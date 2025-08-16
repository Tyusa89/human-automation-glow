-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  select exists (
    select 1 from public.profiles
    where coalesce(user_id, id) = auth.uid() and role = 'owner'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  select exists (
    select 1 from public.profiles
    where coalesce(user_id, id) = auth.uid() and role in ('admin','owner')
  );
$$;