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

-- Drop ALL existing profiles policies first
drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_owner_all on public.profiles;
drop policy if exists profiles_owner_update_all on public.profiles;
drop policy if exists profiles_owner_select_all on public.profiles;
drop policy if exists "Users can view their own email" on public.profiles;
drop policy if exists "profiles_upsert_own" on public.profiles;
drop policy if exists "Insert own profile" on public.profiles;
drop policy if exists "Read own profile" on public.profiles;
drop policy if exists "Update own profile" on public.profiles;

-- Create new profiles policies
create policy profiles_select_own
on public.profiles for select
to authenticated
using (coalesce(user_id, id) = auth.uid());

create policy profiles_insert_own
on public.profiles for insert
to authenticated
with check (coalesce(user_id, id) = auth.uid());

create policy profiles_update_own
on public.profiles for update
to authenticated
using (coalesce(user_id, id) = auth.uid())
with check (coalesce(user_id, id) = auth.uid());

-- Owner can read/update all profiles
create policy profiles_owner_select_all
on public.profiles for select
to authenticated
using (public.is_admin_or_owner());

create policy profiles_owner_update_all
on public.profiles for update
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

-- 1) LEADS: keep public intake working; only owner/admin can read all
alter table public.leads enable row level security;

-- Drop existing leads policies
drop policy if exists leads_insert_anon on public.leads;
drop policy if exists leads_insert_authed on public.leads;
drop policy if exists leads_select_admin on public.leads;
drop policy if exists "Only admin/owner can view leads" on public.leads;
drop policy if exists "Only admin/owner can update leads" on public.leads;
drop policy if exists "Only admin/owner can create leads" on public.leads;

-- Allow inserts from BOTH unauthenticated (public website) and authenticated sessions
create policy leads_insert_anon
on public.leads for insert
to anon
with check (true);

create policy leads_insert_authed
on public.leads for insert
to authenticated
with check (true);

-- Only owner/admin can SELECT and UPDATE leads in the dashboard
create policy leads_select_admin
on public.leads for select
to authenticated
using (public.is_admin_or_owner());

create policy leads_update_admin
on public.leads for update
to authenticated
using (public.is_admin_or_owner())
with check (public.is_admin_or_owner());

-- 2) RESULTS: store automation outputs; users see their own, owner sees all
alter table public.results enable row level security;

-- Drop existing results policies
drop policy if exists results_select_own on public.results;
drop policy if exists results_insert_own on public.results;
drop policy if exists results_update_own on public.results;
drop policy if exists results_select_all_owner on public.results;
drop policy if exists "Authenticated users can view own results" on public.results;
drop policy if exists "Authenticated users can create results" on public.results;
drop policy if exists "Authenticated users can update own results" on public.results;
drop policy if exists "results_select_admin_only" on public.results;

create policy results_select_own
on public.results for select
to authenticated
using (user_id = auth.uid() or user_id is null);

create policy results_insert_own
on public.results for insert
to authenticated
with check (user_id = auth.uid());

create policy results_update_own
on public.results for update
to authenticated
using (user_id = auth.uid() or user_id is null)
with check (user_id = auth.uid() or user_id is null);

create policy results_select_all_owner
on public.results for select
to authenticated
using (public.is_admin_or_owner());