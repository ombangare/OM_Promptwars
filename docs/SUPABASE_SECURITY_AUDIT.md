# Supabase Security Audit

- Publishable key only in the browser.
- No service/secret key shipped to frontend.
- Supabase Auth is the single identity provider.
- FastAPI derives user identity from a validated Supabase access token.
- No `user_id` is accepted from the client for ownership.
- All user-owned tables have RLS enabled.
- Policies use `to authenticated` and `auth.uid()` ownership checks.
- PostgREST calls use the user's access token, preserving RLS.
- API keys and Gemini credentials are environment variables.
- CORS is explicitly configured.
- API errors avoid returning stack traces or secret values.
