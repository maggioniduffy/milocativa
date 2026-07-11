"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  catalogContent,
  filterProducts,
  type CatalogFilterType,
  type CatalogProduct,
} from "@/content/catalog";

const FILTER_PARAM = "categoria";

function parseFilterType(value: string | null): CatalogFilterType {
  const match = catalogContent.typeFilters.find((t) => t.id === value);
  return match ? match.id : "all";
}

interface CatalogFilter {
  activeType: CatalogFilterType;
  activeTypeLabel: string;
  products: readonly CatalogProduct[];
  resultCount: number;
  setActiveType: (type: CatalogFilterType) => void;
}

/**
 * Catalog type filter state, backed by the `?categoria=` search param so the
 * navbar search block and the products grid stay in sync without shared
 * client state, and filtered views stay linkable.
 */
export function useCatalogFilter(): CatalogFilter {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeType = parseFilterType(searchParams.get(FILTER_PARAM));
  const products = filterProducts(activeType);
  const activeTypeLabel =
    catalogContent.typeFilters.find((t) => t.id === activeType)?.label ??
    catalogContent.typeFilters[0].label;

  const setActiveType = useCallback(
    (type: CatalogFilterType) => {
      const params = new URLSearchParams(searchParams);
      if (type === "all") {
        params.delete(FILTER_PARAM);
      } else {
        params.set(FILTER_PARAM, type);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams]
  );

  return {
    activeType,
    activeTypeLabel,
    products,
    resultCount: products.length,
    setActiveType,
  };
}
