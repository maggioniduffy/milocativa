import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { CategoryCard } from "@/components/home/categoryCard";
import { ListingCard } from "@/components/home/listingCard";
import { Reveal } from "@/components/motion/reveal";
import { homeContent } from "@/content/home";
import { cn } from "@/lib/utils";

export function CatalogPreview() {
  const { catalogPreview } = homeContent;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <Reveal>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-copy-primary sm:text-3xl">
            {catalogPreview.title}
          </h2>
          <Link
            href={catalogPreview.viewAll.href}
            className="flex shrink-0 items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
          >
            {catalogPreview.viewAll.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-8">
        <div className="grid gap-6 sm:grid-cols-3">
          {catalogPreview.categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalogPreview.listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              categoryLabel={catalogPreview.categoryLabels[listing.category]}
            />
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-10">
        <Link
          href={catalogPreview.goToCatalog.href}
          className={cn(buttonVariants(), "h-11 w-full text-base")}
        >
          {catalogPreview.goToCatalog.label}
        </Link>
      </Reveal>
    </section>
  );
}
