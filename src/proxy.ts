import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const ADMIN_PREFIX = "/admin";
const AUTHENTICATED_PREFIXES = ["/admin", "/my-conversations", "/my-rentals", "/profile"];

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  const requiresAuth = AUTHENTICATED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  if (!requiresAuth) return;

  const { userId, sessionClaims } = await auth();

  if (!userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", pathname + req.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  if (pathname.startsWith(ADMIN_PREFIX) && sessionClaims?.public_metadata?.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
