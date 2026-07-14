import type { Role } from "@/types/domain";

export {};

declare global {
  /**
   * Shape of Clerk's session token custom claims. Requires a `public_metadata`
   * claim mapped to `{{user.public_metadata}}` in the Clerk Dashboard session
   * token customization — the same claim Supabase RLS reads via
   * `auth.jwt() -> 'public_metadata' ->> 'role'` (architecture-context.md).
   */
  interface CustomJwtSessionClaims {
    public_metadata?: {
      role?: Role;
    };
  }
}
