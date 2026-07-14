-- Table-level privileges for the Supabase roles. `0001` created `people` but
-- relied on Supabase's default-privilege automation to grant access to the
-- API roles; that didn't apply for this table, so grant explicitly.
--
-- RLS still governs *which rows* `authenticated` can touch — these grants only
-- open the table to the role so the policies can be evaluated at all. Writes
-- stay locked down: no INSERT/DELETE for `authenticated`, and UPDATE is the
-- column-scoped grant from `0002`. `service_role` bypasses RLS entirely (used
-- by the webhook and the `server/people.ts` self-heal).
grant all on public.people to service_role;
grant select on public.people to authenticated;
