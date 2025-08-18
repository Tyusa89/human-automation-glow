-- Set user role to owner
UPDATE public.profiles 
SET role = 'owner' 
WHERE email = 'sacredsystems@outlook.com';