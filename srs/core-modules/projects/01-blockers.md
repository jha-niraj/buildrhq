# Projects — blockers

Fix these before anything else in the module. Each one either costs users money,
breaks the app shell, or is visibly wrong on every load.

---

## PRJ-B1 — Credits are debited with no refund on failure

**Severity: high — costs users real money.**

`apps/main/actions/(main)/projects/project.action.ts:57` defines
`_refundCredits()`. Nothing calls it. The underscore prefix is suppressing the
unused-symbol warning that would otherwise have surfaced this.

Every flow that debits credits and then calls an LLM can fail *after* the debit:
the model errors, the request times out, the JSON fails to parse. The user is
charged and receives nothing, with no automatic path back.

### Do

1. Build the shared credit-hold helper (`SHARED-3`) — one place that does
   charge → run → settle-or-refund, writing a `creditTransactions` row on both
   the debit and any refund so the ledger reconciles.
2. Route every debit in this module through it.
3. Refund on: LLM error, timeout, schema-validation failure, and worker job
   ending in `failed`.
4. Make the refund idempotent — keyed on job id — so an alarm that re-fires
   after a DO eviction cannot double-refund.
5. Only then remove the `_` prefix from `_refundCredits` (or fold it into the
   helper).

**Blocked by:** `SHARED-3`.
**Mirrors:** `PF-B1`, which is the same defect in pathfinder but worse — there
the debit happens before a *four-call* AI sequence.

---

## PRJ-B2 — No error boundaries; a thrown error kills the whole shell

**Severity: high — one bad render replaces the entire app.**

No `error.tsx` exists anywhere under `app/(main)/projects`. Next.js walks up to
the root boundary, so a failure inside e.g. the sprint board unmounts the
sidebar and the AI rail too.

### Do

1. Add `error.tsx` at `app/(main)/projects/` — covers every child route.
2. Add a tighter one at `app/(main)/projects/[slug]/` so a workspace failure
   keeps the project header and tab strip, and only the tab panel is replaced.
3. Each must offer `reset()` and a route back to `/projects/myprojects`.
4. Match the surrounding card chrome — a full-bleed error page inside the
   rounded page card looks like a crash even when it is a handled state.
5. Add `not-found.tsx` at `[slug]/` — a bad slug currently renders the generic
   404 rather than anything project-aware.

**Blocks:** nothing, but do it early — it changes how every later bug presents.

---

## PRJ-B3 — Tab strip is unreadable in dark mode

**Severity: medium — visible on every project workspace load.**

`[slug]/_components/project-details-client.tsx:768`, `:779`. `dark:bg-white` and
`dark:text-neutral-900` are applied unconditionally instead of being gated on
`data-[state=active]`, so in dark mode every tab gets a white background and the
active tab is indistinguishable.

### Do

1. Gate both on state: `dark:data-[state=active]:bg-white`,
   `dark:data-[state=active]:text-neutral-900`.
2. Give inactive triggers an explicit dark style rather than relying on
   inheritance.
3. Sweep the module for the same mistake — the pattern was copy-pasted, so check
   every `data-[state=active]` next to a bare `dark:` utility.
4. Verify in the browser in both themes. This class of bug does not show up in
   `tsc` and is easy to "fix" without actually looking.

---

## PRJ-B4 — `catch (error: any)` in 43 places across the two modules

**Severity: medium — actively hides failures.**

Banned by `CLAUDE.md`. The practical harm: `error.message` type-checks on a value
that may be a string or a `Response`, so handlers produce `undefined` in
user-facing messages instead of failing loudly.

### Do

1. Convert to `catch (error: unknown)` and narrow before use.
2. Add one shared `toErrorMessage(error: unknown): string` rather than repeating
   `error instanceof Error ? error.message : "…"` 43 times.
3. Do this file by file with `tsc` after each — the narrowing will surface real
   type errors that `any` was masking. Those are findings, not obstacles.

---

## PRJ-B5 — Inline LLM calls have no timeout budget

**Severity: high in production, invisible locally.**

No `maxDuration` or `runtime` export anywhere in the module. 11 inline LLM calls
across 6 action files run under the platform default. On Cloudflare Workers via
OpenNext a 30–60s completion will be killed mid-flight — and because of `PRJ-B1`
the user has already been charged when that happens.

### Do

The real fix is `02-worker-migration.md`. Until each flow is migrated:

1. Add an explicit `AbortController` timeout to every inline LLM call so it fails
   predictably instead of being killed by the platform.
2. Treat the abort as a refundable failure (`PRJ-B1`).
3. Log which flow aborted, so the migration order can be driven by real data
   rather than by the guesses in `02-worker-migration.md`.

**Related:** `PF-B2` — same defect, worse instance.
