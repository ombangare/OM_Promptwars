create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  decision_text text not null,
  options jsonb not null default '[]'::jsonb,
  priorities jsonb not null default '[]'::jsonb,
  reasons text not null,
  constraints text,
  known_facts text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
