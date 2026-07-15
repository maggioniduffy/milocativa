# Memory Log

## 2026-07-14

### Profile Dashboard Redesign + Header User Cluster
- **Source**: AIDesigner "page 3" mock (member dashboard). Scope confirmed with the user as **design-only, empty states** — no rentals query, no fabricated rows, notification bell is a visual placeholder.
- **`/profile`** (`app/(app)/profile/page.tsx`, still a server component, same `auth()` + `ensurePerson()` data): two-column layout — left profile card (`lg:sticky`; avatar via plain `<img>` from `person.avatar_url ?? user.imageUrl`, name, `company_name` subtitle, static "Usuario Verificado" pill, email/phone rows, `EditProfileButton`) and right main column (greeting, 3 stat cards with `0` counts, `Mis Alquileres/Historial/Pagos` tabs). Mobile-first: stacks + 1-up stats at ~360px.
- **New `components/profile/`**: `rentalCard.tsx` (presentational `RentalCard`/`RentalCardData`, reuses `RENTAL_STATUS_COLORS`/`CATEGORY_COLORS`/`catalogContent.categoryTags`, status-dependent placeholder actions), `rentalsTabs.tsx` (`"use client"` tab switch fed `rentals={[]}` → per-tab empty states), `editProfileButton.tsx` (`"use client"`, `useClerk().openUserProfile()` — reuses Clerk's account modal, no new route).
- **Header**: new `components/layout/userMenu.tsx` (`"use client"`) renders the signed-in cluster — notification bell (static unread dot, no backend) + avatar pill (`useUser().imageUrl`) opening an account `Sheet` (nav links + Perfil + Cerrar sesión) on all breakpoints. `navbar.tsx` uses it for signed-in users; signed-out header unchanged.
- **Content**: `content/profile.ts` extended (greeting, stats, tabs, card labels, `rentalStatusLabels`); `content/site.ts` got `nav.notifications`/`nav.accountMenu`.
- **Open items logged in progress-tracker**: notifications system missing (bell + "Mensajes Nuevos" are placeholders); `people` has no job-title/verified/location fields (subtitle falls back to `company_name`, verified pill is decorative, location row dropped).
- **Verification**: `tsc --noEmit` + ESLint clean on touched files.

### Responsive Catalog Filters and Scroll-Aware Brand Logo
- **Responsiveness**: Replaced the horizontal scrolling filter buttons on mobile/tablet viewports in `/catalogo` with a single "Filtros" button to prevent wrapping and overflow on smaller screens.
- **Filters Popup**: Added a custom slide-out popup `<Sheet>` (`side="right"`) containing all search filters: Categories (matching theme colors), Price Range inputs (Min/Max), Contract Duration selection, and Availability selection.
- **Active Indicators**: Implemented active filter states inside the popup. Added a visual badge indicator dot to the mobile "Filtros" trigger button when any filters are active, along with a "Limpiar todo" reset link.
- **Desktop Layout**: Set desktop filter buttons to only show at `md` and above, styled with `flex-nowrap` to prevent any wrapping.
- **Scroll-Aware Brand**: Modified the logo rendering in `<BrandMark />` and `<Navbar />` to accept a `hideText` prop when `showCompactPill` is active. When scrolled past the threshold on `/catalogo`, the "MILOCATIVA" text hides only on mobile viewports (below `md`), leaving only the icon to free space for the search bar, while remaining visible on desktop.
- **Log Out Button Styling**: Applied subtle red tones to both desktop and mobile log out controls. On desktop, uses muted text-error (`text-error/80 hover:text-error`) for the text and icon. On mobile, changes the button component to the custom shadcn `destructive` variant (`bg-destructive/10 text-destructive hover:bg-destructive/20`).
- **Carousel Mobile Margins**: Added `scroll-ml-4 sm:scroll-ml-0` to `BuildingCard` and `ShowAllCard` in `buildingsRail.tsx` to align scroll snapping positions with the page margins, solving the missing left margin on mobile views.
- **Verification**: Ran `npm run build` to confirm successful build and TypeScript checks.

## 2026-07-15

### Items Split (Class-Table Inheritance) + Admin Panel Listados
- **Migration `0011_split_items_by_subtype.sql`** (applied via psql): `items` keeps only common columns (`id`, `item_kind`, `title`, `description`, `base_price`, `price_unit`, `status`, `category_id`, timestamps); new 1:1 tables `estates`/`machinery`/`services`/`parking_spots` (`item_id` PK+FK, ON DELETE CASCADE) carry subtype columns — `location`/`condition` went to the three ObjectItem tables, `latitude`/`longitude` to estates, `building_id` to estates + parking_spots. RLS mirrors items (published-listing public read + admin-only writes), explicit grants per the 0003 pattern. The remote `items` table was empty (earlier "Torre Añelo" data had been rolled back), so the INSERT-before-DROP data copy was a verified no-op. No code consumed the moved columns.
- **Migration `0012`**: `save_item_with_subtype(p_item_id, p_item jsonb, p_subtype jsonb)` RPC — SECURITY INVOKER (admin RLS is the real gate), writes items + subtype row atomically, item_kind immutable on update; also seeds the 3 base categories (Inmuebles/Maquinarias/Servicios).
- **Admin panel Listados** (`/admin` → `/admin/listings`, English routes per standing convention): layout with nav rail (Inbox/Alquileres disabled "Próximamente"), real-data table (kind/status badges, es-AR price, publish + featured optimistic switches → `listings` upsert server actions), create/edit form with subtype-driven fields. Copy in `content/admin.ts`; server actions re-check the admin claim before mutating.
- **Base UI (this project's shadcn base) gotchas**: `Select` needs an `items` value→label map or `SelectValue` shows raw values; link Buttons need `nativeButton={false} render={<Link/>}`; `<fieldset>` default `min-width: min-content` overflows 360px → add `min-w-0`.
- **Clerk instance changes**: set `role: "admin"` on fausmaggioni5@gmail.com and `role: "user"` on the est.fi.uncoma account (no admin existed). Session claim `public_metadata` was already configured; Supabase Third-Party Auth confirmed working.
- **Verification**: real headless-Chrome sessions via Clerk sign-in tokens at 360px — created all 4 subtypes through the form (rows verified in DB), publish switch created a `published` listing row, edit prefilled + persisted, non-admin redirected to `/`, no horizontal overflow. E2E rows deleted after (cascade verified). `npm run build` + ESLint clean.

### Listados: Create/Edit Sheet (02-3-post)
- Replaced the `/admin/listings/new` + `[id]` pages with a right-side Sheet on the list view: `components/admin/listingsSection.tsx` (client, owns sheet state + dirty-guard via `window.confirm`), list page now also fetches the 4 subtype tables so edit opens prefilled; `listingsTable` uses an `onEdit` callback.
- Spec assumed the Server Action already used zod — it didn't. Extracted shared schemas to `lib/validation/item.ts` (string-based, Spanish messages from `content/admin.ts`); the action and the client form both use them (inline per-field errors, cleared on edit, server re-validates returning `fieldErrors`).
- Minimal action extensions (flagged): returns `{success: true}` instead of redirect (sheet closes; `revalidatePath` refreshes), and handles the in-form publish toggle (publish upserts `listings` + `published_at`; unpublish only touches existing rows). Submit label: "Publicar"/"Guardar".
- E2E-verified with a real admin session at 360px (validation, kind-switch field persistence, all 4 subtypes, publish, edit-no-duplicate, discard confirm). Test rows deleted. Build/lint/tsc clean.
