-- Fix the overly permissive anonymous insert policy for leads
-- This policy currently allows any anonymous user to insert with no restrictions

-- Drop the existing insecure policy
DROP POLICY "leads_contact_form_insert" ON public.leads;

-- Create a more secure anonymous insert policy with basic validation
CREATE POLICY "leads_contact_form_insert_secure" 
ON public.leads 
FOR INSERT 
TO anon 
WITH CHECK (
  -- Require email to be present and valid format
  email IS NOT NULL 
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  -- Limit email length to prevent abuse
  AND length(email) <= 254
  -- Limit name length if provided
  AND (name IS NULL OR length(name) <= 100)
  -- Limit company length if provided  
  AND (company IS NULL OR length(company) <= 100)
  -- Ensure status is either null or 'new' for anonymous submissions
  AND (status IS NULL OR status = 'new')
  -- Prevent setting source to anything other than expected values
  AND (source IS NULL OR source IN ('website', 'contact_form'))
);