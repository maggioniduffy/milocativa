import { Pencil } from "lucide-react";

import { ListingToggle } from "@/components/admin/listingToggle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { adminContent } from "@/content/admin";
import { CATEGORY_COLORS, type Category } from "@/types/domain";
import type { ItemKind, ItemStatus, PriceUnit } from "@/types/supabase";
import { cn } from "@/lib/utils";

export interface ListingsTableRow {
  id: string;
  title: string;
  kind: ItemKind;
  categoryName: string | null;
  basePrice: number | null;
  priceUnit: PriceUnit | null;
  itemStatus: ItemStatus;
  published: boolean;
  featured: boolean;
  hasListing: boolean;
}

const KIND_TO_CATEGORY: Record<ItemKind, Category> = {
  estate: "estate",
  machinery: "machinery",
  service: "service",
  parking_spot: "parking",
};

const ITEM_STATUS_CLASSES: Record<ItemStatus, string> = {
  draft: "bg-subtle text-copy-muted",
  available: "bg-success/10 text-success",
  rented: "bg-warning/10 text-warning",
  archived: "bg-subtle text-copy-faint",
};

const priceFormatter = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

export function ListingsTable({
  rows,
  onEdit,
}: {
  rows: ListingsTableRow[];
  onEdit: (itemId: string) => void;
}) {
  const { table, empty } = adminContent.listings;

  if (rows.length === 0) {
    return (
      <p className="rounded-2xl border border-surface-border bg-surface px-4 py-10 text-center text-sm text-copy-muted sm:text-base">
        {empty}
      </p>
    );
  }

  return (
    // Wide content scrolls inside its own container — the page never
    // overflows horizontally (ui-context Responsiveness).
    <div className="overflow-x-auto rounded-2xl border border-surface-border bg-surface">
      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead>{table.title}</TableHead>
            <TableHead>{table.kind}</TableHead>
            <TableHead>{table.category}</TableHead>
            <TableHead>{table.price}</TableHead>
            <TableHead>{table.itemStatus}</TableHead>
            <TableHead>{table.publication}</TableHead>
            <TableHead>{table.featured}</TableHead>
            <TableHead className="text-right">{table.actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const kindColor = CATEGORY_COLORS[KIND_TO_CATEGORY[row.kind]];
            const isOutline = kindColor.fill === "transparent";
            return (
              <TableRow key={row.id}>
                <TableCell className="font-medium text-copy-primary">{row.title}</TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      isOutline && "border",
                    )}
                    style={{
                      backgroundColor: isOutline ? undefined : kindColor.fill,
                      color: kindColor.text,
                      borderColor: isOutline ? kindColor.text : undefined,
                    }}
                  >
                    {adminContent.kindLabels[row.kind]}
                  </span>
                </TableCell>
                <TableCell className="text-copy-secondary">
                  {row.categoryName ?? (
                    <span className="text-copy-faint">{table.noCategory}</span>
                  )}
                </TableCell>
                <TableCell className="text-copy-secondary">
                  {row.basePrice !== null ? (
                    <>
                      {`$ ${priceFormatter.format(row.basePrice)}`}
                      {row.priceUnit && (
                        <span className="text-copy-muted">
                          {" "}
                          · {adminContent.priceUnitLabels[row.priceUnit]}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-copy-faint">{table.noPrice}</span>
                  )}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      ITEM_STATUS_CLASSES[row.itemStatus],
                    )}
                  >
                    {adminContent.itemStatusLabels[row.itemStatus]}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <ListingToggle
                      itemId={row.id}
                      kind="published"
                      checked={row.published}
                      ariaLabel={table.publishLabel(row.title)}
                    />
                    <span className="text-xs text-copy-muted">
                      {row.hasListing
                        ? adminContent.listingStatusLabels[row.published ? "published" : "draft"]
                        : table.notPublished}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <ListingToggle
                    itemId={row.id}
                    kind="featured"
                    checked={row.featured}
                    ariaLabel={table.featuredLabel(row.title)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <button
                    type="button"
                    onClick={() => onEdit(row.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
                  >
                    <Pencil className="h-4 w-4" aria-hidden />
                    {table.edit}
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
