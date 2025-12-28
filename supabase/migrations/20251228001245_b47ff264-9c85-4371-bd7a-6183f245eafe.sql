-- 1) Table
create table if not exists public.user_template_activity (
  user_id uuid not null references auth.users(id) on delete cascade,
  template_slug text not null,
  last_opened_at timestamptz not null default now(),
  open_count int not null default 0,
  saved boolean not null default false,
  saved_at timestamptz null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint user_template_activity_pkey primary key (user_id, template_slug)
);

-- 2) Keep updated_at fresh
drop trigger if exists trg_user_template_activity_updated_at on public.user_template_activity;
create trigger trg_user_template_activity_updated_at
before update on public.user_template_activity
for each row execute function public.set_updated_at();

-- 3) Indexes for fast "Saved" + "Recent"
create index if not exists idx_uta_user_recent
  on public.user_template_activity (user_id, last_opened_at desc);

create index if not exists idx_uta_user_saved
  on public.user_template_activity (user_id, saved, saved_at desc);

-- 4) RLS
alter table public.user_template_activity enable row level security;

drop policy if exists "uta_select_own" on public.user_template_activity;
create policy "uta_select_own"
on public.user_template_activity
for select
using (auth.uid() = user_id);

drop policy if exists "uta_insert_own" on public.user_template_activity;
create policy "uta_insert_own"
on public.user_template_activity
for insert
with check (auth.uid() = user_id);

drop policy if exists "uta_update_own" on public.user_template_activity;
create policy "uta_update_own"
on public.user_template_activity
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "uta_delete_own" on public.user_template_activity;
create policy "uta_delete_own"
on public.user_template_activity
for delete
using (auth.uid() = user_id);