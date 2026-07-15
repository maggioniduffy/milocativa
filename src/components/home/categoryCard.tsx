import Link from "next/link";
import {
  Building2,
  HardHat,
  SquareParking,
  Truck,
  type LucideIcon,
} from "lucide-react";

import type { HomeCategoryCard } from "@/content/home";
import { CATEGORY_COLORS, type Category } from "@/types/domain";

const categoryIcons: Record<Category, LucideIcon> = {
  estate: Building2,
  machinery: Truck,
  service: HardHat,
  parking: SquareParking,
};

interface CategoryCardProps {
  category: HomeCategoryCard;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = categoryIcons[category.id];
  const colors = CATEGORY_COLORS[category.id];

  return (
    <Link
      href={category.href}
      className="flex h-full flex-col gap-2.5 rounded-2xl border border-surface-border bg-surface px-5 py-[18px] shadow-sm transition duration-200 ease-out hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex items-center gap-3.5">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-[14px]"
          style={{ backgroundColor: colors.fill, color: colors.text }}
        >
          <Icon className="h-6 w-6" />
        </span>
        <h3
          className="text-lg font-bold text-copy-primary sm:text-[19px]"
          style={{ color: colors.text }}
        >
          {category.name}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-copy-muted sm:text-[14.5px]">
        {category.description}
      </p>
    </Link>
  );
}
