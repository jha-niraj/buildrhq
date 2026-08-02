"use server"

import { getSession } from '@repo/auth'
import { headers } from 'next/headers'
import { db, users, backgroundJobs } from '@repo/db'
import { eq } from 'drizzle-orm'
import { z } from "zod"
import { ProjectEchoSchema } from "../schemas/projects.schema"
import crypto from 'crypto'
import { callGenerationWorker } from '@/lib/workers/generation-worker'


async function getCurrentUser() {
    const session = await getSession(await headers())
    if (!session?.user?.email) throw new Error("Not authenticated")
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1)
    if (!user) throw new Error("User not found")
    return user
}

// Signed HMAC token the generation worker verifies (Web Crypto on the worker side).
export async function issueWorkerToken(action: 'generate_project' | 'generate_verification' | 'check_job' | 'run_code' | 'check_execution', jobId?: string) {
    const user = await getCurrentUser()
    const secret = process.env.WORKER_SECRET
    if (!secret) throw new Error("Worker secret not configured")

    const now = Math.floor(Date.now() / 1000)
    const payload = { userId: user.id, action, jobId, iat: now, exp: now + 300 }
    const data = JSON.stringify(payload)
    const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url')
    const encodedPayload = Buffer.from(data).toString('base64url')
    return `${encodedPayload}.${signature}`
}

/**
 * Start a project-generation job on the Cloudflare generation worker.
 * The worker's Durable Object schedules an Alarm and runs the 1-1.5 min pipeline,
 * writing status/progress to the BackgroundJob table server-side. The client just
 * polls `getGenerationStatus(jobId)`.
 */
export async function startProjectGeneration(
    input: z.infer<typeof ProjectEchoSchema>,
): Promise<{ success: boolean; jobId?: string; error?: string }> {
    try {
        const user = await getCurrentUser()
        const validated = ProjectEchoSchema.parse(input)

        const cost = (validated.visibility === "PUBLIC" ? 13 : 25) + (validated.includeAssessment ? 30 : 0)
        if ((user.credits ?? 0) < cost) {
            return { success: false, error: `Insufficient credits. You need ${cost} credits to generate this project.` }
        }

        const jobId = crypto.randomUUID()

        // Persist the job first so the UI can poll immediately.
        await db.insert(backgroundJobs).values({
            jobId,
            status: 'waiting',
            progress: 0,
            userId: user.id,
            input: validated as unknown as Record<string, unknown>,
        })

        const now = Math.floor(Date.now() / 1000)
        const tokenPayload = JSON.stringify({ userId: user.id, action: 'generate_project', jobId, iat: now, exp: now + 300 })
        const signature = crypto.createHmac('sha256', process.env.WORKER_SECRET!).update(tokenPayload).digest('base64url')
        const token = `${Buffer.from(tokenPayload).toString('base64url')}.${signature}`

        // Service binding on Workers, HTTP locally — see lib/workers/generation-worker.ts.
        const res = await callGenerationWorker('/api/v1/generateproject', {
            token,
            body: { jobId, input: validated },
        })

        if (!res.ok) {
            const err = await res.text()
            await db.update(backgroundJobs).set({ status: 'failed', error: `Worker error: ${err}` }).where(eq(backgroundJobs.jobId, jobId))
            return { success: false, error: 'Failed to start generation. Please try again.' }
        }

        return { success: true, jobId }
    } catch (error) {
        console.error('startProjectGeneration failed:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Failed to start generation' }
    }
}

/**
 * Read the current generation status from the DB (written server-side by the worker's DO).
 */
export async function getGenerationStatus(jobId: string): Promise<{
    success: boolean
    status?: string
    progress?: number
    phaseLabel?: string
    slug?: string
    error?: string
}> {
    try {
        const [job] = await db.select().from(backgroundJobs).where(eq(backgroundJobs.jobId, jobId)).limit(1)
        if (!job) return { success: false, error: 'Job not found' }

        const result = (job.result ?? {}) as { slug?: string; phaseLabel?: string }
        return {
            success: true,
            status: job.status,
            progress: job.progress,
            phaseLabel: result.phaseLabel,
            slug: result.slug,
            error: job.error ?? undefined,
        }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to read status' }
    }
}
