"use client";

import { useState } from "react";

import { ProductCard } from "@/components/catalog/productCard";
import { useCatalogFilter } from "@/hooks/useCatalogFilter";

export function ProductsGrid() {
  const { products } = useCatalogFilter();
  // In-memory favorites until they are backed by real user state.
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string) =>
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavorite={!!favorites[product.id]}
          onToggleFavorite={() => toggleFavorite(product.id)}
        />
      ))}
    </div>
  );
}
