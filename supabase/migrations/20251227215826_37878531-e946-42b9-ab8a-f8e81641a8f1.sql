-- Create the activate_template RPC function
CREATE OR REPLACE FUNCTION public.activate_template(p_user_id uuid, p_template_slug text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_template_id uuid;
BEGIN
  -- Security check: caller can only activate for themselves
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not allowed';
  END IF;

  -- Find the template by slug
  SELECT id INTO v_template_id
  FROM public.templates
  WHERE slug = p_template_slug
  LIMIT 1;

  IF v_template_id IS NULL THEN
    RAISE EXCEPTION 'Template not found: %', p_template_slug;
  END IF;

  -- Deactivate all current templates for this user
  UPDATE public.user_templates
  SET is_active = false
  WHERE user_id = p_user_id
    AND is_active = true;

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
$$;

-- Enforce single active template per user at database level
CREATE UNIQUE INDEX IF NOT EXISTS user_one_active_template
ON public.user_templates (user_id)
WHERE is_active = true;