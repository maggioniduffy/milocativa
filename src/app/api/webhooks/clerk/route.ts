import { type NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/serviceRole";

interface ClerkUserEmail {
  id: string;
  email_address: string;
}

interface ClerkUserData {
  id: string;
  email_addresses: ClerkUserEmail[];
  primary_email_address_id: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
}

function primaryEmail(data: ClerkUserData): string | null {
  return (
    data.email_addresses.find((address) => address.id === data.primary_email_address_id)
      ?.email_address ?? data.email_addresses[0]?.email_address ?? null
  );
}

function fullName(data: ClerkUserData): string | null {
  return [data.first_name, data.last_name].filter(Boolean).join(" ") || null;
}

/**
 * `publicMetadata.role` can't be set from the client, so new sign-ups default
 * to `role: "user"` here, right after Clerk creates the account. Admin accounts
 * are provisioned manually — this handler never assigns `role: "admin"`.
 *
 * This is also where the Supabase `people` row is created/kept in sync —
 * Clerk owns identity, but rentals/messages/notifications reference `people`,
 * so registration isn't complete until that row exists. Uses the service-role
 * client since this reacts to a verified external event, not a user session
 * (architecture-context.md invariant #1).
 */
export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createSupabaseServiceRoleClient();

  if (event.type === "user.created") {
    const data = event.data as unknown as ClerkUserData;

    if (!event.data.public_metadata?.role) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(data.id, {
        publicMetadata: { role: "user" },
      });
    }

    const email = primaryEmail(data);
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const { error } = await supabase.from("people").insert({
      id: data.id,
      email,
      full_name: fullName(data),
      avatar_url: data.image_url,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (event.type === "user.updated") {
    const data = event.data as unknown as ClerkUserData;
    const email = primaryEmail(data);

    const { error } = await supabase
      .from("people")
      .update({
        ...(email ? { email } : {}),
        full_name: fullName(data),
        avatar_url: data.image_url,
      })
      .eq("id", data.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (event.type === "user.deleted") {
    if (event.data.id) {
      const { error } = await supabase.from("people").delete().eq("id", event.data.id);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
