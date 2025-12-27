-- Add work_type and hardest_things columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS work_type text,
ADD COLUMN IF NOT EXISTS hardest_things text[] DEFAULT '{}'::text[];