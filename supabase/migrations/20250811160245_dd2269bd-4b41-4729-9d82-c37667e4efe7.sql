-- Add missing user_id column to results table
ALTER TABLE public.results 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update existing results policies to handle nullable user_id
DROP POLICY IF EXISTS results_select_own ON public.results;
DROP POLICY IF EXISTS results_insert_own ON public.results;
DROP POLICY IF EXISTS results_update_own ON public.results;
DROP POLICY IF EXISTS results_select_all_owner ON public.results;

-- Updated policies that handle both user-specific and system-generated results
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