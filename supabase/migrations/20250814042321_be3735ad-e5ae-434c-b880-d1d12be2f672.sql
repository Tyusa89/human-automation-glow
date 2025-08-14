-- Create profiles table with direct auth.users reference
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create RLS policies
create policy "Insert own profile"
on public.profiles for insert to authenticated
with check (auth.uid() = id);

create policy "Read own profile"
on public.profiles for select to authenticated
using (auth.uid() = id);

create policy "Update own profile"
on public.profiles for update to authenticated
using (auth.uid() = id);