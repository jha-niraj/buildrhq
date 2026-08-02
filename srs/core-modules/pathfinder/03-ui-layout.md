# Pathfinder — UI & layout

The dashboard is in better shape than most of the product. Most work here is on
the routes around it, not the dashboard itself.

---

## PF-U1 — Error and 404 surfaces

See `PF-B3`. Listed here because the layout constraint is specific and easy to
get wrong.

`/pathfinder` is a `h-screen` two-panel workspace inside the page card. An error
state must respect `--page-h` (`calc(100vh - 1rem)`), not `100vh` — the card is
inset by the shell's margin, and a `min-h-screen` error page will overflow it by
exactly 16px and produce a scrollbar over a strip of nothing.

The global rule in `packages/ui/src/styles/globals.css` retargets `h-screen` and
`min-h-screen` inside `[data-app-page]`, so this works automatically **if** the
error component uses those utilities rather than an inline `height: 100vh`.

---

## PF-U2 — Verification flow feedback

`[slug]/verify` is where four LLM calls currently run inline behind, at best, a
spinner. Once `PF-W1` lands this becomes a polled job and the UI must show:

1. Which of the four sections is generating.
2. That closing the tab is safe — the single most valuable thing to say here, and
   the whole point of the migration.
3. A real failure state with the credits-refunded message (`PF-B1`), not a
   generic error.
4. Resume-on-return: a user who navigates away and comes back mid-generation must
   land back on the live job, not a fresh form.

Depends on `SHARED-2` (the polling hook) and `PF-W1`.

---

## PF-U3 — Reward moment

Once `PF-B4` grants XP, verification completion needs a surface worth the
three-week wait: XP awarded, level change if any, achievement unlocked, and the
goal's final score.

The `weightedScore` computed at `verification.action.ts:621` is already there and
should be shown — right now the user is scored and never told.

---

## PF-U4 — Explore and fork

`/pathfinder/explore` and `explore/[slug]`, 401 lines of action behind them,
including paid goals (`creditPrice`, credit-add at `explore.action.ts:349`).

### Do

1. Confirm the paid-goal flow is in scope (`00-state-of-play.md`, open question 4).
2. If it is: the purchase path needs the same credit-hold treatment as everything
   else — a paid fork that fails must not charge.
3. Empty state for explore when nothing is public yet, which is the state at
   launch.

---

## PF-U5 — Goal detail at narrow widths

`[slug]` has not been checked at width with the AI rail open. The dashboard
handles this properly via `mobileTab`; verify the detail route does too, at 1280
/ 1024 / 768 / 390, rail open and closed.

---

## PF-U6 — Empty states

A new user has no goals, no groups, and nothing in explore. The dashboard has an
`EmptyState` component; confirm every other surface does too — `[slug]` with no
sub-goals, `explore` with nothing public, groups with none created.

---

## PF-U7 — Re-match skeletons after layout changes

`pathfinder/loading.tsx` was hand-matched to the real two-panel dashboard —
header, mobile tab pills, 400px rail with goal cards, overview panel with a
six-tile `grid-cols-3` stat block and two chart cards. Any change to
`pathfinder-dashboard.tsx` invalidates it.

Same for `[slug]`, `[slug]/verify`, `explore` and `explore/[slug]`.
