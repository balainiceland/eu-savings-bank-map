-- Fix: RLS infinite recursion on admin_users
-- Run this in Supabase SQL Editor to replace broken policies

-- Step 1: Drop all existing policies
drop policy if exists "Published banks are viewable by everyone" on banks;
drop policy if exists "Digital features of published banks are viewable by everyone" on digital_features;
drop policy if exists "Admins can do everything with banks" on banks;
drop policy if exists "Admins can do everything with digital features" on digital_features;
drop policy if exists "Admins can view admin users" on admin_users;
drop policy if exists "Admins can manage admin users" on admin_users;

-- Step 2: Create a SECURITY DEFINER function to check admin status
-- This bypasses RLS, breaking the recursion
create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from admin_users
    where email = (select auth.jwt() ->> 'email')
  );
$$;

-- Step 3: Recreate policies using the function

-- Public read access for published banks
create policy "Published banks are viewable by everyone"
  on banks for select
  using (status = 'published');

-- Public read access for digital features of published banks
create policy "Digital features of published banks are viewable by everyone"
  on digital_features for select
  using (
    exists (
      select 1 from banks where banks.id = digital_features.bank_id and banks.status = 'published'
    )
  );

-- Admin: full access to banks
create policy "Admins can do everything with banks"
  on banks for all
  using (is_admin())
  with check (is_admin());

-- Admin: full access to digital features
create policy "Admins can do everything with digital features"
  on digital_features for all
  using (is_admin())
  with check (is_admin());

-- Admin users: admin access only
create policy "Admins can view admin users"
  on admin_users for select
  using (is_admin());

create policy "Admins can manage admin users"
  on admin_users for all
  using (is_admin())
  with check (is_admin());
