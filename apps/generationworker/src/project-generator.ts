import { DurableObject } from "cloudflare:workers"
import { eq } from "drizzle-orm"
import type { Env } from "./env"
import { createDb, schema } from "./db"
import { runGeneration, type GenerationInput } from "./pipeline"

const { backgroundJobs } = schema

interface StoredJob {
	jobId: string
	userId: string
	input: GenerationInput
}

// One Durable Object instance per generation job (addressed by jobId). It owns the
// job's lifecycle: /start persists the input + schedules an Alarm; alarm() runs the
// 1–1.5 min pipeline and writes status/progress to Postgres server-side (so the UI
// keeps seeing progress even if the browser closes).
export class ProjectGenerator extends DurableObject<Env> {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === "POST" && url.pathname.endsWith("/start")) {
			const body = (await request.json()) as StoredJob
			await this.ctx.storage.put("job", body)
			await this.ctx.storage.put("phase", "pending")
			// Kick the pipeline off the request path via an immediate alarm.
			await this.ctx.storage.setAlarm(Date.now() + 100)
			await this.writeStatus(body.jobId, "active", 5)
			return Response.json({ ok: true, jobId: body.jobId })
		}

		if (url.pathname.endsWith("/status")) {
			const phase = (await this.ctx.storage.get<string>("phase")) ?? "unknown"
			const result = await this.ctx.storage.get<unknown>("result")
			return Response.json({ phase, result: result ?? null })
		}

		return new Response("Not found", { status: 404 })
	}

	async alarm(): Promise<void> {
		const phase = await this.ctx.storage.get<string>("phase")
		// Guard against duplicate runs (alarms can re-fire if the DO is evicted mid-run).
		if (phase === "running" || phase === "done" || phase === "failed") return
		const job = await this.ctx.storage.get<StoredJob>("job")
		if (!job) return

		await this.ctx.storage.put("phase", "running")
		const db = createDb(this.env.DATABASE_URL)

		try {
			const result = await runGeneration(
				db,
				this.env.OPENAI_API_KEY,
				job.input,
				job.userId,
				(progress, phaseLabel) => this.writeStatus(job.jobId, "active", progress, undefined, undefined, phaseLabel),
			)
			await this.writeStatus(job.jobId, "completed", 100, result)
			await this.ctx.storage.put("result", result)
			await this.ctx.storage.put("phase", "done")
		} catch (err) {
			const message = err instanceof Error ? err.message : "Generation failed"
			// Catch (don't rethrow) so the alarm doesn't auto-retry and create duplicates.
			await this.writeStatus(job.jobId, "failed", 0, undefined, message)
			await this.ctx.storage.put("phase", "failed")
		}
	}

	private async writeStatus(
		jobId: string,
		status: string,
		progress: number,
		result?: unknown,
		error?: string,
		phaseLabel?: string,
	): Promise<void> {
		try {
			const db = createDb(this.env.DATABASE_URL)
			await db
				.update(backgroundJobs)
				.set({
					status,
					progress,
					...(result !== undefined ? { result: { ...(result as object), phaseLabel } as unknown } : phaseLabel ? { result: { phaseLabel } as unknown } : {}),
					...(error ? { error } : {}),
					updatedAt: new Date(),
				})
				.where(eq(backgroundJobs.jobId, jobId))
		} catch {
			// Status writes are best-effort; the pipeline continues regardless.
		}
	}
}
