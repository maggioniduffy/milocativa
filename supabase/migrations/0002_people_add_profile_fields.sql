-- Profile detail fields collected after sign-up (not from Clerk itself).
-- Kept on `people` rather than a separate `profiles` table — `people.id`
-- already *is* the Clerk user id, so a second linking column would just
-- duplicate that relationship.
alter table people
  add column if not exists phone text,
  add column if not exists company_name text;

-- Row-level security (auth.jwt() ->> 'sub' = id) already restricts a user to
-- their own row; this adds column-level restriction so an authenticated
-- user's own update can only touch full_name/phone/company_name — not email,
-- avatar_url, id, or the timestamps. The webhook writes via the service-role
-- client, which bypasses grants entirely, so this doesn't affect it.
revoke update on people from authenticated;
grant update (full_name, phone, company_name) on people to authenticated;
