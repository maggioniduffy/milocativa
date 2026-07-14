import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Building2, Calendar, KeyRound, Mail, MessageCircle, Phone } from "lucide-react";

import { ensurePerson } from "@/server/people";
import { profileContent } from "@/content/profile";

function formatMemberSince(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=%2Fprofile");

  const user = await currentUser();
  const person = await ensurePerson();

  const displayName =
    person?.full_name ?? user?.fullName ?? profileContent.fallbackName;
  const email = person?.email ?? user?.primaryEmailAddress?.emailAddress ?? "";
  const { info, messages, rentals } = profileContent;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-extrabold tracking-tight text-copy-primary sm:text-4xl">
        {profileContent.title}
      </h1>

      {person ? null : (
        <p className="mt-3 text-sm text-copy-muted">{profileContent.noProfileRow}</p>
      )}

      <section className="mt-8 rounded-2xl border border-surface-border bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-copy-primary">{info.heading}</h2>
        <p className="mt-1 text-xl font-extrabold text-copy-primary">{displayName}</p>
        <dl className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 shrink-0 text-copy-muted" aria-hidden />
            <dt className="sr-only">{info.emailLabel}</dt>
            <dd className="text-copy-secondary">{email}</dd>
          </div>
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 shrink-0 text-copy-muted" aria-hidden />
            <dt className="sr-only">{info.phoneLabel}</dt>
            <dd className={person?.phone ? "text-copy-secondary" : "text-copy-faint"}>
              {person?.phone ?? info.phoneEmpty}
            </dd>
          </div>
          <div className="flex items-center gap-2.5">
            <Building2 className="h-4 w-4 shrink-0 text-copy-muted" aria-hidden />
            <dt className="sr-only">{info.companyLabel}</dt>
            <dd className={person?.company_name ? "text-copy-secondary" : "text-copy-faint"}>
              {person?.company_name ?? info.companyEmpty}
            </dd>
          </div>
          {person ? (
            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 shrink-0 text-copy-muted" aria-hidden />
              <dt className="text-copy-muted">{info.memberSinceLabel}</dt>
              <dd className="text-copy-secondary">{formatMemberSince(person.created_at)}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-copy-primary">
          <MessageCircle className="h-5 w-5 text-brand" aria-hidden />
          {messages.heading}
        </h2>
        <p className="mt-2 text-sm text-copy-muted">{messages.empty}</p>
        <Link
          href={messages.cta.href}
          className="mt-4 inline-flex items-center rounded-full bg-accent-dim px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {messages.cta.label}
        </Link>
      </section>

      <section className="mt-6 rounded-2xl border border-surface-border bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-copy-primary">
          <KeyRound className="h-5 w-5 text-brand" aria-hidden />
          {rentals.heading}
        </h2>
        <p className="mt-2 text-sm text-copy-muted">{rentals.empty}</p>
        <Link
          href={rentals.viewAll.href}
          className="mt-4 inline-flex items-center rounded-full bg-accent-dim px-4 py-2 text-sm font-bold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {rentals.viewAll.label}
        </Link>
      </section>
    </div>
  );
}
