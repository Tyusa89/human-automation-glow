-- Assign owner role to the current user (atyus55@gmail.com)
INSERT INTO public.user_roles (user_id, role, assigned_at)
VALUES ('bf29bd9b-63bc-4478-a103-6fe7d28989a4', 'owner', now())
ON CONFLICT (user_id, role) DO NOTHING;