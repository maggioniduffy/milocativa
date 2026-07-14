-- Availability windows for an Item: a date range and whether it is already
-- booked. Read publicly only for items whose listing is published (so the
-- catalog/detail pages can show when something is free); writes are admin-only.
create table if not exists availability (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references items (id) on delete cascade,
  start_date date not null,
  end_date date not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create index if not exists availability_item_id_idx on availability (item_id);

alter table availability enable row level security;

-- Public read is scoped the same way as items: only rows belonging to an item
-- with a published listing. Admin sees all.
create policy "availability_select_published" on availability
  for select
  using (
    exists (
      select 1
      from listings l
      where l.item_id = availability.item_id
        and l.status = 'published'
    )
  );

create policy "availability_select_admin" on availability
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "availability_insert_admin" on availability
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "availability_update_admin" on availability
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "availability_delete_admin" on availability
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

grant all on public.availability to service_role;
grant select on public.availability to anon, authenticated;
grant insert, update, delete on public.availability to authenticated;
