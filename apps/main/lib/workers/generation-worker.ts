import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Talking to the generation worker.
//
// In production both this app and the generation worker run on Cloudflare, so
// they are wired together with a SERVICE BINDING (`GENERATION_WORKER` in
// apps/main/wrangler.jsonc) rather than a public fetch to workers.dev:
//
//   - the request never leaves Cloudflare's network — no DNS, no TLS handshake,
//     no public hop, and no egress
//   - there is no URL to keep in sync across preview/staging/production
//   - the generation worker never has to be publicly reachable
//
// Locally there is no binding, because `next dev` is not running inside a
// Worker. So this falls back to an HTTP fetch at `GENERATION_WORKER_URL`
// (default `http://localhost:8787`, where `wrangler dev` serves the worker).
//
// Both paths speak the same protocol — a `Request` in, a `Response` out — so
// callers do not branch. That is the whole reason this file exists: without it
// every call site would need its own binding-or-fetch conditional, and they
// would drift.
// ─────────────────────────────────────────────────────────────────────────────

/** The subset of a Cloudflare service binding this app uses. */
interface ServiceBinding {
    fetch: (request: Request) => Promise<Response>;
}

/**
 * The service binding, or null when not running on Workers.
 *
 * `getCloudflareContext` is imported lazily: `next dev` does not run inside a
 * Worker and importing it eagerly at module scope makes local development fail
 * on a module that can never resolve there.
 */
async function getBinding(): Promise<ServiceBinding | null> {
    try {
        const { getCloudflareContext } = await import("@opennextjs/cloudflare");
        const ctx = await getCloudflareContext({ async: true });
        const binding = (ctx?.env as Record<string, unknown> | undefined)?.GENERATION_WORKER;
        // Duck-typed rather than instanceof: the binding is a Fetcher, not a class
        // this bundle has a reference to.
        if (binding && typeof (binding as ServiceBinding).fetch === "function") {
            return binding as ServiceBinding;
        }
        return null;
    } catch {
        // Not on Workers (local dev, or a build-time import). Fall back to HTTP.
        return null;
    }
}

function fallbackUrl(): string {
    return process.env.GENERATION_WORKER_URL || process.env.WORKER_API_URL || "http://localhost:8787";
}

/**
 * Call the generation worker.
 *
 * `path` is worker-relative, e.g. `/api/v1/generateverification`.
 *
 * Over a service binding the hostname is ignored by Cloudflare but a valid
 * absolute URL is still required to construct the `Request`, hence the
 * placeholder origin.
 */
export async function callGenerationWorker(
    path: string,
    init: { method?: string; token: string; body?: unknown },
): Promise<Response> {
    const request = (url: string) =>
        new Request(url, {
            method: init.method ?? "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${init.token}`,
            },
            ...(init.body !== undefined ? { body: JSON.stringify(init.body) } : {}),
        });

    const binding = await getBinding();
    if (binding) {
        return binding.fetch(request(`https://generation-worker${path}`));
    }
    return fetch(request(`${fallbackUrl()}${path}`));
}

/** Which transport a call would use — for diagnostics and startup logging. */
export async function generationWorkerTransport(): Promise<"service-binding" | "http"> {
    return (await getBinding()) ? "service-binding" : "http";
}
