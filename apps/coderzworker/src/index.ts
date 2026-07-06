import { getContainer } from "@cloudflare/containers"
import type { Env } from "./env"
export { CodeExecutor } from "./executor-container"

// Spread execution load across a small pool of warm container instances
// (matches wrangler `max_instances`).
const POOL_SIZE = 5

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (url.pathname === "/health") {
			return Response.json({ ok: true })
		}

		if (request.method === "POST" && url.pathname === "/api/v1/execute") {
			// Auth: the main app sends `Authorization: Bearer <WORKER_SECRET>`.
			const auth = request.headers.get("Authorization") ?? ""
			if (!env.WORKER_SECRET || auth !== `Bearer ${env.WORKER_SECRET}`) {
				return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
			}

			// Pick a pooled instance and proxy the request to its container.
			const instance = `pool-${Math.floor(Math.random() * POOL_SIZE)}`
			const container = getContainer(env.CODE_EXECUTOR, instance)
			try {
				return await container.fetch(request)
			} catch (err) {
				return Response.json(
					{ success: false, error: err instanceof Error ? err.message : "Execution service unavailable" },
					{ status: 502 },
				)
			}
		}

		return new Response("Not found", { status: 404 })
	},
}
