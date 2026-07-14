"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock,
  ChevronDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

  // Local state for mobile/popup filters interactivity
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");

  const hasActiveFilters =
    activeType !== "all" ||
    priceMin !== "" ||
    priceMax !== "" ||
    selectedDuration !== "all" ||
    selectedAvailability !== "all";

  const handleClearAll = () => {
    setActiveType("all");
    setPriceMin("");
    setPriceMax("");
    setSelectedDuration("all");
    setSelectedAvailability("all");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-3.5 px-4 pb-4 pt-1 sm:px-6">
      <div className="flex w-full max-w-[620px] items-center gap-2">
        <div className="flex flex-1 items-center gap-2.5 rounded-full border border-surface-border bg-surface py-1.5 pl-4 pr-1.5 shadow-sm sm:pl-5">
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

        {/* Filter Popup Trigger on mobile */}
        <Sheet>
          <SheetTrigger
            className={cn(
              "relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-surface text-copy-secondary transition-colors hover:border-subtle-border hover:text-copy-primary md:hidden shadow-sm cursor-pointer",
              hasActiveFilters ? "border-brand text-brand" : "border-surface-border"
            )}
            aria-label="Filtros"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute right-3.5 top-3.5 h-2 w-2 rounded-full bg-brand" />
            )}
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[85%] max-w-sm bg-surface p-6 flex flex-col h-full border-l border-surface-border rounded-l-3xl shadow-lg"
          >
            <SheetHeader className="px-0 pt-2 pb-4 border-b border-surface-border">
              <SheetTitle className="text-lg font-extrabold text-copy-primary">
                Filtros de búsqueda
              </SheetTitle>
            </SheetHeader>

            {/* Scrollable Filters Body */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {/* Category Filter */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-copy-primary">Categoría</h3>
                <div className="flex flex-wrap gap-2">
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
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-200",
                          isActive
                            ? "text-white border-transparent"
                            : "border-surface-border text-copy-secondary hover:bg-subtle"
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
              </div>

              {/* Price Range Filter */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-copy-primary">Precio</h3>
                <div className="flex items-center gap-3">
                  <div className="flex flex-1 items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2">
                    <span className="text-xs font-semibold text-copy-muted">$</span>
                    <input
                      type="number"
                      placeholder="Mínimo"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-copy-primary outline-none placeholder:text-copy-faint"
                    />
                  </div>
                  <span className="text-copy-muted font-medium">-</span>
                  <div className="flex flex-1 items-center gap-1.5 rounded-xl border border-surface-border bg-surface px-3 py-2">
                    <span className="text-xs font-semibold text-copy-muted">$</span>
                    <input
                      type="number"
                      placeholder="Máximo"
                      value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full bg-transparent text-xs font-medium text-copy-primary outline-none placeholder:text-copy-faint"
                    />
                  </div>
                </div>
              </div>

              {/* Duration Filter */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-copy-primary">Duración del Contrato</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Cualquier duración" },
                    { id: "daily", label: "Diario" },
                    { id: "monthly", label: "Mensual" },
                    { id: "service", label: "Por servicio" },
                  ].map((option) => {
                    const isActive = selectedDuration === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedDuration(option.id)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
                          isActive
                            ? "border-brand bg-accent-dim text-brand"
                            : "border-surface-border text-copy-secondary hover:bg-subtle"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability Filter */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-copy-primary">Disponibilidad</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "Cualquier fecha" },
                    { id: "immediate", label: "Inmediata" },
                    { id: "30days", label: "Próximos 30 días" },
                    { id: "90days", label: "Próximos 90 días" },
                  ].map((option) => {
                    const isActive = selectedAvailability === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedAvailability(option.id)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-200",
                          isActive
                            ? "border-brand bg-accent-dim text-brand"
                            : "border-surface-border text-copy-secondary hover:bg-subtle"
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-auto pt-4 border-t border-surface-border flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-bold text-copy-secondary hover:text-copy-primary underline transition-colors"
              >
                Limpiar todo
              </button>
              <SheetClose
                className="rounded-full bg-brand px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-brand-hover cursor-pointer"
              >
                Ver {resultCount} resultados
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop view: inline filters, only shown at md and up. Wraps into
          two rows at md (chips over dropdowns), one row again at lg. */}
      <div className="hidden md:flex md:w-full md:flex-col md:gap-3 lg:flex-row lg:items-center">
        <div className="flex shrink-0 items-center gap-1 self-start rounded-full border border-surface-border bg-surface p-1">
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
        <div className="flex items-center gap-3 lg:contents">
          <FilterDropdownButton icon={<SlidersHorizontal className="h-4 w-4" />}>
            {search.priceLabel}
          </FilterDropdownButton>
          <FilterDropdownButton icon={<CalendarDays className="h-4 w-4" />}>
            {search.durationLabel}
          </FilterDropdownButton>
          <FilterDropdownButton icon={<Clock className="h-4 w-4" />}>
            {search.availabilityLabel}
          </FilterDropdownButton>
          <span className="ml-auto whitespace-nowrap text-[13px] font-semibold text-copy-muted">
            {resultCount} {search.resultsSuffix}
          </span>
        </div>
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
