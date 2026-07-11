import { BrandMark } from "@/components/layout/brandMark";
import { TopoBackground } from "@/components/layout/topoBackground";
import { AuthPanel } from "@/components/auth/authPanel";
import { AuthPhotoPanel } from "@/components/auth/authPhotoPanel";

interface AuthShellProps {
  initialTab: "login" | "signup";
  redirectUrl: string | null;
}

/** Split-screen shell shared by `/sign-in` and `/sign-up` — form column left, photo panel right. */
export function AuthShell({ initialTab, redirectUrl }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh min-[900px]:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
      <div className="relative flex min-h-dvh flex-col overflow-hidden">
        <div className="absolute inset-0 opacity-50" aria-hidden>
          <div className="absolute -left-[10%] -top-[10%] h-[46vw] w-[46vw] rounded-full bg-[radial-gradient(circle,rgba(14,140,127,.07),transparent_66%)]" />
          <TopoBackground variant="absolute" />
        </div>

        <div className="relative px-6 pt-[26px] sm:px-8 lg:px-14">
          <BrandMark />
        </div>

        <div className="relative flex flex-1 items-center justify-center px-6 py-8 sm:px-8 sm:py-12 lg:px-14">
          <AuthPanel initialTab={initialTab} redirectUrl={redirectUrl} />
        </div>
      </div>

      <AuthPhotoPanel />
    </div>
  );
}
