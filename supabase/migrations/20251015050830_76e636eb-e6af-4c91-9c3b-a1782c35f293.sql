-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'owner', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE (user_id, role)
);

-- 3. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Update existing security functions to use new table
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'owner'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'owner'::public.app_role) 
      OR public.has_role(auth.uid(), 'admin'::public.app_role);
$$;

-- 6. Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT 
  COALESCE(user_id, id) as user_id,
  role::public.app_role
FROM public.profiles
WHERE role IS NOT NULL
  AND role IN ('admin', 'owner', 'user')
ON CONFLICT (user_id, role) DO NOTHING;

-- 7. Create RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Only owners can assign roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'owner'::public.app_role));

CREATE POLICY "Only owners can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'owner'::public.app_role));

CREATE POLICY "Only owners can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'owner'::public.app_role));

-- 8. Remove role column from profiles (SECURE THE VULNERABILITY)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;