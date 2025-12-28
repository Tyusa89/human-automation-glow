-- Add plan_tier column to profiles (default to 'free' which maps to beginner)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_tier text DEFAULT 'free';

-- Create index for plan lookups
CREATE INDEX IF NOT EXISTS idx_profiles_plan_tier ON public.profiles(plan_tier);

-- Update activate_template RPC: Beginner = single-active, Pro = multi-active
CREATE OR REPLACE FUNCTION public.activate_template(p_user_id uuid, p_template_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_template_id uuid;
  v_plan text;
BEGIN
  -- Security check: caller can only activate for themselves
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  -- Get user's plan (default to free/beginner if null)
  SELECT COALESCE(plan_tier, 'free') INTO v_plan
  FROM public.profiles
  WHERE user_id = p_user_id
  LIMIT 1;

  -- Find the template by slug
  SELECT id INTO v_template_id
  FROM public.templates
  WHERE slug = p_template_slug
  LIMIT 1;

  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Template not found: %', p_template_slug;
  END IF;

  -- Beginner/Free: enforce 1-at-a-time by deactivating others
  IF v_plan = 'free' OR v_plan = 'beginner' OR v_plan IS NULL THEN
    UPDATE public.user_templates
    SET is_active = false
    WHERE user_id = p_user_id
      AND is_active = true;
  END IF;

  -- Activate existing row if present
  UPDATE public.user_templates
  SET is_active = true
  WHERE user_id = p_user_id
    AND template_id = v_template_id;

  -- If no row existed, insert a new active row
  IF NOT FOUND THEN
    INSERT INTO public.user_templates(user_id, template_id, is_active)
    VALUES (p_user_id, v_template_id, true);
  END IF;
END;
$function$;

-- Add deactivate_template RPC for explicit deactivation
CREATE OR REPLACE FUNCTION public.deactivate_template(p_user_id uuid, p_template_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_template_id uuid;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  SELECT id INTO v_template_id
  FROM public.templates
  WHERE slug = p_template_slug
  LIMIT 1;

  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Template not found: %', p_template_slug;
  END IF;

  UPDATE public.user_templates
  SET is_active = false
  WHERE user_id = p_user_id
    AND template_id = v_template_id;
END;
$function$;