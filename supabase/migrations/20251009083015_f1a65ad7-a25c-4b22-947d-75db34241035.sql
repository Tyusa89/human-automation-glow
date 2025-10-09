-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage all integrations" ON public.integrations;
DROP POLICY IF EXISTS "Users can view own integrations" ON public.integrations;
DROP POLICY IF EXISTS "Admins can manage all configs" ON public.integration_configs;
DROP POLICY IF EXISTS "Users can view own configs" ON public.integration_configs;

-- Create integrations table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  encrypted_tokens JSONB,
  scopes TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  last_sync TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Admins can manage all integrations"
ON public.integrations
FOR ALL
USING (is_admin_or_owner());

CREATE POLICY "Users can view own integrations"
ON public.integrations
FOR SELECT
USING (auth.uid() = user_id);

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS update_integrations_updated_at ON public.integrations;
CREATE TRIGGER update_integrations_updated_at
BEFORE UPDATE ON public.integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create integration_configs table
CREATE TABLE IF NOT EXISTS public.integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  integration_id UUID REFERENCES public.integrations(id) ON DELETE CASCADE NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(integration_id, config_key)
);

-- Enable RLS on configs
ALTER TABLE public.integration_configs ENABLE ROW LEVEL SECURITY;

-- Recreate config policies
CREATE POLICY "Admins can manage all configs"
ON public.integration_configs
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE id = integration_id AND is_admin_or_owner()
  )
);

CREATE POLICY "Users can view own configs"
ON public.integration_configs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.integrations
    WHERE id = integration_id AND user_id = auth.uid()
  )
);