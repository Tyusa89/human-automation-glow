-- Create contact_submissions table for contact form functionality
CREATE TABLE public.contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  client_ip text,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  processed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can view all submissions"
ON public.contact_submissions
FOR SELECT
USING (is_admin_or_owner());

CREATE POLICY "Admins can update submissions"
ON public.contact_submissions
FOR UPDATE
USING (is_admin_or_owner());

CREATE POLICY "Admins can delete submissions"
ON public.contact_submissions
FOR DELETE
USING (is_admin_or_owner());

-- Create index for rate limiting queries
CREATE INDEX idx_contact_submissions_client_ip_time
ON public.contact_submissions(client_ip, submitted_at);

-- Create index for email lookups
CREATE INDEX idx_contact_submissions_email
ON public.contact_submissions(email);

-- Add trigger for updated_at
CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();