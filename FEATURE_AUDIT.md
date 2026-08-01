# ShiprHQ - Feature Audit: Keep, Cut, Decide

> Goal: cut the clutter so the product is one sharp thing - **Learn → Build → Get
> Hired for developers** - and you can focus. Every feature below is judged on one
> question: *does it directly move a user along Build → Interview-ready → Matched &
> Hired?* If not, it's clutter, no matter how built-out it is.

## The decision lens

Three jobs-to-be-done. Everything maps to one or it goes:
1. **Build** a portfolio that gets you hired → **Projects**
2. **Get interview-ready** → **Practice + Mock + AI interview/resume tools**
3. **Get matched & hired** → **Jobs (resume/profile → match → apply)**

## Market context (why this lens)
- **Portfolio > resume**: ~73% of hiring managers weigh a strong portfolio over a perfect resume for dev roles → Projects is the flagship, correctly. ([Frontend Mentor](https://www.frontendmentor.io/articles/project-based-learning-vs-tutorials), [Hyperskill](https://hyperskill.org/blog/post/building-a-developer-portfolio-in-2026-what-actually-gets-attention))
- **AI job-matching is a proven, hot category** (Simplify, Jobright, Jobscan): profile/resume → extract skills → **% match + missing keywords** → apply. This is exactly your jobs vision - and your current matching is far below this bar. ([Simplify](https://simplify.jobs/), [Jobscan](https://www.jobscan.co/), [Jobright](https://jobright.ai/))
- **Mock interviews have durable demand** (interviewing.io, Pramp/Exponent, AI mocks like MockIF) → keep Mock, but only the real one. ([IGotAnOffer](https://igotanoffer.com/blogs/tech/best-mock-interview-websites))
- **Gamification is mostly a trap**: a 2023 meta-analysis (66 studies, 17k learners) found **points+badges alone ≈ zero effect**, and **public leaderboards demotivate the majority** of users → Achievements + global Leaderboard are clutter. ([Rational Growth](https://rational-growth.com/gamification-in-education-2026/))

---

## ✅ KEEP - the spine (fully built, on-thesis)

| Module | Why keep | Next move |
|---|---|---|
| **Projects** | Flagship. Most built (1,367-line schema, ~8.6k lines of actions, ~30 tables). Directly = "Build". Market says portfolio wins. | Keep investing. This is the crown jewel - protect it. |
| **Practice** | Real, 4 tracks (DSA / system design / frontend / backend), AI problem gen + assessment. | Keep, but **don't try to out-LeetCode**. Position as practice tied to *your* projects/goals, not a generic problem bank. |
| **Mock → Voice** | The one **real** mock (AI voice, full session/review). On-thesis. | Keep **only** `/mock/voice`. Delete the 4 stub modes (below). |
| **AI → Resume Creator** | Real, substantial (drafts, templates, import, public share via `/r/[slug]`, PDF). Core to "Get Hired". | Keep. Wire its resume extraction into Jobs matching (see below). |
| **AI → Job Interview Assistant** | Real (plans, coding questions, generations). On-thesis. | Keep. |
| **AI → Cover Letter** | Real, small, on-thesis. | Keep. |
| **Jobs** | The "Get Hired" pillar you want to build. Plumbing (browse, apply, saved, spark swipe, applications, recommendations) is fully wired. | **Keep + upgrade the matching brain** (see dedicated section). This is where to invest next. |
| **Profile** | The data source for job matching - links, skills, socials, resume. | Keep. Make it the single "about me" that feeds matching. Absorb the useful bits of KnowMe here. |

**Necessary infrastructure (keep, not "features"):**
- **Home / dashboard** - keep, but prune links to deleted modules (currently links to achievements, leaderboard, sharecredits, community, knowme).
- **Purchase + Transactions** - keep. High blast radius: 8 files funnel to `/purchase` (the credits paywall). Don't touch.
- **Settings + Auth** - keep. Trim the "coming soon" tabs.

---

## 🟥 CUT NOW - pure stubs (zero risk, no backend)

These are "Coming Soon" tiles/shells with no real implementation. Deleting them removes clutter and false promises immediately:

- **7 fake AI tools** on the AI hub: Portfolio Audit, System Architect, Project Scoper, Open Source Scout, DocuSmith, Code Sentinel, Test Forge. (Only Resume / Interview Assistant / Cover Letter are real.)
- **4 fake Mock modes**: AI Video Mock, Company-Specific, Peer-to-Peer, Expert Mentorship.
- **3 fake Jobs nav items**: Job Alerts, Company Reviews, Salary Insights.
- **Assorted "coming soon" tabs** in settings (auth, integrations) and profile.

> Cutting these alone makes the app feel dramatically more honest and focused, with essentially no engineering risk.

---

## 🟥 CUT - clutter (real code, but off-thesis or evidence-against)

| Module | Why cut | Blast radius / notes |
|---|---|---|
| **Achievements** (badges/XP/levels) | Gamification with ~zero evidence of value; maintenance + credits + OpenAI share-text for little return. | Linked from home + profile (4 files). Schema `achievements.ts` (386 lines), `xpTransactions`. Remove UI + nav; keep XP only if Projects needs it internally. |
| **Leaderboard** (global) | Public leaderboards demotivate most users. Off-thesis vanity. | Linked from home (2×). Keep Projects' *contextual* leaderboards if you want; kill the global one. |
| **Chat / Inbox** (1:1 DM) | Peer messaging is social, not Learn→Build→Hire. High moderation/maintenance, weak retention. Projects already has its own team/invites. | Sidebar "Inbox" → remove. Schema `chat.ts` (197 lines). |
| **Communities / social feed** | Off-thesis social product; huge maintenance, weak retention. Not even surfaced well (home links to `/community`). | Schema `communities.ts` (713 lines) - big dead weight. Don't build; remove. |
| **ShareCredits** (P2P credit transfer) | Niche, adds complexity, no growth rationale. | Linked from home (1×). `creditTransfers`. Remove UI; the paid Purchase flow stays. |
| **Referrals** | Growth mechanic with no acquisition strategy behind it yet. | Defer: hide UI, keep table dormant. Revive only with a real growth plan. |
| **Feedback (as a module)** | Doesn't need a full page/module. | Downgrade to a lightweight "Send feedback" widget. |
| **(uni) student view inside `apps/main`** | Overlaps the dedicated `apps/uni` app; multiple stubs (grades/jobs/leaderboard/mock/schedule). | Remove the `(uni)` route group from `main` - it belongs in `apps/uni`. |
| **Open Source (OSS Scout)** | The AI "scout" is a stub; `opensource.ts` schema (972 lines) is dead weight. | Remove schema if nothing real uses it. |

---

## 🟨 DECIDE - the two big built-out bets (your call, sunk cost is real)

These are genuinely built-out, so deleting them throws away real work. But keeping them is the main reason the app feels unfocused. My recommendation for each:

### KnowMe AI - **recommend: park it (hide from product), harvest its engine for Jobs**
- **What it is**: an AI persona of the user that recruiters chat with (RAG over your data). 3,378 lines, 12 tables, Upstash embeddings.
- **The problem**: it's basically a *second product*. "Recruiters chat with an AI you" is novel but unproven and off your core Build→Hire loop. It's the single biggest focus-drain.
- **The opportunity**: its **embedding pipeline (extract → embed → match)** is *exactly* what Jobs matching needs. So don't just delete - **repurpose the KnowMe embeddings/RAG infra to power real job matching**, then remove the recruiter-facing KnowMe surface (hide nav, freeze the standalone pages). You keep the valuable engine, drop the distraction.

### Pathfinder - **recommend: keep but freeze; consider merging into Projects later**
- **What it is**: career goals → subgoals → AI-verified progress. 3,726 lines, heavy AI, on-thesis (career).
- **The tension**: it's a whole parallel "structured path" system that overlaps Projects (both are guided journeys). Two engines for "guided progress" is duplicate surface.
- **Call**: keep it (it's on-thesis and built), but **stop expanding it** and plan to fold its "goal → verify" loop into Projects so there's one journey system, not two.

### Chat - covered under CUT above (recommend remove).

---

## 🎯 The Jobs matching upgrade (the thing you actually want to build)

Today's "matching" is **string overlap**: `matchScore = matchedSkills / requiredSkills × 100`, with experience/location/industry **hardcoded to 80** and a default of 70 (`actions/jobs/tabs.ts`). The UI, gating (`apply if ≥60`), spark-swipe, and `jobRecommendations` table are all wired - **only the brain is missing.** To hit the Simplify/Jobright bar:

1. **Ingest** the user's inputs - resume upload + profile links (GitHub/LinkedIn/portfolio). You already have `resume-extractor.ts` and GitHub integration.
2. **Extract structured profile** - skills, seniority, domains, years - via the AI extractor (reuse KnowMe's pipeline).
3. **Embed** job descriptions + the candidate profile into vectors (**Upstash Vector is already in your stack** - the KnowMe engine).
4. **Hybrid score** = semantic similarity (embeddings) + skill overlap + hard filters (location, seniority, visa/remote). Replace the hardcoded 80s.
5. **Show it like the market does**: ranked jobs with a **% match, "why you match," and missing keywords** (the Jobscan/Simplify pattern that converts).

This single upgrade turns Jobs from a generic board into your differentiator, and it *reuses* the KnowMe embedding work you'd otherwise throw away.

---

## Suggested focus order

1. **Delete the stubs** (CUT NOW) - instant clarity, zero risk.
2. **Remove the clutter** (Achievements, global Leaderboard, Chat, Communities, ShareCredits, uni-in-main; defer Referrals). Prune the home dashboard + sidebar to match.
3. **Park KnowMe** (hide surface) and **harvest its embedding engine** for →
4. **Upgrade Jobs matching** (the differentiator).
5. **Keep shipping Projects**, and keep Practice / Mock-voice / the 3 real AI tools as the interview-prep layer.
6. Later: merge Pathfinder's goal→verify loop into Projects.

## Deletion mechanics (do it safely)
- The **web/main split is already done**, so marketing is untouched by any of this.
- Delete in this order per module: nav entry → page routes → components → actions → **DB schema last** (only after confirming no other module imports the tables - Projects/University reuse several project tables, so check before dropping).
- High-coupling - **do not delete**: `purchase`, `home`, `profile`, `packages/db` core (`schema.ts`, `credits.ts`, `profile.ts`).
- `r/[slug]` is **not** a standalone module - it's the public face of the Resume Creator + PDF. Keep it with `ai/resume`.
