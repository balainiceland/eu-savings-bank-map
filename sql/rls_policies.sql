-- Row Level Security Policies
-- Run after schema.sql in Supabase SQL Editor

-- Enable RLS on all tables
alter table banks enable row level security;
alter table digital_features enable row level security;
alter table admin_users enable row level security;

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
  using (
    exists (
      select 1 from admin_users
      where admin_users.email = (select auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from admin_users
      where admin_users.email = (select auth.jwt() ->> 'email')
    )
  );

-- Admin: full access to digital features
create policy "Admins can do everything with digital features"
  on digital_features for all
  using (
    exists (
      select 1 from admin_users
      where admin_users.email = (select auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from admin_users
      where admin_users.email = (select auth.jwt() ->> 'email')
    )
  );

-- Admin users: readable by authenticated admins, manageable by admins
create policy "Admins can view admin users"
  on admin_users for select
  using (
    exists (
      select 1 from admin_users au
      where au.email = (select auth.jwt() ->> 'email')
    )
  );

create policy "Admins can manage admin users"
  on admin_users for all
  using (
    exists (
      select 1 from admin_users au
      where au.email = (select auth.jwt() ->> 'email')
    )
  )
  with check (
    exists (
      select 1 from admin_users au
      where au.email = (select auth.jwt() ->> 'email')
    )
  );
