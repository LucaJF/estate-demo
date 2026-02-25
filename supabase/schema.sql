-- Estate Tools Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients table
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  budget_min numeric,
  budget_max numeric,
  preferred_areas text[],
  status text not null default 'active' check (status in ('active', 'pending', 'closed')),
  follow_up_date date,
  notes text,
  created_at timestamptz default now()
);

-- Events table
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients(id) on delete cascade not null,
  type text not null check (type in ('call', 'email', 'showing', 'offer', 'note')),
  title text not null,
  notes text,
  event_date timestamptz default now(),
  created_at timestamptz default now()
);

-- Properties table
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  address text not null,
  price numeric not null,
  area_sqft numeric,
  bedrooms integer,
  bathrooms numeric,
  area_name text,
  status text not null default 'available' check (status in ('available', 'pending', 'sold')),
  created_at timestamptz default now()
);

-- Row Level Security
alter table clients enable row level security;
alter table events enable row level security;
alter table properties enable row level security;

-- RLS Policies: clients
create policy "Users can manage their own clients"
  on clients for all
  using (auth.uid() = user_id);

-- RLS Policies: events (via client ownership)
create policy "Users can manage events for their clients"
  on events for all
  using (
    exists (
      select 1 from clients
      where clients.id = events.client_id
        and clients.user_id = auth.uid()
    )
  );

-- RLS Policies: properties
create policy "Users can manage their own properties"
  on properties for all
  using (auth.uid() = user_id);

-- Seed demo data (optional - run after signing up to populate)
-- Replace 'YOUR_USER_ID' with your actual auth.users id
/*
insert into clients (user_id, name, email, phone, budget_min, budget_max, preferred_areas, status, follow_up_date) values
  ('YOUR_USER_ID', 'James Mitchell', 'james.m@email.com', '+1 212-555-0101', 800000, 1200000, array['Upper East Side', 'Midtown'], 'active', current_date),
  ('YOUR_USER_ID', 'Sarah Chen', 'sarah.chen@email.com', '+1 646-555-0182', 500000, 750000, array['Brooklyn', 'Lower East Side'], 'active', current_date + 2),
  ('YOUR_USER_ID', 'Robert Davis', 'r.davis@email.com', '+1 917-555-0143', 1500000, 2500000, array['Upper West Side', 'Tribeca'], 'pending', current_date + 1),
  ('YOUR_USER_ID', 'Emily Watson', 'emily.w@email.com', '+1 212-555-0167', 300000, 500000, array['Queens', 'Astoria'], 'active', current_date + 3),
  ('YOUR_USER_ID', 'Michael Torres', 'm.torres@email.com', '+1 718-555-0129', 600000, 900000, array['Downtown', 'Financial District'], 'closed', null);

insert into properties (user_id, address, price, area_sqft, bedrooms, bathrooms, area_name, status) values
  ('YOUR_USER_ID', '245 Park Ave, New York, NY 10167', 1100000, 1850, 3, 2, 'Midtown', 'available'),
  ('YOUR_USER_ID', '88 Lexington Ave, New York, NY 10016', 720000, 1200, 2, 1, 'Upper East Side', 'available'),
  ('YOUR_USER_ID', '310 W 72nd St, New York, NY 10023', 2100000, 2400, 4, 3, 'Upper West Side', 'available'),
  ('YOUR_USER_ID', '55 Water St, New York, NY 10041', 850000, 1500, 2, 2, 'Financial District', 'pending'),
  ('YOUR_USER_ID', '120 Atlantic Ave, Brooklyn, NY 11201', 650000, 1100, 2, 1, 'Brooklyn', 'available');
*/
