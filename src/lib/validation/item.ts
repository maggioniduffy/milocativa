import { z } from "zod";

import { adminContent } from "@/content/admin";
import type { ItemKind, ItemStatus, PriceUnit } from "@/types/supabase";

/**
 * Shared item-form validation, used by both the admin sheet (inline client
 * feedback) and the save Server Action (the authoritative check). Schemas
 * operate on the raw form strings; numeric normalization stays in the action.
 */

export const ITEM_KINDS = ["estate", "machinery", "service", "parking_spot"] as const satisfies readonly ItemKind[];
export const ITEM_STATUSES = ["draft", "available", "rented", "archived"] as const satisfies readonly ItemStatus[];
export const PRICE_UNITS = ["month", "day", "service", "hour", "unit"] as const satisfies readonly PriceUnit[];

/** Form fields each subtype section submits, mapped to its table's columns. */
export const SUBTYPE_FIELDS: Record<ItemKind, readonly string[]> = {
  estate: ["area", "bedrooms", "address"],
  machinery: ["brand", "model", "year"],
  service: ["service_type", "duration"],
  parking_spot: ["spot_number"],
};

const msg = adminContent.form.errors;

const optionalNumber = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || !Number.isNaN(Number(v.replace(",", "."))), { message });

const optionalInteger = (message: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || Number.isInteger(Number(v.replace(",", "."))), { message });

const commonSchema = z.object({
  item_kind: z.enum(ITEM_KINDS, { message: msg.kindInvalid }),
  title: z.string().trim().min(1, msg.titleRequired),
  base_price: optionalNumber(msg.priceInvalid),
});

export const itemFormSchemas: Record<ItemKind, z.ZodObject> = {
  estate: commonSchema.extend({
    area: optionalNumber(msg.areaInvalid),
    bedrooms: optionalInteger(msg.bedroomsInvalid),
  }),
  machinery: commonSchema.extend({
    year: optionalInteger(msg.yearInvalid),
  }),
  service: commonSchema,
  parking_spot: commonSchema,
};

export type ItemFieldErrors = Record<string, string>;

/**
 * Validates the raw form values for a subtype. Returns a field → first
 * Spanish message map, or null when everything passes.
 */
export function validateItemFields(
  kind: ItemKind,
  values: Record<string, string>,
): ItemFieldErrors | null {
  const result = itemFormSchemas[kind].safeParse({ ...values, item_kind: kind });
  if (result.success) return null;

  const errors: ItemFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "item_kind");
    if (!(field in errors)) errors[field] = issue.message;
  }
  return errors;
}

/** Pulls the string value of every relevant field out of a FormData. */
export function formValuesFor(kind: ItemKind, formData: FormData): Record<string, string> {
  const names = ["title", "description", "base_price", "price_unit", "status", "category_id", ...SUBTYPE_FIELDS[kind]];
  const values: Record<string, string> = {};
  for (const name of names) {
    const raw = formData.get(name);
    values[name] = typeof raw === "string" ? raw : "";
  }
  return values;
}
