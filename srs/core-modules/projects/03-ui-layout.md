# Projects — UI & layout

Layout work, ordered cheapest-and-most-visible first. All of it sits inside the
three-card app shell (`app/(main)/layout.tsx`) — sidebar, page card, AI rail —
so anything full-bleed here fights the card it lives in.

---

## PRJ-U1 — Fix the dark-mode tab strip

See `PRJ-B3`. Listed here too because it is the most visible layout defect in the
module. **Do this first.**

---

## PRJ-U2 — Decide what `/projects` is

`/projects` renders a marketing page — centred hero, badge, 4-up stat band, trust
pills, alternating full-bleed sections — **inside the authenticated shell**. Its
own skeleton mirrors that shape, so the hand-matching is honest; the question is
whether the page should be that at all.

A signed-in user landing on a hero that sells them the product they already pay
for is a dead click. Compare `/projects/myprojects`, which is what someone
signed in almost always wants.

### Do

1. Confirm the intent with Niraj — this may be a landing page that ended up
   behind auth.
2. If it should be a hub: replace the hero with the user's own state — projects
   in progress, next task, recent activity — and move discovery below it.
3. If it should be marketing: move it to `apps/web` and make `/projects`
   redirect to `/projects/myprojects`.
4. Either way the skeleton must be re-matched afterwards; a skeleton that no
   longer matches is worse than none.

---

## PRJ-U3 — Workspace layout on narrow screens

`[slug]` is a four-tab workspace (overview / pages / setup / settings). Verify at
1280, 1024, 768 and 390, **with the AI rail both open and closed** — the rail
takes 460px by default, so a 1440px window with the rail open leaves the page
card at ~866px. A layout only ever checked at full width has not been checked.

### Do

1. Walk all four tabs at each width, rail open and closed.
2. Confirm the tab strip scrolls rather than wraps or clips on narrow screens.
3. Check tables and code blocks scroll inside their own container — the shell
   forbids horizontal body scroll.
4. Check the sprint board and kanban, which are the most likely to overflow.

---

## PRJ-U4 — Empty states

12 routes; a new user has nothing in any of them. Check each renders a real empty
state rather than a bare heading over blank space — `myprojects`, `allprojects`,
`ideas`, both leaderboards, `tasks`, `sprints`.

Each empty state should say what the surface is for and offer the one action that
fills it.

---

## PRJ-U5 — Long-running feedback

Once flows move to the worker (`02-worker-migration.md`), every migrated flow
needs an honest progress surface: which stage is running, roughly how long, and
what happens if the tab is closed — the answer being "nothing, it keeps going",
which is the main user-visible benefit of the migration and worth stating.

Depends on `SHARED-2`.

---

## PRJ-U6 — Error and 404 surfaces

See `PRJ-B2`. The design requirement: an error inside the workspace should keep
the project header and tab strip and replace only the panel, so the user does not
lose their place.

---

## PRJ-U7 — Re-match skeletons after layout changes

Every route has a hand-matched `loading.tsx`. Any layout change above invalidates
its skeleton. The rule from `CLAUDE.md`: *a skeleton that does not match is worse
than none — the page visibly reflows.*

Re-check `/projects` (if `PRJ-U2` changes it), `[slug]`, `tasks`, `sprints`.
