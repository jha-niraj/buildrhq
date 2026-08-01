# Deployment

Every deployable app in this monorepo ships to **Cloudflare Workers**. The Next.js apps go
through `@opennextjs/cloudflare`; the two background workers are plain Workers.

## What deploys where

| App | Type | Worker name | Port (dev) |
|---|---|---|---|
| `apps/web` | Next (marketing, `shiprhq.com`) | `shiprhq-web` | 4100 |
| `apps/main` | Next (product, `app.shiprhq.com`) | `shiprhq-main` | 4101 |
| `apps/admin` | Next | `shiprhq-admin` | 3005 |
| `apps/hiring` | Next | `shiprhq-hiring` | 3002 |
| `apps/uni` | Next | `shiprhq-uni` | 3003 |
| `apps/shiprworker` | Cloudflare Worker | `shiprhq-shiprworker` | - |
| `apps/generationworker` | Cloudflare Worker | `shiprhq-generation` | - |

Each Next app owns two config files:

- `wrangler.jsonc` - worker name, compatibility flags, asset + R2 bindings
- `open-next.config.ts` - the OpenNext adapter config (incremental cache)

## One-time setup

The R2 bucket backing the Next incremental cache is **shared by all the Next apps**, so it
only has to be created once for the whole monorepo:

```bash
wrangler r2 bucket create shiprhq-next-cache
```

Each app namespaces its own entries inside that bucket via `NEXT_INC_CACHE_R2_PREFIX` in its
`wrangler.jsonc`, so they cannot collide.

The binding name must stay exactly `NEXT_INC_CACHE_R2_BUCKET` - that is the name
`r2IncrementalCache` looks up. Rename it and nothing errors; the cache just silently never
hits and every request re-renders inside the Worker.

## Commands

From an app directory (or `pnpm --filter <app> <script>` from the root):

```bash
pnpm deploy:build     # build the Worker bundle into .open-next/
pnpm preview          # run that bundle locally in workerd
pnpm deploy           # build + wrangler deploy        (code only - the default)
pnpm deploy:secrets   # build + deploy, also uploading secrets
pnpm cf-typegen       # regenerate cloudflare-env.d.ts from the wrangler bindings
```

`deploy` never depends on a local secrets file. Secrets are uploaded only by
`deploy:secrets`, which reads `secrets.json` (admin, hiring, uni, main) or `.env.production`
(web). Both are gitignored. Setting secrets once via the Cloudflare dashboard or
`wrangler secret put` and then using plain `deploy` is equally valid.

## Rules that are easy to get wrong

**Middleware must stay named `middleware.ts` - never `proxy.ts`.**
Next 16 renames Middleware to Proxy. Do not make that rename here: the Cloudflare adapter
does not support the `proxy.ts` convention, while `middleware.ts` is still fully supported by
Next 16 and is what OpenNext bundles. `apps/main`, `apps/hiring` and `apps/uni` each have a
`middleware.ts` that must keep its name.

**`public/_headers` does nothing on Workers.**
`_headers` is a Cloudflare *Pages* feature and is silently ignored by a Workers deploy.
Declare security and cache headers in `next.config.mjs` / `next.config.js` under `headers()`
instead, or they will look correct in the repo and never be sent.

**Workspace packages need `transpilePackages`.**
`@repo/ui`, `@repo/db`, `@repo/auth` and `@repo/email` all export raw `.ts`/`.tsx` from
`src/` with no build step, so every Next app must list the ones it uses in
`transpilePackages`.

**Keep `open-next.config.ts` minimal.**
No `enableCacheInterception`, no `withRegionalCache`, no Durable Object sharded tag cache.
That combination caused intermittent production 500s on this stack in a sibling project. Add
the DO tag cache only for an app that genuinely uses tag-based revalidation.

**Node 20.9+ is required** (Next 16). The root `engines` field enforces it.

## Version alignment

| Package | Version |
|---|---|
| `next` | `^16.2.12` |
| `@opennextjs/cloudflare` | `^1.20.2` |
| `wrangler` | `^4.116.0` |
| `react` / `react-dom` | `^19.2.0` |

`@opennextjs/cloudflare@1.20.2` requires `next >=15.5.21 <16 || >=16.2.11`, so the Next and
adapter versions have to move together. If you bump one, check the other's peer range.

> **`apps/main` is still on Next 15.4.10 / OpenNext 1.19.8.** It was intentionally left
> behind while the other apps were upgraded, because it had active in-flight changes at the
> time. It needs the same treatment: bump `next`, `@opennextjs/cloudflare` and `wrangler`,
> add `transpilePackages`, and add the R2 cache binding to its `wrangler.jsonc` (the
> commented-out block is already there). Its `middleware.ts` keeps its name.
