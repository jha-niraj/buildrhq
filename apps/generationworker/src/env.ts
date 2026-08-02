export interface Env {
	PROJECT_GENERATOR: DurableObjectNamespace
	VERIFICATION_GENERATOR: DurableObjectNamespace
	DATABASE_URL: string
	OPENAI_API_KEY: string
	/** OpenAI Assistant used for Pathfinder verification generation. */
	PATHFINDER_ASSISTANT_ID?: string
	WORKER_SECRET: string
	NODE_ENV?: string
}
