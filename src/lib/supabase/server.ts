// src/lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { auth } from "@clerk/nextjs/server";

export async function createSupabaseServerClient() {
  const { getToken } = await auth();
  const clerkToken = await getToken();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
      global: {
        headers: clerkToken ? { Authorization: `Bearer ${clerkToken}` } : {},
      },
    },
  );
}
