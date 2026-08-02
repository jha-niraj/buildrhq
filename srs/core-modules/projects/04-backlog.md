# Projects — backlog

Everything not a blocker and not part of the worker migration. Ordered.

---

## PRJ-1 — Resolve the mock-interview duplication

`projectv2-mock.action.ts` (528 lines, 3 LLM calls) and the standalone `mock`
module (4,006 lines) both run mock interviews. Two implementations, two prompt
sets, two sets of bugs.

**Decide which survives before migrating either to the worker** (`PRJ-W3`).
Nothing is deleted until Niraj decides — this task is the decision, plus a
written comparison of what each does that the other does not.

---

## PRJ-2 — Retire `any` from the action layer

156 occurrences across 8 files, `project.action.ts` worst at 49.

Do it file by file, largest first, `tsc` after each. Expect the narrowing to
surface real bugs — `any` has been masking them. Log each one found rather than
quietly fixing it, so the payoff is visible.

Related: `PRJ-B4` (the 43 `catch (error: any)`), which is the subset that
actively hides failures and is therefore a blocker rather than backlog.

---

## PRJ-3 — Split `project.action.ts`

1,139 lines, 49 `any`s, and the home of the never-called `_refundCredits`.

A file this size is where dead code hides — `_refundCredits` sat unused long
enough to be prefixed rather than wired up. Split along real seams (CRUD /
membership / progress / credits) once `PRJ-2` has made the types honest enough
to move safely.

---

## PRJ-4 — Real counts in skeletons

Route skeletons currently use fixed placeholder counts. Where a page's item count
is knowable — a fixed tab set, a query `limit` — the skeleton should use the same
source, so the two cannot drift.

Precedent: `/profile` and the five `knowme` routes re-export the component's own
skeleton, giving one definition instead of two.

---

## PRJ-5 — Team collaboration review

`team-collaboration.action.ts` (559 lines) — one of the larger untouched
surfaces. Not yet scanned in depth. Establish whether it is in scope for the
narrowed product before investing in it.

---

## PRJ-6 — Feature suggestions & project errors

`feature-suggestions.action.ts` (747) and `project-errors.action.ts` (672) are
1,419 lines of surface adjacent to the core loop. Both were mid-refactor at some
point — `project-errors` was one of the files carrying broken `db.transaction()`
calls before the driver fix.

Confirm both are wanted before further work.

---

## PRJ-7 — Standup: two implementations

`standup.action.ts` (432) and `standup-voice.action.ts` (478). Text and voice
paths for the same feature. Check whether they share logic or have diverged; if
diverged, converge before `PRJ-W6` migrates the voice path to the worker.

---

## PRJ-8 — Leaderboard query cost

`leaderboard.action.ts` (466 lines, 19 `any`s) backs three routes
(`/projects/leaderboard`, `[username]`, `[slug]/leaderboard`). Ranking queries
are the classic full-table-scan-per-request. Check the query plans and whether
the ranking should be materialised rather than computed per request.

---

## PRJ-9 — Idea → project handoff

`projectIdeas.blueprintProjectId` links an idea to a generated project, with
`hasBlueprintGenerated` / `blueprintGeneratedAt` alongside. Verify the full path:
idea → generate → project, including what happens when generation fails after the
idea is marked as having a blueprint. That is a two-writes-no-transaction shape —
check it uses `withTransaction` or `db.batch`, not two bare updates.

---

## PRJ-10 — Public/private visibility audit

`projectsV2.visibility` (PUBLIC/PRIVATE) and `isPlatformSeeded` gate what appears
in `/projects` and `/projects/allprojects`. Audit every read path that lists
projects to confirm private ones cannot leak — the same class of bug as the
`ACTIVE`/`PUBLIC` filter the AI job-search tool needed.
