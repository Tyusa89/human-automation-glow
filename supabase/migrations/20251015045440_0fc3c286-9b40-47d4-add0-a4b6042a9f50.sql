-- Create rate limiting table for API endpoints
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint, window_start)
);

-- Enable RLS
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own rate limit data
CREATE POLICY "Users can view own rate limits"
ON public.api_rate_limits
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert/update rate limit records (through edge functions with service role)
CREATE POLICY "Service role can manage rate limits"
ON public.api_rate_limits
FOR ALL
USING (auth.jwt() ->> 'role' = 'service_role');

-- Add index for efficient rate limit lookups
CREATE INDEX idx_rate_limits_user_endpoint 
ON public.api_rate_limits(user_id, endpoint, window_start);

-- Create trigger to update timestamps
CREATE TRIGGER update_api_rate_limits_updated_at
BEFORE UPDATE ON public.api_rate_limits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();