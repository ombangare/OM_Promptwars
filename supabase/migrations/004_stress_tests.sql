create table if not exists public.stress_tests (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references public.analyses(id) on delete cascade,
  decision_id uuid references public.decisions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  assumption text not null,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
