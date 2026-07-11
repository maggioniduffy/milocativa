import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buildingContent, type BuildingDetail } from "@/content/building";

interface BuildingSummaryProps {
  building: BuildingDetail;
}

export function BuildingSummary({ building }: BuildingSummaryProps) {
  const { summary } = buildingContent;
  const allUnits = building.floors.flatMap((floor) => floor.units);
  const rows = [
    {
      label: summary.totalUnits,
      value: allUnits.length,
      className: "text-copy-primary",
    },
    {
      label: summary.availableNow,
      value: allUnits.filter((unit) => unit.status === "available").length,
      className: "text-success",
    },
    {
      label: summary.freeParking,
      value: building.parking.filter((bay) => bay.status === "available").length,
      className: "text-brand",
    },
  ];

  return (
    <aside className="rounded-3xl border border-surface-border bg-surface p-6 shadow-md lg:sticky lg:top-[88px]">
      <h3 className="mb-4 text-[17px] font-extrabold tracking-tight text-copy-primary">
        {summary.title}
      </h3>
      <dl className="flex flex-col gap-3.5">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-3 border-b border-subtle pb-3.5"
          >
            <dt className="text-sm font-semibold text-copy-secondary">{row.label}</dt>
            <dd className={`text-[15px] font-extrabold ${row.className}`}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      <Link
        href={summary.cta.href}
        className="mt-5 flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-3 text-[15px] font-bold text-white shadow-md shadow-brand/30 transition-colors hover:bg-brand-hover"
      >
        {summary.cta.label}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </aside>
  );
}
