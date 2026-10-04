import httpx
from app.settings import settings
from app.schemas import DecisionInput, AnalysisResult, StressResult

class SupabaseError(RuntimeError):
    pass

def _headers(access_token: str):
    if not settings.supabase_url or not settings.supabase_publishable_key:
        raise SupabaseError('Supabase is not configured')
    return {
        'apikey': settings.supabase_publishable_key,
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
    }

async def _request(method: str, path: str, access_token: str, *, params=None, json=None):
    async with httpx.AsyncClient(timeout=12.0) as client:
        response = await client.request(method, f"{settings.supabase_url.rstrip('/')}/rest/v1/{path}", headers=_headers(access_token), params=params, json=json)
    if response.status_code >= 400:
        raise SupabaseError('Supabase data request failed')
    if not response.content:
        return []
    return response.json()

async def save_analysis_bundle(user_id: str, data: DecisionInput, result: AnalysisResult, access_token: str):
    decision_payload={
        'user_id':user_id, 'title':data.title or data.decision[:120], 'decision_text':data.decision,
        'options':data.options, 'priorities':data.priorities, 'reasons':data.reasons, 'constraints':data.constraints, 'known_facts':data.known_facts
    }
    decisions=await _request('POST','decisions',access_token,json=decision_payload)
    decision=decisions[0]
    analysis_payload={
        'decision_id':decision['id'],'user_id':user_id,'summary':result.summary,
        'reasoning_map':result.reasoning_map.model_dump(),'assumptions':[x.model_dump() for x in result.assumptions],
        'blind_spots':[x.model_dump() for x in result.blind_spots],'conflicts':[x.model_dump() for x in result.conflicts],
        'evidence_gaps':[x.model_dump() for x in result.evidence_gaps],'critical_questions':result.critical_questions,
        'guardrail':result.guardrail,'model_name':settings.gemini_model
    }
    analyses=await _request('POST','analyses',access_token,json=analysis_payload)
    decision = {**decision, 'decision': decision.get('decision_text', '')}
    return {'decision':decision,'analysis':analyses[0]}

async def save_stress_test(user_id: str, analysis_id: str | None, assumption: str, result: StressResult, access_token: str):
    decision_id=None
    if analysis_id:
        rows=await _request('GET','analyses',access_token,params={'select':'decision_id','id':f'eq.{analysis_id}','user_id':f'eq.{user_id}','limit':'1'})
        if not rows: raise SupabaseError('Analysis not found')
        decision_id=rows[0]['decision_id']
    payload={'user_id':user_id,'analysis_id':analysis_id,'decision_id':decision_id,'assumption':assumption,'result':result.model_dump()}
    rows=await _request('POST','stress_tests',access_token,json=payload)
    return rows[0]

async def list_history(user_id: str, access_token: str):
    rows=await _request('GET','analyses',access_token,params={
        'select':'id,decision_id,created_at,assumptions,blind_spots,conflicts,critical_questions,decisions(title,decision_text)',
        'user_id':f'eq.{user_id}','order':'created_at.desc','limit':'50'
    })
    items=[]
    for row in rows:
        d=row.get('decisions') or {}
        items.append({
            'analysis_id':row['id'],'decision_id':row['decision_id'],'title':d.get('title') or 'Untitled analysis',
            'decision_text':d.get('decision_text',''),'created_at':row['created_at'],
            'insights':len(row.get('assumptions') or [])+len(row.get('blind_spots') or [])+len(row.get('conflicts') or []),
            'questions':len(row.get('critical_questions') or [])
        })
    return items

async def get_analysis_bundle(user_id: str, analysis_id: str, access_token: str):
    rows=await _request('GET','analyses',access_token,params={
        'select':'*,decisions(*)','id':f'eq.{analysis_id}','user_id':f'eq.{user_id}','limit':'1'
    })
    if not rows: raise LookupError('Analysis not found')
    row=rows[0]
    decision=row.pop('decisions',None) or {}
    decision = {**decision, 'decision': decision.get('decision_text', '')}
    return {'decision':decision,'analysis':row}

async def delete_decision(user_id: str, decision_id: str, access_token: str):
    # RLS protects this delete; the explicit user_id filter is defense-in-depth.
    rows=await _request('DELETE','decisions',access_token,params={'id':f'eq.{decision_id}','user_id':f'eq.{user_id}'})
    if not rows: raise LookupError('Analysis not found')
