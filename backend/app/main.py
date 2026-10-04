from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.settings import settings
from app.routers import auth, analysis

app = FastAPI(title='MindXray API', version='2.0.0')
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origin_list, allow_credentials=True, allow_methods=['GET','POST','DELETE','OPTIONS'], allow_headers=['Authorization','Content-Type'])

@app.middleware('http')
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
    if request.url.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store'
    return response

app.include_router(auth.router, prefix='/api/v1/auth', tags=['auth'])
app.include_router(analysis.router, prefix='/api/v1/analysis', tags=['analysis'])

@app.get('/health')
def health():
    return {'status':'ok','service':'mindxray-api'}
