# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

Public site foundation — landing, catalog, and building detail pages implemented with placeholder data. Clerk auth (sign-in/sign-up, role-based redirect, role provisioning) is now wired end to end.

## Current Goal

Wire the catalog and building pages to Supabase (real listings, buildings, and unit statuses).

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
- Catalog page at `/catalogo` and building detail at `/edificios/[slug]`, implemented from the Claude Design handoff (`context/designs/Milocativa landing page/design_handoff_milocativa/`):
  - `content/catalog.ts` and `content/building.ts` hold all Spanish copy plus placeholder buildings/products/units until Supabase powers the catalog.
  - `types/domain.ts` extended: `Category` now includes `parking`; added `UnitStatus` (`RentalStatus | available | external`), `UNIT_STATUS_COLORS` (with borders), `CATALOG_FILTER_COLORS`, and the external/parking hatch gradients.
  - `components/catalog/`: `catalogSearch.tsx` (expanded search + type/price/duración/disponibilidad filter row + compact navbar pill), `buildingsRail.tsx` (snap carousel with arrows, favorites, staggered "Mostrar todo" card), `productsGrid.tsx` + `productCard.tsx` (Airbnb-style cards, category dot badges, favorites, "Con cochera disponible" badge).
  - `components/building/`: `buildingDiagram.tsx` (interactive floor/unit cross-section with hover/tap popovers, inert hatched "No publicado" units, striped parking level, staggered riseIn entrance respecting `prefers-reduced-motion`), `statusLegend.tsx`, `buildingSummary.tsx` (sticky summary + CTA).
  - Navbar (`components/layout/navbar.tsx`) hosts the catalog search on `/catalogo`: past 40px scroll the search block collapses and a compact pill replaces the center links; clicking it scrolls back to top.
  - Type filter state lives in the `?categoria=` URL param (`hooks/useCatalogFilter.ts`), so the landing/footer links (`/catalogo?categoria=estate|machinery|service`) filter the grid directly; `useSearchParams` consumers are Suspense-wrapped so both routes stay static.
  - Catalog products reuse landing photos where they match; remaining covers are CSS gradient placeholders per the handoff (replace with real photos).
  - `context/designs/**` excluded from ESLint (prototype runtime files are reference-only).
- Landing reworked to match the Claude Design handoff (replacing the v0 look):
  - Navbar transparent at top → solid white + border + shadow past 24px scroll (all pages); brand mark now uses the petrol building-glyph tile.
  - Hero: radial petrol blob + SVG-grain overlay, pill badge with map pin, pill CTAs with arrow, dot-separated stat row, photo panel with deep shadow, staggered reveals.
  - "Nosotros" is a 3D `rotateX` hover/tap flip card (`aboutSection.tsx`); title accent uses Instrument Serif italic (`--font-serif-accent`, loaded via `next/font`); reduced motion crossfades instead of rotating.
  - Category cards use the icon-tile + title top-row layout; catalog preview cards are Airbnb-style (`listingCard.tsx`: dot badge, heart, star rating, price + availability status with success/warning tone) — new copy and six handoff listings in `content/home.ts`.
  - "Cómo funciona" lives in a large white rounded panel with a corner blob; footer got the rounded-top-corners + soft top shadow treatment.
  - `topo-bg.js` ported to `components/layout/topoBackground.tsx` (fixed animated topographic canvas behind landing + building pages; static frame under reduced motion).
  - `components/home/categoryBadge.tsx` removed (superseded by the inline dot badge).
- Product detail page at `/catalogo/[id]`, Airbnb-style single-listing layout, placeholder data:
  - `content/product.ts`: `ProductDetail` (description, quick facts, features, gallery photos) per catalog product id, joined to `CatalogProduct` via `getProductById`.
  - `components/product/`: `productGallery.tsx` (bento hero + up to 4 tiles, degrades to single hero photo or plain cover for products without extra photos), `productOverview.tsx` (quick facts row, description, features checklist, location note), `productBookingCard.tsx` (sticky price/rating card, local favorite toggle, "Iniciar conversación" CTA linking to `/sign-in`).
  - `productCard.tsx` now links to `/catalogo/[id]` instead of `#`.
  - No live chat/booking wired yet — CTA only routes to sign-in, matching the "auth flows not started" phase.
- Clerk auth (`/sign-in`, `/sign-up`), per `context/feature-specs/01-auth-page.md`:
  - Fixed a pre-existing bug: `proxy.ts` lived at the repo root, but with a `src/` layout Next.js only loads it from `src/proxy.ts` — Clerk's own middleware was silently never running (`auth()`/`currentUser()` threw). Moved it to `src/proxy.ts`; `/admin` gating (`auth.protect({ role: "admin" })`) now actually executes. No other change to its logic.
  - `src/app/layout.tsx` wraps the app in `<ClerkProvider>` with a shared `appearance` (`lib/clerk/appearance.ts`, tokenized via CSS vars — no hardcoded hex) and `localization` (`content/auth.ts` — full Spanish override of Clerk's default English copy for the OAuth/OTP/password flows actually in use). `localization`/global `appearance` are ClerkProvider-only props in this Clerk version (7.x) — `<SignIn/>`/`<SignUp/>` no longer take a `localization` prop directly.
  - `src/app/auth/redirect/page.tsx`: default post-auth landing (used when no `redirect_url` was carried over) — reads `publicMetadata.role` via `currentUser()` and redirects to `/admin` or `/catalogo` per `lib/clerk/redirects.ts::ROLE_HOME_ROUTE`; missing role defaults to `user`.
  - `src/app/api/webhooks/clerk/route.ts`: verifies the `user.created` webhook (`verifyWebhook` from `@clerk/nextjs/webhooks`, keyed by `CLERK_WEBHOOK_SIGNING_SECRET`) and sets `publicMetadata.role = "user"` on new sign-ups — the only place `role` is ever written server-side; no admin self-signup path exists.
  - `types/domain.ts` gained `Role = "admin" | "user"`, matching the existing `publicMetadata.role` convention from `architecture-context.md`.
  - `components/product/productBookingCard.tsx`'s "Iniciar conversación" CTA now links to `/sign-in?redirect_url=<current item path>` (via `usePathname()`) instead of a bare `/sign-in`, so the round trip back to the item page works once real gating exists.
  - `lib/supabase/client.ts` / `server.ts` already forward the Clerk session token with no `template` argument — correct for Clerk's native Supabase integration (no per-code-side template wiring needed); the `public_metadata` claim itself must still be added to the session token in the Clerk dashboard (see Next Up).
- Auth page visual pass per `context/designs/Auth-page/design_handoff_ingresar/README.md` (split-screen "Ingresar/Crear cuenta" design, high-fidelity):
  - `/sign-in` and `/sign-up` (`src/app/sign-in/page.tsx`, `src/app/sign-up/page.tsx`) are now plain (non-catch-all) routes rendering `components/auth/authShell.tsx`, since Clerk 7's `<SignIn/>`/`<SignUp/>` no longer support `routing="virtual"` (that value was dropped from the actual component prop type even though `RoutingStrategy` still lists it) — omitting `path`/`routing` entirely gives the same self-contained, non-file-routed widget the design needs.
  - `components/auth/authShell.tsx`: two-column split screen (`min-[900px]:grid-cols-[...]`, photo panel hidden below 900px) — left column has the brand header + `TopoBackground` (new `variant="absolute"` prop scopes the existing fixed/viewport canvas to a panel instead) + `authPanel.tsx`; right column is `authPhotoPanel.tsx`.
  - `components/auth/authPanel.tsx` (client): our own tab toggle (`login`/`signup`, pill segmented control) mounts either `<SignIn/>` or `<SignUp/>` — clicking the tab or the bottom switch-prompt just flips local state, no navigation. Clerk's own built-in footer is hidden (`appearance.elements.footer: "hidden"`) since this custom switch prompt replaces it. Clerk's own `header`/title/subtitle (localized) are kept for each internal screen (start/password/forgotPassword/emailCode); our own "eyebrow" label sits above since Clerk has no eyebrow slot.
  - `components/auth/authPhotoPanel.tsx`: reuses `public/images/hero-anelo.png` (no separate Vaca Muerta photo asset exists) with the design's exact gradient overlays, pill badge, serif-italic heading accent, and stat row from `content/auth.ts`.
  - **Deliberate gap vs. the design**: the design's pre-submit "Contraseña / Código por email" segmented control (choosing a sign-in strategy *before* entering an email) isn't implemented — Clerk's `<SignIn/>` only offers a strategy choice *after* the identifier is submitted; doing it beforehand would require dropping to headless `useSignIn()`/`useSignUp()` hooks, which conflicts with `01-auth-page.md`'s explicit "use `<SignIn/>`/`<SignUp/>`, not custom flows" instruction. User confirmed: drop the toggle, keep the prebuilt components. Clerk's own post-submit method choice still works.
  - Also not implemented (Clerk has no themeable slot for it): the 52×52 icon badge (lock/mail) on the forgot-password/OTP screens.

## In Progress

## Next Up

- Wire `/catalogo` and `/edificios/[slug]` to Supabase: listings, buildings, per-unit rental statuses; replace in-memory favorites with real user state.
- Price / Duración / Disponibilidad filter dropdowns and the search input are visual stubs — define their behavior and implement.
- `/perfil` route doesn't exist yet (navbar links to it already).
- Configure the real Clerk instance: set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` in `.env.local` (currently blank — Clerk auto-falls back to a temporary keyless dev instance), add a `user.created` webhook endpoint pointing at `/api/webhooks/clerk` in the Clerk dashboard and copy its signing secret into `CLERK_WEBHOOK_SIGNING_SECRET`, and add a `public_metadata` custom claim (`{{user.public_metadata}}`) to the session token so RLS can read `auth.jwt() -> 'public_metadata' ->> 'role'`.
- Gate the actual "start a conversation" / "request a rental" actions (not built yet) behind an auth check once those features exist — today only the product page's "Iniciar conversación" CTA sends unauthenticated visitors through `/sign-in?redirect_url=...`.

## Open Questions

- Footer links to `/contacto`, `/terminos`, and `/privacidad` — these pages are not defined in the context files yet.
- Brand casing: the v0 design brief uses "MILOCATIVA" while `project-overview.md` says "Mi Locativa" — the landing page follows the design brief ("MILOCATIVA").
- Hero trust stats ("+120 activos disponibles") are filler numbers from the design brief; replace with real counts once the catalog is live.
- Only Torre Añelo has building detail data, so every building card links to `/edificios/torre-anelo` for now (the design prototype does the same); real slugs need per-building unit data from Supabase.
- Product detail pages now exist at `/catalogo/[id]` for catalog products; building unit blocks (`buildingDiagram.tsx`) still link to `#` since building units aren't in the catalog product id space yet.
- `01-auth-page.md` names `/sign-in` + `/sign-up` in its "Routes" section but Spanish paths (`/iniciar-sesion`, `/registrarse`) in its "Check when done" section. Went with `/sign-in` / `/sign-up`: they already matched `.env.local` (`NEXT_PUBLIC_CLERK_SIGN_IN_URL`/`SIGN_UP_URL`) and the existing navbar/product-page links before this feature started.

## Architecture Decisions

- Tailwind v4 CSS-first config (no tailwind.config.js) — all theme tokens live in globals.css via @theme inline.
- shadcn/ui components live in components/ui/ and must not be modified after installation.
- Light-only theme: petrol-blue (#0C5678) primary accent, teal and sky secondary accents; no .dark class toggle needed.
- Next.js 16 us- Hero trust stats ("+120 activos disponibles") are filler numbers from the design brief; replace with real counts once the catalog is live.
  es proxy.ts (not middleware.ts) — the middleware file convention was renamed in v16.
- No Prisma/ORM: Supabase Postgres accessed directly via RLS-scoped Supabase clients (browser and server), authorized through the Clerk JWT forwarded as the Authorization header.
- Role (admin | user) lives in Clerk publicMetadata, not a database table; RLS policies read it via auth.jwt() -> 'public_metadata' ->> 'role'.
- File storage (item photos, documents) uses Supabase Storage, not Vercel Blob.
- Realtime chat and in-app notifications use Supabase Realtime, not a third-party collaboration service.
- Payments: Stripe and MercadoPago, reconciled via verified webhooks in app/api; payment status is never set client-side.
- Maps: MapLibre GL JS + open vector tiles (not Google Maps / Mapbox) — custom "keen style" achieved by editing the vector style JSON directly with project design tokens, no per-request cost.
- ParkingSpot (cochera) is a new ObjectItem subtype — rentable standalone or bundled with an Estate in the same Rental.
- Building groups Estates and ParkingSpots via an optional buildingId (nullable — standalone properties don't need a Building record).
- Rental no longer maps 1:1 to a single Item — bundled rentals go through a rental_items join table; always read/write through it, never through a single itemId on Rental.
- Estate carries latitude/longitude, captured at listing creation/edit time, as the source of truth for map markers.
- `proxy.ts` must live at `src/proxy.ts` (not the repo root) because the project uses a `src/` layout — this is a Next.js 16 file-location rule, distinct from the middleware.ts→proxy.ts rename already noted below.
- New sign-ups get `role: "user"` written server-side by a Clerk `user.created` webhook (`app/api/webhooks/clerk`), not client-side — `publicMetadata` can't be set from the client.

## Session Notes

- Project uses Next.js 16, React 19, Tailwind v4, TypeScript.
- Light-only theme. All color tokens are CSS custom properties mapped via @theme inline.
- Tailwind utility classes: bg-base, bg-surface, bg-elevated, bg-subtle, text-copy-primary, text-copy-muted, border-surface-border, text-brand, bg-accent-dim, text-accent-teal, etc.
- @clerk/nextjs (Core 3, requires Next.js 15.2.3+) installed; auth file is proxy.ts, not middleware.ts.
- createRouteMatcher() is deprecated in this Clerk version — route protection uses inline pathname checks with auth.protect({ role }) instead.
- Clerk publicMetadata.role drives both the proxy.ts route gate and the Supabase RLS policies — keep both in sync per any role logic change.
- UI copy is entirely in Spanish, sourced from content/dictionary files; code identifiers are entirely in English camelCase.
