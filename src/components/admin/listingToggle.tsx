"use client";

import { useState, useTransition } from "react";

import {
  setListingFeaturedAction,
  setListingPublishedAction,
} from "@/app/admin/listings/actions";
import { Switch } from "@/components/ui/switch";

interface ListingToggleProps {
  itemId: string;
  kind: "published" | "featured";
  checked: boolean;
  ariaLabel: string;
}

/**
 * Optimistic publish/featured switch — flips immediately, reverts if the
 * server action fails. The action revalidates /admin/listings, so the row's
 * derived text (Publicado/Borrador) refreshes on success.
 */
export function ListingToggle({ itemId, kind, checked, ariaLabel }: ListingToggleProps) {
  const [optimistic, setOptimistic] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  const value = optimistic ?? checked;

  function handleChange(next: boolean) {
    setOptimistic(next);
    startTransition(async () => {
      const action = kind === "published" ? setListingPublishedAction : setListingFeaturedAction;
      const { error } = await action(itemId, next);
      if (error) setOptimistic(null);
    });
  }

  return (
    <Switch
      checked={value}
      onCheckedChange={handleChange}
      disabled={isPending}
      aria-label={ariaLabel}
    />
  );
}
