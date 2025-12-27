-- 1) Enums for personalization
DO $$ BEGIN
  CREATE TYPE business_type AS ENUM (
    'consultant', 'coach', 'freelancer', 'creative_designer', 'local_service_provider', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE client_volume AS ENUM ('1_3','4_10','11_25','25_plus');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE monthly_revenue_range AS ENUM (
    'starting_inconsistent', 'under_5000', '5000_10000', '10000_plus'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE tracking_method AS ENUM (
    'spreadsheets', 'accounting_software', 'notes_memory', 'nothing_consistently'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE success_goal AS ENUM (
    'consistent_income', 'less_stress', 'fewer_dropped_balls', 'more_time', 'preparing_to_grow'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE assistant_level AS ENUM ('quiet','balanced','active');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2) Add new columns to existing profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS business_type public.business_type,
  ADD COLUMN IF NOT EXISTS client_volume public.client_volume,
  ADD COLUMN IF NOT EXISTS monthly_revenue_range public.monthly_revenue_range,
  ADD COLUMN IF NOT EXISTS tracking_method public.tracking_method,
  ADD COLUMN IF NOT EXISTS success_goal public.success_goal,
  ADD COLUMN IF NOT EXISTS assistant_level public.assistant_level DEFAULT 'balanced',
  ADD COLUMN IF NOT EXISTS primary_challenges text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS onboarding_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS timezone text,
  ADD COLUMN IF NOT EXISTS locale text DEFAULT 'en';

-- 3) Constraint: primary_challenges max length 2
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS primary_challenges_max_two;

ALTER TABLE public.profiles
  ADD CONSTRAINT primary_challenges_max_two
  CHECK (coalesce(array_length(primary_challenges, 1), 0) <= 2);

-- 4) user_dashboard_widgets table
CREATE TABLE IF NOT EXISTS public.user_dashboard_widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 100,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, widget_key)
);

DROP TRIGGER IF EXISTS trg_user_dashboard_widgets_updated_at ON public.user_dashboard_widgets;
CREATE TRIGGER trg_user_dashboard_widgets_updated_at
BEFORE UPDATE ON public.user_dashboard_widgets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.user_dashboard_widgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_widgets" ON public.user_dashboard_widgets;
CREATE POLICY "read_own_widgets"
ON public.user_dashboard_widgets
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_widgets" ON public.user_dashboard_widgets;
CREATE POLICY "insert_own_widgets"
ON public.user_dashboard_widgets
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_widgets" ON public.user_dashboard_widgets;
CREATE POLICY "update_own_widgets"
ON public.user_dashboard_widgets
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_widgets" ON public.user_dashboard_widgets;
CREATE POLICY "delete_own_widgets"
ON public.user_dashboard_widgets
FOR DELETE
USING (auth.uid() = user_id);

-- 5) user_events table for activity feed
CREATE TABLE IF NOT EXISTS public.user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_source text,
  event_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_events_user_created
  ON public.user_events (user_id, created_at DESC);

ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_events" ON public.user_events;
CREATE POLICY "read_own_events"
ON public.user_events
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_events" ON public.user_events;
CREATE POLICY "insert_own_events"
ON public.user_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);