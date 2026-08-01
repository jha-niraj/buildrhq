import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@repo/db/schema"

// Build a Drizzle client from the DO's env (NOT the top-level @repo/db client,
// which reads process.env at import time - undefined at worker init). Neon's
// HTTP driver runs fine inside a Cloudflare Worker / Durable Object.
export function createDb(databaseUrl: string) {
	const sql = neon(databaseUrl)
	return drizzle(sql, { schema })
}

export type DB = ReturnType<typeof createDb>
export { schema }
