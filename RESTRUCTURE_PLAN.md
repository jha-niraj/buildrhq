# ShipItHQ - Monorepo Restructure Plan

> Goal: split the public/marketing surface out of `apps/main` into a dedicated
> `apps/web`, matching the proven convention used in **gurukulofficial** and
> **syncorbitofficial** (separate Next.js apps per surface, on separate
> subdomains, sharing `@repo/*` packages).

---

## 1. Where we are today

`shipithq` is already a **Turborepo + pnpm** monorepo. Stack: Next.js 15.4 (App
Router), React 19, Tailwind 4, **better-auth**, **Drizzle** ORM.

**Apps**
| App | Port | Role | Notes |
|---|---|---|---|
| `main` | 3000 | **Monolith** - mixes marketing + the authenticated product | needs splitting |
| `uni` | 3001 | University/institution side (faculty, departments, placements, students) | ok |
| `hiring` | 3002 | Recruiter/company side (candidates, jobs, applications, interviews) | ok |
| `admin` | 3003 | Internal admin console | ok |
| `shipitworker` | - | Express + BullMQ + Dockerode code-execution worker (not Next.js) | ok |

**Packages** - `auth` (better-auth), `db` (Drizzle, domain-split schema), `ui`
(shadcn/Radix), `eslint-config`, `typescript-config`. All consumed via
`workspace:*`. These are in good shape and already match the reference repos.

**The problem - `apps/main` conflates two surfaces:**

```
apps/main/app/
├── page.tsx                 ← MARKETING landing (ShipItHQ hero/features/pricing)
├── (home)/                  ← MARKETING  (aboutus, blogs)
├── (legal)/                 ← MARKETING  (privacypolicy, termsofservice)
├── (auth)/                  ← APP        (signin, register, onboarding, verify…)
├── (main)/                  ← APP        (ai, chat, practice, mock, pathfinder,
│                                          projects, purchase, profile, home…)
├── (jobs)/                  ← APP        (candidate job board: browse, applications, saved)
├── (uni)/uni/               ← APP        (student university view - overlaps apps/uni)
└── api/                     ← APP        (large API surface)
```

Marketing content (landing, about, blogs, legal, SEO, `content/` MDX,
`components/landingpage/*`, `components/homepage/*`) is bundled into the same
deploy as the gated product.

---

## 2. Target architecture

Follow the reference convention exactly: **one Next.js app per surface**,
separate subdomains, shared design system + auth + db.

| App | Subdomain | Port | Contents |
|---|---|---|---|
| **`web`** *(new)* | `shipithq.com` | 3004 | Marketing landing, about, blogs, legal, pricing, SEO. **No auth, no middleware, no DB writes.** Minimal deps. |
| `main` | `app.shipithq.com` | 3000 | The authenticated product: `(auth)`, `(main)`, `(jobs)`, `api`. Behind middleware + layout guards. |
| `uni` | `uni.shipithq.com` | 3001 | (unchanged) |
| `hiring` | `hiring.shipithq.com` | 3002 | (unchanged) |
| `admin` | `admin.shipithq.com` | 3003 | (unchanged) |
| `shipitworker` | (internal) | - | (unchanged) |

**How the two surfaces bridge** (identical to gurukul/synchq):
1. **Shared `@repo/ui`** - both apps import the same `globals.css`, fonts,
   `ThemeProvider`, components → one visual system, zero duplication.
2. **`next.config` `redirects()` on both sides** - `web` bounces any app path
   (`/signin`, `/register`, `/home`, `/purchase`, `/onboarding`…) to
   `NEXT_PUBLIC_APP_URL`; `main` bounces stale marketing paths (`/aboutus`,
   `/blogs`, `/privacypolicy`…) back to `NEXT_PUBLIC_WEB_URL`. **Query strings
   preserved** so pricing→checkout handoff survives.
3. **Cross-subdomain better-auth cookies** - add `advanced.crossSubDomainCookies`
   + `cookieDomain: .shipithq.com` in `packages/auth` so a session set on
   `app.shipithq.com` is readable by `web` (lets the marketing navbar show
   "Go to Dashboard" when logged in). Distinct `cookiePrefix` per app avoids
   clobbering on shared localhost.
4. **Env URLs** - `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_APP_URL` (+ existing
   `NEXT_PUBLIC_UNI_URL`, `_HIRING_URL`, `_ADMIN_URL`).

---

## 3. What moves - `apps/main` → `apps/web`

**Move OUT of `apps/main` and INTO the new `apps/web`:**

| From `apps/main` | To `apps/web` |
|---|---|
| `app/page.tsx` (landing) | `app/page.tsx` |
| `app/(home)/` (aboutus, blogs) | `app/(home)/` |
| `app/(legal)/` (privacy, terms) | `app/(legal)/` |
| `app/sitemap.ts`, `app/robots.ts` | `app/sitemap.ts`, `app/robots.ts` |
| `content/` (blog posts, authors, blog.ts) | `content/` |
| `components/landingpage/*` (14 files) | `components/` |
| `components/homepage/*`, `components/blog/*` | `components/` |
| marketing bits of `public/` (og images, blog images) | `public/` |

**Add fresh in `apps/web`** (SEO surface, per synchq): `robots.ts`, `sitemap.ts`,
`manifest.ts`, `llms.txt`, `json-ld` component, `lib/seo`.

**Stays in `apps/main`:** `(auth)`, `(main)`, `(jobs)`, `(uni)` *(pending
decision #3)*, `api/`, `actions/`, `middleware.ts`, and all product components.
Public-but-explorable product pages (`/practice`, `/projects`, `/ai`, `/mock`,
`/leaderboard` - currently in the middleware allow-list) **stay in `main`** and
remain publicly viewable there; only *pure marketing* moves to `web`. (This
matches how gurukul/synchq keep `/checkout` etc. in the app and just whitelist
them.)

---

## 4. Concrete wiring changes

**`packages/auth/src/auth.ts`**
- Add `advanced: { crossSubDomainCookies: { enabled: true, domain: process.env.AUTH_COOKIE_DOMAIN }, cookiePrefix: "shipithq", useSecureCookies: <prod> }`.
- Add `NEXT_PUBLIC_WEB_URL` / `NEXT_PUBLIC_APP_URL` to `trustedOrigins`.

**`apps/web`** (new) - scaffold from `apps/main`'s config as the template:
- `package.json` (name `web`, port 3004, **trimmed deps** - no better-auth
  server, no AI/payments/worker SDKs; keep `next`, `react`, `@repo/ui`, MDX,
  framer-motion, lenis).
- `next.config.mjs` with `redirects()` → app subdomain; MDX; image
  remotePatterns; **no PWA/auth**.
- `tsconfig.json` (extends `@repo/typescript-config/nextjs.json`, `@/*` alias),
  `postcss.config.mjs`, `eslint.config.js`, `open-next.config.ts`,
  `wrangler.jsonc`, `.env` + `.env.example`.
- `app/layout.tsx` importing `@repo/ui/styles/globals.css` + `ThemeProvider`.
- **No `middleware.ts`.**

**`apps/main`**
- `next.config.mjs`: add `redirects()` → bounce moved marketing paths to
  `NEXT_PUBLIC_WEB_URL`.
- `middleware.ts`: drop marketing paths from the route lists; keep product
  gating.
- Delete the moved files/dirs after verifying `web` renders them.

**Root**
- `turbo.json`: add `NEXT_PUBLIC_WEB_URL`, `NEXT_PUBLIC_APP_URL`,
  `AUTH_COOKIE_DOMAIN` to `globalEnv`/task `env`.
- `apps/web` is auto-picked up by the existing `apps/*` workspace glob.

---

## 5. Migration phases (each independently reviewable/committable)

- **Phase 0 - Scaffold `apps/web`** (empty shell that builds & runs on :3004,
  shares `@repo/ui`, renders a placeholder). No moves yet. ✅ safe.
- **Phase 1 - Move legal + about** (lowest risk, static). Wire `redirects()`
  both ways. Verify.
- **Phase 2 - Move blogs** (`content/` MDX + blog components + blog images).
- **Phase 3 - Move the landing page** + `components/landingpage/*` +
  `components/homepage/*` + og images. This is the big visual one.
- **Phase 4 - SEO** - move/author `sitemap.ts`, `robots.ts`, add `manifest.ts`,
  `llms.txt`, JSON-LD. Point canonical URLs at `shipithq.com`.
- **Phase 5 - Auth cookies** - cross-subdomain cookie config; marketing navbar
  reads session to toggle "Sign in" ↔ "Dashboard".
- **Phase 6 - Cleanup** - delete moved code from `main`, prune `main`'s deps,
  update middleware allow-lists, docs/CLAUDE.md, `.env.example`s.

Each phase: `pnpm --filter web dev` + `--filter main dev` running together,
click through moved pages + the redirect bounces, then commit.

---

## 6. Open decisions (need your call before/at implementation)

1. **Production domains.** Assumed `shipithq.com` (web) + `app.shipithq.com`
   (main), `uni.` / `hiring.` / `admin.` subdomains. Confirm the real domain +
   whether app lives at `app.` or a path.
2. **Pricing page** - keep `/purchase` (checkout) in `main`, but put a marketing
   **`/pricing`** page in `web` that deep-links into `main`'s checkout with the
   plan preselected (synchq pattern)? Recommended: **yes**.
3. **`apps/main/app/(uni)/uni/`** - a *student's* university view (assignments,
   classes, grades, schedule, mock, studio) that overlaps `apps/uni` (which is
   the *institution* side). Keep it in `main` as-is, move it to `apps/uni`, or
   leave for a later pass? Recommend: **leave in `main` for now**, out of scope
   for the web split.
4. **`content/` ownership** - blog MDX moves fully to `web`. If `main` ever
   needs to render a blog teaser, it deep-links to `web`. Confirm no in-app
   surface reads `content/` (I'll verify during Phase 2).

---

## 7. After the split - feature work

Once `web`/`main` are cleanly separated, feature work parallelizes cleanly:
marketing/SEO iterates on `web` independently; product features land in `main`
(or `uni`/`hiring`) without touching the marketing deploy. We'll pick the first
feature to build after you approve this structure.
