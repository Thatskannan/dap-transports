-- Run this in the Supabase SQL Editor if you already created your `trips`
-- table before login was added. It swaps the open "allow all" policies for
-- ones that require a signed-in user.

drop policy if exists "Allow all reads" on trips;
drop policy if exists "Allow all inserts" on trips;
drop policy if exists "Allow all updates" on trips;
drop policy if exists "Allow all deletes" on trips;

create policy "Authenticated read" on trips
  for select using (auth.role() = 'authenticated');

create policy "Authenticated insert" on trips
  for insert with check (auth.role() = 'authenticated');

create policy "Authenticated update" on trips
  for update using (auth.role() = 'authenticated');

create policy "Authenticated delete" on trips
  for delete using (auth.role() = 'authenticated');
