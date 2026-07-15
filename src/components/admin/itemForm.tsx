"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { saveItemAction, type SaveItemState } from "@/app/admin/listings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { adminContent } from "@/content/admin";
import {
  ITEM_KINDS,
  ITEM_STATUSES,
  PRICE_UNITS,
  formValuesFor,
  validateItemFields,
  type ItemFieldErrors,
} from "@/lib/validation/item";
import type { CategoryItemType, ItemKind, ItemStatus, PriceUnit } from "@/types/supabase";

interface CategoryOption {
  id: string;
  name: string;
  item_type: CategoryItemType;
}

export interface ItemFormInitialValues {
  item: {
    id: string;
    item_kind: ItemKind;
    title: string;
    description: string | null;
    base_price: number | null;
    price_unit: PriceUnit | null;
    status: ItemStatus;
    category_id: string | null;
  };
  /** Row from the item's subtype table; fields vary by kind. */
  subtype: Record<string, string | number | null>;
  /** Whether the item currently has a published listing. */
  published: boolean;
}

const INITIAL_STATE: SaveItemState = { error: null };

function fieldValue(subtype: Record<string, string | number | null>, key: string): string {
  const value = subtype[key];
  return value === null || value === undefined ? "" : String(value);
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-xs text-error">
      {message}
    </p>
  );
}

export function ItemForm({
  categories,
  initial,
  onDirtyChange,
  onRequestClose,
  onSaved,
}: {
  categories: CategoryOption[];
  initial: ItemFormInitialValues | null;
  onDirtyChange: (dirty: boolean) => void;
  onRequestClose: () => void;
  onSaved: () => void;
}) {
  const [state, formAction, isPending] = useActionState(saveItemAction, INITIAL_STATE);
  const [kind, setKind] = useState<ItemKind>(initial?.item.item_kind ?? "estate");
  const [publish, setPublish] = useState(initial?.published ?? false);
  const [clientErrors, setClientErrors] = useState<ItemFieldErrors>({});
  const savedRef = useRef(false);

  useEffect(() => {
    if (state.success && !savedRef.current) {
      savedRef.current = true;
      onDirtyChange(false);
      onSaved();
    }
  }, [state.success, onDirtyChange, onSaved]);

  const isEdit = Boolean(initial);
  const { form, kindLabels, itemStatusLabels, priceUnitLabels } = adminContent;
  const { fields } = form;

  // Inline feedback: client-side zod result first, server re-validation after.
  const fieldErrors: ItemFieldErrors = { ...state.fieldErrors, ...clientErrors };

  // parking_spot has no category by design (see categories migration 0004).
  const kindCategories =
    kind === "parking_spot" ? [] : categories.filter((c) => c.item_type === kind);
  // Base UI's SelectValue renders the raw value unless the root gets an
  // `items` value→label map.
  const categoryItems = Object.fromEntries(kindCategories.map((c) => [c.id, c.name]));
  const subtype = initial?.subtype ?? {};

  function markDirty() {
    onDirtyChange(true);
  }

  // Editing a field clears its stale inline error immediately.
  function handleChange(event: React.FormEvent<HTMLFormElement>) {
    markDirty();
    const name = (event.target as HTMLInputElement).name;
    if (name && clientErrors[name]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const errors = validateItemFields(kind, formValuesFor(kind, formData));
    if (errors) {
      event.preventDefault();
      setClientErrors(errors);
      return;
    }
    setClientErrors({});
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      onChange={handleChange}
      className="flex min-w-0 flex-col gap-6"
    >
      {isEdit && <input type="hidden" name="item_id" value={initial!.item.id} />}
      <input type="hidden" name="publish" value={publish ? "true" : "false"} />

      {/* min-w-0 overrides the browser's fieldset min-width: min-content, which
          otherwise forces horizontal overflow on narrow viewports. */}
      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold text-copy-primary">
          {form.kindLegend}
        </legend>
        {isEdit ? (
          <>
            <input type="hidden" name="item_kind" value={kind} />
            <p className="text-sm text-copy-secondary">
              {kindLabels[kind]}
              <span className="mt-1 block text-xs text-copy-muted">{form.kindLockedNote}</span>
            </p>
          </>
        ) : (
          <Select
            name="item_kind"
            items={kindLabels}
            value={kind}
            onValueChange={(value) => {
              setKind(value as ItemKind);
              markDirty();
            }}
          >
            <SelectTrigger className="w-full sm:max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEM_KINDS.map((k) => (
                <SelectItem key={k} value={k}>
                  {kindLabels[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </fieldset>

      <fieldset className="flex min-w-0 flex-col gap-4">
        <legend className="mb-2 text-sm font-semibold text-copy-primary">
          {form.commonLegend}
        </legend>

        <div className="flex flex-col gap-2">
          <Label htmlFor="title">{fields.title}</Label>
          <Input
            id="title"
            name="title"
            defaultValue={initial?.item.title ?? ""}
            placeholder={fields.titlePlaceholder}
            aria-invalid={Boolean(fieldErrors.title) || undefined}
          />
          <FieldError message={fieldErrors.title} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">
            {fields.description}{" "}
            <span className="font-normal text-copy-muted">({form.optional})</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={initial?.item.description ?? ""}
            placeholder={fields.descriptionPlaceholder}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="base_price">{fields.basePrice}</Label>
            <Input
              id="base_price"
              name="base_price"
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              defaultValue={initial?.item.base_price ?? ""}
              placeholder={fields.basePricePlaceholder}
              aria-invalid={Boolean(fieldErrors.base_price) || undefined}
            />
            <FieldError message={fieldErrors.base_price} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="price_unit">{fields.priceUnit}</Label>
            <Select
              name="price_unit"
              items={priceUnitLabels}
              defaultValue={initial?.item.price_unit ?? "month"}
              onValueChange={markDirty}
            >
              <SelectTrigger id="price_unit" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRICE_UNITS.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {priceUnitLabels[unit]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {kind !== "parking_spot" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="category_id">{fields.category}</Label>
              <Select
                key={kind}
                name="category_id"
                items={categoryItems}
                defaultValue={initial?.item.category_id ?? kindCategories[0]?.id ?? ""}
                onValueChange={markDirty}
              >
                <SelectTrigger id="category_id" className="w-full">
                  <SelectValue placeholder={fields.categoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {kindCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="status">{fields.status}</Label>
            <Select
              name="status"
              items={itemStatusLabels}
              defaultValue={initial?.item.status ?? "draft"}
              onValueChange={markDirty}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEM_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {itemStatusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </fieldset>

      <fieldset className="flex min-w-0 flex-col gap-4">
        <legend className="mb-2 text-sm font-semibold text-copy-primary">
          {form.subtypeLegend} · {kindLabels[kind]}
        </legend>

        {kind === "estate" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="area">{fields.area}</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  defaultValue={fieldValue(subtype, "area")}
                  aria-invalid={Boolean(fieldErrors.area) || undefined}
                />
                <FieldError message={fieldErrors.area} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bedrooms">{fields.bedrooms}</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  step="1"
                  min="0"
                  inputMode="numeric"
                  defaultValue={fieldValue(subtype, "bedrooms")}
                  aria-invalid={Boolean(fieldErrors.bedrooms) || undefined}
                />
                <FieldError message={fieldErrors.bedrooms} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">{fields.address}</Label>
              <Input
                id="address"
                name="address"
                defaultValue={fieldValue(subtype, "address")}
                placeholder={fields.addressPlaceholder}
              />
            </div>
          </>
        )}

        {kind === "machinery" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand">{fields.brand}</Label>
              <Input id="brand" name="brand" defaultValue={fieldValue(subtype, "brand")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="model">{fields.model}</Label>
              <Input id="model" name="model" defaultValue={fieldValue(subtype, "model")} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="year">{fields.year}</Label>
              <Input
                id="year"
                name="year"
                type="number"
                step="1"
                min="1900"
                inputMode="numeric"
                defaultValue={fieldValue(subtype, "year")}
                aria-invalid={Boolean(fieldErrors.year) || undefined}
              />
              <FieldError message={fieldErrors.year} />
            </div>
          </div>
        )}

        {kind === "service" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="service_type">{fields.serviceType}</Label>
              <Input
                id="service_type"
                name="service_type"
                defaultValue={fieldValue(subtype, "service_type")}
                placeholder={fields.serviceTypePlaceholder}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="duration">{fields.duration}</Label>
              <Input
                id="duration"
                name="duration"
                defaultValue={fieldValue(subtype, "duration")}
                placeholder={fields.durationPlaceholder}
              />
            </div>
          </div>
        )}

        {kind === "parking_spot" && (
          <div className="flex flex-col gap-2 sm:max-w-xs">
            <Label htmlFor="spot_number">{fields.spotNumber}</Label>
            <Input
              id="spot_number"
              name="spot_number"
              defaultValue={fieldValue(subtype, "spot_number")}
              placeholder={fields.spotNumberPlaceholder}
            />
          </div>
        )}
      </fieldset>

      <div className="flex items-start justify-between gap-3 rounded-2xl border border-surface-border bg-subtle/60 p-4">
        <div className="flex min-w-0 flex-col gap-1">
          <Label htmlFor="publish-toggle">{form.publishToggle}</Label>
          <p className="text-xs text-copy-muted">{form.publishToggleHint}</p>
        </div>
        <Switch
          id="publish-toggle"
          checked={publish}
          onCheckedChange={(checked) => {
            setPublish(checked);
            markDirty();
          }}
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={onRequestClose}
        >
          {form.cancel}
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? form.saving : publish ? form.publish : form.save}
        </Button>
      </div>
    </form>
  );
}
