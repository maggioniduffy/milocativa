import Image from "next/image";
import { CalendarCheck2, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "@/components/home/categoryBadge";
import type { HomeListing } from "@/content/home";

interface ListingCardProps {
  listing: HomeListing;
  categoryLabel: string;
}

export function ListingCard({ listing, categoryLabel }: ListingCardProps) {
  return (
    <Card className="group gap-0 overflow-hidden rounded-2xl py-0 transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.imageAlt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <CategoryBadge
            category={listing.category}
            label={categoryLabel}
            onImage
          />
        </div>
      </div>
      <CardContent className="space-y-1.5 p-4">
        <h3 className="font-semibold text-copy-primary">{listing.name}</h3>
        <p className="flex items-center gap-1 text-sm text-copy-muted">
          <MapPin className="h-4 w-4" />
          {listing.location}
        </p>
        <p className="pt-1 text-copy-primary">
          <span className="text-lg font-bold">{listing.price}</span>{" "}
          <span className="text-sm text-copy-muted">{listing.period}</span>
        </p>
        <p className="flex items-center gap-1 text-xs text-copy-faint">
          <CalendarCheck2 className="h-4 w-4" />
          {listing.availability}
        </p>
      </CardContent>
    </Card>
  );
}
