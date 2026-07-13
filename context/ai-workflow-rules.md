# Development Workflow

## Approach

Build this project incrementally using a spec-driven workflow. Context files define what to build, how to build it, and what the current state of progress is. Always implement against these specs — do not infer or invent behavior from scratch.

## Scoping Rules

- Work on one feature unit or subsystem at a time.
- Prefer small, verifiable increments over large speculative changes.
- Do not combine unrelated system boundaries in a single implementation step.

## When To Split Work

Split an implementation step if it combines:

- UI changes and payment/webhook logic
- Item-scoped chat (Realtime) changes and rental lifecycle changes
- Multiple unrelated API routes or Server Actions
- Public catalog changes and admin panel changes
- Behavior that is not clearly defined in the context files

If a change cannot be verified end to end quickly, the scope is too broad — split it.

## Handling Missing Requirements

- Do not invent product behavior that is not defined in the context files.
- If a requirement is ambiguous, resolve it in the relevant context file before implementing.
- If a requirement is missing, add it as an open question in `progress-tracker.md` before continuing.
- Spanish copy that isn't yet defined is a missing requirement, not something to draft ad hoc inside a component — resolve the wording in the content/dictionary file first.

## Protected Foundation Components

Do not modify generated third-party foundation components unless explicitly instructed.

This includes:

- `components/ui/*` (shadcn/ui components)
- third-party library internals (Clerk components, Stripe/MercadoPago SDK internals)

These should remain default and reusable.

Project-specific styling, layout changes, and feature logic must be implemented in app-level components instead of modifying foundation components.

Only modify these files when a task explicitly requires it.

## Handling RLS and Auth Changes

- Any change to a Supabase RLS policy must be written as a versioned migration in `supabase/migrations/`, never applied only through the dashboard.
- Any change to role logic (`admin` vs `user`) must be reflected consistently in three places: the `proxy.ts` route gate, the relevant RLS policies, and `architecture-context.md`. Treat these as a single unit of work — do not update one without the others.
- Do not weaken or bypass an RLS policy to unblock a UI feature. If the policy is genuinely wrong, fix the policy and document why in the migration.

## Keeping Docs In Sync

Update the relevant context file whenever implementation changes:

- System architecture or boundaries
- Storage model or RLS/auth decisions
- Code conventions or standards
- Feature scope

Progress state must reflect the actual state of the implementation, not the intended state.

## Before Moving To The Next Unit

1. The current unit works end to end within its defined scope.
2. No invariant defined in `architecture-context.md` was violated.
3. Any Spanish-facing copy introduced is in the content/dictionary files, not hardcoded.
4. `progress-tracker.md` reflects the completed work.

## Memory

- Update memory/MEMORY.md with the latest works after updatinf progress tracker
