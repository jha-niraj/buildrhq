import type { Env } from "./env"
import { verifyWorkerToken } from "./token"
export { ProjectGenerator } from "./project-generator"
export { VerificationGenerator } from "./verification-generator"

function bearer(request: Request): string | null {
	const h = request.headers.get("Authorization") ?? ""
	return h.startsWith("Bearer ") ? h.slice(7) : null
}

const cors = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
	"Access-Control-Allow-Headers": "Authorization,Content-Type",
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === "OPTIONS") return new Response(null, { headers: cors })
		if (url.pathname === "/health") return Response.json({ ok: true })

		// Start a generation job.
		if (request.method === "POST" && url.pathname === "/api/v1/generateproject") {
			const token = bearer(request)
			const payload = token ? await verifyWorkerToken(token, env.WORKER_SECRET) : null
			if (!payload || payload.action !== "generate_project") {
				return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: cors })
			}

			const body = (await request.json()) as { jobId: string; input: unknown }
			if (!body?.jobId || !body?.input) {
				return Response.json({ success: false, error: "Missing jobId or input" }, { status: 400, headers: cors })
			}

			const id = env.PROJECT_GENERATOR.idFromName(body.jobId)
			const stub = env.PROJECT_GENERATOR.get(id)
			await stub.fetch("https://do/start", {
				method: "POST",
				body: JSON.stringify({ jobId: body.jobId, userId: payload.userId, input: body.input }),
			})

			return Response.json({ success: true, jobId: body.jobId }, { headers: cors })
		}

		// Start a Pathfinder verification-generation job.
		if (request.method === "POST" && url.pathname === "/api/v1/generateverification") {
			const token = bearer(request)
			const payload = token ? await verifyWorkerToken(token, env.WORKER_SECRET) : null
			if (!payload || payload.action !== "generate_verification") {
				return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: cors })
			}

			const body = (await request.json()) as { jobId: string; goalId: string }
			if (!body?.jobId || !body?.goalId) {
				return Response.json({ success: false, error: "Missing jobId or goalId" }, { status: 400, headers: cors })
			}

			const id = env.VERIFICATION_GENERATOR.idFromName(body.jobId)
			const stub = env.VERIFICATION_GENERATOR.get(id)
			await stub.fetch("https://do/start", {
				method: "POST",
				// userId comes from the signed token, never the request body — the
				// caller must not be able to run a generation as somebody else.
				body: JSON.stringify({ jobId: body.jobId, userId: payload.userId, goalId: body.goalId }),
			})

			return Response.json({ success: true, jobId: body.jobId }, { headers: cors })
		}

		// Optional: read live phase straight from the DO (the app usually polls the DB).
		const jobMatch = url.pathname.match(/^\/api\/v1\/job\/([^/]+)$/)
		if (request.method === "GET" && jobMatch) {
			const token = bearer(request)
			const payload = token ? await verifyWorkerToken(token, env.WORKER_SECRET) : null
			if (!payload) return Response.json({ success: false, error: "Unauthorized" }, { status: 401, headers: cors })

			const jobId = jobMatch[1]!
			const id = env.PROJECT_GENERATOR.idFromName(jobId)
			const stub = env.PROJECT_GENERATOR.get(id)
			const res = await stub.fetch("https://do/status")
			const data = await res.json()
			return Response.json({ success: true, ...(data as object) }, { headers: cors })
		}

		return new Response("Not found", { status: 404, headers: cors })
	},
}
