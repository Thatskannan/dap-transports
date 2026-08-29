-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

create extension if not exists "pgcrypto";

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  trip_date date not null,
  vehicle_number text not null,
  company_name text not null,
  destination_from text not null,
  destination_to text not null,

  rent numeric not null default 0,
  advance_from_company numeric not null default 0,
  balance_from_company numeric generated always as (rent - advance_from_company) stored,

  driver_name text not null,
  driver_salary numeric not null default 0,
  driver_advance numeric not null default 0,
  driver_balance numeric generated always as (driver_salary - driver_advance) stored,

  diesel_cost numeric not null default 0,
  fasttag numeric not null default 0,

  net_profit numeric generated always as (rent - driver_salary - diesel_cost - fasttag) stored,

  created_at timestamptz not null default now()
);

create index if not exists trips_trip_date_idx on trips (trip_date);

-- Row Level Security. Only signed-in users (via Supabase Auth) can
-- read or write trips. Create user logins in Authentication > Users.
alter table trips enable row level security;

create policy "Authenticated read" on trips
  for select using (auth.role() = 'authenticated');

create policy "Authenticated insert" on trips
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated update" on trips
  for update using (auth.role() = 'authenticated');

create policy "Authenticated delete" on trips
  for delete using (auth.role() = 'authenticated');
