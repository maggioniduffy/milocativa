import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { ROLE_HOME_ROUTE } from "@/lib/clerk/redirects";
import type { Role } from "@/types/domain";

/**
 * Default post-auth landing spot when sign-in/sign-up didn't carry a `redirect_url`.
 * Sends admins to `/admin` and everyone else to `/catalogo`.
 */
export default async function AuthRedirectPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const role = (user.publicMetadata.role as Role | undefined) ?? "user";
  redirect(ROLE_HOME_ROUTE[role]);
}
