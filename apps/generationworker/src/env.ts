export interface Env {
	PROJECT_GENERATOR: DurableObjectNamespace
	DATABASE_URL: string
	OPENAI_API_KEY: string
	WORKER_SECRET: string
	NODE_ENV?: string
}
