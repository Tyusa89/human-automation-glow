-- Create user_dashboard_suggestions table for behavior-based suggestions
CREATE TABLE IF NOT EXISTS public.user_dashboard_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  suggestion_key text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  acted_at timestamptz
);

-- Create unique index for active suggestions per user
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_active_suggestion
ON public.user_dashboard_suggestions(user_id, suggestion_key)
WHERE status = 'active';

-- Enable Row Level Security
ALTER TABLE public.user_dashboard_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "read_own_suggestions"
ON public.user_dashboard_suggestions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "mutate_own_suggestions"
ON public.user_dashboard_suggestions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "insert_own_suggestions"
ON public.user_dashboard_suggestions
FOR INSERT
WITH CHECK (auth.uid() = user_id);