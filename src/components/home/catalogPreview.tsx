import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CategoryCard } from "@/components/home/categoryCard";
import { ListingCard } from "@/components/home/listingCard";
import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";

export function CatalogPreview() {
  const { catalogPreview } = homeContent;

  return (
    <section
      id="catalogo"
      className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20"
    >
      <Reveal>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-copy-primary sm:text-3xl lg:text-4xl">
            {catalogPreview.title}
          </h2>
          <Link
            href={catalogPreview.viewAll.href}
            className="flex shrink-0 items-center gap-1.5 text-[15px] font-bold text-brand transition-colors hover:text-brand-hover"
          >
            {catalogPreview.viewAll.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {catalogPreview.categories.map((category, index) => (
          <Reveal key={category.id} delay={index * 0.09}>
            <CategoryCard category={category} />
          </Reveal>
        ))}
      </div>
      {/* 
      <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
        {catalogPreview.listings.map((listing, index) => (
          <Reveal key={listing.id} delay={index * 0.09}>
            <ListingCard
              listing={listing}
              categoryLabel={catalogPreview.categoryLabels[listing.category]}
              favoriteLabel={catalogPreview.favoriteLabel}
            />
          </Reveal>
        ))}
      </div> */}

      <Reveal delay={0.05} className="mt-8 sm:mt-10">
        <Link
          href={catalogPreview.goToCatalog.href}
          className="flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-base font-bold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-hover active:scale-[.98]"
        >
          {catalogPreview.goToCatalog.label}
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </Reveal>
    </section>
  );
}
