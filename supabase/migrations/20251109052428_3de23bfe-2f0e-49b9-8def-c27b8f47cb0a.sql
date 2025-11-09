-- Enable RLS on automation_runs table
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

-- Allow admins/owners to view all automation runs
CREATE POLICY "Admins can view all automation runs"
ON public.automation_runs
FOR SELECT
TO authenticated
USING (is_admin_or_owner());

-- Allow admins/owners to insert automation runs
CREATE POLICY "Admins can insert automation runs"
ON public.automation_runs
FOR INSERT
TO authenticated
WITH CHECK (is_admin_or_owner());

-- Allow admins/owners to update automation runs
CREATE POLICY "Admins can update automation runs"
ON public.automation_runs
FOR UPDATE
TO authenticated
USING (is_admin_or_owner());

-- Allow admins/owners to delete automation runs
CREATE POLICY "Admins can delete automation runs"
ON public.automation_runs
FOR DELETE
TO authenticated
USING (is_admin_or_owner());