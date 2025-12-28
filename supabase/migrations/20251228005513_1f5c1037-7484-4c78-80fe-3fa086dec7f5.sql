-- Make activate_template resolve by slug OR UUID for flexibility
CREATE OR REPLACE FUNCTION public.activate_template(p_user_id uuid, p_template_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_template_id uuid;
  v_plan text;
  v_input_uuid uuid;
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

  -- 1) Try resolve by slug
  SELECT id INTO v_template_id
  FROM public.templates
  WHERE slug = p_template_slug
  LIMIT 1;

  -- 2) If not found, try resolve by UUID id (if input is UUID-ish)
  IF v_template_id IS NULL THEN
    BEGIN
      v_input_uuid := p_template_slug::uuid;
      SELECT id INTO v_template_id
      FROM public.templates
      WHERE id = v_input_uuid
      LIMIT 1;
    EXCEPTION WHEN others THEN
      -- ignore cast failures
      v_template_id := NULL;
    END;
  END IF;

  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Template not found (key=%)', p_template_slug;
  END IF;

  -- Beginner: enforce 1 active by deactivating others
  IF v_plan = 'beginner' OR v_plan = 'free' THEN
    UPDATE public.user_templates
    SET is_active = false
    WHERE user_id = p_user_id
      AND is_active = true
      AND template_id <> v_template_id;
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