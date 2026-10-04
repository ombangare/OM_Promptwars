alter table public.profiles enable row level security;
alter table public.decisions enable row level security;
alter table public.analyses enable row level security;
alter table public.stress_tests enable row level security;

create policy "profiles_select_own" on public.profiles to authenticated using ((select auth.uid()) = id);
create policy "profiles_insert_own" on public.profiles to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "decisions_select_own" on public.decisions to authenticated using ((select auth.uid()) = user_id);
create policy "decisions_insert_own" on public.decisions to authenticated with check ((select auth.uid()) = user_id);
create policy "decisions_update_own" on public.decisions to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "decisions_delete_own" on public.decisions to authenticated using ((select auth.uid()) = user_id);

create policy "analyses_select_own" on public.analyses to authenticated using ((select auth.uid()) = user_id);
create policy "analyses_insert_own" on public.analyses to authenticated with check ((select auth.uid()) = user_id);
create policy "analyses_update_own" on public.analyses to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "analyses_delete_own" on public.analyses to authenticated using ((select auth.uid()) = user_id);

create policy "stress_tests_select_own" on public.stress_tests to authenticated using ((select auth.uid()) = user_id);
create policy "stress_tests_insert_own" on public.stress_tests to authenticated with check ((select auth.uid()) = user_id);
create policy "stress_tests_update_own" on public.stress_tests to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "stress_tests_delete_own" on public.stress_tests to authenticated using ((select auth.uid()) = user_id);

-- Explicit PostgREST table grants for the authenticated role. RLS remains the row-level guard.
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.decisions to authenticated;
grant select, insert, update, delete on table public.analyses to authenticated;
grant select, insert, update, delete on table public.stress_tests to authenticated;
