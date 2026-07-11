Read `AGENTS.md`, `context/architecture-context.md`, `context/ui-context.md`, and `context/code-standards.md` before starting.

We're implementing the authentication pages and auth wiring using Clerk.

## Scope

Build the sign-in and sign-up flows for Mi Locativa. Clerk is the sole identity provider; there is no separate credentials table. Support all three configured methods:

- Google OAuth
- Email OTP (passwordless)
- Email + password

Routes (Spanish paths, English code):

- `/sign-in`
- `/sign-up`

Use Clerk's `<SignIn />` and `<SignUp />` components in `appearance`-customized form, not fully custom flows — restyle via the `appearance` prop / CSS variables to match our design tokens rather than hand-rolling the OTP/password/OAuth logic.

## Role & session handling

- Two roles: `admin` and `user`, stored in Clerk `publicMetadata.role`. No separate roles table.
- Forward the Clerk JWT to Supabase for RLS — confirm the Clerk JWT template used for Supabase (`role` claim mapped through) is referenced correctly in `lib/supabase/client.ts` (or equivalent) when creating the authenticated client.
- New sign-ups default to `role: "user"`. Admin accounts are provisioned manually (out of scope for self-service — do not build an admin-signup path).

## Next.js 16 conventions — verify before writing

These have already bitten us once; don't trust older docs or training data on them:

- Route protection lives in `proxy.ts` at the project root, **not** `middleware.ts`.
- Do **not** use `createRouteMatcher` (deprecated in this version). Use direct `pathname.startsWith(...)` checks against the request URL.
- Gate admin-only routes with `auth.protect({ role: "admin" })`.
- `reactCompiler` is a top-level key in `next.config.ts`, not under `experimental`.

## Routing / redirect behavior

- Unauthenticated visitors can browse `/catalogo` freely — auth is only required to start a conversation or request a rental (per the core user flow in the project overview).
- After successful sign-in/sign-up, redirect by role:
  - `admin` → `/admin`
  - `user` → `/catalogo`
- Preserve a `redirect_url`/`next` param so a user who hit the sign-in wall from an item page returns to that item after auth, instead of always bouncing to `/catalogo`.

## Styling — light theme, per `ui-context.md`

- Light theme only, no dark mode toggle or dark variant.
- Use existing CSS variable tokens (`--bg-surface`, `--accent-primary` petrol blue `#0C5678`, `--border-default`, etc.) via the Tailwind mapping — no hardcoded hex values inside the Clerk `appearance` config.
- Card container: `rounded-3xl` (modal/overlay scale), white surface, soft shadow — consistent with our modal/dialog pattern.
- Primary action buttons use `--accent-primary` / `--accent-primary-hover`, full-width on mobile (`w-full sm:w-auto`).
- Typography: Plus Jakarta Sans via the existing `--font-jakarta-sans` variable.
- Respect the mobile-first breakpoints already in use elsewhere (base styles for ~360px, scale up with `sm:`/`lg:`).

## Copy

- All visible strings (labels, button text, error messages, OTP prompts) are Spanish, Argentina locale.
- Do not inline Spanish strings in the component. Put them in the existing content/dictionary file pattern (e.g. `content/auth.ts` or wherever other page copy already lives) and import from there, so Clerk's default English strings are fully overridden via `localization`, not partially.

## Do not

- Do not build custom OAuth/OTP/password logic — Clerk owns that.
- Do not create a roles table in Supabase — role stays in Clerk `publicMetadata`.
- Do not add an admin self-signup path.
- Do not modify generated `components/ui/*` primitives — compose around them.

## Check when done

- Google OAuth, email OTP, and email + password all work end-to-end in both `/iniciar-sesion` and `/registrarse`.
- New sign-ups land with `role: "user"` in `publicMetadata`.
- Supabase queries made right after sign-in succeed under RLS (JWT role claim is present and correct).
- Role-based redirect works for both `admin` and `user`.
- `redirect_url` round-trip works when arriving from a gated item page.
- No hardcoded Spanish strings inside component files.
- Visual check: light theme only, petrol-blue accent, `rounded-3xl` card, no residual Clerk default (indigo) styling visible.
- `proxy.ts` (not `middleware.ts`) handles route protection, using `pathname.startsWith` + `auth.protect({ role })`, no `createRouteMatcher`.
