-- Catalog taxonomy. A `Category` groups items of one high-level kind; the
-- `item_type` mirrors the `Category` union in `types/domain.ts`
-- (estate | machinery | service). ParkingSpot is deliberately absent here:
-- it is an ObjectItem subtype, not its own category (see architecture-context
-- "ParkingSpot ... new ObjectItem subtype"), so parking items carry a null
-- category_id rather than a "parking" category row.
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  item_type text not null
    check (item_type in ('estate', 'machinery', 'service')),
  created_at timestamptz not null default now()
);

alter table categories enable row level security;

-- Read model: the catalog is browsable without an account, so categories are
-- world-readable. Writes are admin-only, gated on the Clerk role claim
-- (auth.jwt() -> 'public_metadata' ->> 'role'), same pattern as `people`.
create policy "categories_select_public" on categories
  for select
  using (true);

create policy "categories_insert_admin" on categories
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "categories_update_admin" on categories
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "categories_delete_admin" on categories
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

-- Explicit role grants: Supabase's default-privilege automation does not fire
-- for tables created by raw SQL in this project (see 0003_people_grants.sql),
-- so open the table to the API roles by hand. RLS above is the real boundary;
-- these grants only let the policies be evaluated at all.
grant all on public.categories to service_role;
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
