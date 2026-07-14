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
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={nav.notifications}
        className="relative grid h-11 w-11 place-items-center rounded-full border border-surface-border bg-surface text-copy-secondary transition-colors hover:bg-subtle"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-error ring-2 ring-surface" />
      </button>

      <Sheet>
        <SheetTrigger
          aria-label={nav.accountMenu}
          className="flex items-center gap-2 rounded-full border border-surface-border bg-surface py-1 pl-3 pr-1 transition-colors hover:bg-subtle"
        >
          <Menu className="h-4 w-4 text-copy-secondary" />
          {user?.imageUrl ? (
            // Plain img: Clerk avatars are a remote host.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <CircleUserRound className="h-8 w-8 text-copy-muted" />
          )}
        </SheetTrigger>
        <SheetContent side="right" className="bg-surface">
          <SheetHeader>
            <SheetTitle>{nav.menuTitle}</SheetTitle>
          </SheetHeader>
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
