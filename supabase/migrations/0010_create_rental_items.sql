-- Join table letting one Rental cover more than one Item (e.g. an Estate
-- bundled with its ParkingSpot). Every Rental has one or more rows here; code
-- always reaches a rental's items through this table, never a single itemId on
-- rentals (architecture-context invariant #6).
create table if not exists rental_items (
  id uuid primary key default gen_random_uuid(),
  rental_id uuid not null references rentals (id) on delete cascade,
  item_id uuid not null references items (id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (rental_id, item_id)
);

create index if not exists rental_items_rental_id_idx on rental_items (rental_id);
create index if not exists rental_items_item_id_idx on rental_items (item_id);

alter table rental_items enable row level security;

-- Not public. Visibility follows the parent rental: the owning user or an
-- admin. No standalone public read policy.
create policy "rental_items_select_own" on rental_items
  for select
  using (
    exists (
      select 1
      from rentals r
      where r.id = rental_items.rental_id
        and r.user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "rental_items_select_admin" on rental_items
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "rental_items_insert_own" on rental_items
  for insert
  with check (
    exists (
      select 1
      from rentals r
      where r.id = rental_items.rental_id
        and r.user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "rental_items_insert_admin" on rental_items
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "rental_items_delete_own" on rental_items
  for delete
  using (
    exists (
      select 1
      from rentals r
      where r.id = rental_items.rental_id
        and r.user_id = auth.jwt() ->> 'sub'
    )
  );

create policy "rental_items_delete_admin" on rental_items
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

grant all on public.rental_items to service_role;
grant select, insert, delete on public.rental_items to authenticated;
