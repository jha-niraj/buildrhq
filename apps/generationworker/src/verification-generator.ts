import { DurableObject } from "cloudflare:workers"
import { eq } from "drizzle-orm"
import type { Env } from "./env"
import { createDb, schema } from "./db"
import type { JobStatus } from "@repo/db/schema"

const { backgroundJobs, pathfinderGoals, pathfinderVerifications, mockInterviewVoice } = schema

/**
 * Pathfinder verification generation, moved off the request path.
 *
 * Why this exists: the app ran this inline in a server action. It calls the
 * OpenAI **Assistants** API, which is not a single completion — it creates a
 * thread, starts a run, then POLLS for the run to finish, up to 90 times at one
 * second apart. That is up to 90 seconds of blocking sleep inside a server
 * action, which Cloudflare will kill long before it finishes. The user had
 * already been charged by then.
 *
 * One DO instance per job, addressed by jobId. `/start` persists the input and
 * schedules an immediate alarm; `alarm()` does the slow work and writes
 * status/progress to Postgres, so the UI keeps seeing progress even if the
 * browser is closed — which for a multi-week goal is the entire point.
 *
 * The prompt, the assistant id and the response schema are UNCHANGED from the
 * inline version. This migration moves where the work runs, nothing else.
 */

/** The pointer the app hands over. Deliberately not the goal payload — the DO
 *  re-reads current data, because minutes can pass before the alarm fires. */
interface StoredJob {
	jobId: string
	userId: string
	goalId: string
}

interface AssistantRun {
	id: string
	status: string
	last_error?: { message?: string }
}

/** Matches the inline version's polling budget exactly: 90 attempts, 1s apart. */
const MAX_POLL_ATTEMPTS = 90
const POLL_INTERVAL_MS = 1000

export class VerificationGenerator extends DurableObject<Env> {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url)

		if (request.method === "POST" && url.pathname.endsWith("/start")) {
			const body = (await request.json()) as StoredJob
			await this.ctx.storage.put("job", body)
			await this.ctx.storage.put("phase", "pending")
			await this.ctx.storage.setAlarm(Date.now() + 100)
			await this.writeStatus(body.jobId, "active", 5, undefined, undefined, "Preparing")
			return Response.json({ ok: true, jobId: body.jobId })
		}

		if (url.pathname.endsWith("/status")) {
			const phase = (await this.ctx.storage.get<string>("phase")) ?? "unknown"
			return Response.json({ phase })
		}

		return new Response("Not found", { status: 404 })
	}

	async alarm(): Promise<void> {
		// Alarms re-fire if the DO is evicted mid-run. Without this guard the
		// generation runs twice — and with credits held against the job, a second
		// run is a second charge.
		const phase = await this.ctx.storage.get<string>("phase")
		if (phase === "running" || phase === "done" || phase === "failed") return

		const job = await this.ctx.storage.get<StoredJob>("job")
		if (!job) return

		await this.ctx.storage.put("phase", "running")

		try {
			const plan = await this.generate(job)
			await this.writeStatus(job.jobId, "completed", 100, plan, undefined, "Complete")
			await this.ctx.storage.put("phase", "done")
		} catch (err) {
			const message = err instanceof Error ? err.message : "Verification generation failed"
			// Catch rather than rethrow: a rethrow makes the platform auto-retry the
			// alarm, which would duplicate the whole run.
			await this.writeStatus(job.jobId, "failed", 0, undefined, message)
			await this.ctx.storage.put("phase", "failed")
		}
	}

	private async generate(job: StoredJob): Promise<unknown> {
		const db = createDb(this.env.DATABASE_URL)
		const assistantId = this.env.PATHFINDER_ASSISTANT_ID
		if (!assistantId) throw new Error("Verification generation not configured")

		// Re-read the goal here rather than trusting a snapshot taken when the job
		// was queued — the user may have completed more sub-goals since.
		const goal = await db.query.pathfinderGoals.findFirst({
			where: eq(pathfinderGoals.id, job.goalId),
			with: {
				dailySessions: {
					orderBy: (ds, { desc }) => [desc(ds.date)],
					limit: 14,
					with: {
						subGoals: {
							columns: { title: true, quizCompleted: true, codingCompleted: true },
							orderBy: (sg, { asc }) => [asc(sg.order)],
						},
					},
				},
			},
		})
		if (!goal) throw new Error("Goal not found")

		await this.writeStatus(job.jobId, "active", 15, undefined, undefined, "Reading your progress")

		// ── Context build: identical to the inline version ────────────────────
		const dailySessions = goal.dailySessions ?? []
		const subGoalTitles = dailySessions.flatMap((s) => s.subGoals.map((sg) => sg.title))
		const uniqueTopics = [...new Set(subGoalTitles)].slice(0, 15)
		const completedCount = dailySessions.reduce((sum, s) => sum + s.completedSubGoals, 0)

		const userContext = {
			goal: {
				title: goal.title,
				category: goal.category,
				level: goal.level,
				focusAreas: goal.focusAreas,
				overview: goal.overview ?? undefined,
			},
			userLearningProgress: {
				topicsLearned: uniqueTopics,
				tasksCompleted: completedCount,
				totalSubGoals: goal.totalSubGoals,
				quizAnswered: goal.totalQuizAnswered,
				codingSolved: goal.totalCodingSolved,
			},
			instruction:
				"Generate verification quiz and coding questions tailored to what this user has actually learned. Focus on the topics they practiced. Return the full pathfinder_learning_plan schema with quizQuestions (20-25), codingQuestions (3-8), mockInterview, minorProject, majorProject.",
		}

		const headers = {
			Authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
			"Content-Type": "application/json",
			"OpenAI-Beta": "assistants=v2",
		}

		await this.writeStatus(job.jobId, "active", 25, undefined, undefined, "Asking the assistant")

		const threadRes = await fetch("https://api.openai.com/v1/threads", {
			method: "POST",
			headers,
			body: JSON.stringify({ messages: [{ role: "user", content: JSON.stringify(userContext) }] }),
		})
		if (!threadRes.ok) throw new Error(`Could not start generation (${threadRes.status})`)
		const thread = (await threadRes.json()) as { id: string }

		const runRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
			method: "POST",
			headers,
			body: JSON.stringify({ assistant_id: assistantId }),
		})
		if (!runRes.ok) throw new Error(`Could not start generation (${runRes.status})`)
		let run = (await runRes.json()) as AssistantRun

		// ── The 90s poll that could never have survived a server action ───────
		let attempts = 0
		while (run.status !== "completed" && attempts < MAX_POLL_ATTEMPTS) {
			await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))
			const pollRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, { headers })
			run = (await pollRes.json()) as AssistantRun
			attempts++

			if (run.status === "failed" || run.status === "cancelled" || run.status === "expired") {
				throw new Error(run.last_error?.message ?? "Generation failed")
			}
			// 25 → 85% across the poll window, so the bar keeps moving through the
			// longest part of the job instead of sitting still for a minute.
			if (attempts % 5 === 0) {
				const pct = 25 + Math.min(60, Math.round((attempts / MAX_POLL_ATTEMPTS) * 60))
				await this.writeStatus(job.jobId, "active", pct, undefined, undefined, "Building your assessment")
			}
		}
		if (run.status !== "completed") throw new Error("Generation timed out")

		const messagesRes = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, { headers })
		const messagesData = (await messagesRes.json()) as {
			data: Array<{ role: string; content: Array<{ type: string; text?: { value: string } }> }>
		}
		const assistantMessage = messagesData.data.find((m) => m.role === "assistant")
		const content = assistantMessage?.content?.[0]
		if (!content || content.type !== "text" || !content.text) {
			throw new Error("No response from assistant")
		}

		let aiPlan: Record<string, unknown>
		try {
			aiPlan = JSON.parse(content.text.value) as Record<string, unknown>
		} catch {
			// Its own error rather than a raw SyntaxError, so the app can refund on a
			// message a user can read.
			throw new Error("The assistant returned malformed output")
		}

		await this.writeStatus(job.jobId, "active", 90, undefined, undefined, "Saving your plan")

		// ── Persist: same writes the inline version made ──────────────────────
		const mockConfig = aiPlan.mockInterview as Record<string, unknown> | undefined
		let mockId: string | null = null
		if (mockConfig) {
			const [mock] = await db
				.insert(mockInterviewVoice)
				.values({
					title: (mockConfig.title as string) || `Verification: ${goal.title}`,
					description: (mockConfig.description as string) || `Mock interview for ${goal.title} verification`,
					category: "TECHNICAL",
					level: (goal.level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED") ?? "INTERMEDIATE",
					duration: (mockConfig.duration as number) || 15,
					questionsCount: (mockConfig.questionsCount as number) || 5,
					knowledgeBase:
						(mockConfig.knowledgeBase as string) ||
						`Verification interview for: ${goal.title}. Category: ${goal.category}. Level: ${goal.level}.`,
					isPublic: false,
					isPredefined: false,
					createdById: job.userId,
					includesResume: false,
					baseCredits: 0,
					creditsRequired: 0,
					tags: ["pathfinder", "verification"],
				})
				.returning()
			if (mock) mockId = mock.id
		}

		await db
			.update(pathfinderGoals)
			.set({
				overview: (aiPlan.overview as string) ?? goal.overview,
				learningObjectives: (aiPlan.learningObjectives as string[]) ?? goal.learningObjectives,
				prerequisites: (aiPlan.prerequisites as string[]) ?? goal.prerequisites,
			})
			.where(eq(pathfinderGoals.id, job.goalId))

		await db
			.update(pathfinderVerifications)
			.set({
				generatedPlan: aiPlan as object,
				mockInterviewId: mockId,
				codingStatus: "PENDING",
				mockStatus: "PENDING",
			})
			.where(eq(pathfinderVerifications.goalId, job.goalId))

		return aiPlan
	}

	private async writeStatus(
		jobId: string,
		status: JobStatus,
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
					...(result !== undefined
						? { result: { plan: result, phaseLabel } as unknown }
						: phaseLabel
							? { result: { phaseLabel } as unknown }
							: {}),
					...(error ? { error } : {}),
					updatedAt: new Date(),
				})
				.where(eq(backgroundJobs.jobId, jobId))
		} catch {
			// Best-effort, exactly as in ProjectGenerator: a failed status write must
			// not abort a run the user has paid for.
		}
	}
}
