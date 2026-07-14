// src/lib/supabase/serviceRole.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Bypasses RLS entirely. Server-only: `app/api` webhook handlers reacting to
 * a verified external event (e.g. Clerk's `user.*` events) and the
 * `server/people.ts` self-heal, which writes strictly session-derived data.
 * Never for a client-initiated mutation, per architecture-context.md
 * invariant #1.
 */
export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
}
