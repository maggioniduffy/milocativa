"use client";

import {
  CalendarDays,
  Clock,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { catalogContent } from "@/content/catalog";
import { useCatalogFilter } from "@/hooks/useCatalogFilter";
import { CATALOG_FILTER_COLORS } from "@/types/domain";
import { cn } from "@/lib/utils";

/**
 * Expanded search block shown under the navbar on /catalogo: big search pill
 * plus the type / price / duration / availability filter row.
 */
export function CatalogSearchPanel() {
  const { activeType, resultCount, setActiveType } = useCatalogFilter();
  const { search, typeFilters } = catalogContent;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3.5 px-4 pb-4 pt-1 sm:px-6">
      <div className="flex w-full max-w-[620px] items-center gap-2.5 rounded-full border border-surface-border bg-surface py-1.5 pl-4 pr-1.5 shadow-sm sm:pl-5">
        <Search className="h-5 w-5 shrink-0 text-copy-muted" />
        <input
          type="text"
          placeholder={search.placeholder}
          className="min-w-0 flex-1 bg-transparent text-[15px] font-medium text-copy-primary outline-none placeholder:text-copy-muted"
        />
        <button
          type="button"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-hover sm:px-5"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">{search.submitLabel}</span>
        </button>
      </div>

      <div className="-mx-4 flex items-center gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex shrink-0 items-center gap-1 rounded-full border border-surface-border bg-surface p-1">
          {typeFilters.map((filter) => {
            const isActive = filter.id === activeType;
            const color = CATALOG_FILTER_COLORS[filter.id];
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveType(filter.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-[13.5px] font-bold transition-colors sm:px-4",
                  isActive ? "text-white" : "text-copy-secondary hover:bg-subtle"
                )}
                style={isActive ? { backgroundColor: color } : undefined}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: isActive ? "#FFFFFF" : color }}
                />
                {filter.label}
              </button>
            );
          })}
        </div>
        <FilterDropdownButton icon={<SlidersHorizontal className="h-4 w-4" />}>
          {search.priceLabel}
        </FilterDropdownButton>
        <FilterDropdownButton icon={<CalendarDays className="h-4 w-4" />}>
          {search.durationLabel}
        </FilterDropdownButton>
        <FilterDropdownButton icon={<Clock className="h-4 w-4" />}>
          {search.availabilityLabel}
        </FilterDropdownButton>
        <span className="ml-auto hidden whitespace-nowrap text-[13px] font-semibold text-copy-muted sm:inline">
          {resultCount} {search.resultsSuffix}
        </span>
      </div>
    </div>
  );
}

function FilterDropdownButton({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-surface-border bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-copy-secondary transition-colors hover:border-subtle-border hover:text-copy-primary"
    >
      {icon}
      {children}
      <ChevronDown className="h-[15px] w-[15px]" />
    </button>
  );
}

/**
 * Compact search pill that replaces the center nav links once the expanded
 * search block collapses on scroll. Clicking it scrolls back to the top,
 * which re-expands the search.
 */
export function CatalogCompactPill() {
  const { activeTypeLabel } = useCatalogFilter();
  const { search } = catalogContent;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex items-center rounded-full border border-surface-border bg-surface p-1.5 shadow-sm transition-shadow hover:shadow-md"
    >
      <span className="whitespace-nowrap px-3 text-[13.5px] font-bold text-copy-primary sm:px-4">
        {activeTypeLabel}
      </span>
      <span className="h-5 w-px bg-surface-border" />
      <span className="hidden whitespace-nowrap px-4 text-[13.5px] font-semibold text-copy-muted sm:inline">
        {search.priceLabel}
      </span>
      <span className="hidden h-5 w-px bg-surface-border sm:inline" />
      <span className="whitespace-nowrap px-3 text-[13.5px] font-semibold text-copy-muted sm:px-3.5">
        {search.submitLabel}
      </span>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand">
        <Search className="h-4 w-4 text-white" />
      </span>
    </button>
  );
}
