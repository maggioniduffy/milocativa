-- Every person is a Clerk user; `id` is the Clerk `userId` (the `sub` claim),
-- referenced across rentals, messages, notifications, and push_subscriptions.
-- Role stays in Clerk publicMetadata, not here, so there is one source of
-- truth for it (see architecture-context.md auth model).
create table if not exists people (
  id text primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger people_set_updated_at
  before update on people
  for each row
  execute function set_updated_at();

alter table people enable row level security;

-- Rows are only ever inserted/deleted by the Clerk webhook handler via the
-- service-role client, which bypasses RLS entirely — no insert/delete
-- policy is defined here, so authenticated clients can never do either.

create policy "people_select_own" on people
  for select
  using (auth.jwt() ->> 'sub' = id);

create policy "people_select_admin" on people
  for select
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');

create policy "people_update_own" on people
  for update
  using (auth.jwt() ->> 'sub' = id)
  with check (auth.jwt() ->> 'sub' = id);

create policy "people_update_admin" on people
  for update
  using (auth.jwt() -> 'public_metadata' ->> 'role' = 'admin');
