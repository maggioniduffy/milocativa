# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

## Current Goal

## Completed

## In Progress

## Next Up

## Open Questions

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
