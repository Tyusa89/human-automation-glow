-- Add onboarding tracking fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step text DEFAULT 'welcome',
ADD COLUMN IF NOT EXISTS setup_goals text[] DEFAULT '{}';

-- Add index for quick lookup of users needing onboarding
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.profiles (onboarding_completed) WHERE onboarding_completed = false;