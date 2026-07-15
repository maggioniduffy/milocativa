"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

import { adminContent } from "@/content/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  ITEM_STATUSES,
  ITEM_KINDS,
  PRICE_UNITS,
  SUBTYPE_FIELDS,
  formValuesFor,
  validateItemFields,
  type ItemFieldErrors,
} from "@/lib/validation/item";
import { ensurePerson } from "@/server/people";
import type { ItemKind, ItemStatus, PriceUnit } from "@/types/supabase";

export interface SaveItemState {
  error: string | null;
  fieldErrors?: ItemFieldErrors;
  /** Set on a successful save so the sheet can close itself. */
  success?: boolean;
}

/**
 * Route-level gating already exists in proxy.ts and RLS is the data-level
 * boundary, but per code-standards.md mutations also check auth explicitly
 * before running any logic.
 */
async function isAdmin(): Promise<boolean> {
  const { userId, sessionClaims } = await auth();
  return Boolean(userId) && sessionClaims?.public_metadata?.role === "admin";
}

/** "" → null; "1.234,5"-tolerant numeric normalization (pre-validated by zod). */
function toNumericString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : String(Number(trimmed.replace(",", ".")));
}

function toText(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

export async function saveItemAction(
  _prevState: SaveItemState,
  formData: FormData,
): Promise<SaveItemState> {
  const { errors } = adminContent.form;

  if (!(await isAdmin())) return { error: errors.forbidden };

  const rawKind = formData.get("item_kind");
  if (typeof rawKind !== "string" || !ITEM_KINDS.includes(rawKind as ItemKind)) {
    return { error: errors.kindInvalid };
  }
  const kind = rawKind as ItemKind;
  const itemId = toText(String(formData.get("item_id") ?? ""));

  // Same zod schemas the sheet uses for inline feedback — this is the
  // authoritative pass.
  const values = formValuesFor(kind, formData);
  const fieldErrors = validateItemFields(kind, values);
  if (fieldErrors) return { error: null, fieldErrors };

  const item: Record<string, string | null> = {
    item_kind: kind,
    title: toText(values.title),
    description: toText(values.description),
    base_price: toNumericString(values.base_price),
    price_unit: PRICE_UNITS.includes(values.price_unit as PriceUnit) ? values.price_unit : null,
    status: ITEM_STATUSES.includes(values.status as ItemStatus) ? values.status : null,
    category_id: toText(values.category_id),
  };

  const subtype: Record<string, string | null> = {};
  for (const field of SUBTYPE_FIELDS[kind]) {
    subtype[field] =
      field === "area" || field === "bedrooms" || field === "year"
        ? toNumericString(values[field])
        : toText(values[field]);
  }

  const supabase = await createSupabaseServerClient();
  const { data: savedItemId, error } = await supabase.rpc("save_item_with_subtype", {
    p_item_id: itemId,
    p_item: item,
    p_subtype: subtype,
  });

  if (error || !savedItemId) {
    console.error("saveItemAction: rpc failed", error);
    return { error: errors.saveFailed };
  }

  // Publish toggle at the foot of the form: publishing upserts the listing;
  // unpublishing only touches an existing row (no draft rows for items that
  // were never published).
  const publish = formData.get("publish") === "true";
  const { data: existingListing, error: listingReadError } = await supabase
    .from("listings")
    .select("id, status")
    .eq("item_id", savedItemId)
    .maybeSingle();
  if (listingReadError) {
    console.error("saveItemAction: listing lookup failed", listingReadError);
    return { error: errors.saveFailed };
  }

  if (publish ? existingListing?.status !== "published" : existingListing?.status === "published") {
    const person = await ensurePerson();
    if (!person) return { error: errors.forbidden };

    const { error: listingError } = await supabase.from("listings").upsert(
      {
        item_id: savedItemId,
        admin_id: person.id,
        status: publish ? "published" : "draft",
        ...(publish ? { published_at: new Date().toISOString() } : {}),
      },
      { onConflict: "item_id" },
    );
    if (listingError) {
      console.error("saveItemAction: listing upsert failed", listingError);
      return { error: errors.saveFailed };
    }
  }

  revalidatePath("/admin/listings");
  return { error: null, success: true };
}

export async function setListingPublishedAction(
  itemId: string,
  publish: boolean,
): Promise<{ error: string | null }> {
  if (!(await isAdmin())) return { error: adminContent.form.errors.forbidden };

  const person = await ensurePerson();
  if (!person) return { error: adminContent.form.errors.forbidden };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("listings").upsert(
    {
      item_id: itemId,
      admin_id: person.id,
      status: publish ? "published" : "draft",
      ...(publish ? { published_at: new Date().toISOString() } : {}),
    },
    { onConflict: "item_id" },
  );

  if (error) {
    console.error("setListingPublishedAction: upsert failed", error);
    return { error: adminContent.form.errors.saveFailed };
  }

  revalidatePath("/admin/listings");
  return { error: null };
}

export async function setListingFeaturedAction(
  itemId: string,
  featured: boolean,
): Promise<{ error: string | null }> {
  if (!(await isAdmin())) return { error: adminContent.form.errors.forbidden };

  const person = await ensurePerson();
  if (!person) return { error: adminContent.form.errors.forbidden };

  const supabase = await createSupabaseServerClient();
  // Upsert so featuring an unpublished item creates its draft listing row.
  const { error } = await supabase.from("listings").upsert(
    { item_id: itemId, admin_id: person.id, featured },
    { onConflict: "item_id" },
  );

  if (error) {
    console.error("setListingFeaturedAction: upsert failed", error);
    return { error: adminContent.form.errors.saveFailed };
  }

  revalidatePath("/admin/listings");
  return { error: null };
}
