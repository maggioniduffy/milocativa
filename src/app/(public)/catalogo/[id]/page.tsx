import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, Star } from "lucide-react";

import { ProductGallery } from "@/components/product/productGallery";
import { ProductOverview } from "@/components/product/productOverview";
import { ProductBookingCard } from "@/components/product/productBookingCard";
import { catalogContent } from "@/content/catalog";
import { getProductById, productContent } from "@/content/product";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return catalogContent.products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: productContent.meta.titleTemplate(product.title),
    description: product.detail.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const photos = product.detail.gallery;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
      <Link
        href={productContent.backLink.href}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-copy-muted transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        {productContent.backLink.label}
      </Link>

      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <span
            className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent-dim px-3 py-1 text-[12.5px] font-bold text-brand"
          >
            {catalogContent.categoryTags[product.category]}
          </span>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-copy-primary sm:text-3xl lg:text-[34px]">
            {product.title}
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-copy-secondary">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-copy-primary stroke-none" />
              {product.rating}
            </span>
            · {productContent.reviewsSuffix(product.detail.reviewCount)} · {product.location}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-border px-3.5 py-2 text-[13px] font-bold text-copy-secondary transition-colors hover:border-subtle-border hover:text-copy-primary"
        >
          <Share2 className="h-4 w-4" />
          {productContent.shareLabel}
        </button>
      </header>

      <div className="mb-8 sm:mb-9">
        <ProductGallery title={product.title} photos={photos} cover={product.cover} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
        <div className="min-w-0 flex-1">
          <ProductOverview detail={product.detail} location={product.location} />
        </div>
        <div className="w-full lg:w-[340px] lg:shrink-0">
          <ProductBookingCard
            price={product.price}
            unit={product.unit}
            rating={product.rating}
            reviewCount={product.detail.reviewCount}
          />
        </div>
      </div>
    </div>
  );
}
