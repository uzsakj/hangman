-- Ensure pgcrypto is available for password hashing (Supabase usually has it)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Default admin user: email admin@localhost, password admin (for Admin page login)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  'authenticated',
  'authenticated',
  'admin@admin.com',
  crypt('admin', gen_salt('bf')),
  current_timestamp,
  current_timestamp,
  current_timestamp,
  '{"provider":"email","providers":["email"]}',
  '{}',
  current_timestamp,
  current_timestamp,
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Link identity so the admin user can sign in with email
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  u.id,
  u.id,
  format('{"sub":"%s","email":"%s"}', u.id::text, u.email)::jsonb,
  'email',
  current_timestamp,
  current_timestamp,
  current_timestamp
FROM auth.users u
WHERE u.email = 'admin@localhost'
  AND NOT EXISTS (
    SELECT 1 FROM auth.identities i
    WHERE i.user_id = u.id AND i.provider = 'email'
  );

-- Create words table if it doesn't exist (run once)
CREATE TABLE IF NOT EXISTS words (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Seed words
INSERT INTO words (word) VALUES
  ('reward'),
  ('shiver'),
  ('regret'),
  ('carbon'),
  ('island'),
  ('impound'),
  ('extreme'),
  ('inspire'),
  ('finance'),
  ('control'),
  ('collapse'),
  ('medicine'),
  ('frighten'),
  ('observer'),
  ('classify'),
  ('monstrous'),
  ('orchestra'),
  ('executive'),
  ('fireplace'),
  ('essential'),
  ('prevalence'),
  ('background'),
  ('particular'),
  ('attraction'),
  ('pedestrian'),
  ('unfortunate'),
  ('charismatic'),
  ('institution'),
  ('destruction'),
  ('presentation'),
  ('manufacturer'),
  ('interference'),
  ('announcement'),
  ('presidential'),
  ('inappropriate'),
  ('embarrassment'),
  ('consideration'),
  ('comprehensive'),
  ('communication'),
  ('representative'),
  ('responsibility'),
  ('constitutional'),
  ('discrimination'),
  ('recommendation')
ON CONFLICT (word) DO NOTHING;
