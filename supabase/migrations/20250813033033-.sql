-- Add missing company column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company TEXT;