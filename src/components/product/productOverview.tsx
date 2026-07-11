import {
  Armchair,
  Building2,
  Check,
  Clock,
  Combine,
  Droplet,
  Gauge,
  Layers,
  MapPin,
  Ruler,
  SquareParking,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { productContent, type ProductDetail, type QuickFactKey } from "@/content/product";

const QUICK_FACT_ICONS: Record<QuickFactKey, LucideIcon> = {
  area: Ruler,
  rooms: Layers,
  furnished: Armchair,
  parkingSpot: SquareParking,
  model: Wrench,
  capacity: Gauge,
  fuel: Droplet,
  operator: Users,
  duration: Clock,
  crew: Users,
  modality: Combine,
  spotType: Building2,
  covered: Building2,
  dimensions: Ruler,
};

interface ProductOverviewProps {
  detail: ProductDetail;
  location: string;
}

export function ProductOverview({ detail, location }: ProductOverviewProps) {
  const { overview, quickFactLabels } = productContent;

  return (
    <div className="flex flex-col gap-7 sm:gap-8">
      <div className="flex flex-wrap gap-x-7 gap-y-3 border-b border-subtle pb-7">
        {detail.quickFacts.map((fact) => {
          const Icon = QUICK_FACT_ICONS[fact.key];
          return (
            <div key={fact.key} className="flex items-center gap-2.5">
              <Icon className="h-5 w-5 shrink-0 text-copy-secondary" />
              <div className="leading-tight">
                <p className="text-[13px] font-semibold text-copy-primary">
                  {fact.label}
                </p>
                <p className="text-[11.5px] font-medium text-copy-muted">
                  {quickFactLabels[fact.key]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-b border-subtle pb-7">
        <h2 className="mb-2.5 text-lg font-extrabold tracking-tight text-copy-primary sm:text-xl">
          {overview.descriptionTitle}
        </h2>
        <p className="max-w-[640px] text-[15px] leading-relaxed text-copy-secondary [text-wrap:pretty]">
          {detail.description}
        </p>
      </div>

      <div className="border-b border-subtle pb-7">
        <h2 className="mb-3.5 text-lg font-extrabold tracking-tight text-copy-primary sm:text-xl">
          {overview.featuresTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {detail.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-[14px] text-copy-secondary">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2.5 text-lg font-extrabold tracking-tight text-copy-primary sm:text-xl">
          {overview.locationTitle}
        </h2>
        <p className="mb-2 flex items-center gap-1.5 text-[15px] font-semibold text-copy-primary">
          <MapPin className="h-4 w-4 text-brand" />
          {location}
        </p>
        <p className="max-w-[560px] text-[13.5px] leading-relaxed text-copy-muted">
          {overview.locationNote}
        </p>
      </div>
    </div>
  );
}
