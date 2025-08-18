-- PHASE 1: Critical Data Protection - Fix Leads Table RLS Policies
-- Remove risky anonymous access policy
DROP POLICY IF EXISTS "leads_insert_anon" ON public.leads;

-- Keep admin/owner policies but ensure they're properly restrictive
DROP POLICY IF EXISTS "leads_select_admin" ON public.leads;
DROP POLICY IF EXISTS "leads_update_admin" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_authed" ON public.leads;

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

-- PHASE 2: Business Data Protection - Restrict Business Intelligence Access

-- Secure traces table - only admin/owner access
DROP POLICY IF EXISTS "Authenticated users can view traces" ON public.traces;
DROP POLICY IF EXISTS "Authenticated users can create traces" ON public.traces;
DROP POLICY IF EXISTS "Authenticated users can update traces" ON public.traces;

CREATE POLICY "traces_admin_select" 
ON public.traces 
FOR SELECT 
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "traces_admin_insert" 
ON public.traces 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_owner());

CREATE POLICY "traces_admin_update" 
ON public.traces 
FOR UPDATE 
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Secure notes table - only admin/owner access
DROP POLICY IF EXISTS "Authenticated users can view notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can create notes" ON public.notes;
DROP POLICY IF EXISTS "Authenticated users can update notes" ON public.notes;

CREATE POLICY "notes_admin_select" 
ON public.notes 
FOR SELECT 
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "notes_admin_insert" 
ON public.notes 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_owner());

CREATE POLICY "notes_admin_update" 
ON public.notes 
FOR UPDATE 
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Secure knowledge_base table - only admin/owner access
DROP POLICY IF EXISTS "Authenticated users can view knowledge base" ON public.knowledge_base;
DROP POLICY IF EXISTS "Authenticated users can create KB entries" ON public.knowledge_base;
DROP POLICY IF EXISTS "Authenticated users can update KB entries" ON public.knowledge_base;

CREATE POLICY "knowledge_base_admin_select" 
ON public.knowledge_base 
FOR SELECT 
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "knowledge_base_admin_insert" 
ON public.knowledge_base 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_owner());

CREATE POLICY "knowledge_base_admin_update" 
ON public.knowledge_base 
FOR UPDATE 
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());