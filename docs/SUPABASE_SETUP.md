# MindXray — Supabase Setup

## 1. Create the Supabase project
Create a Supabase project and open **Connect / API Keys**. Current Supabase projects use a publishable key for public clients and a secret key only for trusted server-side code. MindXray only needs the publishable key because backend data requests are sent with the signed-in user's access token, so RLS remains active.

## 2. Run migrations
Run these files in order in Supabase SQL Editor, or use the Supabase CLI migrations workflow:

1. 001_profiles.sql
2. 002_decisions.sql
3. 003_analyses.sql
4. 004_stress_tests.sql
5. 005_indexes.sql
6. 006_rls.sql
7. 007_profile_trigger.sql

## 3. Configure Google OAuth
In Supabase: Authentication → Providers → Google. Add the Google OAuth Web Client ID and secret.

In Google Cloud Console, add the Supabase Auth callback URL shown by the provider setup. Add your deployed frontend origin to the authorized JavaScript origins where required.

In Supabase URL Configuration, add:
- `http://localhost:5173`
- your deployed frontend URL

The application redirects to `/auth/callback` after Google OAuth.

## 4. Environment
Frontend `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_API_BASE_URL=http://localhost:8000
```

Backend `.env`:

```env
CORS_ORIGINS=http://localhost:5173
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.8-flash
```

Never commit `.env` files.

## 5. Auth and RLS model
The browser authenticates through Supabase Auth. FastAPI receives the Supabase access token and validates the user using Supabase Auth. Database reads/writes use the same user token against PostgREST, so the `authenticated` role and RLS policies apply to the request.

## 6. Smoke test
1. Sign in with Google.
2. Confirm `/dashboard` opens after `/auth/callback`.
3. Create an analysis.
4. Check `decisions` and `analyses` tables.
5. Refresh the page and reopen the analysis from History.
6. Stress-test an assumption.
7. Delete the analysis.
8. Confirm the row is gone and another user's rows remain inaccessible.
