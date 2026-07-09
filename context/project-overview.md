# Mi Locativa

## Overview

Mi Locativa is a full-stack rental marketplace for Añelo, Neuquén, built to serve the local shale oil & gas industry (Vaca Muerta). It lets a small team of owners (2–3 admins) list and manage rentable estate, machinery, and services, and lets companies and individuals operating in the region browse, filter, and request rentals directly from the platform.

The UI is entirely in **Spanish** (the language of the target users — oilfield service companies, contractors, and local businesses in Añelo). The codebase — variable names, function names, comments, commit messages, file names — is entirely in **English**, using camelCase for TypeScript identifiers. These are separate concerns: user-facing text lives in Spanish copy/content files; everything a developer or AI agent reads is in English.

## Goals

- Give Vaca Muerta–area businesses a single place to find estate, machinery, and services for rent, filterable by type, price, contract duration, and availability window.
- Let a small admin team manage the entire rental lifecycle (inquiry → negotiation → acceptance → active rental → completion) without leaving the platform.
- Centralize all client communication and history around the specific item being rented, so admins have full context per listing rather than per generic inbox.
- Support both in-app payment (Stripe, MercadoPago) and off-platform payment arrangements.
- Deliver a fast, polished, motion-rich booking experience comparable to Airbnb, running on a lean stack with no dedicated backend service.

## Core User Flow

1. A visitor browses or filters listings (type, price, contract length, availability) without needing an account.
2. To contact an owner or request a rental, the user signs in via Google, email OTP, or email + password (Clerk).
3. The user opens an item's page, sees its details and availability, and starts a conversation tied to that item.
4. An admin receives an in-app + push + email notification, responds in the item's conversation thread, and either accepts or declines the request.
5. On acceptance, a rental record is created with agreed dates and price; payment is settled in-app (Stripe/MercadoPago) or marked as arranged externally.
6. Both parties can track the rental status until completion; admins manage everything from a dedicated panel.

## Features

### Authentication and Projects

- Authentication via Clerk: Google OAuth, email OTP, and email + password.
- Two roles: `admin` (owners, 2–3 seats, full management access) and `user` (renters/prospects, self-service browsing and requests).
- Role is stored in Clerk `publicMetadata` and propagated to Supabase via JWT for RLS enforcement — no separate role table needed.
- A signed-in user has one profile shared across all their conversations and rental requests, regardless of how many items they've inquired about.

### Starter System Designs

- Item taxonomy: `Item` splits into `Object` (physical, has location/condition — `Estate`, `Machinery`) and `Service` (has type/duration). This split drives which filters and fields render per listing type.
- Every item carries an `Availability` calendar (date ranges), independent of its `Listing` (public visibility/publication status).
- Every conversation is scoped to a single `Item`, not to a user-to-user thread — this is the organizing principle for how admins triage and manage clients.
- `Rental` is the transactional core: it tracks status through the request → accepted → active → completed lifecycle and is the anchor for payments and reviews.

## Scope

### In Scope

- Public catalog with search, filters (type, price, contract duration, availability), and item detail pages.
- Item-scoped chat between prospective/active renters and admins, with full history.
- Admin panel: manage listings, respond to inquiries, accept/decline requests, publish new items.
- In-app notifications, web push notifications, and transactional email.
- Payment via Stripe and MercadoPago, plus a manual "arranged outside the app" status.
- Responsive, animated UI in Spanish, targeting an Airbnb-level design bar.
- Image/file storage via Supabase Storage.

### Out Of Scope

- Multi-tenant support for other regions or other rental businesses (this is a single-operator platform for now).
- Native mobile apps (web-only, responsive).
- Automated contract generation or legal document management.
- Public API for third-party integrations.
- Self-service admin onboarding (admins are provisioned manually; only 2–3 seats expected).

## Success Criteria

- A prospective renter can find a relevant item, understand its availability and price, and start a conversation in under a minute, entirely in Spanish.
- Admins can see, from any conversation, the full context of the item, the client, and the rental history without leaving that thread.
- No rental request goes unnoticed: every new message or request reaches an admin via at least one of in-app, push, or email within seconds.
- A rental can go from first contact to a completed, paid transaction entirely within the app, with Stripe or MercadoPago handling payment.
- The UI feels comparable to Airbnb in polish and motion, not like a generic admin-panel CRUD app.
