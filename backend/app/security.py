from fastapi import Header, HTTPException
import httpx
from app.settings import settings

async def require_supabase_user(authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail='Authentication required')
    token = authorization.removeprefix('Bearer ').strip()
    if not token:
        raise HTTPException(status_code=401, detail='Authentication required')
    if not settings.supabase_url or not settings.supabase_publishable_key:
        raise HTTPException(status_code=503, detail='Supabase is not configured')
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(
                f"{settings.supabase_url.rstrip('/')}/auth/v1/user",
                headers={
                    'apikey': settings.supabase_publishable_key,
                    'Authorization': f'Bearer {token}',
                },
            )
    except httpx.RequestError as exc:
        raise HTTPException(status_code=503, detail='Authentication service unavailable') from exc
    if response.status_code != 200:
        raise HTTPException(status_code=401, detail='Invalid or expired Supabase session')
    user = response.json()
    return {
        'id': user.get('id'),
        'email': user.get('email', ''),
        'name': (user.get('user_metadata') or {}).get('full_name') or (user.get('user_metadata') or {}).get('name') or user.get('email', 'MindXray User'),
        'picture': (user.get('user_metadata') or {}).get('avatar_url') or (user.get('user_metadata') or {}).get('picture'),
        'access_token': token,
    }
