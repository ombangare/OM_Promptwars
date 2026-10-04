import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app
from app.schemas import AnalysisResult, ReasoningMap, Assumption, BlindSpot, Conflict, EvidenceGap, StressResult

client = TestClient(app)

# Helper mock user fixture
MOCK_USER = {
    'id': 'user_123',
    'email': 'alex@example.com',
    'name': 'Alex Developer',
    'picture': 'https://example.com/avatar.png',
    'access_token': 'mock_valid_bearer_token',
}

# Helper mock analysis result
MOCK_ANALYSIS_RESULT = AnalysisResult(
    summary='Analysis of internship decision',
    reasoning_map=ReasoningMap(
        decision='Should I accept this 6-month internship?',
        reasons=['Good industry experience', 'Networking opportunity'],
        facts=['Duration is 6 months', 'Stipend provided'],
        assumption_labels=['Time commitment will not affect GPA'],
        blind_spot_labels=['Loss of study hours for final exams'],
        conflict_labels=['Work hours vs course schedule'],
    ),
    assumptions=[
        Assumption(
            title='Time commitment manageable',
            description='Assuming internship hours do not overlap with lectures.',
            why_it_matters='Grade impact could be severe.',
            confidence='Medium',
            questions=['What are the core working hours?'],
        )
    ],
    blind_spots=[
        BlindSpot(
            title='Exam preparation overlap',
            description='Final exam season overlaps with peak project delivery.',
            why_it_matters='Could compromise academic performance.',
        )
    ],
    conflicts=[
        Conflict(
            title='Study vs Work Priority',
            description='Coursework requires 20h/week while internship requires 40h/week.',
            tension='High workload competition.',
        )
    ],
    evidence_gaps=[
        EvidenceGap(
            claim='Flexible working hours guaranteed',
            missing_evidence='No written confirmation from HR.',
            verification_method='Request written agreement.',
        )
    ],
    critical_questions=['Can the internship be done part-time during exam weeks?'],
)

MOCK_STRESS_RESULT = StressResult(
    why_it_may_hold='Company has a history of supporting student interns.',
    why_it_may_fail='Project deadlines might require overtime.',
    evidence_to_seek=['Past intern testimonials', 'HR policy document'],
    questions_to_ask=['Are working hours flexible during finals?'],
    verification_steps=['Confirm working schedule with team lead in writing.'],
)


# 1. GET /health
def test_health_check():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok', 'service': 'mindxray-api'}


# 2. Protected analysis endpoint rejects unauthenticated requests
def test_protected_analysis_requires_auth():
    response = client.post(
        '/api/v1/analysis/audit',
        json={
            'decision': 'Should I accept this 6-month internship offer?',
            'options': ['Accept', 'Decline'],
            'priorities': ['Career growth', 'Learning'],
            'reasons': 'It offers real-world software engineering experience.',
            'constraints': 'University workload is heavy.',
            'known_facts': 'Stipend is $1000/month.',
        },
    )
    assert response.status_code == 401
    assert 'Authentication required' in response.json()['detail']


# 3. Invalid decision payload returns validation error
def test_invalid_decision_payload_returns_validation_error():
    # Authenticated user mock
    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER):
        # Decision string is shorter than min_length=10
        response = client.post(
            '/api/v1/analysis/audit',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
            json={
                'decision': 'Short',
                'options': ['Accept'],
                'reasons': 'Too short reasons',
            },
        )
        assert response.status_code == 422
        errors = response.json()['detail']
        assert any(err['loc'] == ['body', 'decision'] for err in errors)


# 4. Authenticated analysis request succeeds with mocked Gemini/Supabase
def test_authenticated_analysis_request_succeeds():
    mock_bundle = {
        'decision': {
            'id': 'dec_999',
            'user_id': 'user_123',
            'title': 'Internship Decision',
            'decision_text': 'Should I accept this 6-month internship offer?',
        },
        'analysis': {
            'id': 'ans_999',
            'decision_id': 'dec_999',
            'user_id': 'user_123',
            'summary': MOCK_ANALYSIS_RESULT.summary,
        },
    }

    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER), \
         patch('app.routers.analysis.analyze_decision', return_value=MOCK_ANALYSIS_RESULT), \
         patch('app.routers.analysis.save_analysis_bundle', new_callable=AsyncMock, return_value=mock_bundle) as mock_save:

        response = client.post(
            '/api/v1/analysis/audit',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
            json={
                'title': 'Internship Decision',
                'decision': 'Should I accept this 6-month internship offer?',
                'options': ['Accept', 'Decline'],
                'priorities': ['Career growth'],
                'reasons': 'Great industry exposure and mentoring.',
                'constraints': 'Heavy semester workload.',
                'known_facts': 'Duration is 6 months.',
            },
        )
        assert response.status_code == 200
        data = response.json()
        assert data['decision']['id'] == 'dec_999'
        assert data['analysis']['user_id'] == 'user_123'
        assert mock_save.called


# 5. Analysis persistence is called with the authenticated user's ID
def test_persistence_called_with_authenticated_user_id():
    mock_bundle = {'decision': {'id': 'dec_123'}, 'analysis': {'id': 'ans_123'}}

    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER), \
         patch('app.routers.analysis.analyze_decision', return_value=MOCK_ANALYSIS_RESULT), \
         patch('app.routers.analysis.save_analysis_bundle', new_callable=AsyncMock, return_value=mock_bundle) as mock_save:

        client.post(
            '/api/v1/analysis/audit',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
            json={
                'decision': 'Should I move to a new city for work?',
                'options': ['Move', 'Stay'],
                'reasons': 'Better career opportunities overall.',
            },
        )
        # Check that first arg passed to save_analysis_bundle is user_id ('user_123')
        assert mock_save.call_args[0][0] == 'user_123'


# 6. Cross-user ownership access is rejected
def test_cross_user_ownership_access_rejected():
    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER), \
         patch('app.routers.analysis.get_analysis_bundle', side_effect=LookupError('Analysis not found')):

        response = client.get(
            '/api/v1/analysis/history/other_user_analysis_id_999',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
        )
        assert response.status_code == 404
        assert response.json()['detail'] == 'Analysis not found'


# 7. Stress-test endpoint validation
def test_stress_test_endpoint_validation():
    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER):
        # Missing required context and assumption is too short (<5 chars)
        response = client.post(
            '/api/v1/analysis/stress-test',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
            json={'assumption': 'Tiny'},
        )
        assert response.status_code == 422


# 8. Stress-test ownership enforcement
def test_stress_test_ownership_enforcement():
    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER), \
         patch('app.routers.analysis.stress_test', return_value=MOCK_STRESS_RESULT), \
         patch('app.routers.analysis.save_stress_test', side_effect=RuntimeError('Analysis not found')):

        response = client.post(
            '/api/v1/analysis/stress-test',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
            json={
                'assumption': 'Time commitment will not affect GPA',
                'context': 'Considering a 6-month software internship.',
                'analysis_id': 'other_users_analysis_id',
            },
        )
        assert response.status_code == 503
        assert 'Analysis not found' in response.json()['detail']


# Additional helper tests
def test_auth_me_endpoint_success():
    with patch('app.routers.auth.require_supabase_user', return_value=MOCK_USER):
        response = client.get(
            '/api/v1/auth/me',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
        )
        assert response.status_code == 200
        assert response.json()['id'] == 'user_123'
        assert response.json()['email'] == 'alex@example.com'


def test_history_list_success():
    mock_history_items = [
        {
            'analysis_id': 'ans_1',
            'decision_id': 'dec_1',
            'title': 'Job Choice',
            'created_at': '2026-10-04T12:00:00Z',
            'insights': 3,
            'questions': 2,
        }
    ]
    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER), \
         patch('app.routers.analysis.list_history', new_callable=AsyncMock, return_value=mock_history_items):

        response = client.get(
            '/api/v1/analysis/history',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
        )
        assert response.status_code == 200
        assert response.json() == {'items': mock_history_items}


def test_delete_history_item_success():
    with patch('app.routers.analysis.require_supabase_user', return_value=MOCK_USER), \
         patch('app.routers.analysis.delete_decision', new_callable=AsyncMock, return_value=True):

        response = client.delete(
            '/api/v1/analysis/history/dec_123',
            headers={'Authorization': 'Bearer mock_valid_bearer_token'},
        )
        assert response.status_code == 200
        assert response.json() == {'deleted': True, 'decision_id': 'dec_123'}
