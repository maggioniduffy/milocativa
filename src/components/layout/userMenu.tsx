"use client";

import Link from "next/link";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Bell, CircleUserRound, LogOut, Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/themeToggle";
import { siteContent } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Signed-in header cluster from the dashboard design: a notification bell
 * (visual placeholder — no notifications backend yet, see progress-tracker)
 * and an avatar pill that opens the account menu (nav links + profile + sign
 * out) as a slide-over on every breakpoint.
 */
export function UserMenu() {
  const { user } = useUser();
  const { nav } = siteContent;

  return (
    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
      <button
        type="button"
        aria-label={nav.notifications}
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-surface-border bg-surface text-copy-secondary transition-colors hover:bg-subtle sm:h-11 sm:w-11"
      >
        <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error ring-2 ring-surface sm:right-2.5 sm:top-2.5" />
      </button>

      <Sheet>
        <SheetTrigger
          aria-label={nav.accountMenu}
          className="flex shrink-0 items-center gap-1 rounded-full border border-surface-border bg-surface py-1 pl-2 pr-1 transition-colors hover:bg-subtle sm:gap-2 sm:pl-3"
        >
          <Menu className="h-4 w-4 text-copy-secondary" />
          {user?.imageUrl ? (
            // Plain img: Clerk avatars are a remote host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt=""
              className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
            />
          ) : (
            <CircleUserRound className="h-7 w-7 text-copy-muted sm:h-8 sm:w-8" />
          )}
        </SheetTrigger>
        <SheetContent side="right" className="bg-surface">
          <SheetHeader>
            <SheetTitle>{nav.menuTitle}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center justify-between px-4 py-2 md:hidden">
            <span className="text-base font-medium text-copy-secondary">
              {nav.themeToggle}
            </span>
            <ThemeToggle />
          </div>
          <nav className="flex flex-col gap-1 px-4" aria-label="Cuenta">
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
            <SignOutButton>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: "destructive" }),
                  "h-11 w-full text-base cursor-pointer"
                )}
              >
                <LogOut className="h-5 w-5" />
                {nav.signOut}
              </button>
            </SignOutButton>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
