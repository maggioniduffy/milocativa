import Image from "next/image";
import Link from "next/link";
import { Heart, SquareParking, Star } from "lucide-react";

import { catalogContent, type CatalogProduct } from "@/content/catalog";
import { CATEGORY_COLORS } from "@/types/domain";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: CatalogProduct;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const tagColor = CATEGORY_COLORS[product.category].text;
  const isOutlineTag = product.category === "parking";

  return (
    <Link
      href="#"
      className="group flex flex-col gap-2.5 transition-transform duration-200 ease-out hover:-translate-y-1"
    >
      <div
        className="relative aspect-[1/0.92] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-200 group-hover:shadow-xl"
        style={product.cover ? { background: product.cover } : undefined}
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.imageAlt ?? product.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
        <span
          className={cn(
            "absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm",
            isOutlineTag && "border"
          )}
          style={{ color: tagColor, borderColor: isOutlineTag ? tagColor : undefined }}
        >
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{ backgroundColor: tagColor }}
          />
          {catalogContent.categoryTags[product.category]}
        </span>
        <button
          type="button"
          aria-label={catalogContent.productsSection.favoriteLabel}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
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
          <h3 className="text-[15px] font-bold leading-snug tracking-tight text-copy-primary">
            {product.title}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-copy-primary">
            <Star className="h-3.5 w-3.5 fill-copy-primary stroke-none" />
            {product.rating}
          </span>
        </div>
        <p className="text-[13px] font-medium text-copy-muted">{product.location}</p>
        {product.category === "estate" && product.hasParking ? (
          <span className="mt-0.5 inline-flex items-center gap-1.5 self-start rounded-full bg-accent-dim px-2 py-0.5 text-[11.5px] font-bold text-brand">
            <SquareParking className="h-3.5 w-3.5" />
            {catalogContent.productsSection.parkingIncluded}
          </span>
        ) : null}
        <p className="mt-0.5 flex items-baseline gap-1">
          <span className="text-[15px] font-extrabold tracking-tight text-copy-primary">
            {product.price}
          </span>
          <span className="text-xs font-semibold text-copy-muted">{product.unit}</span>
        </p>
      </div>
    </Link>
  );
}
