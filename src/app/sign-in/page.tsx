import { AuthShell } from "@/components/auth/authShell";
import { toSafeRedirectPath } from "@/lib/clerk/redirects";

interface SignInPageProps {
  searchParams: Promise<{ redirect_url?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { redirect_url: redirectUrl } = await searchParams;

  return (
    <AuthShell initialTab="login" redirectUrl={toSafeRedirectPath(redirectUrl)} />
  );
}
