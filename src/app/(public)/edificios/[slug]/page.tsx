import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, MapPin } from "lucide-react";

import { BuildingDiagram } from "@/components/building/buildingDiagram";
import { TopoBackground } from "@/components/layout/topoBackground";
import { BuildingSummary } from "@/components/building/buildingSummary";
import { StatusLegend } from "@/components/building/statusLegend";
import { buildingContent, getBuildingBySlug } from "@/content/building";

interface BuildingPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return buildingContent.buildings.map((building) => ({ slug: building.slug }));
}

export async function generateMetadata({
  params,
}: BuildingPageProps): Promise<Metadata> {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);
  if (!building) return {};
  return {
    title: `${building.name} — MILOCATIVA`,
    description: building.description,
  };
}

export default async function BuildingPage({ params }: BuildingPageProps) {
  const { slug } = await params;
  const building = getBuildingBySlug(slug);
  if (!building) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
      <TopoBackground />
      <Link
        href={buildingContent.backLink.href}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-bold text-copy-muted transition-colors hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" />
        {buildingContent.backLink.label}
      </Link>

      <header className="mb-8 sm:mb-9">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-dim px-3 py-1.5 text-[12.5px] font-bold text-brand">
          <Building2 className="h-3.5 w-3.5" />
          {buildingContent.badge}
        </span>
        <h1 className="mb-2 mt-3 text-3xl font-extrabold leading-tight tracking-tight text-copy-primary sm:text-4xl lg:text-[42px]">
          {building.name}
        </h1>
        <p className="mb-2.5 flex items-center gap-1.5 text-[15px] font-semibold text-copy-muted">
          <MapPin className="h-4 w-4" />
          {building.address}
        </p>
        <p className="max-w-[620px] text-[15.5px] leading-relaxed text-copy-secondary [text-wrap:pretty]">
          {building.description}
        </p>
      </header>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
        <div className="min-w-0 flex-1">
          <BuildingDiagram building={building} />
          <StatusLegend />
        </div>
        <div className="w-full lg:w-[300px] lg:shrink-0">
          <BuildingSummary building={building} />
        </div>
      </div>
    </div>
  );
}
