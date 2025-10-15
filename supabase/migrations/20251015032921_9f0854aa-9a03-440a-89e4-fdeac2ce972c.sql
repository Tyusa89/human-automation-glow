-- Enable Row Level Security on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins/owners can view events
CREATE POLICY "events_admin_select" 
ON public.events 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

-- Policy: Only admins/owners can insert events
CREATE POLICY "events_admin_insert" 
ON public.events 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

-- Policy: Only admins/owners can update events
CREATE POLICY "events_admin_update" 
ON public.events 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
)
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

-- Policy: Only admins/owners can delete events
CREATE POLICY "events_admin_delete" 
ON public.events 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);