# Architecture Context

## Stack

| Layer              | Technology                           | Role                                                                                       |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| Framework          | Next.js 16 + TypeScript              | Full-stack app with server/client boundaries, no external backend                          |
| UI                 | Tailwind + shadcn/ui + Framer Motion | Component composition, styling, and Airbnb-style motion                                    |
| Auth               | Clerk                                | User identity (Google, OTP, email + password) and route protection via `proxy.ts`          |
| Database           | Supabase (PostgreSQL)                | Relational data: items, listings, availability, rentals, payments, messages, notifications |
| Row-level security | Supabase RLS + Clerk JWT             | Authorization enforced at the database layer via `auth.jwt()` claims                       |
| Realtime           | Supabase Realtime                    | Live chat updates and in-app notification delivery                                         |
| File storage       | Supabase Storage                     | Item images, documents, and uploaded attachments                                           |
| Payments           | Stripe + MercadoPago                 | In-app payment processing; webhooks reconcile `Payment` records                            |
| Email              | Resend                               | Transactional email (new message, rental accepted, payment confirmation)                   |
| Push               | web-push (VAPID)                     | Web push notifications for admins and users                                                |

## System Boundaries

- `app/(public)` — Public catalog: item listing, filters, item detail pages. No auth required.
- `app/(app)` — Authenticated user routes: conversations, rental requests, profile.
- `app/admin` — Admin-only routes: inbox, listing management, rental approval. Protected in `proxy.ts` via `auth.protect({ role: 'admin' })`.
- `app/api` — Route handlers: webhook receivers (Stripe, MercadoPago), server-side actions that require elevated (service-role) access not safe to run as RLS-scoped client calls.
- `lib/supabase` — Supabase client factories (browser, server) that inject the Clerk JWT for RLS-scoped access.
- `lib/payments` — Stripe and MercadoPago SDK wrappers and shared payment-status mapping.
- `lib/notifications` — Notification fan-out helpers (in-app insert, push send, email send).
- `components` — UI composition: item cards, filter bar, chat thread, admin panel views.
- `types` — Shared TypeScript types generated from the Supabase schema.

## Storage Model

- **Database (Supabase Postgres)**: all structured data — `people`, `items`, `categories`, `availability`, `listings`, `rentals`, `payments`, `reviews`, `conversations`, `messages`, `notifications`, `push_subscriptions`. This is the single source of truth; there is no separate metadata/artifact split.
- **Supabase Storage**: binary assets only — item photos, uploaded documents. Buckets are scoped by item (`items/{itemId}/...`); the resulting public or signed URL is stored on the `Item` or `Listing` record, not the file itself.
- No blob storage outside Supabase is used; keeping storage and database on one platform avoids a second auth/access-control surface.

## Auth and Access Model

- Every person is a Clerk user; the Clerk `userId` (`sub` claim) is the primary key referenced across `rentals`, `messages`, `notifications`, and `push_subscriptions`.
- Role (`admin` | `user`) lives in Clerk `publicMetadata` and is propagated into Supabase RLS policies via `auth.jwt() -> 'public_metadata' ->> 'role'`. There is no separate roles table.
- Only authenticated users can open a conversation or submit a rental request.
- A `user` can read/write only their own conversations, rentals, and notifications; an `admin` can read/write across all of them.
- Supabase clients (browser and server) always forward the Clerk session token as the `Authorization` header so RLS evaluates the real caller — no client ever uses the service-role key directly, except inside `app/api` webhook handlers that must write on behalf of an external event (e.g. a Stripe webhook).

## Starter System Designs

- Recurring machinery/service listings can be published from a **listing template**: a static, predefined set of field defaults (category, base price unit, description skeleton) that an admin picks when creating a new `Listing`.
- Templates live as static data in the codebase (not a database table) and are resolved by template ID at creation time — they only prefill the create-listing form, they never override or link back to the resulting `Item`/`Listing` record.
- Template data follows the same shape as a real `Item`, so no separate validation path is needed between template-seeded and manually-created listings.

## Communication and Notification Model

### Chat

- Input: a message typed by a user or admin inside an item-scoped `Conversation`.
- Execution: inserted into `messages` via the RLS-scoped Supabase client; Supabase Realtime broadcasts the insert to subscribers of that conversation's channel.
- Output: message appears live for all participants; a `Notification` row is created for the recipient(s) not currently active in that conversation.

### Notification fan-out

- Input: a domain event — new message, rental request, rental accepted/declined, payment confirmed.
- Execution: a server-side helper in `lib/notifications` writes the `Notification` row and, based on the recipient's channel preferences, sends a web push (via VAPID) and/or a transactional email (via Resend). This runs inline in the route handler or server action that caused the event — no durable background job runner is used, since Next.js route handlers are sufficient for this workload.
- Output: recipient sees an in-app badge (Realtime-driven), a browser push notification, and/or an email, depending on channel.

## Payment Model

- Input: a `Rental` accepted by an admin, with an agreed `totalAmount`.
- Execution: the client initiates a Stripe Checkout session or a MercadoPago preference from a route handler; the corresponding webhook (`app/api/webhooks/stripe`, `app/api/webhooks/mercadoPago`) verifies the event and updates the matching `Payment` record.
- Output: `Payment.status` transitions (`pending → paid | failed`), which in turn can transition `Rental.status`. Off-platform payment is supported by allowing an admin to manually mark a `Payment` as `arrangedExternally`.

## Invariants

1. No client ever bypasses RLS: all reads/writes from `app/(public)`, `app/(app)`, and `app/admin` go through the Clerk-JWT-scoped Supabase client. Only webhook handlers in `app/api` use the service-role key, and only to react to verified external events.
2. Every `Message` and `Conversation` is scoped to exactly one `Item` — there is no user-to-user thread independent of an item.
3. Role checks (`admin` vs `user`) are enforced both in `proxy.ts` (route-level) and in RLS policies (data-level); the route check is a UX convenience, the RLS policy is the real boundary.
4. Payment state is only ever written by a verified webhook or an explicit admin action — never inferred client-side.
5. Client components (`'use client'`) are used only where Realtime subscriptions, form interactivity, or animation require it; data fetching for initial page loads stays in server components.
