"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleUserRound, Menu } from "lucide-react";

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
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [elevated, setElevated] = useState(false);
  const { nav } = siteContent;

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-surface-border transition-[background-color,box-shadow] duration-200",
        elevated
          ? "bg-surface/80 shadow-md backdrop-blur-md"
          : "bg-surface"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandMark />

        <nav className="hidden items-center gap-6 md:flex" aria-label="Principal">
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

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href={nav.profile.href}
            className="flex items-center gap-1.5 text-sm font-medium text-copy-secondary transition-colors hover:text-copy-primary"
          >
            <CircleUserRound className="h-5 w-5" />
            {nav.profile.label}
          </Link>
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
              <SheetClose
                render={
                  <Link
                    href={nav.profile.href}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-copy-secondary transition-colors hover:bg-subtle hover:text-copy-primary"
                  />
                }
              >
                <CircleUserRound className="h-5 w-5" />
                {nav.profile.label}
              </SheetClose>
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
      </div>
    </header>
  );
}
