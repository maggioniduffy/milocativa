"use client";

import { useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import type { Database } from "@/types/supabase";

/**
 * Third-Party Auth (native Clerk session token) — no JWT template, no shared
 * secret. Supabase calls `accessToken()` on every request and forwards it as
 * the bearer token, so RLS evaluates the real signed-in Clerk user.
 */
export function useSupabaseClient() {
  const { getToken } = useAuth();

  return useMemo(
    () =>
      createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        { accessToken: () => getToken() },
      ),
    [getToken],
  );
}
