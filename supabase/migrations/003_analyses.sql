create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid not null references public.decisions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  summary text,
  reasoning_map jsonb,
  assumptions jsonb not null default '[]'::jsonb,
  blind_spots jsonb not null default '[]'::jsonb,
  conflicts jsonb not null default '[]'::jsonb,
  evidence_gaps jsonb not null default '[]'::jsonb,
  critical_questions jsonb not null default '[]'::jsonb,
  guardrail text,
  model_name text,
  created_at timestamptz not null default now()
);
