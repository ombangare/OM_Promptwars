from fastapi import APIRouter, Depends, HTTPException, Path
from app.schemas import DecisionInput, AssumptionTestRequest
from app.security import require_supabase_user
from app.services.gemini import analyze_decision, stress_test
from app.services.persistence import save_analysis_bundle, save_stress_test, list_history, get_analysis_bundle, delete_decision

router = APIRouter()

@router.post('/audit')
async def audit(body: DecisionInput, user: dict = Depends(require_supabase_user)):
    try:
        result = analyze_decision(body)
        bundle = await save_analysis_bundle(user['id'], body, result, user['access_token'])
        return bundle
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail='AI analysis or persistence temporarily unavailable') from exc

@router.post('/stress-test')
async def stress(body: AssumptionTestRequest, user: dict = Depends(require_supabase_user)):
    try:
        result = stress_test(body.assumption, body.context)
        saved = await save_stress_test(user['id'], body.analysis_id, body.assumption, result, user['access_token'])
        return {**result.model_dump(), 'stress_test_id': saved.get('id')}
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail='AI stress test or persistence temporarily unavailable') from exc

@router.get('/history')
async def history(user: dict = Depends(require_supabase_user)):
    try:
        return {'items': await list_history(user['id'], user['access_token'])}
    except Exception as exc:
        raise HTTPException(status_code=502, detail='Could not load analysis history') from exc

@router.get('/history/{analysis_id}')
async def history_item(analysis_id: str = Path(min_length=8, max_length=64), user: dict = Depends(require_supabase_user)):
    try:
        return await get_analysis_bundle(user['id'], analysis_id, user['access_token'])
    except LookupError as exc:
        raise HTTPException(status_code=404, detail='Analysis not found') from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail='Could not load analysis') from exc

@router.delete('/history/{decision_id}')
async def delete_history_item(decision_id: str = Path(min_length=8, max_length=64), user: dict = Depends(require_supabase_user)):
    try:
        await delete_decision(user['id'], decision_id, user['access_token'])
        return {'deleted': True, 'decision_id': decision_id}
    except LookupError as exc:
        raise HTTPException(status_code=404, detail='Analysis not found') from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail='Could not delete analysis') from exc
