-- Fix RLS policies on customer_notes to prevent anonymous access

-- Drop the problematic policy that allows anonymous access
DROP POLICY IF EXISTS "Anyone can view public customer notes" ON public.customer_notes;

-- Create a new policy that requires authentication for viewing public notes
CREATE POLICY "Authenticated users can view public customer notes" 
ON public.customer_notes 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND ((NOT is_private) OR (created_by = auth.uid()))
);

-- Update the insert policy to be more explicit about authentication requirement
DROP POLICY IF EXISTS "Authenticated users can create customer notes" ON public.customer_notes;

CREATE POLICY "Authenticated users can create customer notes" 
ON public.customer_notes 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL 
  AND created_by = auth.uid()
);