# Deploying `apps/main` to Cloudflare Workers

The app deploys to Cloudflare Workers through [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare),
which compiles the Next server into a Worker bundle and uploads the static output to
Cloudflare's asset CDN. `apps/web` deploys the same way, to a separate Worker.

| File | Role |
| --- | --- |
| `open-next.config.ts` | OpenNext adapter config - currently just the R2 incremental cache. |
| `wrangler.jsonc` | Worker name, compatibility flags, asset + R2 bindings, observability. |
| `.env` | **Local** values. Untouched by deploys. |
| `.env.production` | **Production** values. Gitignored - holds live secrets. |
| `.env.production.example` | Committed template for the above. |
| `.open-next/` | Build output. Generated, gitignored. Never edit or commit. |

## How environment values reach production

`.env.production` does two different jobs, which is why the public URLs and the
secrets live in one file:

1. **Build time.** `next build` sets `NODE_ENV=production`, and Next then loads
   `.env.production` automatically (it takes precedence over `.env`). Every
   `NEXT_PUBLIC_*` value is *inlined into the client bundle at this point*. If the
   production domains are not in that file, the deployed bundle ships `localhost`
   URLs - there is no runtime fix for that, it has to be right before the build.
2. **Runtime.** `pnpm deploy` passes the same file to
   `wrangler deploy --secrets-file .env.production`, uploading each key as a
   Cloudflare Worker secret for the server side (`DATABASE_URL`,
   `BETTER_AUTH_SECRET`, API keys, …).

`--secrets-file` is **additive**: a key you leave out keeps whatever value it
already has in production. But a key that is *present with an empty value* is
uploaded as an empty string and **overwrites the live secret**. So the rule is
delete the line, never blank it - which is why the generated `.env.production`
ships with every secret commented out rather than set to `""`.

## One-time setup

```bash
# 1. Authenticate (interactive - run this yourself)
npx wrangler login

# 2. Create the shared incremental-cache bucket. apps/web and apps/main both use it;
#    they are namespaced apart by NEXT_INC_CACHE_R2_PREFIX in each wrangler.jsonc,
#    so create it once and skip this if apps/web already did.
npx wrangler r2 bucket create shipithq-next-cache
```

## Secrets

`wrangler.jsonc` `vars` are **public** - they end up in the bundle, so only
non-sensitive things belong there. Everything sensitive goes in `.env.production`
and is pushed by `pnpm deploy`.

```bash
cp .env.production.example .env.production   # if you don't have it yet
# fill in every secret; DELETE any line you are not setting
pnpm deploy
```

A single secret can also be set without a full deploy:

```bash
npx wrangler secret put DATABASE_URL
```

`.env.production` is gitignored (the blanket `.env*` rule);
`.env.production.example` is explicitly un-ignored so the template stays in git.

## Commands

```bash
pnpm deploy             # build + deploy + push .env.production as secrets
pnpm deploy:no-secrets  # build + deploy, leaving existing secrets untouched
pnpm deploy:build       # build the Worker bundle only
pnpm preview            # build, then run it locally on workerd (closest to prod)
pnpm cf-typegen         # regenerate cloudflare-env.d.ts from the bindings
```

All of these set `--max-old-space-size=8192`. That is not decoration: a plain
`next build` on this app is OOM-killed at Node's default heap, and the OpenNext build
runs a bundling pass on top of the Next build.

Every app in the monorepo (`web`, `main`, `uni`, `hiring`, `admin`) exposes the same
five scripts and the same `.env.production` convention.

## Things that bite

- **`global_fetch_strictly_public` is required.** `middleware.ts` resolves the session by
  fetching its own `/api/auth/get-session`. Without that compatibility flag the subrequest
  does not resolve to the public route on Workers and every request is treated as
  logged-out. Note this is one extra round trip per request - if it ever shows up in
  latency, read the session from the better-auth cookie cache in middleware instead.
- **`public/_headers` does nothing here.** That is a Cloudflare *Pages* feature and is
  silently ignored by a Workers deploy. Response headers belong in `next.config.mjs`
  under `headers()`.
- **Don't add the Durable Object tag cache pre-emptively.** `doShardedTagCache` plus
  `enableCacheInterception` caused intermittent production 500s on this stack in a sibling
  project. Nothing in this app calls `revalidateTag`. If that changes, add the DO override
  and the matching `durable_objects` + `migrations` blocks in `wrangler.jsonc` together -
  the Worker fails to boot if the binding is missing.
- **`serverExternalPackages` is load-bearing.** `@react-pdf/renderer`, `mammoth` and
  `sass` are not Workers-compatible when bundled; `sass` alone added ~4 MB via
  `@excalidraw/excalidraw`'s optional peer dep.
