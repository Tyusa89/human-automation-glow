-- Fix security vulnerability: Restrict task access to assignees and admins only

-- Add user_id column to properly associate tasks with users
ALTER TABLE public.tasks ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Create index for better performance on user_id lookups
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee);

-- Drop the overly permissive policies
DROP POLICY "Authenticated users can view tasks" ON public.tasks;
DROP POLICY "Authenticated users can create tasks" ON public.tasks;
DROP POLICY "Authenticated users can update tasks" ON public.tasks;

-- Create secure RLS policies

-- Users can only view tasks assigned to them (by email) or that they created, plus admin/owner can see all
CREATE POLICY "Users can view their assigned tasks or admins see all" 
ON public.tasks 
FOR SELECT 
USING (
  is_admin_or_owner() OR 
  assignee = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  user_id = auth.uid()
);

-- Users can create tasks (will be associated with their user_id)
CREATE POLICY "Users can create tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR user_id IS NULL
);

-- Users can update tasks they created or are assigned to, admins can update all
CREATE POLICY "Users can update their tasks or admins update all" 
ON public.tasks 
FOR UPDATE 
USING (
  is_admin_or_owner() OR 
  assignee = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  user_id = auth.uid()
)
WITH CHECK (
  is_admin_or_owner() OR 
  assignee = (SELECT email FROM auth.users WHERE id = auth.uid()) OR
  user_id = auth.uid()
);

-- Only admins can delete tasks
CREATE POLICY "Only admins can delete tasks" 
ON public.tasks 
FOR DELETE 
USING (is_admin_or_owner());