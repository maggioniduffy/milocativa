# Handoff: Mi Locativa — Marketplace de alquileres (Vaca Muerta / Añelo)

## Overview
Mi Locativa is a rental marketplace for the Vaca Muerta oil & gas region (Añelo, Neuquén, Argentina). It lists four item types — **Estate** (inmuebles), **Machinery** (maquinaria), **Service** (servicios) and **ParkingSpot** (cocheras, rentable standalone or bundled with an Estate). Some Estates belong to a **Building** (edificio) that groups several units and has its own page.

This bundle contains three connected pages:
1. **Landing** (`MILOCATIVA Landing.dc.html`) — marketing home with hero, category cards, a catalog preview and an "about" flip card.
2. **Catálogo** (`Catalogo.dc.html`) — main catalog: search + filters, Edificios carousel, Productos grid.
3. **Edificio** (`Edificio.dc.html`) — building detail: header + interactive floor/unit cross-section diagram + status legend.

The UI copy is **Spanish**; all code identifiers are **English camelCase**.

## About the Design Files
The files in this bundle are **design references authored in HTML** (a lightweight streaming component format called "DC"). They are prototypes that show intended look and behavior — **not production code to copy directly**. The task is to **recreate these designs in the target codebase's environment** (the brief targets **React + Tailwind + shadcn/ui + Framer Motion + lucide-react**) using its established patterns. If no environment exists yet, pick that stack (it is what the design was speced against) and implement there.

Ignore the `.dc.html` mechanics (`<x-dc>`, `renderVals()`, `<sc-for>`, `<x-import>`, `support.js`). They are just the prototyping runtime. Read them for **structure, exact values, and behavior**, then rebuild with real components.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and interactions are all present and intended to be matched pixel-closely, using the codebase's own component library where equivalent (shadcn/ui).

---

## Design Tokens

### Color
| Role | Hex / value |
|---|---|
| Page background | `#F7F9FA` |
| Surface | `#FFFFFF` |
| Primary accent (petrol blue) | `#03597F` · hover `#0A465F` · dim `rgba(3, 89, 127,0.10)` |
| Secondary accent (teal) | `#0E8C7F` |
| Tertiary accent (sky) | `#3E8FB0` |
| Amber (machinery) | `#B57614` / `#B8720F` · tint `rgba(217,143,42,0.14)` |
| Text primary | `#0B1F26` |
| Text secondary | `#3E545C` |
| Text muted | `#6F8790` |
| Text faint | `#9FB2B8` |
| Border default | `#DCE3E5` |
| Border subtle | `#C9D3D6` |
| Neutral panel | `#EEF2F3` / `#E4EAEC` |

### Rental status colors (building page)
| Status | Background | Text |
|---|---|---|
| Requested (Solicitado) | `rgba(63,143,176,0.12)` | `#3E8FB0` |
| Accepted (Aceptado) | `rgba(14,140,127,0.12)` | `#0E8C7F` |
| Active (Activo) | `rgba(31,157,107,0.12)` | `#1F9D6B` |
| Completed (Completado) | `rgba(111,135,144,0.12)` | `#6F8790` |
| Cancelled (Cancelado) | `rgba(217,72,63,0.10)` | `#D9483F` |
| Available (Disponible) | `#FFFFFF`, subtle border `#C9D3D6`, no tint | `#3E545C` |
| External / No publicado | diagonal hatch `repeating-linear-gradient(45deg,#F2F5F6 0 6px,#E9EEEF 6px 12px)`, border `#DCE3E5` | `#9FB2B8` — **non-interactive** |

### Category → tag color
Estate `#03597F` · Machinery `#B57614` · Service `#0E8C7F` · ParkingSpot `#03597F` (outline variant).

### Typography
- Font: **Plus Jakarta Sans** (400/500/600/700/800). Display italic accents use **Instrument Serif** (italic) on the landing only.
- Headings 700–800, tight letter-spacing (`-0.01em`…`-0.02em`).
- Card titles 15–17px/700; body 13–15px; captions 12–13px.

### Radius
inline/controls `999px` (pills) · cards / image tiles `16–18px` · large panels `24–48px` · modals `24px`.

### Shadow
- card rest `0 1px 4px rgba(11,31,38,.06)`
- card hover `0 14px 32px rgba(11,31,38,.18)`
- elevated/nav `0 8px 24px rgba(11,31,38,.06)`
- popover `0 16px 40px rgba(11,31,38,.35)` (dark popover on `#0B1F26`)

### Motion
Spring-ish, `cubic-bezier(.22,1,.36,1)` for reveals/panels (300–400ms) and `cubic-bezier(.34,1.56,.64,1)` for playful pop (150–250ms micro). Respect `prefers-reduced-motion` → opacity-only.

### Icons
lucide-react, stroke-only. Used: `building-2`, `map-pin`, `search`, `sliders-horizontal`, `calendar`, `clock`, `chevron-down/left/right`, `heart`, `star`, `square-parking`, `user`, `arrow-right`, `arrow-left`.

---

## Screens / Views

### 1. Landing (`MILOCATIVA Landing.dc.html`)
- **Navbar** (sticky): logo mark (petrol rounded square + "MILOCATIVA") · center nav (Inicio / Catálogo / Cómo funciona / Nosotros) · Perfil + Ingresar. Transparent at top; on scroll >24px it becomes solid white with bottom border `#DCE3E5` and shadow.
- **Hero**: pill badge, big H1 (`clamp(34px,4.6vw,56px)`), subcopy, two CTAs (solid petrol + outlined), stat row, and a `.washed`/image-slot photo panel with soft radial blobs. Scroll-reveal on children (staggered translateY).
- **Category cards** (3): icon tile + Spanish title in one top row (no English tag), short description. Grid `minmax(260px,1fr)`, padding `18px 20px`, gap `10px`. Hover lifts `translateY(-5px)` + shadow.
- **Catalog preview** (6 cards): **Airbnb-style** — rounded image tile (`aspect-ratio: 1 / 0.92`, radius 16), top-left white pill badge with color dot (category), top-right decorative heart button; below the image (no container): title + star rating on one row, `Añelo, Neuquén`, then price + availability status. Whole card lifts on hover; image shadow deepens.
- **About flip card** ("Nosotros"): a 3D `rotateX` flip. Front `#F4F8F9` centered title ("Una empresa local *para un negocio exigente*"). On hover it flips to a white back showing the title smaller **above** a left-aligned, non-bold description paragraph.
- **Footer**: brand blurb + Empresa / Catálogo / Legal link columns + copyright row. White panel, top corners radius 48px.

### 2. Catálogo (`Catalogo.dc.html`)
- **Navbar + search (Airbnb-style collapse)**: At top the navbar shows logo + center nav links + Perfil/Ingresar, and **below it** an expanded block with a big search pill (input + "Buscar" button) and a filters row. On scroll >40px: the expanded block collapses upward (max-height→0, fade, translateY) and the center nav links are replaced by a **compact search pill** ("`<tipo activo>` · Precio · Buscar 🔍") inside the navbar; clicking it smooth-scrolls to top and re-expands. Navbar also goes solid white with shadow on scroll.
- **Filters**: item-type segmented control (Todos / Inmuebles / Maquinaria / Servicios / Cocheras) — each option has a **color dot** matching its category, and when active the pill fills with that category color (white text). Plus Precio, Duración, Disponibilidad dropdown buttons and a live `N resultados` count. (Filter is functional: selecting a type filters the Productos grid.)
- **Edificios rail** (horizontal carousel): header "Edificios" + "Ver todos" + **‹ › arrow buttons** that `scrollBy` the rail. Scrollbar hidden. Building cards are Airbnb-style (image `aspect-ratio: 3/2`, availability badge top-left "`3 disponibles de 8`", heart top-right, name + address below). A final **"Mostrar todo"** card shows three stacked mini-photos that **animate in one-by-one** (staggered `fanIn` pop). Cards link to the Edificio page.
- **Productos grid**: responsive `minmax(230px,1fr)`, gap `24px 20px`. Airbnb-style item cards (see Landing preview) with category color badge, functional heart favorite (fills `#D9483F` when on), star rating, price + unit, and — for Estates with a bundled cochera — an inline "Con cochera disponible" badge (`square-parking` icon).

### 3. Edificio (`Edificio.dc.html`)
- **Header**: back link "Volver al catálogo", "Edificio" pill, building name (H1), address with map-pin, short description. Same navbar scroll effect as the landing.
- **Interactive cross-section**: a stack of floors (top floor first) inside a white rounded panel. Each floor row = floor label chip + a grid of clickable **unit blocks** colored by rental status. A visually distinct **parking level** at the base uses a 45° striped texture with small clickable bays (C1…C5).
  - **Hover (desktop)** on a unit shows a dark popover above it: `Depto 4B` / `$450.000/mes` / availability note. **Tap (mobile)** toggles the same popover.
  - Units navigate to the item detail page (stubbed `#`).
  - **External / "No publicado"** units (other owners) render with the hatch texture, muted text, default cursor, **no popover, no navigation, no hover-lift**.
  - Entrance: floors + parking fade/slide up with staggered delay (`riseIn`); `prefers-reduced-motion` → opacity only.
- **Legend**: Disponible / Solicitado / Aceptado / Activo / Completado / No publicado swatches.
- **Side summary** (sticky): unidades totales, disponibles ahora, cocheras libres + "Consultar disponibilidad" CTA.
- **Footer**: same as landing/catalog.

---

## Interactions & Behavior
- **Navbar scroll transition** (all pages): solid/transparent + shadow past a scroll threshold.
- **Catalog search collapse**: expanded search ↔ compact navbar pill (see Catálogo above).
- **Type filter**: updates the visible Productos set and the result count; active pill takes the category color.
- **Favorites**: heart toggles per item id (catalog products + building cards); filled `#D9483F` when active. Prototype state is in-memory — back it with real user state.
- **Edificios rail arrows**: `scrollBy(±680px, smooth)`; scrollbar hidden; scroll-snap on cards.
- **"Mostrar todo" card**: three mini-photos animate in staggered (`fanIn`, delays .1/.24/.38s).
- **Building units**: hover/tap popover; click → detail; external units inert.
- **About flip card** (landing): hover flips front→back.
- All entrance animations respect `prefers-reduced-motion`.

## State Management
- `activeType` — selected catalog item type (drives grid filter + compact pill label + result count).
- `favorites` — map of item/building id → boolean.
- `scrolled` (derived from scroll position) — drives navbar solidity + search collapse.
- `openUnit` — currently open unit/parking popover id (building page).
- `aboutFlipped` — landing about card hover flip.
- Data currently hardcoded in each file's `dict()` / product & building arrays → replace with API fetch (catalog list, building-by-slug with unit statuses).

## Assets
- **No real photos** are bundled. Image areas use CSS gradient placeholders (HSL) or `image-slot` drop targets (`image-slot.js`). Replace with real listing photos / a proper image component.
- **Background** (`topo-bg.js`): decorative animated topographic canvas behind the landing and building pages (fixed, z-index -1). Optional — reimplement or drop.
- Icons: lucide-react (see icon list above).
- Fonts: Google Fonts — Plus Jakarta Sans (+ Instrument Serif italic on landing).

## Files
- `MILOCATIVA Landing.dc.html` — landing page
- `Catalogo.dc.html` — catalog page (search, filters, edificios rail, productos grid)
- `Edificio.dc.html` — building detail page (floor/unit diagram)
- `support.js`, `image-slot.js`, `topo-bg.js` — prototype runtime + helpers (reference only; do not ship)

Copy content strings from the `dict()` objects at the bottom of `Catalogo.dc.html` and `Edificio.dc.html` — they already keep Spanish copy separated from logic, ready to move into a content/i18n dictionary.
