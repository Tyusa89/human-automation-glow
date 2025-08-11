-- 0) PROFILES: add role + basic RLS
alter table public.profiles enable row level security;

alter table public.profiles
  add column if not exists role text
  check (role in ('owner','admin','user')) default 'user';

-- Helper: owner/admin checks (SECURITY DEFINER so RLS can call these)
create or replace function public.is_owner() returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.is_admin_or_owner() returns boolean
language sql stable security definer
as $$
  select exists (
    select 1 from public.profiles
    where user_id = auth.uid() and role in ('admin','owner')
  );
$$;

-- Profiles policies: users see/update their own; owner sees all
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_upsert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;

create policy profiles_select_own
on public.profiles for select
to authenticated
using (auth.uid() = user_id);

create policy profiles_insert_own
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy profiles_update_own
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Owner can read/update all profiles
create policy profiles_owner_all
on public.profiles for select
to authenticated
using (public.is_owner());

create policy profiles_owner_update_all
on public.profiles for update
to authenticated
using (public.is_owner())
with check (public.is_owner());

-- 1) LEADS: keep public intake working; only owner/admin can read all
alter table public.leads enable row level security;

-- Allow inserts from BOTH unauthenticated (public website) and authenticated sessions
drop policy if exists leads_insert_anon on public.leads;
drop policy if exists leads_insert_authed on public.leads;
create policy leads_insert_anon
on public.leads for insert
to anon
with check (true);

create policy leads_insert_authed
on public.leads for insert
to authenticated
with check (true);

-- Only owner/admin can SELECT all leads in the dashboard
drop policy if exists leads_select_authed on public.leads;
create policy leads_select_admin
on public.leads for select
to authenticated
using (public.is_admin_or_owner());

-- 2) RESULTS: store automation outputs; users see their own, owner sees all
alter table public.results enable row level security;

drop policy if exists results_select_own on public.results;
drop policy if exists results_insert_own on public.results;
drop policy if exists results_update_own on public.results;
drop policy if exists results_select_all_owner on public.results;

create policy results_select_own
on public.results for select
to authenticated
using (user_id = auth.uid());

create policy results_insert_own
on public.results for insert
to authenticated
with check (user_id = auth.uid());

create policy results_update_own
on public.results for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy results_select_all_owner
on public.results for select
to authenticated
using (public.is_admin_or_owner());