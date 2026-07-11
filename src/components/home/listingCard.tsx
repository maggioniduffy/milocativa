"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";

import type { HomeListing } from "@/content/home";
import { CATEGORY_COLORS } from "@/types/domain";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  listing: HomeListing;
  categoryLabel: string;
  favoriteLabel: string;
}

export function ListingCard({ listing, categoryLabel, favoriteLabel }: ListingCardProps) {
  // In-memory favorite until it is backed by real user state.
  const [isFavorite, setIsFavorite] = useState(false);
  const tagColor = CATEGORY_COLORS[listing.category].text;

  return (
    <Link
      href="/catalogo"
      className="group flex flex-col gap-2.5 transition-transform duration-200 ease-out hover:-translate-y-1"
    >
      <div className="relative aspect-[1/0.92] overflow-hidden rounded-2xl bg-subtle shadow-sm transition-shadow duration-200 group-hover:shadow-xl">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        <span
          className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm"
          style={{ color: tagColor }}
        >
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{ backgroundColor: tagColor }}
          />
          {categoryLabel}
        </span>
        <button
          type="button"
          aria-label={favoriteLabel}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite((f) => !f);
          }}
          className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-surface/55 backdrop-blur-sm transition active:scale-90 hover:bg-surface/85"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-error stroke-error" : "fill-copy-primary/30 stroke-white"
            )}
          />
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-[15px] font-bold leading-snug text-copy-primary">
            {listing.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-copy-primary">
            <Star className="h-3.5 w-3.5 fill-copy-primary stroke-none" />
            {listing.rating}
          </span>
        </div>
        <p className="text-[13px] font-medium text-copy-muted">{listing.location}</p>
        <div className="mt-0.5 flex items-baseline justify-between gap-2">
          <p className="flex items-baseline gap-1">
            <span className="text-[15px] font-extrabold text-copy-primary">
              {listing.price}
            </span>
            <span className="text-xs font-semibold text-copy-muted">{listing.period}</span>
          </p>
          <span
            className={cn(
              "text-xs font-semibold",
              listing.availabilityTone === "success" ? "text-success" : "text-warning"
            )}
          >
            {listing.availability}
          </span>
        </div>
      </div>
    </Link>
  );
}
