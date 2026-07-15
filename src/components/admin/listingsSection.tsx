"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";

import { ItemForm, type ItemFormInitialValues } from "@/components/admin/itemForm";
import { ListingsTable, type ListingsTableRow } from "@/components/admin/listingsTable";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminContent } from "@/content/admin";
import type { CategoryItemType } from "@/types/supabase";

export interface AdminItemRow {
  display: ListingsTableRow;
  form: ItemFormInitialValues;
}

interface CategoryOption {
  id: string;
  name: string;
  item_type: CategoryItemType;
}

/**
 * Listados: header with the "Nuevo ítem" trigger, the items table, and the
 * right-side sheet that hosts the create/edit form (per the overlay pattern in
 * ui-context.md — slide-over, not a centered modal).
 */
export function ListingsSection({
  rows,
  categories,
}: {
  rows: AdminItemRow[];
  categories: CategoryOption[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ItemFormInitialValues | null>(null);
  const dirtyRef = useRef(false);

  const { listings, form } = adminContent;

  function openSheet(initial: ItemFormInitialValues | null) {
    dirtyRef.current = false;
    setEditing(initial);
    setOpen(true);
  }

  // Cancel button, X, backdrop and Esc all funnel through here — confirm
  // before discarding touched fields.
  function requestClose() {
    if (dirtyRef.current && !window.confirm(form.discardConfirm)) return;
    dirtyRef.current = false;
    setOpen(false);
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-copy-primary sm:text-3xl">
            {listings.title}
          </h1>
          <p className="mt-1 text-sm text-copy-muted sm:text-base">{listings.subtitle}</p>
        </div>
        <Button className="w-full sm:w-auto" onClick={() => openSheet(null)}>
          <Plus className="h-5 w-5" aria-hidden />
          {listings.newItem}
        </Button>
      </header>

      <ListingsTable
        rows={rows.map((row) => row.display)}
        onEdit={(itemId) => {
          const row = rows.find((r) => r.display.id === itemId);
          if (row) openSheet(row.form);
        }}
      />

      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) requestClose();
          else setOpen(true);
        }}
      >
        <SheetContent
          side="right"
          className="data-[side=right]:w-full data-[side=right]:sm:max-w-xl sm:rounded-l-3xl"
        >
          <SheetHeader className="border-b border-surface-border sm:px-6">
            <SheetTitle>{editing ? form.editTitle : form.createTitle}</SheetTitle>
            <SheetDescription>
              {editing ? form.editSubtitle : form.createSubtitle}
            </SheetDescription>
          </SheetHeader>
          <div className="min-w-0 flex-1 overflow-y-auto px-4 pb-6 sm:px-6">
            <ItemForm
              key={editing?.item.id ?? "new"}
              categories={categories}
              initial={editing}
              onDirtyChange={(dirty) => {
                dirtyRef.current = dirty;
              }}
              onRequestClose={requestClose}
              onSaved={() => {
                dirtyRef.current = false;
                setOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}
