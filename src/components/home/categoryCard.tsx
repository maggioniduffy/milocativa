import Link from "next/link";
import { Building2, HardHat, SquareParking, Truck, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
    <Link href={category.href} className="group block rounded-2xl">
      <Card className="h-full rounded-2xl transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
        <CardContent className="space-y-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: colors.fill, color: colors.text }}
          >
            <Icon className="h-6 w-6" />
          </span>
          <h3 className="text-lg font-semibold text-copy-primary">
            {category.name}
          </h3>
          <p className="text-sm text-copy-muted">{category.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
