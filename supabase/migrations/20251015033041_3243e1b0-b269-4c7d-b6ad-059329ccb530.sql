-- Enable RLS on org_integrations table (contains webhook URLs and secrets)
ALTER TABLE public.org_integrations ENABLE ROW LEVEL SECURITY;

-- Org integrations policies: Only admins/owners can access
CREATE POLICY "org_integrations_admin_select" 
ON public.org_integrations 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "org_integrations_admin_insert" 
ON public.org_integrations 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "org_integrations_admin_update" 
ON public.org_integrations 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
)
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "org_integrations_admin_delete" 
ON public.org_integrations 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

-- Enable RLS on support_customers table
ALTER TABLE public.support_customers ENABLE ROW LEVEL SECURITY;

-- Support customers policies: Only admins/owners can access
CREATE POLICY "support_customers_admin_select" 
ON public.support_customers 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_customers_admin_insert" 
ON public.support_customers 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_customers_admin_update" 
ON public.support_customers 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
)
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_customers_admin_delete" 
ON public.support_customers 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

-- Enable RLS on support_threads table
ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;

-- Support threads policies: Only admins/owners can access
CREATE POLICY "support_threads_admin_select" 
ON public.support_threads 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_threads_admin_insert" 
ON public.support_threads 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_threads_admin_update" 
ON public.support_threads 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
)
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_threads_admin_delete" 
ON public.support_threads 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

-- Enable RLS on support_messages table
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Support messages policies: Only admins/owners can access
CREATE POLICY "support_messages_admin_select" 
ON public.support_messages 
FOR SELECT 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_messages_admin_insert" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_messages_admin_update" 
ON public.support_messages 
FOR UPDATE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
)
WITH CHECK (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);

CREATE POLICY "support_messages_admin_delete" 
ON public.support_messages 
FOR DELETE 
USING (
  (auth.uid() IS NOT NULL) AND is_admin_or_owner()
);