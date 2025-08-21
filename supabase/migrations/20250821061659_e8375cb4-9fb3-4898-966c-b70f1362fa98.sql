-- Update results table RLS policy to be more restrictive
DROP POLICY IF EXISTS results_select_own ON public.results;
CREATE POLICY results_select_own
ON public.results FOR SELECT TO authenticated
USING (user_id = auth.uid());