-- Fix security issue: Restrict meetings table access to admin/owner users only
-- Drop the overly permissive policy that allows any authenticated user to view meetings
DROP POLICY IF EXISTS "Authenticated users can view meetings" ON public.meetings;

-- Create new restrictive policy for viewing meetings - only admin/owner users
CREATE POLICY "Only admin/owner can view meetings" 
ON public.meetings 
FOR SELECT 
USING (is_admin_or_owner());

-- Update create policy to also restrict to admin/owner users  
DROP POLICY IF EXISTS "Authenticated users can create meetings" ON public.meetings;
CREATE POLICY "Only admin/owner can create meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (is_admin_or_owner());

-- Update update policy to also restrict to admin/owner users
DROP POLICY IF EXISTS "Authenticated users can update meetings" ON public.meetings;
CREATE POLICY "Only admin/owner can update meetings" 
ON public.meetings 
FOR UPDATE 
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());