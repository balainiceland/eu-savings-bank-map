-- European Savings Bank Map — Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Banks table
create table if not exists banks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  country text not null,
  country_code text not null,
  city text,
  address text,
  latitude decimal not null,
  longitude decimal not null,
  parent_group text,
  website text,
  founded_year integer,
  total_assets decimal,          -- millions EUR
  customer_count decimal,        -- thousands
  deposit_volume decimal,        -- millions EUR
  loan_volume decimal,           -- millions EUR
  employee_count integer,
  branch_count integer,
  reporting_year integer default 2024,
  digital_score decimal default 0, -- 0-100
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Digital features table (one row per bank per category)
create table if not exists digital_features (
  id uuid primary key default uuid_generate_v4(),
  bank_id uuid not null references banks(id) on delete cascade,
  category text not null check (category in (
    'mobile_banking', 'open_banking', 'digital_onboarding', 'ai_chatbot', 'devops_cloud'
  )),
  present boolean default false,
  maturity_level text not null default 'none' check (maturity_level in (
    'none', 'basic', 'intermediate', 'advanced'
  )),
  evidence_url text,
  created_at timestamptz default now(),
  unique(bank_id, category)
);

-- Admin users table
create table if not exists admin_users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_banks_status on banks(status);
create index if not exists idx_banks_country on banks(country);
create index if not exists idx_banks_digital_score on banks(digital_score);
create index if not exists idx_digital_features_bank_id on digital_features(bank_id);
create index if not exists idx_admin_users_email on admin_users(email);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger banks_updated_at
  before update on banks
  for each row execute function update_updated_at();
