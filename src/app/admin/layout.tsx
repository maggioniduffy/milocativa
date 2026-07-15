import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminNav } from "@/components/admin/adminNav";
import { BrandMark } from "@/components/layout/brandMark";
import { adminContent } from "@/content/admin";

export const metadata: Metadata = {
  title: adminContent.meta.title,
};

/**
 * Admin shell: navigation rail (left on desktop, top bar on mobile) +
 * content area, per ui-context.md "Admin panel" layout pattern. Route access
 * is enforced by proxy.ts (admin role) — this layout only renders chrome.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-surface-border bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:flex-col lg:items-stretch lg:gap-6 lg:px-4 lg:py-6">
          <BrandMark />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-copy-muted transition-colors hover:text-brand lg:order-last"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {adminContent.nav.backToSite}
          </Link>
        </div>
        <AdminNav />
      </aside>
      <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
