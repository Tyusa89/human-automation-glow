-- Create staff_roles table
CREATE TABLE public.staff_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create customer_notes table
CREATE TABLE public.customer_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  content TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.staff_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for staff_roles
CREATE POLICY "Users can view their own staff roles"
ON public.staff_roles
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Only admins can manage staff roles"
ON public.staff_roles
FOR ALL
USING (is_admin_or_owner())
WITH CHECK (is_admin_or_owner());

-- Add the requested policy for customer_notes
CREATE POLICY "Allow only managers to view private notes"
ON public.customer_notes
FOR SELECT
USING (EXISTS (
    SELECT 1
    FROM public.staff_roles
    WHERE staff_roles.user_id = auth.uid()
    AND staff_roles.role = 'manager'
));

-- Allow all authenticated users to view non-private notes
CREATE POLICY "Anyone can view public customer notes"
ON public.customer_notes
FOR SELECT
USING (NOT is_private OR created_by = auth.uid());

-- Allow users to create notes
CREATE POLICY "Authenticated users can create customer notes"
ON public.customer_notes
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow note creators and managers to update notes
CREATE POLICY "Note creators and managers can update notes"
ON public.customer_notes
FOR UPDATE
USING (
  created_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.staff_roles 
    WHERE staff_roles.user_id = auth.uid() 
    AND staff_roles.role = 'manager'
  )
);

-- Add update trigger for timestamps
CREATE TRIGGER update_staff_roles_updated_at
BEFORE UPDATE ON public.staff_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_notes_updated_at
BEFORE UPDATE ON public.customer_notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();