// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { useSession } from "@clerk/nextjs";

export function useSupabaseClient() {
  const { session } = useSession();

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken();
          const headers = new Headers(options.headers);
          if (clerkToken) headers.set("Authorization", `Bearer ${clerkToken}`);
          return fetch(url, { ...options, headers });
        },
      },
    },
  );
}
