import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { BadgeCheck, CheckCircle2, Clock, Mail, MessageSquare, Phone } from "lucide-react";

import { ensurePerson } from "@/server/people";
import { profileContent } from "@/content/profile";
import { TopoBackground } from "@/components/layout/topoBackground";
import { EditProfileButton } from "@/components/profile/editProfileButton";
import { RentalsTabs } from "@/components/profile/rentalsTabs";
import type { RentalCardData } from "@/components/profile/rentalCard";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fprofile");

  const user = await currentUser();
  const person = await ensurePerson();

  const displayName =
    person?.full_name ?? user?.fullName ?? profileContent.fallbackName;
  const firstName = displayName.split(" ")[0];
  const email = person?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const avatarUrl = person?.avatar_url ?? user?.imageUrl ?? "";
  const { info, stats } = profileContent;

  // No rentals query yet — see progress-tracker open question. The layout is
  // wired to render real cards + counts once a rentals feature exists.
  const rentals: RentalCardData[] = [];
  const activeCount = rentals.filter((r) => r.status === "active").length;
  const pendingCount = rentals.filter((r) => r.status === "requested").length;
  const messageCount = 0;

  const statCards = [
    {
      label: stats.activeRentals,
      value: activeCount,
      icon: CheckCircle2,
      color: "var(--state-success)",
      dim: "rgba(31, 157, 107, 0.12)",
    },
    {
      label: stats.pendingRequests,
      value: pendingCount,
      icon: Clock,
      color: "var(--accent-sky)",
      dim: "rgba(63, 143, 176, 0.12)",
    },
    {
      label: stats.newMessages,
      value: messageCount,
      icon: MessageSquare,
      color: "var(--accent-teal)",
      dim: "rgba(14, 140, 127, 0.10)",
    },
  ];

  return (
    <>
      <TopoBackground />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:gap-8">
        {/* Left: profile card */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-surface-border bg-surface p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                {avatarUrl ? (
                  // Plain img: Clerk/Supabase avatars are remote hosts.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="grid h-24 w-24 place-items-center rounded-full bg-subtle text-2xl font-bold text-copy-muted">
                    {firstName.charAt(0)}
                  </div>
                )}
                <span className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-surface">
                  <BadgeCheck className="h-5 w-5 text-brand" aria-hidden />
                </span>
              </div>
              <h1 className="mt-4 text-xl font-extrabold tracking-tight text-copy-primary">
                {displayName}
              </h1>
              {person?.company_name ? (
                <p className="mt-0.5 text-sm text-copy-muted">{person.company_name}</p>
              ) : null}
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-subtle px-3 py-1.5 text-xs font-bold text-copy-secondary">
                <BadgeCheck className="h-4 w-4 text-brand" aria-hidden />
                {info.verifiedLabel}
              </span>
            </div>

            <div className="my-6 border-t border-surface-border" />

            <h2 className="text-sm font-bold text-copy-primary">{info.contactHeading}</h2>
            <dl className="mt-4 flex flex-col gap-3 text-sm">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-copy-muted" aria-hidden />
                <dt className="sr-only">{info.emailLabel}</dt>
                <dd className="truncate text-copy-secondary">{email}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-copy-muted" aria-hidden />
                <dt className="sr-only">{info.phoneLabel}</dt>
                <dd className={person?.phone ? "text-copy-secondary" : "text-copy-faint"}>
                  {person?.phone ?? info.phoneEmpty}
                </dd>
              </div>
            </dl>

            <div className="mt-6">
              <EditProfileButton />
            </div>
          </div>
        </aside>

        {/* Right: main content */}
        <div>
          {person ? null : (
            <p className="mb-4 text-sm text-copy-muted">{profileContent.noProfileRow}</p>
          )}
          <h2 className="text-2xl font-extrabold tracking-tight text-copy-primary sm:text-3xl">
            {profileContent.greeting(firstName)}
          </h2>
          <p className="mt-1 text-base text-copy-secondary sm:text-lg">
            {profileContent.subtitle}
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-surface-border bg-surface p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="grid h-10 w-10 place-items-center rounded-full"
                    style={{ backgroundColor: card.dim, color: card.color }}
                  >
                    <card.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-2xl font-extrabold text-copy-primary">
                    {card.value}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-copy-muted">{card.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <RentalsTabs rentals={rentals} />
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
