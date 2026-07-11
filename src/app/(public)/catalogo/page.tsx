import type { Metadata } from "next";
import { Suspense } from "react";

import { BuildingsRail } from "@/components/catalog/buildingsRail";
import { ProductsGrid } from "@/components/catalog/productsGrid";
import { catalogContent } from "@/content/catalog";

export const metadata: Metadata = {
  title: catalogContent.meta.title,
  description: catalogContent.meta.description,
};

export default function CatalogPage() {
  const { productsSection } = catalogContent;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8">
      <div className="mb-10 sm:mb-12">
        <BuildingsRail />
      </div>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-copy-primary sm:text-[28px]">
            {productsSection.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-copy-muted sm:text-[14.5px]">
            {productsSection.subtitle}
          </p>
        </div>
        <Suspense fallback={null}>
          <ProductsGrid />
        </Suspense>
      </section>
    </div>
  );
}
