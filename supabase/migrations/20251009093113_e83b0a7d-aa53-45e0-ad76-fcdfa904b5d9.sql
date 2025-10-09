-- Create table to track terms acceptance
CREATE TABLE public.terms_acceptance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signature_data TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  terms_version TEXT NOT NULL DEFAULT '1.0',
  UNIQUE(user_id, terms_version)
);

-- Enable RLS
ALTER TABLE public.terms_acceptance ENABLE ROW LEVEL SECURITY;

-- Users can view their own acceptance records
CREATE POLICY "Users can view own terms acceptance"
ON public.terms_acceptance
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own acceptance (one-time)
CREATE POLICY "Users can accept terms once"
ON public.terms_acceptance
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only admins can view all acceptance records
CREATE POLICY "Admins can view all terms acceptance"
ON public.terms_acceptance
FOR SELECT
USING (is_admin_or_owner());

-- Create index for faster lookups
CREATE INDEX idx_terms_acceptance_user_id ON public.terms_acceptance(user_id);
CREATE INDEX idx_terms_acceptance_version ON public.terms_acceptance(terms_version);