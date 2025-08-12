-- Fix security vulnerability: Remove public access to sensitive business knowledge base

-- Drop the dangerous public read policy that exposes business secrets
DROP POLICY IF EXISTS "Knowledge base is publicly readable" ON public.knowledge_base;

-- Create secure RLS policy that requires authentication
CREATE POLICY "Authenticated users can view knowledge base" 
ON public.knowledge_base 
FOR SELECT 
TO authenticated
USING (true);

-- Keep existing policies for create/update (already properly restricted to authenticated users)
-- No changes needed for:
-- - "Authenticated users can create KB entries" 
-- - "Authenticated users can update KB entries"