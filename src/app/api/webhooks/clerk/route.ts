import { type NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * `publicMetadata.role` can't be set from the client, so new sign-ups default
 * to `role: "user"` here, right after Clerk creates the account. Admin accounts
 * are provisioned manually — this handler never assigns `role: "admin"`.
 */
export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "user.created") {
    const { id, public_metadata: publicMetadata } = event.data;
    if (!publicMetadata?.role) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(id, {
        publicMetadata: { role: "user" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
