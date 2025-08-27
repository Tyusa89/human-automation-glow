-- Comprehensive fix for all anonymous access security issues

-- Fix knowledge_base policies
DROP POLICY IF EXISTS "knowledge_base_admin_select" ON public.knowledge_base;
DROP POLICY IF EXISTS "knowledge_base_admin_update" ON public.knowledge_base;
DROP POLICY IF EXISTS "knowledge_base_admin_insert" ON public.knowledge_base;

CREATE POLICY "knowledge_base_admin_select" 
ON public.knowledge_base 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "knowledge_base_admin_update" 
ON public.knowledge_base 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "knowledge_base_admin_insert" 
ON public.knowledge_base 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix leads policies
DROP POLICY IF EXISTS "leads_admin_select_all" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_update" ON public.leads;
DROP POLICY IF EXISTS "leads_admin_insert" ON public.leads;

CREATE POLICY "leads_admin_select_all" 
ON public.leads 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "leads_admin_update" 
ON public.leads 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "leads_admin_insert" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix meetings policies
DROP POLICY IF EXISTS "Only admin/owner can view meetings" ON public.meetings;
DROP POLICY IF EXISTS "Only admin/owner can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Only admin/owner can update meetings" ON public.meetings;

CREATE POLICY "Only admin/owner can view meetings" 
ON public.meetings 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "Only admin/owner can create meetings" 
ON public.meetings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "Only admin/owner can update meetings" 
ON public.meetings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix notes policies
DROP POLICY IF EXISTS "notes_admin_select" ON public.notes;
DROP POLICY IF EXISTS "notes_admin_insert" ON public.notes;
DROP POLICY IF EXISTS "notes_admin_update" ON public.notes;

CREATE POLICY "notes_admin_select" 
ON public.notes 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "notes_admin_insert" 
ON public.notes 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "notes_admin_update" 
ON public.notes 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix profiles policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_owner_update_all" ON public.profiles;

CREATE POLICY "profiles_select_own" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND COALESCE(user_id, id) = auth.uid());

CREATE POLICY "profiles_insert_own" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND COALESCE(user_id, id) = auth.uid());

CREATE POLICY "profiles_update_own" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND COALESCE(user_id, id) = auth.uid())
WITH CHECK (auth.uid() IS NOT NULL AND COALESCE(user_id, id) = auth.uid());

CREATE POLICY "profiles_owner_select_all" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "profiles_owner_update_all" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix results policies
DROP POLICY IF EXISTS "results_select_all_owner" ON public.results;
DROP POLICY IF EXISTS "results_select_own" ON public.results;
DROP POLICY IF EXISTS "results_insert_own" ON public.results;
DROP POLICY IF EXISTS "results_update_own" ON public.results;

CREATE POLICY "results_select_all_owner" 
ON public.results 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "results_select_own" 
ON public.results 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "results_insert_own" 
ON public.results 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "results_update_own" 
ON public.results 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND ((user_id = auth.uid()) OR (user_id IS NULL)))
WITH CHECK (auth.uid() IS NOT NULL AND ((user_id = auth.uid()) OR (user_id IS NULL)));

-- Fix staff_roles policies
DROP POLICY IF EXISTS "Users can view their own staff roles" ON public.staff_roles;
DROP POLICY IF EXISTS "Only admins can manage staff roles" ON public.staff_roles;

CREATE POLICY "Users can view their own staff roles" 
ON public.staff_roles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "Only admins can manage staff roles" 
ON public.staff_roles 
FOR ALL 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix tasks policies
DROP POLICY IF EXISTS "Users can view their assigned tasks or admins see all" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their tasks or admins update all" ON public.tasks;
DROP POLICY IF EXISTS "Only admins can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "tasks_select_own" ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert_own" ON public.tasks;
DROP POLICY IF EXISTS "tasks_update_own" ON public.tasks;
DROP POLICY IF EXISTS "tasks_admin_all" ON public.tasks;

CREATE POLICY "Users can view their assigned tasks or admins see all" 
ON public.tasks 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    is_admin_or_owner() OR 
    (assignee = (SELECT email FROM auth.users WHERE id = auth.uid())::text) OR 
    (user_id = auth.uid())
  )
);

CREATE POLICY "Users can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND ((auth.uid() = user_id) OR (user_id IS NULL))
);

CREATE POLICY "Users can update their tasks or admins update all" 
ON public.tasks 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    is_admin_or_owner() OR 
    (assignee = (SELECT email FROM auth.users WHERE id = auth.uid())::text) OR 
    (user_id = auth.uid())
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    is_admin_or_owner() OR 
    (assignee = (SELECT email FROM auth.users WHERE id = auth.uid())::text) OR 
    (user_id = auth.uid())
  )
);

CREATE POLICY "Only admins can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

-- Fix traces policies
DROP POLICY IF EXISTS "traces_admin_select" ON public.traces;
DROP POLICY IF EXISTS "traces_admin_insert" ON public.traces;
DROP POLICY IF EXISTS "traces_admin_update" ON public.traces;

CREATE POLICY "traces_admin_select" 
ON public.traces 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "traces_admin_insert" 
ON public.traces 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());

CREATE POLICY "traces_admin_update" 
ON public.traces 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND is_admin_or_owner())
WITH CHECK (auth.uid() IS NOT NULL AND is_admin_or_owner());