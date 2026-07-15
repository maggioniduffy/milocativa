# Handoff: MILOCATIVA — Ingresar / Crear cuenta (Auth)

## Overview
A single responsive split-screen authentication page for MILOCATIVA — a B2B rental marketplace for the Vaca Muerta / Añelo shale industry (real estate, machinery, and services). One screen hosts **Sign in (Ingresar)** and **Sign up (Crear cuenta)** via a tab toggle, plus two sub-views: **forgot password (Recuperar contraseña)** and **email OTP verification (Verificá tu correo)**. All copy is in Spanish (Argentina).

## About the Design Files
The file in this bundle (`Ingresar.dc.html`) is a **design reference created in HTML** — a prototype showing the intended look and behavior. It is **not production code to copy directly**. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, SwiftUI, native, etc.) using its established components, form/validation libraries, and patterns. If no environment exists yet, choose the most appropriate framework and implement it there.

> Implementation note: the prototype is authored as a "Design Component" using a small internal runtime (`support.js`, `topo-bg.js`, `image-slot.js`). Ignore that runtime — recreate the markup/styles/behavior natively. `topo-bg.js` (animated topographic canvas) and `image-slot.js` (a drag-drop image placeholder) are prototype-only helpers; in production replace the image slot with a real `<img>`/background image, and the topo background is optional decoration.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, radii, and interactions are specified below. Recreate pixel-accurately using the codebase's existing libraries and patterns.

## Layout (page shell)
- Root: CSS grid, two columns. Desktop (`≥900px`): `grid-template-columns: minmax(0,1fr) minmax(0,1.02fr)` — form panel left, photo panel right. Below `900px`: single column (`1fr`); the photo panel is `display:none` and the form takes full width.
- `min-height: 100vh`, `min-width: 360px`, `box-sizing: border-box` on all elements.
- Body: background `#F7F9FA`, text `#0B1F26`, font `'Plus Jakarta Sans', system-ui, sans-serif`, `-webkit-font-smoothing: antialiased`.

### Form panel (left)
- `position: relative; display:flex; flex-direction:column; min-height:100vh; overflow:hidden`.
- Decorative background (behind content, `opacity:.5`): a radial glow blob (`radial-gradient(circle, rgba(14,140,127,.07), transparent 66%)`, ~46vw circle, top-left) + the animated topo canvas. Purely decorative — omit or replace with a static equivalent.
- Brand header: padding `26px clamp(24px,5vw,56px) 0`. Logo = 32×32 rounded square (`border-radius:10px`, bg `#03597F`) containing a white "building" icon (Lucide `building`/home style, stroke `#FFFFFF` width 2.5), followed by wordmark `MILOCATIVA` (weight 800, `letter-spacing:.04em`, 17px). Links to the landing page.
- Form body: `flex:1; display:flex; align-items:center; justify-content:center; padding:32px clamp(24px,5vw,56px) 48px`.
- Form column: `width:100%; max-width:420px`. Mount animation `fadeSlide .4s ease` (opacity 0→1, translateY 8px→0).

### Photo panel (right)
- `position:relative; overflow:hidden; background:#0B1F26; min-height:100vh`.
- Full-bleed industrial photo with filter `saturate(.82) contrast(.96) brightness(.9)` (a "washed" look).
- Two overlay gradients (pointer-events none):
  - `linear-gradient(180deg, rgba(11,31,38,.28) 0%, rgba(11,31,38,.15) 40%, rgba(11,31,38,.72) 100%)`
  - `linear-gradient(120deg, rgba(3, 89, 127,.34) 0%, transparent 55%)`
- Overlay content (`z-index:1`, `padding: clamp(32px,4vw,56px)`, space-between column):
  - Top pill (glass): "Añelo · Vaca Muerta" with a Lucide `map-pin` icon. Style: `background:rgba(255,255,255,.14); backdrop-filter:blur(6px); color:#FFFFFF; border:1px solid rgba(255,255,255,.18); border-radius:999px; padding:8px 16px; font-weight:700; font-size:13px`.
  - Bottom heading: "Todo el catálogo del shale, *en un solo lugar*" — `#FFFFFF`, `clamp(26px,2.8vw,40px)`, weight 800, `line-height:1.14`, `letter-spacing:-.02em`, `max-width:15ch`, `text-wrap:balance`. The phrase "en un solo lugar" is an `<em>` in `'Instrument Serif', Georgia, serif`, `font-weight:400; font-style:italic; color:#8FE3D6`.
  - Stat row (weight 700, 14px, `rgba(255,255,255,.9)`), separated by 4px dot bullets `rgba(255,255,255,.4)`: **+120** activos · **3** categorías · Gestión 100% local. The numbers are 26px weight 800 `#FFFFFF`.

## Screens / Views

### 1. Main — Ingresar (Sign in)
- **Eyebrow**: "Bienvenido de nuevo" — 13px, weight 700, `letter-spacing:.06em`, uppercase, color `#0E8C7F`, margin-bottom 6px.
- **Title (h1)**: "Ingresá a tu cuenta" — `clamp(28px,3.4vw,36px)`, weight 800, `line-height:1.1`, `letter-spacing:-.02em`.
- **Subtitle**: "Accedé al catálogo, gestioná tus alquileres y seguí tus solicitudes." — 15.5px, `line-height:1.6`, color `#3E545C`, margin-bottom 26px.
- **Tab toggle**: 2-col grid, `gap:4px; padding:4px; background:#EEF2F3; border-radius:999px; margin-bottom:24px`. Each tab: `padding:10px 12px; border-radius:999px; font-weight:700; font-size:14px`, transitions .2s. Active tab: `background:#FFFFFF; color:#0B1F26; box-shadow:0 1px 3px rgba(11,31,38,.12)`. Inactive: `background:transparent; color:#6F8790`.
- **Google button** (full width): `padding:13px; border-radius:999px; border:1.5px solid #DCE3E5; background:#FFFFFF; font-weight:700; font-size:15px; color:#0B1F26`; icon = official 4-color Google "G" (18×18); label "Continuar con Google". Hover `background:#F4F8F9; border-color:#C9D3D6`; active `transform:scale(.985)`; focus-visible `outline:2px solid #03597F; outline-offset:2px`.
- **Divider**: 1px `#DCE3E5` rules on each side of centered label "o con tu correo" (12.5px, weight 600, `#9AABB2`), `gap:14px; margin:20px 0`.
- **Method segmented** (login only): 2-col grid, `gap:6px; margin-bottom:18px`. Buttons: `padding:9px; border-radius:12px; border:1.5px solid; font-weight:700; font-size:13.5px`. Options "Contraseña" and "Código por email". Selected: `background:rgba(3, 89, 127,.10); color:#03597F; border-color:#03597F`. Unselected: `background:#FFFFFF; color:#6F8790; border-color:#DCE3E5`.
- **Fields** (form, `display:flex; flex-direction:column; gap:16px`):
  - **Correo electrónico** (always): label 13.5px weight 700 `#0B1F26`, margin-bottom 7px; input `type=email`, placeholder "tu@empresa.com".
  - **Contraseña** (only when method = password): label row has a right-aligned "¿Olvidaste tu contraseña?" text button (13px, weight 700, `#03597F`, hover `#0A465F`) → opens Forgot view. Input has a trailing show/hide eye toggle button (Lucide `eye` / `eye-off`, 18px, `#6F8790`, hover `#0B1F26` on `#EEF2F3` 8px-radius). Input right padding `44px` to clear the icon. Placeholder "Tu contraseña".
- **Input style (shared)**: `padding:13px 15px` (password: `13px 44px 13px 15px`), `border-radius:12px; border:1.5px solid #DCE3E5; background:#FFFFFF; font-size:15px; color:#0B1F26; outline:none`. Focus: `border-color:#03597F; box-shadow:0 0 0 3px rgba(3, 89, 127,.12)`. Placeholder color `#9AABB2`.
- **Submit button** (full width): label "Ingresar" (password method) or "Enviar código" (OTP method), trailing arrow icon (Lucide `arrow-right`). Style: `padding:14px; border-radius:999px; background:#03597F; color:#FFFFFF; font-weight:700; font-size:15.5px; box-shadow:0 4px 16px rgba(3, 89, 127,.28); margin-top:4px`. Hover `background:#0A465F`; active `transform:scale(.985)`; focus-visible accent outline.
- **Switch prompt** (centered, 14px, `#3E545C`, margin-top 22px): "¿Todavía no tenés cuenta? **Crear cuenta**" — the action is a text button `#03597F` weight 700 that switches to the signup tab.

### 2. Main — Crear cuenta (Sign up)
Same shell as Sign in with these differences:
- Eyebrow "Sumate a MILOCATIVA"; title "Creá tu cuenta"; subtitle "Reservá inmuebles, maquinaria y servicios para tu operación en minutos."
- **No** method segmented control (password is always shown).
- **Extra field first**: **Nombre completo** (`type=text`, placeholder "Ej. Juan Pérez").
- Field order: Nombre completo → Correo electrónico → Contraseña (placeholder "Creá una contraseña"; no forgot link here).
- **Terms checkbox**: custom-styled checkbox (20×20, `border:1.5px solid #C9D3D6; border-radius:6px; background:#FFFFFF`; checked → `background:#03597F; border-color:#03597F`) + label 13.5px `#3E545C`: "Acepto los **Términos de servicio** y la **Política de privacidad** de MILOCATIVA." (links weight 700).
- Submit label "Crear cuenta".
- Switch prompt: "¿Ya tenés una cuenta? **Ingresar**".

### 3. Recuperar contraseña (Forgot password)
- Back button (top): Lucide `arrow-left` + "Volver", 14px weight 700 `#3E545C` (hover `#0B1F26`) → returns to Main. margin-bottom 22px.
- Icon badge: 52×52, `border-radius:16px; background:rgba(3, 89, 127,.10); color:#03597F`, Lucide `lock` icon (24px). margin-bottom 18px.
- Title "Recuperar contraseña" (`clamp(26px,3.2vw,32px)`, weight 800); subtitle "Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña."
- Single email field (same input style) + full-width primary submit "Enviar enlace".
- Mount animation `fadeSlide .35s ease`.

### 4. Verificá tu correo (Email OTP)
- Reached from Sign in when method = "Código por email" and the user submits.
- Back button "Volver" → Main.
- Icon badge: 52×52, `border-radius:16px; background:rgba(14,140,127,.12); color:#0E8C7F`, Lucide `mail` icon.
- Title "Verificá tu correo"; subtitle "Enviamos un código de 6 dígitos a tu correo. Ingresalo abajo para continuar."
- **OTP inputs**: 6-col grid, `gap:8px; margin-bottom:20px`. Each cell: `aspect-ratio:1; text-align:center; border-radius:12px; border:1.5px solid #DCE3E5; background:#FFFFFF; font-size:22px; font-weight:700; color:#0B1F26; maxlength=1; inputmode=numeric`. Focus = accent border + `0 0 0 3px rgba(3, 89, 127,.12)` ring. (In production, wire auto-advance/paste-to-fill/backspace navigation across cells.)
- Full-width primary submit "Verificar y continuar".
- Footer (centered 14px `#3E545C`): "¿No recibiste el código? **Reenviar**" (text button `#03597F`).

## Interactions & Behavior
- **Tab toggle**: switching tab resets `view` to `main` and (via the switch-prompt link) resets `method` to `password`.
- **Method switch** (login): toggles the Contraseña field visibility and the submit label.
- **Show/hide password**: toggles input `type` between `password`/`text` and swaps the eye icon.
- **Forgot link** → `view=forgot`. Back → `view=main`.
- **Sign-in submit**: if method = OTP and on main view, `preventDefault` and advance to `view=otp`. (Password sign-in, sign-up, forgot, and OTP verify submissions are stubbed in the prototype — wire to real auth/API in production, including field validation and error/loading states.)
- **Transitions**: buttons/inputs use .15–.2s ease on background/border/box-shadow/color; primary buttons scale to .985 on active; views mount with `fadeSlide` (opacity + 8px translateY).
- **Responsive**: at `<900px` the right photo panel is hidden and the form goes full-width. Fluid type via `clamp()` throughout. Recompute layout on window resize.
- **Accessibility**: focus-visible uses a 2px `#03597F` outline with 2px offset (not browser default). Ensure inputs have associated labels (they do in the prototype), the password toggle has an `aria-label`, and OTP cells are keyboard-navigable.

## State Management
- `tab`: `'login' | 'signup'` (default `'login'`)
- `view`: `'main' | 'forgot' | 'otp'` (default `'main'`)
- `method`: `'password' | 'otp'` (login only; default `'password'`)
- `showPw`: boolean (password visibility)
- `terms`: boolean (signup terms checkbox)
- Derived: `isLogin`, `isSignup`, `passwordMethod = isSignup || method==='password'`.
- Data needs (production): auth submit (email+password), Google OAuth, request OTP / verify OTP, request password-reset email, create account. Not implemented in the prototype.

## Design Tokens
Colors:
- Text primary `#0B1F26`; muted `#3E545C`; secondary muted `#6F8790`; placeholder `#9AABB2`.
- Page bg `#F7F9FA`; surface tint `#F4F8F9`; toggle track `#EEF2F3`.
- Borders `#DCE3E5` (default), `#C9D3D6` (hover/checkbox).
- Accent (petrol blue) `#03597F`; accent hover/pressed `#0A465F`; accent tint `rgba(3, 89, 127,.10)`; accent focus ring `rgba(3, 89, 127,.12)`.
- Secondary accent (teal) `#0E8C7F`; teal tint `rgba(14,140,127,.12)`; teal-on-dark `#8FE3D6`.
- Dark panel `#0B1F26`.

Typography:
- Body/UI: **Plus Jakarta Sans** (400/500/600/700/800).
- Serif accent (italic display): **Instrument Serif** (italic 400).
- Scale used: eyebrow 13px/700; h1 `clamp(28px,3.4vw,36px)`/800; subtitle 15.5px; labels 13.5px/700; inputs 15px; buttons 15–15.5px/700; small/links 12.5–14px; OTP 22px/700.

Radii: inputs & segmented `12px`; icon badges & logo `10–16px`; buttons/pills/toggle `999px`; checkbox `6px`.

Shadows: primary button `0 4px 16px rgba(3, 89, 127,.28)`; active tab `0 1px 3px rgba(11,31,38,.12)`; focus ring `0 0 0 3px rgba(3, 89, 127,.12)`.

Spacing: form column `max-width:420px`; field gap `16px`; section gaps `18–26px`; page padding `clamp(24px,5vw,56px)`.

Motion: `fadeSlide` keyframe (opacity 0→1, translateY 8px→0), .35–.4s ease; active press `scale(.985)`.

## Assets
- **Icons**: Lucide (https://lucide.dev) — building/home (logo), map-pin, arrow-right, arrow-left, eye, eye-off, lock, mail. Recommended stroke width ~2.25–2.5. Use your codebase's existing icon library equivalents.
- **Google "G"**: inline 4-color SVG (standard Google brand mark).
- **Photo (right panel)**: an industrial Vaca Muerta photograph, displayed "washed" (`saturate(.82) contrast(.96) brightness(.9)`) behind the dark gradients. In the prototype this is a drag-drop `image-slot`; supply a real image in production. A reference photo exists in the project at `assets/photo.jpg`.

## Files
- `Ingresar.dc.html` — the auth page design reference (included in this bundle).
- Related (not included; for brand/style reference): `MILOCATIVA Landing.dc.html` — the landing page this auth page matches (same palette, fonts, topo background, pill/rounded language).
