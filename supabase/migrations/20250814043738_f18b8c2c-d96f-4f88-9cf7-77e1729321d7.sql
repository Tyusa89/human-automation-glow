-- Helper functions
create or replace function public.is_owner() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.is_admin_or_owner() returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role in ('admin','owner')
  );
$$;

-- Optional: timestamp helper with search_path
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PROFILES
alter table public.profiles enable row level security;
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own
on public.profiles for select to authenticated
using (auth.uid() = user_id);
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles for insert to authenticated
with check (auth.uid() = user_id);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
drop policy if exists profiles_owner_select_all on public.profiles;
create policy profiles_owner_select_all
on public.profiles for select to authenticated
using (public.is_admin_or_owner());
drop policy if exists profiles_owner_update_all on public.profiles;
create policy profiles_owner_update_all
on public.profiles for update to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

-- MEETINGS
alter table public.meetings enable row level security;
drop policy if exists meetings_select_own on public.meetings;
create policy meetings_select_own
on public.meetings for select to authenticated
using (user_id = auth.uid());
drop policy if exists meetings_insert_own on public.meetings;
create policy meetings_insert_own
on public.meetings for insert to authenticated
with check (user_id = auth.uid());
drop policy if exists meetings_update_own on public.meetings;
create policy meetings_update_own
on public.meetings for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists meetings_admin_all on public.meetings;
create policy meetings_admin_all
on public.meetings for select to authenticated
using (public.is_admin_or_owner());

-- NOTES
alter table public.notes enable row level security;
drop policy if exists notes_select_own on public.notes;
create policy notes_select_own
on public.notes for select to authenticated
using (user_id = auth.uid());
drop policy if exists notes_insert_own on public.notes;
create policy notes_insert_own
on public.notes for insert to authenticated
with check (user_id = auth.uid());
drop policy if exists notes_update_own on public.notes;
create policy notes_update_own
on public.notes for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists notes_admin_all on public.notes;
create policy notes_admin_all
on public.notes for select to authenticated
using (public.is_admin_or_owner());

-- TASKS
alter table public.tasks enable row level security;
drop policy if exists tasks_select_own on public.tasks;
create policy tasks_select_own
on public.tasks for select to authenticated
using (user_id = auth.uid());
drop policy if exists tasks_insert_own on public.tasks;
create policy tasks_insert_own
on public.tasks for insert to authenticated
with check (user_id = auth.uid());
drop policy if exists tasks_update_own on public.tasks;
create policy tasks_update_own
on public.tasks for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
drop policy if exists tasks_admin_all on public.tasks;
create policy tasks_admin_all
on public.tasks for select to authenticated
using (public.is_admin_or_owner());

-- RESULTS (admin/owner-only read; users can insert their own)
alter table public.results enable row level security;
drop policy if exists results_insert_own on public.results;
create policy results_insert_own
on public.results for insert to authenticated
with check (user_id = auth.uid());
drop policy if exists results_select_admin_only on public.results;
create policy results_select_admin_only
on public.results for select to authenticated
using (public.is_admin_or_owner());

-- TRACES (admin/owner-only)
alter table public.traces enable row level security;
drop policy if exists traces_admin_only on public.traces;
create policy traces_admin_only
on public.traces for all to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

-- Function search_path audit/fix for all functions in public
do $$
declare r record;
begin
  for r in
    select n.nspname as schema_name, p.proname as func_name,
           pg_catalog.pg_get_function_arguments(p.oid) as args
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
  loop
    execute format('alter function %I.%I(%s) set search_path = public;', r.schema_name, r.func_name, r.args);
  end loop;
end $$;