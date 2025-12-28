-- Update activate_template function with improved beginner/free plan logic
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

  -- Get user's plan tier (default beginner if missing)
  SELECT COALESCE(plan_tier, 'beginner') INTO v_plan
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

  -- Beginner: enforce 1 active by deactivating others
  IF v_plan = 'beginner' OR v_plan = 'free' THEN
    UPDATE public.user_templates
    SET is_active = false
    WHERE user_id = p_user_id
      AND is_active = true
      AND template_id <> v_template_id; -- don't flap if it's already active
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

-- Add index for efficient active template lookups
CREATE INDEX IF NOT EXISTS idx_user_templates_user_active
ON public.user_templates (user_id, is_active);