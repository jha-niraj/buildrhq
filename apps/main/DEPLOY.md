# Deploying `apps/main` to Cloudflare Workers

The app deploys to Cloudflare Workers through [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare),
which compiles the Next server into a Worker bundle and uploads the static output to
Cloudflare's asset CDN. `apps/web` deploys the same way, to a separate Worker.

| File | Role |
| --- | --- |
| `open-next.config.ts` | OpenNext adapter config — currently just the R2 incremental cache. |
| `wrangler.jsonc` | Worker name, compatibility flags, asset + R2 bindings, observability. |
| `.open-next/` | Build output. Generated, gitignored. Never edit or commit. |

## One-time setup

```bash
# 1. Authenticate (interactive — run this yourself)
npx wrangler login

# 2. Create the shared incremental-cache bucket. apps/web and apps/main both use it;
#    they are namespaced apart by NEXT_INC_CACHE_R2_PREFIX in each wrangler.jsonc,
#    so create it once and skip this if apps/web already did.
npx wrangler r2 bucket create buildrhq-next-cache
```

## Secrets

`wrangler.jsonc` `vars` are **public** — they end up in the bundle. Everything sensitive
(`DATABASE_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`,
`OPENAI_API_KEY`, …) must be uploaded as a Worker secret:

```bash
# one at a time
npx wrangler secret put DATABASE_URL

# or in bulk from a local file (same KEY=value format as .env)
pnpm deploy:secrets     # builds, deploys, then pushes .env.production as secrets
```

`.env.production` is gitignored along with every other `.env*`.

## Commands

```bash
pnpm deploy:build   # build the Worker bundle only
pnpm preview        # build, then run it locally on workerd (closest thing to prod)
pnpm deploy         # build + wrangler deploy
pnpm cf-typegen     # regenerate cloudflare-env.d.ts from the bindings
```

All of these set `--max-old-space-size=8192`. That is not decoration: a plain
`next build` on this app is OOM-killed at Node's default heap, and the OpenNext build
runs a bundling pass on top of the Next build.

## Things that bite

- **`global_fetch_strictly_public` is required.** `middleware.ts` resolves the session by
  fetching its own `/api/auth/get-session`. Without that compatibility flag the subrequest
  does not resolve to the public route on Workers and every request is treated as
  logged-out. Note this is one extra round trip per request — if it ever shows up in
  latency, read the session from the better-auth cookie cache in middleware instead.
- **`public/_headers` does nothing here.** That is a Cloudflare *Pages* feature and is
  silently ignored by a Workers deploy. Response headers belong in `next.config.mjs`
  under `headers()`.
- **Don't add the Durable Object tag cache pre-emptively.** `doShardedTagCache` plus
  `enableCacheInterception` caused intermittent production 500s on this stack in a sibling
  project. Nothing in this app calls `revalidateTag`. If that changes, add the DO override
  and the matching `durable_objects` + `migrations` blocks in `wrangler.jsonc` together —
  the Worker fails to boot if the binding is missing.
- **`serverExternalPackages` is load-bearing.** `@react-pdf/renderer`, `mammoth` and
  `sass` are not Workers-compatible when bundled; `sass` alone added ~4 MB via
  `@excalidraw/excalidraw`'s optional peer dep.
