-- Split the single-table `items` model (0006) into class-table inheritance:
-- `items` keeps only the columns common to every subtype (plus the
-- `item_kind` discriminator, kept so readers know which subtype table to join
-- without probing); each subtype gets its own 1:1 table keyed by `item_id`.
--
-- Column distribution beyond the documented domain model (the real 0006
-- schema has more columns than the mermaid): `location`/`condition` are
-- ObjectItem fields → estates, machinery and parking_spots each carry them;
-- `latitude`/`longitude` are Estate map coordinates (MapLibre source of
-- truth) → estates; `building_id` belongs to Estate and ParkingSpot →
-- estates and parking_spots. Services get none of these (not a physical
-- object). `spot_number` is the only parking-specific column in the real
-- schema.
--
-- Order matters: create tables → copy data → drop old columns. The INSERTs
-- must run before the DROPs (same file, single transaction under psql -1 /
-- ON_ERROR_STOP).

-- 1:1 subtype tables. `item_id` is both PK and FK → guaranteed unique, no
-- separate unique index needed.
create table if not exists estates (
  item_id uuid primary key references items (id) on delete cascade,
  area numeric(10, 2),
  bedrooms integer,
  address text,
  location text,
  condition text,
  latitude double precision,
  longitude double precision,
  building_id uuid references buildings (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists machinery (
  item_id uuid primary key references items (id) on delete cascade,
  brand text,
  model text,
  year integer,
  location text,
  condition text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists services (
  item_id uuid primary key references items (id) on delete cascade,
  service_type text,
  duration text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists parking_spots (
  item_id uuid primary key references items (id) on delete cascade,
  spot_number text,
  location text,
  condition text,
  building_id uuid references buildings (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists estates_building_id_idx on estates (building_id);
create index if not exists parking_spots_building_id_idx on parking_spots (building_id);

create trigger estates_set_updated_at
  before update on estates
  for each row
  execute function set_updated_at();

create trigger machinery_set_updated_at
  before update on machinery
  for each row
  execute function set_updated_at();

create trigger services_set_updated_at
  before update on services
  for each row
  execute function set_updated_at();

create trigger parking_spots_set_updated_at
  before update on parking_spots
  for each row
  execute function set_updated_at();

-- Copy existing data into the subtype tables. Every item gets a subtype row
-- (even if all subtype fields are null) so the 1:1 relation holds for the
-- whole catalog, not just rows that happened to fill subtype columns.
insert into estates (item_id, area, bedrooms, address, location, condition, latitude, longitude, building_id)
select id, area, bedrooms, address, location, condition, latitude, longitude, building_id
from items
where item_kind = 'estate'
on conflict (item_id) do nothing;

insert into machinery (item_id, brand, model, year, location, condition)
select id, brand, model, year, location, condition
from items
where item_kind = 'machinery'
on conflict (item_id) do nothing;

insert into services (item_id, service_type, duration)
select id, service_type, duration
from items
where item_kind = 'service'
on conflict (item_id) do nothing;

insert into parking_spots (item_id, spot_number, location, condition, building_id)
select id, spot_number, location, condition, building_id
from items
where item_kind = 'parking_spot'
on conflict (item_id) do nothing;

-- Drop the moved columns from `items` — it now carries only the common set:
-- id, item_kind, title, description, base_price, price_unit, status,
-- category_id, timestamps. Dependent indexes (items_building_id_idx) drop
-- with their column.
alter table items
  drop column if exists location,
  drop column if exists condition,
  drop column if exists latitude,
  drop column if exists longitude,
  drop column if exists area,
  drop column if exists bedrooms,
  drop column if exists address,
  drop column if exists brand,
  drop column if exists model,
  drop column if exists year,
  drop column if exists service_type,
  drop column if exists duration,
  drop column if exists spot_number,
  drop column if exists building_id;

-- RLS: same criteria as `items` (0006 admin policies + 0007's
-- items_select_published) — public read only when the parent item has a
-- published listing, all writes admin-only.
alter table estates enable row level security;
alter table machinery enable row level security;
alter table services enable row level security;
alter table parking_spots enable row level security;

create policy "estates_select_published" on estates
  for select
  using (
    exists (
      select 1
      from listings l
      where l.item_id = estates.item_id
        and l.status = 'published'
    )
  );

create policy "estates_select_admin" on estates
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "estates_insert_admin" on estates
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "estates_update_admin" on estates
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "estates_delete_admin" on estates
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "machinery_select_published" on machinery
  for select
  using (
    exists (
      select 1
      from listings l
      where l.item_id = machinery.item_id
        and l.status = 'published'
    )
  );

create policy "machinery_select_admin" on machinery
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "machinery_insert_admin" on machinery
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "machinery_update_admin" on machinery
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "machinery_delete_admin" on machinery
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "services_select_published" on services
  for select
  using (
    exists (
      select 1
      from listings l
      where l.item_id = services.item_id
        and l.status = 'published'
    )
  );

create policy "services_select_admin" on services
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "services_insert_admin" on services
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "services_update_admin" on services
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "services_delete_admin" on services
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "parking_spots_select_published" on parking_spots
  for select
  using (
    exists (
      select 1
      from listings l
      where l.item_id = parking_spots.item_id
        and l.status = 'published'
    )
  );

create policy "parking_spots_select_admin" on parking_spots
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "parking_spots_insert_admin" on parking_spots
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "parking_spots_update_admin" on parking_spots
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "parking_spots_delete_admin" on parking_spots
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

-- Explicit role grants — Supabase's default-privilege automation does not
-- fire for raw-SQL tables in this project (see 0003_people_grants.sql).
grant all on public.estates to service_role;
grant select on public.estates to anon, authenticated;
grant insert, update, delete on public.estates to authenticated;

grant all on public.machinery to service_role;
grant select on public.machinery to anon, authenticated;
grant insert, update, delete on public.machinery to authenticated;

grant all on public.services to service_role;
grant select on public.services to anon, authenticated;
grant insert, update, delete on public.services to authenticated;

grant all on public.parking_spots to service_role;
grant select on public.parking_spots to anon, authenticated;
grant insert, update, delete on public.parking_spots to authenticated;
