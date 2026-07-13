// src/lib/supabase/serviceRole.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Bypasses RLS entirely. Only for `app/api` webhook handlers reacting to a
 * verified external event (e.g. Clerk's `user.*` events) — never for a
 * client-initiated mutation, per architecture-context.md invariant #1.
 */
export function createSupabaseServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
