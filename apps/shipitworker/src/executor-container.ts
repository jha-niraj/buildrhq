import { Container } from "@cloudflare/containers"
import type { Env } from "./env"

// A Durable Object backed by a Cloudflare Container. The `@cloudflare/containers`
// base class owns the container lifecycle (start, wait-for-ready, proxy to
// defaultPort, idle sleep). Each request is proxied to the executor HTTP server
// running inside the container (container/server.mjs on :8080).
export class CodeExecutor extends Container<Env> {
	defaultPort = 8080
	// Keep instances warm for a few minutes so repeated runs skip cold starts,
	// then let them sleep to save cost.
	sleepAfter = "3m"
}
