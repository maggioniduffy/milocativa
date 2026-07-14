"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BrandMark } from "@/components/layout/brandMark";
import { UserMenu } from "@/components/layout/userMenu";
import {
  CatalogCompactPill,
  CatalogSearchPanel,
} from "@/components/catalog/catalogSearch";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

/** Scroll depth past which the catalog search collapses into the compact pill. */
const SEARCH_COLLAPSE_THRESHOLD = 40;

export function Navbar() {
  const [elevated, setElevated] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { nav } = siteContent;
  // The catalog page embeds an Airbnb-style search block in the navbar.
  const hasCatalogSearch = pathname === "/catalogo";

  useEffect(() => {
    const onScroll = () => {
      setElevated(window.scrollY > 24);
      setCollapsed(window.scrollY > SEARCH_COLLAPSE_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showCompactPill = hasCatalogSearch && collapsed;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-200",
        elevated
          ? "border-surface-border bg-surface/80 shadow-md backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <BrandMark hideText={showCompactPill} />

        <div className="relative flex min-h-11 flex-1 items-center justify-center">
          <nav
            className={cn(
              "hidden items-center gap-6 transition-all duration-200 md:flex",
              showCompactPill && "pointer-events-none -translate-y-2.5 opacity-0"
            )}
            aria-label="Principal"
          >
            {nav.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-copy-secondary transition-colors hover:text-copy-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {hasCatalogSearch ? (
            <div
              className={cn(
                "absolute transition-all duration-200",
                showCompactPill
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-2.5 opacity-0"
              )}
            >
              <Suspense fallback={null}>
                <CatalogCompactPill />
              </Suspense>
            </div>
          ) : null}
        </div>

        {/* Signed-in: dashboard-style bell + avatar pill on every breakpoint. */}
        <Show when="signed-in">
          <UserMenu />
        </Show>

        {/* Signed-out: desktop CTA + mobile menu sheet. */}
        <Show when="signed-out">
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href={nav.signIn.href}
              className={cn(buttonVariants(), "h-9 px-4")}
            >
              {nav.signIn.label}
            </Link>
          </div>

          <Sheet>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-lg" }),
                "md:hidden"
              )}
              aria-label={nav.openMenu}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-surface">
              <SheetHeader>
                <SheetTitle>{nav.menuTitle}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4" aria-label="Principal">
                {nav.links.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-lg px-3 py-2 text-base font-medium text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary"
                      />
                    }
                  >
                    {link.label}
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto p-4">
                <SheetClose
                  render={
                    <Link
                      href={nav.signIn.href}
                      className={cn(buttonVariants(), "h-11 w-full text-base")}
                    />
                  }
                >
                  {nav.signIn.label}
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </Show>
      </div>

      {hasCatalogSearch ? (
        <div
          className="overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: collapsed ? 0 : 240,
            opacity: collapsed ? 0 : 1,
            transform: collapsed ? "translateY(-10px)" : "none",
          }}
        >
          <Suspense fallback={null}>
            <CatalogSearchPanel />
          </Suspense>
        </div>
      ) : null}
    </header>
  );
}
