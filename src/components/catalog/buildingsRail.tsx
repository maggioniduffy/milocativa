"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { catalogContent, type CatalogBuilding } from "@/content/catalog";
import { cn } from "@/lib/utils";

const RAIL_SCROLL_STEP = 680;

export function BuildingsRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { buildingsSection, buildings } = catalogContent;

  const scrollRail = (direction: 1 | -1) =>
    railRef.current?.scrollBy({
      left: direction * RAIL_SCROLL_STEP,
      behavior: "smooth",
    });

  const toggleFavorite = (slug: string) =>
    setFavorites((prev) => ({ ...prev, [slug]: !prev[slug] }));

  return (
    <section>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-copy-primary sm:text-[28px]">
            {buildingsSection.title}
          </h2>
          <p className="mt-1 text-sm font-medium text-copy-muted sm:text-[14.5px]">
            {buildingsSection.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href={buildingsSection.viewAll.href}
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold text-brand transition-colors hover:bg-accent-dim hover:text-brand-hover"
          >
            {buildingsSection.viewAll.label}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={buildingsSection.prevLabel}
              onClick={() => scrollRail(-1)}
              className="grid h-[34px] w-[34px] place-items-center rounded-full border border-surface-border bg-surface text-copy-primary transition hover:border-copy-primary hover:bg-base active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={buildingsSection.nextLabel}
              onClick={() => scrollRail(1)}
              className="grid h-[34px] w-[34px] place-items-center rounded-full border border-surface-border bg-surface text-copy-primary transition hover:border-copy-primary hover:bg-base active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={railRef}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-1 [&::-webkit-scrollbar]:hidden"
      >
        {buildings.map((building) => (
          <BuildingCard
            key={building.slug}
            building={building}
            isFavorite={!!favorites[building.slug]}
            onToggleFavorite={() => toggleFavorite(building.slug)}
          />
        ))}
        <ShowAllCard />
      </div>
    </section>
  );
}

interface BuildingCardProps {
  building: CatalogBuilding;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function BuildingCard({ building, isFavorite, onToggleFavorite }: BuildingCardProps) {
  const { buildingsSection } = catalogContent;

  return (
    <Link
      // Placeholder: every card opens the one building with detail data until
      // buildings come from Supabase.
      href="/edificios/torre-anelo"
      className="group flex w-[260px] shrink-0 snap-start flex-col gap-2.5 transition-transform duration-200 ease-out hover:-translate-y-1 sm:w-[320px]"
    >
      <div
        role="img"
        aria-label={building.coverAlt}
        className="relative aspect-[3/2] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-200 group-hover:shadow-xl"
        style={{ background: building.cover }}
      >
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-[12.5px] font-bold text-brand shadow-sm backdrop-blur-sm">
          <Building2 className="h-3.5 w-3.5" />
          {buildingsSection.availableTemplate(building.available, building.total)}
        </span>
        <button
          type="button"
          aria-label={buildingsSection.favoriteLabel}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-surface/55 backdrop-blur-sm transition active:scale-90 hover:bg-surface/85"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-error stroke-error" : "fill-copy-primary/30 stroke-white"
            )}
          />
        </button>
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold tracking-tight text-copy-primary">
          {building.name}
        </h3>
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-copy-muted">
          <MapPin className="h-3.5 w-3.5" />
          {building.address}
        </p>
      </div>
    </Link>
  );
}

const miniPhotos = [
  {
    delay: 0.1,
    className: "absolute left-1.5 top-3.5 h-[58px] w-[74px]",
    inner:
      "rotate-[-9deg] bg-[linear-gradient(135deg,hsl(205_28%_46%),hsl(223_30%_40%))] shadow-md",
  },
  {
    delay: 0.24,
    className: "absolute right-1 top-1.5 h-[58px] w-[74px]",
    inner:
      "rotate-[8deg] bg-[linear-gradient(135deg,hsl(168_28%_46%),hsl(186_30%_40%))] shadow-md",
  },
  {
    delay: 0.38,
    className: "absolute left-1/2 top-5 h-[60px] w-[76px] -ml-[38px]",
    inner:
      "border-2 border-surface bg-[linear-gradient(135deg,hsl(210_30%_50%),hsl(200_32%_42%))] shadow-lg",
  },
];

function ShowAllCard() {
  const reduceMotion = useReducedMotion();
  const { buildingsSection } = catalogContent;

  return (
    <Link
      href={buildingsSection.showAll.href}
      className="group flex w-[260px] shrink-0 snap-start flex-col gap-2.5 transition-transform duration-200 ease-out hover:-translate-y-1 sm:w-[320px]"
    >
      <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-2xl border border-surface-border bg-surface shadow-sm transition duration-200 group-hover:border-subtle-border group-hover:shadow-xl">
        <div className="relative h-[92px] w-[120px]">
          {miniPhotos.map((photo) => (
            <motion.div
              key={photo.delay}
              className={photo.className}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.7 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: photo.delay,
                type: "spring",
                stiffness: 260,
                damping: 16,
              }}
            >
              <div className={cn("h-full w-full rounded-[10px]", photo.inner)} />
            </motion.div>
          ))}
        </div>
      </div>
      <span className="flex items-center gap-1.5 text-[15px] font-extrabold text-copy-primary underline underline-offset-[3px]">
        {buildingsSection.showAll.label}
        <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
