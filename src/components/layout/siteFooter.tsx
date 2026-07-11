import Link from "next/link";

import { BrandMark } from "@/components/layout/brandMark";
import { siteContent } from "@/content/site";

export function SiteFooter() {
  const { brand, footer } = siteContent;

  return (
    <footer className="mt-2 rounded-t-[28px] border-t border-surface-border bg-surface shadow-[0_-12px_40px_rgba(11,31,38,.05)] sm:rounded-t-[48px]">
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14 lg:pt-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.5fr_repeat(3,1fr)] md:gap-10">
          <div className="space-y-3">
            <BrandMark />
            <p className="max-w-xs text-sm leading-relaxed text-copy-muted">
              {brand.tagline}
            </p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[13px] font-extrabold uppercase tracking-[.06em] text-copy-faint">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-semibold text-copy-secondary transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-surface-border py-5 text-[13px] text-copy-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.legal}</p>
          <p>{footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
