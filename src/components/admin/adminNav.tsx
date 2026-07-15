"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, Inbox, LayoutList } from "lucide-react";

import { adminContent } from "@/content/admin";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  label: string;
  href: string | null;
  icon: typeof Inbox;
}

// Inbox and Alquileres are upcoming sections (href: null → disabled).
const NAV_ITEMS: AdminNavItem[] = [
  { label: adminContent.nav.items.inbox, href: null, icon: Inbox },
  { label: adminContent.nav.items.listings, href: "/admin/listings", icon: LayoutList },
  { label: adminContent.nav.items.rentals, href: null, icon: CalendarClock },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav aria-label={adminContent.nav.label} className="px-4 pb-3 sm:px-6 lg:px-4 lg:pb-0">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = href !== null && pathname.startsWith(href);

          if (href === null) {
            return (
              <li key={label} className="shrink-0">
                <span
                  aria-disabled
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-copy-faint"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                  <span className="rounded-full bg-subtle px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-copy-muted">
                    {adminContent.nav.comingSoon}
                  </span>
                </span>
              </li>
            );
          }

          return (
            <li key={label} className="shrink-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent-dim text-brand"
                    : "text-copy-secondary hover:bg-subtle hover:text-copy-primary",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
