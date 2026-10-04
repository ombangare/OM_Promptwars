create index if not exists decisions_user_id_idx on public.decisions(user_id);
create index if not exists decisions_created_at_idx on public.decisions(created_at desc);
create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_decision_id_idx on public.analyses(decision_id);
create index if not exists analyses_created_at_idx on public.analyses(created_at desc);
create index if not exists stress_tests_user_id_idx on public.stress_tests(user_id);
create index if not exists stress_tests_analysis_id_idx on public.stress_tests(analysis_id);
