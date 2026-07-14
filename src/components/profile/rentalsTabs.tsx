"use client";

import { useState } from "react";

import { profileContent } from "@/content/profile";
import { cn } from "@/lib/utils";
import { RentalCard, type RentalCardData } from "@/components/profile/rentalCard";

type TabKey = "rentals" | "history" | "payments";

const TAB_ORDER: TabKey[] = ["rentals", "history", "payments"];

/** Which rental statuses each tab shows. Payments has no rental view yet. */
const TAB_FILTER: Record<TabKey, (r: RentalCardData) => boolean> = {
  rentals: (r) => r.status !== "completed" && r.status !== "cancelled",
  history: (r) => r.status === "completed" || r.status === "cancelled",
  payments: () => false,
};

export function RentalsTabs({ rentals }: { rentals: RentalCardData[] }) {
  const [active, setActive] = useState<TabKey>("rentals");
  const { tabs } = profileContent;

  const visible = rentals.filter(TAB_FILTER[active]);

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto border-b border-surface-border">
        {TAB_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={cn(
              "-mb-px shrink-0 border-b-2 pb-3 text-sm font-bold transition-colors",
              active === key
                ? "border-brand text-copy-primary"
                : "border-transparent text-copy-muted hover:text-copy-secondary"
            )}
            aria-current={active === key ? "page" : undefined}
          >
            {tabs[key].label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {visible.length > 0 ? (
          <div className="flex flex-col gap-3">
            {visible.map((rental) => (
              <RentalCard key={rental.id} rental={rental} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-surface-border bg-surface px-4 py-10 text-center text-sm text-copy-muted">
            {tabs[active].empty}
          </p>
        )}
      </div>
    </div>
  );
}
