import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { Database } from "@/types/supabase";

/**
 * Third-Party Auth (native Clerk session token) — no JWT template, no shared
 * secret. Supabase calls `accessToken()` on every request and forwards it as
 * the bearer token, so RLS evaluates the real signed-in Clerk user.
 */
export async function createSupabaseServerClient() {
  const { getToken } = await auth();

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { accessToken: () => getToken() },
  );
}
