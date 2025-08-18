-- PHASE 1: Critical Data Protection - Fix Leads Table RLS Policies
-- Remove all existing policies first
DROP POLICY IF EXISTS "leads_insert_anon" ON public.leads;
DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;  
DROP POLICY IF EXISTS "leads_update_admin" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_authed" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_select_all" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_insert" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_update" ON public.leads;
DROP POLICY IF EXISTS "leads_contact_form_insert" ON public.leads;

-- Create secure policies for leads
CREATE POLICY "leads_admin_select_all" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "leads_admin_insert" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_owner());

CREATE POLICY "leads_admin_update" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Allow anonymous contact form submissions only (no read access)
CREATE POLICY "leads_contact_form_insert" 
ON public.leads 
FOR INSERT 
TO anon
WITH CHECK (true);