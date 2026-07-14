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
