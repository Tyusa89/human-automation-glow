-- Drop existing policies
drop policy if exists "Leads are publicly readable" on public.leads;
drop policy if exists "Anyone can create leads" on public.leads;
drop policy if exists "Anyone can update leads" on public.leads;

-- Leads: authenticated users only
alter table public.leads enable row level security;

create policy "leads_select_authed"
on public.leads for select
to authenticated
using (true);

create policy "leads_insert_authed"
on public.leads for insert
to authenticated
with check (true);