import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response=client.get('/health')
    assert response.status_code==200
    assert response.json()['status']=='ok'

def test_protected_route_requires_auth():
    response=client.get('/api/v1/auth/me')
    assert response.status_code==401

def test_protected_analysis_requires_auth():
    response=client.post('/api/v1/analysis/audit',json={
      'decision':'Should I accept this internship?',
      'options':['Accept','Decline'],
      'priorities':['Learning'],
      'reasons':'It offers relevant industry exposure.',
      'constraints':'College workload is high.',
      'known_facts':'It lasts six months.'
    })
    assert response.status_code==401

def test_invalid_analysis_payload_is_rejected_before_auth():
    response=client.post('/api/v1/analysis/audit',json={'decision':'Hi'})
    assert response.status_code in (401,422)
