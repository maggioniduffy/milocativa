-- Minimal Rental — just enough for rental_items (0010) to have a target. The
-- full model (payments, reviews, per-status transitions, admin approval flow)
-- is Phase 2/5, not here. `status` mirrors RentalStatus in types/domain.ts.
-- A Rental never references a single Item directly: its items are joined via
-- rental_items (see architecture-context invariant #6).
create table if not exists rentals (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references people (id) on delete restrict,
  status text not null default 'requested'
    check (status in ('requested', 'accepted', 'active', 'completed', 'cancelled')),
  start_date date,
  end_date date,
  total_amount numeric(12, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rentals_user_id_idx on rentals (user_id);

create trigger rentals_set_updated_at
  before update on rentals
  for each row
  execute function set_updated_at();

alter table rentals enable row level security;

-- Not public. A user reads/writes only their own rentals (user_id = the Clerk
-- `sub` claim); an admin reads/writes across all of them.
create policy "rentals_select_own" on rentals
  for select
  using (auth.jwt() ->> 'sub' = user_id);

create policy "rentals_select_admin" on rentals
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "rentals_insert_own" on rentals
  for insert
  with check (auth.jwt() ->> 'sub' = user_id);

create policy "rentals_update_own" on rentals
  for update
  using (auth.jwt() ->> 'sub' = user_id)
  with check (auth.jwt() ->> 'sub' = user_id);

create policy "rentals_update_admin" on rentals
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin')
  with check (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "rentals_delete_admin" on rentals
  for delete
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

-- No anon grant: rentals are never world-readable. RLS scopes the rows;
-- these grants just open the table to the authenticated/service roles.
grant all on public.rentals to service_role;
grant select, insert, update, delete on public.rentals to authenticated;
