"use server"

import { getSession } from "@repo/auth"
import { headers } from "next/headers"
import {
    db,
    backgroundJobs,
    pathfinderGoals,
    pathfinderVerifications,
    isTerminalJobStatus,
} from "@repo/db"
import { and, eq } from "drizzle-orm"
import crypto from "crypto"
import { PATHFINDER_CREDITS } from "@/lib/constants/pricing"
import { reserveCredits, releaseCredits, settleCredits } from "@/lib/credits/hold"
import { toErrorMessage } from "@/lib/errors"
import { callGenerationWorker } from "@/lib/workers/generation-worker"

// ─────────────────────────────────────────────────────────────────────────────
// Pathfinder verification generation, dispatched to the Cloudflare worker.
//
// The inline version called the OpenAI Assistants API and then polled it up to
// 90 times at one second apart — up to 90 seconds of blocking sleep inside a
// server action, which Cloudflare kills long before it finishes. The user had
// already been charged by then.
//
// Now: reserve credits, insert the job row, hand off to a Durable Object, return
// a jobId. The DO schedules an alarm and does the slow work off the request
// path, so closing the tab no longer loses a multi-week goal's verification.
//
// Credits settle or release when the app observes the terminal job status —
// deliberately NOT in the worker, so every credit decision in the product stays
// in one place (`lib/credits/hold.ts`).
// ─────────────────────────────────────────────────────────────────────────────

/** Same HMAC scheme the project generator uses; scoped to this action. */
async function issueToken(userId: string, jobId: string): Promise<string> {
    const secret = process.env.WORKER_SECRET
    if (!secret) throw new Error("Worker secret not configured")
    const now = Math.floor(Date.now() / 1000)
    const payload = JSON.stringify({ userId, action: "generate_verification", jobId, iat: now, exp: now + 300 })
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url")
    return `${Buffer.from(payload).toString("base64url")}.${signature}`
}

/** The hold key for a job. Derived so the poller can settle/release without
 *  having to carry the hold id around separately. */
const holdIdFor = (jobId: string) => `pf-verify-job-${jobId}`

export async function startVerificationGeneration(goalId: string): Promise<{
    success: boolean
    jobId?: string
    error?: string
    code?: string
    required?: number
    available?: number
}> {
    try {
        const session = await getSession(await headers())
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        const goal = await db.query.pathfinderGoals.findFirst({
            where: and(eq(pathfinderGoals.id, goalId), eq(pathfinderGoals.userId, session.user.id)),
        })
        if (!goal) return { success: false, error: "Goal not found" }

        // Refuse a second run while one is in flight, rather than charging twice
        // and racing two Durable Objects at the same verification row.
        const [inFlight] = await db
            .select({ jobId: backgroundJobs.jobId, status: backgroundJobs.status })
            .from(backgroundJobs)
            .where(
                and(
                    eq(backgroundJobs.userId, session.user.id),
                    eq(backgroundJobs.type, "verification_generation"),
                    eq(backgroundJobs.status, "active"),
                ),
            )
            .limit(1)
        if (inFlight) return { success: true, jobId: inFlight.jobId }

        const jobId = crypto.randomUUID()
        const fee = PATHFINDER_CREDITS.verificationFee

        const hold = await reserveCredits({
            userId: session.user.id,
            amount: fee,
            reason: `Pathfinder Verification: ${goal.title}`,
            holdId: holdIdFor(jobId),
        })
        if (!hold.ok) {
            return {
                success: false,
                error: hold.error,
                code: hold.code,
                required: hold.required ?? fee,
                available: hold.available ?? 0,
            }
        }

        // Insert BEFORE dispatch so the UI can poll immediately — a job that
        // exists only inside the worker is invisible until its first write.
        await db.insert(backgroundJobs).values({
            jobId,
            type: "verification_generation",
            status: "waiting",
            progress: 0,
            input: { goalId },
            userId: session.user.id,
        })

        try {
            const token = await issueToken(session.user.id, jobId)
            // Service binding on Workers, HTTP locally — see lib/workers/generation-worker.ts.
            const res = await callGenerationWorker("/api/v1/generateverification", {
                token,
                body: { jobId, goalId },
            })
            if (!res.ok) throw new Error(`Worker rejected the job (${res.status})`)
        } catch (error: unknown) {
            // Never dispatched, so nothing will ever finish this job — fail it here
            // and give the credits straight back.
            await releaseCredits(holdIdFor(jobId), toErrorMessage(error, "dispatch failed"))
            await db
                .update(backgroundJobs)
                .set({ status: "failed", error: toErrorMessage(error, "Could not start generation") })
                .where(eq(backgroundJobs.jobId, jobId))
            return { success: false, error: "Could not start verification. Your credits were not charged." }
        }

        await db.update(pathfinderVerifications)
            .set({ verificationCreditsCharged: fee })
            .where(eq(pathfinderVerifications.goalId, goalId))

        return { success: true, jobId }
    } catch (error: unknown) {
        console.error("[pathfinder] startVerificationGeneration failed:", error)
        return { success: false, error: "Failed to start verification generation" }
    }
}

/**
 * Poll a verification job.
 *
 * Settles or releases the credit hold the first time a terminal status is seen.
 * Both are idempotent, so polling twice after completion is harmless — which
 * matters because several tabs may be polling the same job.
 */
export async function getVerificationJobStatus(jobId: string): Promise<{
    success: boolean
    status?: string
    progress?: number
    phaseLabel?: string
    done?: boolean
    error?: string
}> {
    try {
        const session = await getSession(await headers())
        if (!session?.user?.id) return { success: false, error: "Unauthorized" }

        // Scoped to the caller: a job id is guessable enough that it should not
        // expose another user's progress.
        const [job] = await db
            .select()
            .from(backgroundJobs)
            .where(and(eq(backgroundJobs.jobId, jobId), eq(backgroundJobs.userId, session.user.id)))
            .limit(1)
        if (!job) return { success: false, error: "Job not found" }

        if (isTerminalJobStatus(job.status)) {
            if (job.status === "completed") await settleCredits(holdIdFor(jobId))
            else await releaseCredits(holdIdFor(jobId), job.error ?? "generation failed")
        }

        const result = (job.result ?? {}) as { phaseLabel?: string }
        return {
            success: true,
            status: job.status,
            progress: job.progress,
            phaseLabel: result.phaseLabel,
            done: isTerminalJobStatus(job.status),
            error: job.status === "failed"
                ? `${job.error ?? "Generation failed"}. Your credits have been refunded.`
                : undefined,
        }
    } catch (error: unknown) {
        return { success: false, error: toErrorMessage(error, "Failed to read status") }
    }
}
