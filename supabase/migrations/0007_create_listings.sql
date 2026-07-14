-- A Listing is the publication of exactly one Item (item_id unique → 1:1 with
-- items, matching the domain model). `admin_id` is the `people` row of the
-- admin who published it. Only a listing with status='published' makes its
-- Item visible in the public catalog.
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null unique references items (id) on delete cascade,
  admin_id text not null references people (id) on delete restrict,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_item_id_idx on listings (item_id);
create index if not exists listings_status_idx on listings (status);

create trigger listings_set_updated_at
  before update on listings
  for each row
  execute function set_updated_at();

alter table listings enable row level security;

-- Public read: only published listings are world-readable; the rest (draft /
-- archived) are admin-only.
create policy "listings_select_published" on listings
  for select
  using (status = 'published');

create policy "listings_select_admin" on listings
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "listings_insert_admin" on listings
  for insert
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "listings_update_admin" on listings
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "listings_delete_admin" on listings
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

grant all on public.listings to service_role;
grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;

-- Now that `listings` exists, add the public read path for `items`: an item is
-- world-readable exactly when a published listing points at it. The subquery
-- runs under the caller's own RLS, so the nested `listings` read is itself
-- constrained to published rows — anon/authenticated can only ever match a
-- genuinely-published listing here.
create policy "items_select_published" on items
  for select
  using (
    exists (
      select 1
      from listings l
      where l.item_id = items.id
        and l.status = 'published'
    )
  );
