import { AuthShell } from "@/components/auth/authShell";
import { toSafeRedirectPath } from "@/lib/clerk/redirects";

interface SignUpPageProps {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { redirect_url: redirectUrl } = await searchParams;

  return (
    <AuthShell initialTab="signup" redirectUrl={toSafeRedirectPath(redirectUrl)} />
  );
}
