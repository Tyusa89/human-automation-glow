-- First add the role column to profiles if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role text
CHECK (role IN ('owner','admin','user')) DEFAULT 'user';

-- Add missing user_id column to results table
ALTER TABLE public.results 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Create helper functions for role checking
CREATE OR REPLACE FUNCTION public.is_owner() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'owner'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role IN ('admin','owner')
  );
$$;

-- Update results policies to handle both user-specific and system results
DROP POLICY IF EXISTS results_select_own ON public.results;
DROP POLICY IF EXISTS results_insert_own ON public.results;
DROP POLICY IF EXISTS results_update_own ON public.results;
DROP POLICY IF EXISTS results_select_all_owner ON public.results;

CREATE POLICY results_select_own
ON public.results FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY results_insert_own
ON public.results FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY results_update_own
ON public.results FOR UPDATE
TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL)
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY results_select_all_owner
ON public.results FOR SELECT
TO authenticated
USING (public.is_admin_or_owner());