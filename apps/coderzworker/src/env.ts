import type { CodeExecutor } from "./executor-container"

export interface Env {
	CODE_EXECUTOR: DurableObjectNamespace<CodeExecutor>
	WORKER_SECRET: string
	NODE_ENV?: string
}
