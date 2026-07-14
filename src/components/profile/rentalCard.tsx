import { MessageCircle, MoveRight, Wrench } from "lucide-react";

import { catalogContent } from "@/content/catalog";
import { profileContent } from "@/content/profile";
import {
  CATEGORY_COLORS,
  RENTAL_STATUS_COLORS,
  type Category,
  type RentalStatus,
} from "@/types/domain";

export interface RentalCardData {
  id: string;
  title: string;
  category: Category;
  status: RentalStatus;
  /** ISO date strings. */
  startDate: string;
  endDate: string;
  imageUrl?: string;
  imageAlt?: string;
}

function formatRange(startDate: string, endDate: string): string {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  return `${fmt(startDate)} ${profileContent.rentalCard.dateSeparator} ${fmt(endDate)}`;
}

/**
 * Presentational rental row matching the dashboard design. Data-agnostic: it
 * receives a `RentalCardData` and renders the thumbnail, status/category tags,
 * title, date range, and a status-dependent action. The action is a visual
 * placeholder until the rentals + chat features are wired.
 */
export function RentalCard({ rental }: { rental: RentalCardData }) {
  const status = RENTAL_STATUS_COLORS[rental.status];
  const category = CATEGORY_COLORS[rental.category];
  const { rentalStatusLabels } = profileContent;

  return (
    <article className="flex items-center gap-4 rounded-2xl border border-surface-border bg-surface p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-subtle sm:h-20 sm:w-24">
        {rental.imageUrl ? (
          // Plain img: rental photos live in Supabase Storage (remote host).
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={rental.imageUrl}
            alt={rental.imageAlt ?? rental.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-copy-faint">
            <Wrench className="h-5 w-5" aria-hidden />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: status.fill, color: status.text }}
          >
            {rentalStatusLabels[rental.status]}
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold"
            style={{ color: category.text }}
          >
            <span
              className="h-[7px] w-[7px] rounded-full"
              style={{ backgroundColor: category.text }}
            />
            {catalogContent.categoryTags[rental.category]}
          </span>
        </div>
        <h3 className="mt-1 truncate text-base font-bold text-copy-primary">
          {rental.title}
        </h3>
        <p className="mt-0.5 text-sm text-copy-muted">
          {formatRange(rental.startDate, rental.endDate)}
        </p>
      </div>

      <RentalAction status={rental.status} />
    </article>
  );
}

function RentalAction({ status }: { status: RentalStatus }) {
  const { rentalCard } = profileContent;

  if (status === "completed" || status === "cancelled") {
    return (
      <button
        type="button"
        className="shrink-0 self-center text-sm font-semibold text-copy-muted transition-colors hover:text-copy-primary"
      >
        {rentalCard.rentAgain}
      </button>
    );
  }

  if (status === "active" || status === "accepted") {
    return (
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-surface-border px-3.5 py-2 text-sm font-semibold text-copy-secondary transition-colors hover:bg-subtle"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {rentalCard.message}
      </button>
    );
  }

  // requested
  return (
    <button
      type="button"
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
    >
      {rentalCard.detail}
      <MoveRight className="h-4 w-4" aria-hidden />
    </button>
  );
}
