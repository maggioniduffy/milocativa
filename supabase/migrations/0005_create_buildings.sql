-- A Building groups Estates and ParkingSpots under one address/administration
-- (architecture-context "Building groups Estates and ParkingSpots via an
-- optional buildingId"). Standalone properties need no Building row.
--
-- `floors_data` (jsonb) holds the physical cross-section rendered by
-- components/building/buildingDiagram.tsx: an ordered list of floors, each
-- with unit slots, plus a parking level. It stays jsonb rather than a
-- normalized floors/units schema on purpose: the diagram also shows slots
-- that are NOT platform items at all — "No publicado" units of other owners
-- (UnitStatus 'external') that have no `items` row to point at — so the layout
-- is presentation data, not a source of truth. Published units instead exist
-- as `items` rows linked back via items.building_id, and their live status is
-- derived from listings/rentals at read time, never stored in floors_data.
-- Shape (kept in sync with content/building.ts BuildingDetail):
--   { "floors": [ { "label": "4°",
--                   "units": [ { "id": "u4a", "name": "Depto 4A",
--                                "item_id": "<uuid|null>",
--                                "status": "<UnitStatus|null>",
--                                "note": "…" } ] } ],
--     "parking": [ { "id": "c1", "name": "C1", "item_id": null,
--                    "status": "available", "note": "…" } ] }
create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  address text not null,
  description text,
  floors_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger buildings_set_updated_at
  before update on buildings
  for each row
  execute function set_updated_at();

alter table buildings enable row level security;

-- Buildings are browsable without an account; writes are admin-only.
create policy "buildings_select_public" on buildings
  for select
  using (true);

create policy "buildings_insert_admin" on buildings
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "buildings_update_admin" on buildings
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "buildings_delete_admin" on buildings
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

grant all on public.buildings to service_role;
grant select on public.buildings to anon, authenticated;
grant insert, update, delete on public.buildings to authenticated;
