import { ListingsSection, type AdminItemRow } from "@/components/admin/listingsSection";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ItemKind } from "@/types/supabase";

export const dynamic = "force-dynamic";

export default async function AdminListingsPage() {
  const supabase = await createSupabaseServerClient();

  // Hand-joined in JS instead of a PostgREST embedded select: the item count
  // is admin-panel sized, and this keeps the hand-written types simple. The
  // subtype rows ride along so the edit sheet opens prefilled without a
  // round trip.
  const [itemsRes, categoriesRes, listingsRes, estatesRes, machineryRes, servicesRes, parkingRes] =
    await Promise.all([
      supabase
        .from("items")
        .select("id, item_kind, title, description, base_price, price_unit, status, category_id")
        .order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name, item_type").order("name"),
      supabase.from("listings").select("item_id, status, featured"),
      supabase.from("estates").select("*"),
      supabase.from("machinery").select("*"),
      supabase.from("services").select("*"),
      supabase.from("parking_spots").select("*"),
    ]);

  const failed = [itemsRes, categoriesRes, listingsRes, estatesRes, machineryRes, servicesRes, parkingRes]
    .map((res) => res.error)
    .find(Boolean);
  if (failed) throw failed;

  const categoryNames = new Map(categoriesRes.data!.map((c) => [c.id, c.name]));
  const listingsByItem = new Map(listingsRes.data!.map((l) => [l.item_id, l]));
  const subtypeByItem: Record<ItemKind, Map<string, Record<string, string | number | null>>> = {
    estate: new Map(estatesRes.data!.map((r) => [r.item_id, r])),
    machinery: new Map(machineryRes.data!.map((r) => [r.item_id, r])),
    service: new Map(servicesRes.data!.map((r) => [r.item_id, r])),
    parking_spot: new Map(parkingRes.data!.map((r) => [r.item_id, r])),
  };

  const rows: AdminItemRow[] = itemsRes.data!.map((item) => {
    const listing = listingsByItem.get(item.id);
    const published = listing?.status === "published";
    return {
      display: {
        id: item.id,
        title: item.title,
        kind: item.item_kind,
        categoryName: item.category_id ? (categoryNames.get(item.category_id) ?? null) : null,
        basePrice: item.base_price,
        priceUnit: item.price_unit,
        itemStatus: item.status,
        published,
        featured: listing?.featured ?? false,
        hasListing: Boolean(listing),
      },
      form: {
        item,
        subtype: subtypeByItem[item.item_kind].get(item.id) ?? {},
        published,
      },
    };
  });

  return <ListingsSection rows={rows} categories={categoriesRes.data!} />;
}
