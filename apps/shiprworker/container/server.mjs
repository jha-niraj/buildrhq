// Code-executor HTTP server — runs INSIDE the Cloudflare Container (Node built-ins only).
// POST /api/v1/execute  { code, language, testCases? } -> { success, stdout, stderr, exitCode, executionTimeMs, testResults?, allTestsPassed? }
// GET  /health

import http from "node:http"
import { spawnSync } from "node:child_process"
import { mkdtempSync, writeFileSync, rmSync } from "node:fs"
import os from "node:os"
import path from "node:path"

const PORT = Number(process.env.PORT || 8080)
const RUN_TIMEOUT_MS = 10_000
const COMPILE_TIMEOUT_MS = 15_000
const MAX_BUFFER = 1024 * 1024 // 1MB stdout/stderr cap

/** @type {Record<string, { ext: string; compile?: (f: string, dir: string) => string[]; run: (f: string, dir: string, cls?: string) => string[] }>} */
const LANGS = {
	javascript: { ext: "js", run: (f) => ["node", [f]] },
	typescript: { ext: "ts", run: (f) => ["tsx", [f]] },
	python: { ext: "py", run: (f) => ["python3", [f]] },
	c: {
		ext: "c",
		compile: (f, dir) => ["gcc", [f, "-O2", "-o", path.join(dir, "a.out")]],
		run: (_f, dir) => [path.join(dir, "a.out"), []],
	},
	cpp: {
		ext: "cpp",
		compile: (f, dir) => ["g++", [f, "-O2", "-std=c++17", "-o", path.join(dir, "a.out")]],
		run: (_f, dir) => [path.join(dir, "a.out"), []],
	},
	java: {
		ext: "java",
		compile: (f, dir) => ["javac", ["-d", dir, f]],
		run: (_f, dir, cls) => ["java", ["-cp", dir, cls || "Main"]],
	},
}

function javaClassName(code) {
	const m = code.match(/public\s+class\s+([A-Za-z_$][\w$]*)/) || code.match(/\bclass\s+([A-Za-z_$][\w$]*)/)
	return m ? m[1] : "Main"
}

function runOnce(cmd, args, cwd, input) {
	const r = spawnSync(cmd, args, {
		cwd,
		input: input ?? "",
		timeout: RUN_TIMEOUT_MS,
		maxBuffer: MAX_BUFFER,
		encoding: "utf8",
	})
	if (r.error && r.error.code === "ETIMEDOUT") {
		return { stdout: r.stdout || "", stderr: "Execution timed out (10s limit).", exitCode: 124, timedOut: true }
	}
	return { stdout: r.stdout || "", stderr: r.stderr || "", exitCode: r.status ?? 1, timedOut: false }
}

function execute({ code, language, testCases }) {
	const cfg = LANGS[language]
	if (!cfg) return { success: false, error: `Unsupported language: ${language}`, exitCode: 1 }

	const dir = mkdtempSync(path.join(os.tmpdir(), "exec-"))
	try {
		const cls = language === "java" ? javaClassName(code) : undefined
		const fileName = language === "java" ? `${cls}.java` : `main.${cfg.ext}`
		const filePath = path.join(dir, fileName)
		writeFileSync(filePath, code)

		// Compile step (c/cpp/java).
		if (cfg.compile) {
			const [ccmd, cargs] = cfg.compile(filePath, dir)
			const c = spawnSync(ccmd, cargs, { cwd: dir, timeout: COMPILE_TIMEOUT_MS, maxBuffer: MAX_BUFFER, encoding: "utf8" })
			if ((c.status ?? 1) !== 0) {
				return { success: false, stdout: "", stderr: c.stderr || c.error?.message || "Compilation failed", exitCode: c.status ?? 1, executionTimeMs: 0 }
			}
		}

		const [rcmd, rargs] = cfg.run(filePath, dir, cls)
		const started = Date.now()

		// With test cases: run once per case, compare stdout.
		if (Array.isArray(testCases) && testCases.length > 0) {
			const testResults = []
			let allPassed = true
			for (const tc of testCases) {
				const res = runOnce(rcmd, rargs, dir, tc.input ?? "")
				const actual = (res.stdout || "").trim()
				const expected = (tc.expectedOutput ?? "").trim()
				const passed = res.exitCode === 0 && actual === expected
				if (!passed) allPassed = false
				testResults.push({ passed, input: tc.input ?? "", expectedOutput: expected, actualOutput: res.stderr ? `${actual}\n${res.stderr}`.trim() : actual, description: tc.description })
			}
			return { success: true, stdout: "", stderr: "", exitCode: 0, executionTimeMs: Date.now() - started, testResults, allTestsPassed: allPassed }
		}

		// No test cases: single run.
		const res = runOnce(rcmd, rargs, dir, "")
		return { success: !res.timedOut && res.exitCode === 0, stdout: res.stdout, stderr: res.stderr, exitCode: res.exitCode, executionTimeMs: Date.now() - started }
	} catch (err) {
		return { success: false, stdout: "", stderr: err?.message || "Execution error", exitCode: 1, executionTimeMs: 0 }
	} finally {
		try { rmSync(dir, { recursive: true, force: true }) } catch { /* ignore */ }
	}
}

const server = http.createServer((req, res) => {
	if (req.method === "GET" && req.url === "/health") {
		res.writeHead(200, { "content-type": "application/json" })
		res.end(JSON.stringify({ ok: true }))
		return
	}
	if (req.method === "POST" && (req.url === "/api/v1/execute" || req.url === "/execute")) {
		let body = ""
		req.on("data", (c) => { body += c; if (body.length > 2 * 1024 * 1024) req.destroy() })
		req.on("end", () => {
			let result
			try {
				const payload = JSON.parse(body || "{}")
				result = execute(payload)
			} catch (err) {
				result = { success: false, stderr: err?.message || "Bad request", exitCode: 1 }
			}
			res.writeHead(200, { "content-type": "application/json" })
			res.end(JSON.stringify(result))
		})
		return
	}
	res.writeHead(404, { "content-type": "application/json" })
	res.end(JSON.stringify({ error: "Not found" }))
})

server.listen(PORT, () => console.log(`[executor] listening on ${PORT}`))
