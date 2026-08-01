# ShiprWorker — Cloudflare Container code executor

Runs user code (JS, TS, Python, Java, C, C++) for ShiprHQ practice. A Cloudflare
Worker + Durable Object owns a Cloudflare Container (Linux sandbox with the runtimes);
the code runs inside the container (Workers can't run Docker/child_process).

- `src/index.ts` — Worker: `Bearer WORKER_SECRET` auth, proxies `/api/v1/execute` to a pooled container.
- `src/executor-container.ts` — `CodeExecutor` DO (`@cloudflare/containers`), port 8080.
- `container/server.mjs` — executor server running inside the container.
- `Dockerfile` — image with node/tsx/python3/gcc/g++/jdk.
- `wrangler.jsonc` — containers + durable_objects + migrations.

API: `POST /api/v1/execute` `{ code, language, testCases? }` -> `{ success, stdout, stderr, exitCode, executionTimeMs, testResults?, allTestsPassed? }`.

Deploy (paid Workers plan + Containers): `wrangler secret put WORKER_SECRET` (match the main app), then `pnpm --filter shiprworker deploy`. Point `NEXT_PUBLIC_WORKER_URL` at the deployed URL.
