# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

Public site foundation — landing page implemented, catalog and auth flows not started.

## Current Goal

Build out the public catalog (`/catalogo`) that the landing page links to.

## Completed

- Landing (home) page at `/` inside the `app/(public)` route group, implemented from the v0 design spec (v0.app chat `jGFCPmKt5rE`), fully tokenized and in Spanish:
  - `components/layout/`: `navbar.tsx` (sticky, scroll elevation, mobile sheet), `siteFooter.tsx`, `brandMark.tsx`.
  - `components/home/`: `hero.tsx`, `aboutSection.tsx`, `catalogPreview.tsx`, `categoryCard.tsx`, `listingCard.tsx`, `categoryBadge.tsx`, `howItWorks.tsx`.
  - `components/motion/reveal.tsx`: shared scroll-into-view fade/slide wrapper (Framer Motion, respects `prefers-reduced-motion`).
  - `content/site.ts` (brand, nav, footer, metadata) and `content/home.ts` (hero, about, catalog preview, how-it-works) hold all Spanish copy; sample listings in `content/home.ts` are placeholders until Supabase powers the catalog.
  - `types/domain.ts`: `Category`, `RentalStatus`, `CATEGORY_COLORS`, `RENTAL_STATUS_COLORS` per `ui-context.md`.
  - `app/(public)/layout.tsx` wraps public pages with navbar + footer; root layout metadata now comes from `content/site.ts`.
  - shadcn/ui `card`, `badge`, `sheet` added via the CLI (unmodified); AI-generated placeholder photos in `public/images/`.
- `npm run build` passes; all routes static.

## In Progress

## Next Up

- Public catalog page (`/catalogo`) with filters (type, price, contract length, availability) — the landing page already links to `/catalogo` and `/catalogo?categoria=<estate|machinery|service>`.
- Clerk sign-in flow — navbar links to `/sign-in` (Clerk convention) and `/perfil`; neither route exists yet.

## Open Questions

- Footer links to `/contacto`, `/terminos`, and `/privacidad` — these pages are not defined in the context files yet.
- Brand casing: the v0 design brief uses "MILOCATIVA" while `project-overview.md` says "Mi Locativa" — the landing page follows the design brief ("MILOCATIVA").
- Hero trust stats ("+120 activos disponibles") are filler numbers from the design brief; replace with real counts once the catalog is live.

## Architecture Decisions

- Tailwind v4 CSS-first config (no tailwind.config.js) — all theme tokens live in globals.css via @theme inline.
- shadcn/ui components live in components/ui/ and must not be modified after installation.
- Light-only theme: petrol-blue (#0C5678) primary accent, teal and sky secondary accents; no .dark class toggle needed.
- Next.js 16 uses proxy.ts (not middleware.ts) — the middleware file convention was renamed in v16.
- No Prisma/ORM: Supabase Postgres accessed directly via RLS-scoped Supabase clients (browser and server), authorized through the Clerk JWT forwarded as the Authorization header.
- Role (admin | user) lives in Clerk publicMetadata, not a database table; RLS policies read it via auth.jwt() -> 'public_metadata' ->> 'role'.
- File storage (item photos, documents) uses Supabase Storage, not Vercel Blob.
- Realtime chat and in-app notifications use Supabase Realtime, not a third-party collaboration service.
- Payments: Stripe and MercadoPago, reconciled via verified webhooks in app/api; payment status is never set client-side.

## Session Notes

- Project uses Next.js 16, React 19, Tailwind v4, TypeScript.
- Light-only theme. All color tokens are CSS custom properties mapped via @theme inline.
- Tailwind utility classes: bg-base, bg-surface, bg-elevated, bg-subtle, text-copy-primary, text-copy-muted, border-surface-border, text-brand, bg-accent-dim, text-accent-teal, etc.
- @clerk/nextjs (Core 3, requires Next.js 15.2.3+) installed; auth file is proxy.ts, not middleware.ts.
- createRouteMatcher() is deprecated in this Clerk version — route protection uses inline pathname checks with auth.protect({ role }) instead.
- Clerk publicMetadata.role drives both the proxy.ts route gate and the Supabase RLS policies — keep both in sync per any role logic change.
- UI copy is entirely in Spanish, sourced from content/dictionary files; code identifiers are entirely in English camelCase.
