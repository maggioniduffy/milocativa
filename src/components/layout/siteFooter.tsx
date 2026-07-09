import Link from "next/link";

import { BrandMark } from "@/components/layout/brandMark";
import { siteContent } from "@/content/site";

export function SiteFooter() {
  const { brand, footer } = siteContent;

  return (
    <footer className="border-t border-surface-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.5fr_repeat(3,1fr)] md:gap-10">
          <div className="space-y-3">
            <BrandMark />
            <p className="max-w-xs text-sm text-copy-muted">{brand.tagline}</p>
          </div>
          {footer.columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold text-copy-primary">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-copy-muted transition-colors hover:text-copy-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-surface-border pt-6 text-sm text-copy-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.legal}</p>
          <p>{footer.madeIn}</p>
        </div>
      </div>
    </footer>
  );
}
