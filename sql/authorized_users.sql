-- authorized_users table for tracking verified public users
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.authorized_users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  first_seen_at timestamptz DEFAULT now(),
  last_seen_at timestamptz DEFAULT now()
);

ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

-- Authenticated users can insert their own row
CREATE POLICY "Users can record own access" ON authorized_users
  FOR INSERT WITH CHECK (auth.email() = email);

-- Authenticated users can update their own last_seen
CREATE POLICY "Users can update own last_seen" ON authorized_users
  FOR UPDATE USING (auth.email() = email);

-- Admins can view all authorized users
CREATE POLICY "Admins can view authorized users" ON authorized_users
  FOR SELECT USING (is_admin());
