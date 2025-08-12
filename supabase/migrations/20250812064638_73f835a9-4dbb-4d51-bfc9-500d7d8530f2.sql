-- Fix security vulnerability: Remove public access to business performance data

-- Drop the dangerous public read policies
DROP POLICY IF EXISTS "Results are publicly readable" ON public.results;
DROP POLICY IF EXISTS "Anyone can create results" ON public.results;
DROP POLICY IF EXISTS "Anyone can update results" ON public.results;

-- Ensure user_id is properly set for authentication-based access
-- Make user_id NOT NULL for new records to enforce proper data association
ALTER TABLE public.results ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update existing records without user_id to have a system user reference
-- This prevents orphaned data while maintaining data integrity
UPDATE public.results 
SET user_id = (SELECT id FROM auth.users LIMIT 1)
WHERE user_id IS NULL 
AND EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- Create secure RLS policies that replace the public ones

-- Only authenticated users can view their own results, plus admins see all
CREATE POLICY "Authenticated users can view own results" 
ON public.results 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    is_admin_or_owner()
  )
);

-- Only authenticated users can create results (auto-assigned to them)
CREATE POLICY "Authenticated users can create results" 
ON public.results 
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid()
);

-- Only authenticated users can update their own results, admins can update all
CREATE POLICY "Authenticated users can update own results" 
ON public.results 
FOR UPDATE 
TO authenticated
USING (
  user_id = auth.uid() OR 
  is_admin_or_owner()
)
WITH CHECK (
  user_id = auth.uid() OR 
  is_admin_or_owner()
);