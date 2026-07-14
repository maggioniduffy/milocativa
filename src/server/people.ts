import "server-only";

import { currentUser } from "@clerk/nextjs/server";

import { createSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";
import type { Person } from "@/types/supabase";

/**
 * Returns the signed-in user's `people` row, creating it from the Clerk
 * session if it doesn't exist yet. The Clerk `user.created` webhook is the
 * primary sync path, but it can't reach a local dev server (and a fresh
 * environment may not have the endpoint registered), so authenticated pages
 * self-heal the row instead of rendering an empty profile.
 *
 * Uses the service-role client because RLS intentionally has no insert
 * policy on `people`; scoping is preserved by always keying on the session's
 * own Clerk user id — never caller input.
 */
export async function ensurePerson(): Promise<Person | null> {
  const user = await currentUser();
  if (!user) return null;

  const supabase = createSupabaseServiceRoleClient();

  const { data: existing, error: selectError } = await supabase
    .from("people")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (selectError) {
    console.error("ensurePerson: failed to read people row", selectError);
    return null;
  }
  if (existing) return existing;

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  // Upsert instead of insert: the webhook may land concurrently.
  const { data: created, error: upsertError } = await supabase
    .from("people")
    .upsert(
      {
        id: user.id,
        email,
        full_name: user.fullName,
        avatar_url: user.imageUrl,
      },
      { onConflict: "id", ignoreDuplicates: false },
    )
    .select()
    .single();
  if (upsertError) {
    console.error("ensurePerson: failed to create people row", upsertError);
    return null;
  }

  return created;
}
