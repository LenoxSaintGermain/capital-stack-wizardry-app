
-- Update lenox.paris@outlook.com to admin role and enterprise subscription
UPDATE public.profiles 
SET 
  role = 'admin',
  subscription_tier = 'enterprise',
  updated_at = NOW()
WHERE email = 'lenox.paris@outlook.com';
