-- CRITICAL SECURITY FIXES
-- Fix 1: Secure database functions by setting search_path

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', '')
  );
  RETURN NEW;
END;
$function$;

-- Update calculate_meeting_end_time function
CREATE OR REPLACE FUNCTION public.calculate_meeting_end_time()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
BEGIN
  NEW.end_time = NEW.start_time + INTERVAL '1 minute' * NEW.duration_minutes;
  RETURN NEW;
END;
$function$;

-- Update is_owner function
CREATE OR REPLACE FUNCTION public.is_owner()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'owner'
  );
$function$;

-- Update is_admin_or_owner function
CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role IN ('admin','owner')
  );
$function$;

-- Fix 2: Secure RLS policies - Remove public access and require authentication

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "leads_select_authed" ON public.leads;
DROP POLICY IF EXISTS "leads_insert_authed" ON public.leads;
DROP POLICY IF EXISTS "Meetings are publicly readable" ON public.meetings;
DROP POLICY IF EXISTS "Anyone can create meetings" ON public.meetings;
DROP POLICY IF EXISTS "Anyone can update meetings" ON public.meetings;
DROP POLICY IF EXISTS "Notes are publicly readable" ON public.notes;
DROP POLICY IF EXISTS "Anyone can create notes" ON public.notes;
DROP POLICY IF EXISTS "Anyone can update notes" ON public.notes;
DROP POLICY IF EXISTS "Tasks are publicly readable" ON public.tasks;
DROP POLICY IF EXISTS "Anyone can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Anyone can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Traces are publicly readable" ON public.traces;
DROP POLICY IF EXISTS "Anyone can create traces" ON public.traces;
DROP POLICY IF EXISTS "Anyone can update traces" ON public.traces;

-- Create secure authentication-based policies

-- LEADS table - Only authenticated admin/owner users can access
CREATE POLICY "Only admin/owner can view leads" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (is_admin_or_owner());

CREATE POLICY "Only admin/owner can create leads" 
ON public.leads 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin_or_owner());

CREATE POLICY "Only admin/owner can update leads" 
ON public.leads 
FOR UPDATE 
TO authenticated
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- MEETINGS table - Only authenticated users can access
CREATE POLICY "Authenticated users can view meetings" 
ON public.meetings 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create meetings" 
ON public.meetings 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update meetings" 
ON public.meetings 
FOR UPDATE 
TO authenticated
USING (true);

-- NOTES table - Only authenticated users can access
CREATE POLICY "Authenticated users can view notes" 
ON public.notes 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create notes" 
ON public.notes 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update notes" 
ON public.notes 
FOR UPDATE 
TO authenticated
USING (true);

-- TASKS table - Only authenticated users can access
CREATE POLICY "Authenticated users can view tasks" 
ON public.tasks 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create tasks" 
ON public.tasks 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tasks" 
ON public.tasks 
FOR UPDATE 
TO authenticated
USING (true);

-- TRACES table - Only authenticated users can access
CREATE POLICY "Authenticated users can view traces" 
ON public.traces 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create traces" 
ON public.traces 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update traces" 
ON public.traces 
FOR UPDATE 
TO authenticated
USING (true);