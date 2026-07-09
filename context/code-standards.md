# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds.
- Do not mix unrelated concerns in one component or route.
- Respect the system boundaries defined in `architecture-context.md`.

## TypeScript

- Strict mode is required throughout the project.
- Avoid `any`; use explicit interfaces or narrowly scoped types.
- Validate unknown external input at system boundaries before trusting it — every webhook payload, form submission, and search param.
- Use `interface` for object contracts.
- Use camelCase for all identifiers (variables, functions, props, file exports); reserve PascalCase for components and types/interfaces.
- Derive Supabase row types from the generated schema (`types/supabase.ts`) rather than hand-writing parallel interfaces that can drift from the database.

## Next.js

- Default to React Server Components.
- Add `"use client"` only when the component needs browser interactivity, Supabase Realtime subscriptions, or animation state.
- Keep route handlers focused on a single responsibility.
- `proxy.ts` handles route-level auth gating only — it must not contain business logic, data fetching, or notification dispatch.

## Styling

- Use CSS custom property tokens defined in `globals.css` — no raw Tailwind color classes like `sky-*` or hardcoded hex values.
- Reference tokens through their Tailwind utility names: `bg-base`, `text-copy-primary`, `border-surface-border`, `text-brand`, etc.
- Maintain the border radius scale: `rounded-lg` for small elements, `rounded-2xl` for cards, `rounded-3xl` for modals.
- All user-facing strings are in Spanish and must come from content/dictionary files — never hardcode Spanish copy inline inside component logic.

## API Routes

- Validate and parse request input before any logic runs.
- Route handlers under `app/api` are reserved for cases the RLS-scoped client cannot handle: verified webhooks (Stripe, MercadoPago) and any action that legitimately requires the Supabase service-role key.
- Prefer Server Actions over route handlers for authenticated mutations initiated from the UI (creating a rental request, sending a message) — they inherit the request's Clerk session naturally and keep the RLS boundary intact.
- Verify webhook signatures (Stripe, MercadoPago) before parsing or trusting payload contents.
- Enforce auth and ownership checks before any mutation, even though RLS is the ultimate boundary — never rely on RLS alone to reject a request the UI shouldn't have allowed in the first place.
- Return consistent, predictable response shapes.
- Keep route handlers thin — push shared logic into `lib/`.

## Data and Storage

- All structured data — people, items, listings, availability, rentals, payments, conversations, messages, notifications — belongs in Supabase Postgres, accessed through Prisma-free, RLS-scoped Supabase clients (see `architecture-context.md`; this project does not use an ORM).
- Item photos and uploaded documents belong in Supabase Storage; the database stores only the resulting path or signed URL, never binary content.
- Do not store large or binary content directly in a Postgres column.
- Every table with user-owned rows must have RLS enabled; a migration that adds a table without a corresponding RLS policy is incomplete.
- Payment status is written only by a verified webhook handler or an explicit admin action — never optimistically set from the client.

## File Organization

- `lib/supabase/` — Supabase client factories (browser, server) that inject the Clerk JWT.
- `lib/payments/` — Stripe and MercadoPago SDK wrappers and shared payment-status mapping.
- `lib/notifications/` — notification fan-out helpers (in-app, push, email).
- `components/` — UI composition only; no business logic or direct Supabase calls — components receive data via props or hooks, they don't fetch it themselves.
- `app/api/` — route handlers for webhooks and service-role-only actions.
- `app/(public)/`, `app/(app)/`, `app/admin/` — route groups matching the access boundaries defined in `architecture-context.md`.
- `supabase/migrations/` — versioned SQL migrations, including RLS policies, committed alongside the code that depends on them.
- Name files after the responsibility they contain, not the technology.
