from fastapi import APIRouter, Depends
from app.security import require_supabase_user

router = APIRouter()

@router.get('/me')
async def me(user: dict = Depends(require_supabase_user)):
    return {'user': {k: v for k, v in user.items() if k != 'access_token'}}
