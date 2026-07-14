-- Single-table model for every rentable thing. Rather than one table per
-- subtype (Estate/Machinery/Service/ParkingSpot) with table inheritance, all
-- subtypes share `items` and carry their type-specific columns as nullable —
-- simpler to keep one RLS surface and one FK target (listings, availability,
-- rental_items all point at `items`). `item_kind` is an explicit discriminator
-- so the subtype is read/filtered directly, never inferred from which nullable
-- columns happen to be populated.
create table if not exists items (
  id uuid primary key default gen_random_uuid(),

  -- Discriminator. estate/machinery/service map to a categories.item_type;
  -- parking_spot is an ObjectItem subtype with no category (see 0004).
  item_kind text not null
    check (item_kind in ('estate', 'machinery', 'service', 'parking_spot')),

  -- Common columns (all Item subtypes).
  title text not null,
  description text,
  base_price numeric(12, 2),
  price_unit text
    check (price_unit in ('month', 'day', 'service', 'hour', 'unit')),
  -- Item-level lifecycle, distinct from listings.status (publication state)
  -- and rentals.status (a specific rental's state).
  status text not null default 'draft'
    check (status in ('draft', 'available', 'rented', 'archived')),
  category_id uuid references categories (id) on delete set null,

  -- ObjectItem (Estate / Machinery / ParkingSpot): a physical thing with a
  -- location and condition.
  location text,
  condition text,
  -- Estate map coordinates — source of truth for MapLibre markers, captured
  -- at listing create/edit time (architecture-context Storage Model).
  latitude double precision,
  longitude double precision,

  -- Estate-specific.
  area numeric(10, 2),
  bedrooms integer,
  address text,

  -- Machinery-specific.
  brand text,
  model text,
  year integer,

  -- Service-specific.
  service_type text,
  duration text,

  -- ParkingSpot-specific.
  spot_number text,

  -- Estate and ParkingSpot both optionally belong to a Building (nullable —
  -- standalone properties need no Building row).
  building_id uuid references buildings (id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_category_id_idx on items (category_id);
create index if not exists items_building_id_idx on items (building_id);
create index if not exists items_item_kind_idx on items (item_kind);

create trigger items_set_updated_at
  before update on items
  for each row
  execute function set_updated_at();

alter table items enable row level security;

-- Admin can see and write every item regardless of publication state. The
-- PUBLIC read path (items reachable through a published listing) is added in
-- 0007, once the `listings` table it depends on exists.
create policy "items_select_admin" on items
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "items_insert_admin" on items
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "items_update_admin" on items
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "items_delete_admin" on items
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

grant all on public.items to service_role;
grant select on public.items to anon, authenticated;
grant insert, update, delete on public.items to authenticated;
