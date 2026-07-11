import type { Role } from "@/types/domain";

/** Default landing page once a session exists and no `redirect_url` was carried over. */
export const ROLE_HOME_ROUTE: Record<Role, string> = {
  admin: "/admin",
  user: "/catalogo",
};

/**
 * Only accept same-origin relative paths from the `redirect_url` query param —
 * an absolute or protocol-relative value here would be an open redirect.
 */
export function toSafeRedirectPath(value: string | undefined | null): string | null {
  if (!value) return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}
