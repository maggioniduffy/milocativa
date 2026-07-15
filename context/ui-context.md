# UI Context

## Theme

Light (default) and dark, toggled by the user. The visual language is a warm, airy marketplace surface — soft neutral backgrounds, generous white space, and a confident petrol-blue accent for interactive elements. This follows the Airbnb-style brief from the project overview: light, trustworthy, low-noise, built for browsing photos and listings comfortably; dark mode reproduces the same hierarchy on a deep petrol-navy ground.

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `sky-*` or `slate-*`. Light values live on `:root`; dark overrides live on `html[data-theme="dark"]` — every token is defined explicitly in both blocks, none is left to fall back.

| Role                  | CSS Variable              | Light                           | Dark                        |
| --------------------- | -------------------------- | -------------------------------- | ---------------------------- |
| Page background       | `--bg-base`               | `#F7F9FA`                       | `#0A141B`                   |
| Surface                | `--bg-surface`            | `#FFFFFF`                       | `#101E29`                   |
| Elevated surface       | `--bg-elevated`           | `#FFFFFF` (+ shadow, see below) | `#101E29` (+ shadow)        |
| Subtle surface         | `--bg-subtle`             | `#EEF2F3`                       | `#16262F`                   |
| Default border         | `--border-default`        | `#DCE3E5`                       | `#223440`                   |
| Subtle border          | `--border-subtle`         | `#C9D3D6`                       | `#33505C`                   |
| Primary text           | `--text-primary`          | `#0B1F26`                       | `#EAF2F5`                   |
| Secondary text         | `--text-secondary`        | `#3E545C`                       | `#A9BCC4`                   |
| Muted text             | `--text-muted`            | `#6F8790`                       | `#7F97A0`                   |
| Faint text             | `--text-faint`            | `#9FB2B8`                       | `#5C7079`                   |
| Brand accent           | `--accent-primary`        | `#03597F` (petrol blue)         | `#3E9BC7`                   |
| Brand accent hover     | `--accent-primary-hover`  | `#0A465F`                       | `#5FB2D8`                   |
| Brand dim              | `--accent-primary-dim`    | `rgba(3, 89, 127, 0.10)`       | `rgba(62, 155, 199, 0.16)`  |
| Secondary accent       | `--accent-teal`           | `#0E8C7F`                       | `#2FC7AC`                   |
| Secondary accent dim   | `--accent-teal-dim`       | `rgba(14, 140, 127, 0.10)`      | `rgba(47, 199, 172, 0.16)`  |
| Tertiary accent        | `--accent-sky`            | `#3E8FB0`                       | `#5FAFC9`                   |
| Error                  | `--state-error`           | `#D9483F`                       | `#E2645A`                   |
| Success                | `--state-success`         | `#1F9D6B`                       | `#3BC98C`                   |
| Warning                | `--state-warning`         | `#D98E1E`                       | `#E0A542`                   |

Elevated surfaces use `--bg-surface` plus a soft shadow (`shadow-md`/`shadow-lg` from the Tailwind scale) rather than a darker fill — this keeps the theme from muddying as depth increases, in both light and dark.

Tailwind utility names map to these variables. Use `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-accent-teal`, etc.

### Theme switching

- Switching is attribute-based: `document.documentElement.setAttribute('data-theme', 'dark' | 'light')` — no class toggling, no JS-driven inline styles. Implemented in [useTheme.ts](../src/hooks/useTheme.ts).
- Preference is read from `localStorage` (key `milocativa-theme`) on load, falling back to `window.matchMedia('(prefers-color-scheme: dark)')` when unset. An inline `beforeInteractive` script in [layout.tsx](../src/app/layout.tsx) applies the attribute before hydration to avoid a flash of the wrong theme; the `<html>` element carries `suppressHydrationWarning` for this reason.
- The toggle lives in the navbar ([themeToggle.tsx](../src/components/layout/themeToggle.tsx)): a 38×38px circular button showing a moon (switch to dark) or sun (switch to light) icon — the icon shown is the theme you'd switch *to*.
- `html[data-theme="dark"] img { filter: brightness(.94) contrast(1.02); }` keeps photography from blowing out against the dark background.

## Content Language

UI copy, labels, dates, and all user-facing strings are written in **Spanish** (Argentina locale conventions — e.g. `DD/MM/AAAA`, `$` with `.` as thousands separator). Copy lives in dedicated content/dictionary files, never inline as hardcoded strings mixed into component logic, so translation or wording changes never require touching component code. All code identifiers (component names, props, functions, variables) stay in English camelCase regardless of the Spanish copy they render.

## Typography

| Role      | Font              | CSS Variable          |
| --------- | ----------------- | --------------------- |
| UI text   | Plus Jakarta Sans | `--font-jakarta-sans` |
| Code/mono | Geist Mono        | `--font-geist-mono`   |

Both fonts are loaded via `next/font/google` and applied as CSS variables on the `<html>` element. The base `body` uses Plus Jakarta Sans with `antialiased`. Plus Jakarta Sans was chosen over a purely geometric sans for its warmer, slightly rounded letterforms — closer to the friendly, human tone the Airbnb-style brief calls for than a strictly technical typeface.

## Border Radius

Radius increases with surface depth — smaller for inline elements, larger for outer containers. Rounded, soft corners throughout reinforce the approachable, non-technical feel.

| Context               | Class          |
| --------------------- | -------------- |
| Inline / small UI     | `rounded-lg`   |
| Cards / listing tiles | `rounded-2xl`  |
| Modal / overlay       | `rounded-3xl`  |
| Avatar / pill badges  | `rounded-full` |

## Category and Status Color System

Instead of a canvas node palette, the domain-specific visual system here is **category tagging** (what kind of item) and **status badges** (where a rental stands). Both are defined in `types/domain.ts` as `CATEGORY_COLORS` and `RENTAL_STATUS_COLORS`.

## Map Style

The property map uses a minimal "keen style" vector map — low-detail, low-noise, consistent with the rest of the light theme. Defined as a MapLibre style JSON in `lib/map/style.ts`.

| Map element       | Token / Value                                                                                  |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| Land background   | `--bg-subtle`                                                                                  |
| Water             | `--accent-primary-dim`                                                                         |
| Major streets     | `--border-subtle`                                                                              |
| Minor streets     | `--border-default` (thinner stroke)                                                            |
| Labels            | `--text-muted`, small size, sparse                                                             |
| Marker (default)  | `--accent-primary` pin, white icon                                                             |
| Marker (hover)    | `--accent-primary-hover`, scales up ~1.15x with a spring transition, elevates with `shadow-md` |
| Marker (selected) | `--accent-teal` pin, stays elevated while its listing card is open                             |

No satellite imagery, no 3D buildings, no traffic layers — the map is a lightweight locator, not a navigation tool. Zoom is constrained to the Añelo / Vaca Muerta area by default.

## Building Visualization

A building's page shows an interactive floor/unit diagram: a simple stacked-floor layout where each unit is a clickable block colored by its `Listing`/`Rental` status (reusing `RENTAL_STATUS_COLORS`). Hovering a unit reveals a compact popover with title, price, and availability; clicking opens the item detail page. Layout is vertical on mobile (floors stack top to bottom, scrollable) and can show floors side-by-side on desktop when the building is small enough.

### Category colors

| Category  | Fill (dim)                 | Text color | Character                 |
| --------- | -------------------------- | ---------- | ------------------------- |
| Estate    | `rgba(3, 89, 127, 0.10)`  | `#03597F`  | Petrol blue (brand)       |
| Machinery | `rgba(217, 142, 30, 0.12)` | `#B8720F`  | Amber — industrial, heavy |
| Service   | `rgba(14, 140, 127, 0.10)` | `#0E8C7F`  | Teal — operational        |

### Rental status colors

| Status    | Fill (dim)                  | Text color | Meaning                  |
| --------- | --------------------------- | ---------- | ------------------------ |
| Requested | `rgba(63, 143, 176, 0.12)`  | `#3E8FB0`  | Awaiting admin response  |
| Accepted  | `rgba(14, 140, 127, 0.12)`  | `#0E8C7F`  | Confirmed, pending start |
| Active    | `rgba(31, 157, 107, 0.12)`  | `#1F9D6B`  | Currently in progress    |
| Completed | `rgba(111, 135, 144, 0.12)` | `#6F8790`  | Finished, closed out     |
| Cancelled | `rgba(217, 72, 63, 0.10)`   | `#D9483F`  | Declined or cancelled    |

Badges always pair a dim background with the matching saturated text color — never a solid fill with white text — to stay consistent with the light theme's low-contrast, airy character.

## Component Library

shadcn/ui on top of Tailwind. No custom design system. Components live in `components/ui/`. Use the `shadcn` CLI to add new components rather than writing them from scratch.

## Layout Patterns

- Catalog page: sticky filter bar at top (type, price, contract length, availability), responsive grid of listing cards below — 1 column on mobile, up to 4 on desktop.
- Item detail page: large image gallery, sticky booking/contact panel on desktop, key details and availability calendar in the main column.
- Chat panel: slide-over on mobile, persistent right-hand panel on desktop when viewing an item with an active conversation.
- Admin panel: left navigation rail (inbox, listings, rentals), content area with data tables and detail drawers.
- Modals and dialogs: centered overlay, `rounded-3xl`, white background with backdrop blur over a dimmed page.
- Navbar: sticky top bar, white background, subtle bottom border, elevates with a soft shadow on scroll.

## Responsiveness

Every page is mobile-first: base (unprefixed) classes target small phones (~360px wide) and scale up via `sm:`/`lg:` — never the reverse. Concretely:

- Type scale steps down on mobile: page titles `text-3xl sm:text-4xl lg:text-5xl`, section headings `text-2xl sm:text-3xl`, lead paragraphs `text-base sm:text-lg`.
- Section vertical padding tightens on mobile: `py-12 sm:py-16 lg:py-20`-style progressions.
- CTA buttons are full-width on mobile (`w-full sm:w-auto`), stacked in a column (`flex-col gap-3 sm:flex-row`).
- Section headers with a trailing action ("Ver todo") stack vertically on mobile instead of squeezing side by side.
- Nothing may cause horizontal overflow at 360px; wide content scrolls inside its own container, never the page.

## Motion

Framer Motion is used for page transitions, card hover states, and modal/drawer entrances — subtle and physically plausible (spring-based, not linear), never decorative for its own sake. Typical durations: 150–250ms for micro-interactions (hover, tap feedback), 300–400ms for panel/modal transitions. Respect `prefers-reduced-motion`: fall back to opacity-only transitions when set.

## Icons

Lucide React. Stroke-based icons only — no filled variants. Icon sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons, `h-8 w-8` for feature icons in empty states.
