# Pathfinder — backlog

Everything not a blocker and not part of the worker migration. Ordered.

---

## PF-1 — Resolve the three-way mock-interview overlap

Verification has a mock-interview section. So does `projectv2-mock.action.ts`
(528 lines). So does the standalone `mock` module (4,006 lines).

**Three implementations of mock interviewing**, each with its own prompts and
bugs. This is the clearest example of the breadth problem: the same capability
built three times because each module needed it locally.

Decide which one is *the* mock interview and have the other two call it. Nothing
deleted until Niraj decides — this task is the decision plus a written comparison.

Related: `PRJ-1`, which is the same decision seen from the projects side.

---

## PF-2 — Settle the `practice` dependency

`practice-mock.action.ts` (72 lines) bridges pathfinder into `practice`. If
`practice` is parked — it is the module most exposed to the "don't compete on
commodity content" thesis — goals that depend on it need an answer.

Options: keep a minimal practice surface purely as a pathfinder dependency; move
the needed pieces into pathfinder; or drop that verification section.

**This is a scope decision, not an engineering one.** It blocks nothing until
`practice` is actually parked.

---

## PF-3 — Idempotency across the module

Several flows write in ways that must not double-apply, and worker alarms can
re-fire after a Durable Object eviction:

- Verification completion → XP + achievements (`PF-B4`)
- Credit debits and refunds (`PF-B1`)
- Sub-goal plan commit (`PF-W2`)
- Fork / paid purchase (`PF-U4`)

Audit each for a natural idempotency key — job id, or a uniqueness constraint —
and add one where it is missing. Cheaper to do as a sweep than to rediscover per
flow after the migration.

---

## PF-4 — Streaks and `lastActivityAt`

`pathfinderGoals` carries `streakDays` and `lastActivityAt`. Streaks are
notoriously easy to get wrong across timezones and DST, and there is no scan
evidence of how they are computed.

Verify: what counts as activity, which timezone the day boundary uses, and what
happens when a user travels. A streak that resets wrongly destroys exactly the
returning-user behaviour this module exists to create.

---

## PF-5 — Verification retry semantics

`verification.action.ts:555` `retryVerificationSection()`. Confirm: does a retry
re-charge? Re-generate, or reuse the generated content? Does the performance
refund at `:621` recompute across retries?

There is a plausible exploit — retry until the score is high enough to maximise
the performance refund. Worth checking before launch rather than after.

---

## PF-6 — Studio link scope

`studio-link.action.ts` (265 lines, 1 LLM call). Blocked on the same scope
question as `PF-W6`.

---

## PF-7 — Goal groups

`groups.action.ts` (253 lines), `pathfinderGroups` with colour and ordering. An
organisational layer that only earns its keep once users have many goals. Confirm
it is worth carrying now versus deferring until there is evidence anyone has
enough goals to need grouping.

---

## PF-8 — Usage tracking

`usage.action.ts` (116 lines). Establish what it measures and whether anything
reads it. If it feeds credit limits it is load-bearing; if it feeds an unbuilt
analytics view it is dead weight.

---

## PF-9 — Creator flow

`creator.action.ts` (132 lines) — publishing goals for others to fork. Ties into
`PF-U4` and the paid-goal question. Same gate: is a goal marketplace in scope now?

---

## PF-10 — Connect verification to project submission

`submitProject(goalId, projectType: 'CODERZ' | 'PORTFOLIO', projectId)` at
`verification.action.ts:511` is the join between the two core modules — the point
where "build the project" meets "verify the goal".

Two things:

1. The `'CODERZ'` literal is stale branding **persisted to a text column**. It
   survived the rebrand deliberately, since changing it rewrites stored values.
   Renaming needs a migration and a backfill, not a find-and-replace.
2. This is the most important integration in the narrowed product and deserves an
   end-to-end test: create goal → generate plan → build project → submit → verify
   → award XP. If one path through the product is worth guarding, it is this one.
