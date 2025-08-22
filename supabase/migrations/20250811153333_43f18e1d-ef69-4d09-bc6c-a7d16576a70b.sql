-- Enable RLS on profiles table (already enabled but ensuring it's set)
alter table public.profiles enable row level security;

-- Drop existing policies to recreate them with proper naming
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;

-- Create new policies with proper authentication requirements
create policy "profiles_select_own" on public.profiles
for select to authenticated
using (auth.uid() = user_id);

create policy "profiles_upsert_own" on public.profiles
for insert to authenticated
with check (auth.uid() = user_id);

create policy "profiles_update_own" on public.profiles
for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);