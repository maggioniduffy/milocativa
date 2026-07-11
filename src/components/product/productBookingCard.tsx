"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Star } from "lucide-react";

import { productContent } from "@/content/product";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

interface ProductBookingCardProps {
  price: string;
  unit: string;
  rating: string;
  reviewCount: number;
}

export function ProductBookingCard({
  price,
  unit,
  rating,
  reviewCount,
}: ProductBookingCardProps) {
  const { booking, favoriteLabel } = productContent;
  const [isFavorite, setIsFavorite] = useState(false);
  const pathname = usePathname();
  const signInHref = `${siteContent.nav.signIn.href}?redirect_url=${encodeURIComponent(pathname)}`;

  return (
    <aside className="rounded-3xl border border-surface-border bg-surface p-6 shadow-md lg:sticky lg:top-[88px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold tracking-tight text-copy-primary">
            {price}
          </span>
          <span className="text-sm font-semibold text-copy-muted">{unit}</span>
        </p>
        <button
          type="button"
          aria-label={favoriteLabel}
          aria-pressed={isFavorite}
          onClick={() => setIsFavorite((v) => !v)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full transition hover:bg-subtle active:scale-90"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-error stroke-error" : "stroke-copy-secondary"
            )}
          />
        </button>
      </div>

      <p className="mb-5 flex items-center gap-1.5 border-b border-subtle pb-5 text-sm font-semibold text-copy-primary">
        <Star className="h-4 w-4 fill-copy-primary stroke-none" />
        {rating}
        <span className="font-medium text-copy-muted">
          · {productContent.reviewsSuffix(reviewCount)}
        </span>
      </p>

      <Link
        href={signInHref}
        className="flex w-full items-center justify-center rounded-full bg-brand px-4 py-3 text-[15px] font-bold text-white shadow-md shadow-brand/30 transition-colors hover:bg-brand-hover"
      >
        {booking.contactCta}
      </Link>
      <p className="mt-3 text-center text-[12.5px] font-medium text-copy-muted">
        {booking.signInNote}
      </p>
    </aside>
  );
}
