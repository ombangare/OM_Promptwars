# MindXray
### See what your reasoning misses.

MindXray is an AI-powered reasoning blind-spot analyzer for PromptWars 2026. It helps users uncover assumptions, overlooked factors, internal conflicts, evidence gaps and critical questions **without making the decision for them**.

## Product UI
The included UI follows the approved MindXray visual reference in `docs/ui-reference.png`: premium light workspace, dark/navy chrome, glass cards, light blue + white surfaces, gold accents, structured data views, a visual Reasoning X-Ray and an Assumption Stress Test flow.

## Core working flows
1. **Decision Canvas** — four-step structured input wizard.
2. **Reasoning X-Ray** — visual map + categorized findings.
3. **Assumption Stress Test** — test one assumption against evidence and counter-cases.
4. **Critical Questions & Reports** — guided questions plus Markdown/PDF/JSON download.
5. **History** — persistent analysis archive in Supabase.

## Architecture
Browser → React/Vite → FastAPI → Gemini + Supabase Postgres

Supabase Auth handles Google OAuth and email/password authentication. FastAPI validates Supabase access tokens. Database writes use the authenticated user's token so Row Level Security remains active.

## Setup
See `docs/SUPABASE_SETUP.md`.

### Frontend
```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

### Backend
```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Required environment
Frontend:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_API_BASE_URL`

Backend:
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

## Git workflow
Use real milestone commits only. Suggested sequence:
```text
chore: initialize MindXray
feat: integrate Supabase foundation
feat: migrate authentication to Supabase
feat: add database schema and RLS
feat: persist analyses and stress tests
test: cover Supabase-backed workflows
security: harden ownership and authorization
docs: document Supabase setup
```
