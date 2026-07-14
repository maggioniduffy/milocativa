import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { myRentalsContent } from "@/content/myRentals";

/**
 * Minimal proof-of-chain route: Clerk session → Supabase RLS (Third-Party
 * Auth, no JWT template) → `people` row for the signed-in user only.
 */
export default async function MyRentalsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const supabase = await createSupabaseServerClient();

  const { data: person } = await supabase
    .from("people")
    .select("full_name, email")
    .eq("id", userId)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-copy-primary sm:text-4xl">
        {myRentalsContent.title}
      </h1>
      <p className="mt-3 text-base text-copy-secondary sm:text-lg">
        {person
          ? myRentalsContent.greeting(person.full_name ?? person.email)
          : myRentalsContent.noProfile}
      </p>
      {person ? (
        <p className="mt-6 text-sm text-copy-muted">{myRentalsContent.empty}</p>
      ) : null}
    </div>
  );
}
