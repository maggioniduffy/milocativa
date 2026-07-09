# UI Context

## Theme

Light only. No dark mode. The visual language is a warm, airy marketplace surface — soft neutral backgrounds, generous white space, and a confident petrol-blue accent for interactive elements. This follows the Airbnb-style brief from the project overview: light, trustworthy, low-noise, built for browsing photos and listings comfortably.

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind tokens via `@theme inline`. Components must use these tokens — no hardcoded hex values or raw Tailwind color classes like `sky-*` or `slate-*`.

| Role                 | CSS Variable             | Hex / Value                     |
| -------------------- | ------------------------ | ------------------------------- |
| Page background      | `--bg-base`              | `#F7F9FA`                       |
| Surface              | `--bg-surface`           | `#FFFFFF`                       |
| Elevated surface     | `--bg-elevated`          | `#FFFFFF` (+ shadow, see below) |
| Subtle surface       | `--bg-subtle`            | `#EEF2F3`                       |
| Default border       | `--border-default`       | `#DCE3E5`                       |
| Subtle border        | `--border-subtle`        | `#C9D3D6`                       |
| Primary text         | `--text-primary`         | `#0B1F26`                       |
| Secondary text       | `--text-secondary`       | `#3E545C`                       |
| Muted text           | `--text-muted`           | `#6F8790`                       |
| Faint text           | `--text-faint`           | `#9FB2B8`                       |
| Brand accent         | `--accent-primary`       | `#0C5678` (petrol blue)         |
| Brand accent hover   | `--accent-primary-hover` | `#0A465F`                       |
| Brand dim            | `--accent-primary-dim`   | `rgba(12, 86, 120, 0.10)`       |
| Secondary accent     | `--accent-teal`          | `#0E8C7F`                       |
| Secondary accent dim | `--accent-teal-dim`      | `rgba(14, 140, 127, 0.10)`      |
| Tertiary accent      | `--accent-sky`           | `#3E8FB0`                       |
| Error                | `--state-error`          | `#D9483F`                       |
| Success              | `--state-success`        | `#1F9D6B`                       |
| Warning              | `--state-warning`        | `#D98E1E`                       |

Elevated surfaces use `--bg-surface` plus a soft shadow (`shadow-md`/`shadow-lg` from the Tailwind scale) rather than a darker fill — this keeps the light theme from muddying as depth increases.

Tailwind utility names map to these variables. Use `bg-base`, `bg-surface`, `text-copy-primary`, `text-copy-muted`, `border-surface-border`, `text-brand`, `bg-accent-dim`, `text-accent-teal`, etc.

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

### Category colors

| Category  | Fill (dim)                 | Text color | Character                 |
| --------- | -------------------------- | ---------- | ------------------------- |
| Estate    | `rgba(12, 86, 120, 0.10)`  | `#0C5678`  | Petrol blue (brand)       |
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

## Motion

Framer Motion is used for page transitions, card hover states, and modal/drawer entrances — subtle and physically plausible (spring-based, not linear), never decorative for its own sake. Typical durations: 150–250ms for micro-interactions (hover, tap feedback), 300–400ms for panel/modal transitions. Respect `prefers-reduced-motion`: fall back to opacity-only transitions when set.

## Icons

Lucide React. Stroke-based icons only — no filled variants. Icon sizes: `h-4 w-4` for inline, `h-5 w-5` for buttons, `h-8 w-8` for feature icons in empty states.
