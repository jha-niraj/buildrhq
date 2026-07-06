'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@repo/ui/lib/utils'

// Lightweight, dependency-free code block for the marketing blog. (The full
// Monaco editor lives in the app; the marketing site stays intentionally light.)
export function CodeBlock({ code, language = 'typescript', className }: { code: string; language?: string; className?: string }) {
	const [copied, setCopied] = useState(false)

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(code)
			setCopied(true)
			setTimeout(() => setCopied(false), 1500)
		} catch {
			// clipboard unavailable — no-op
		}
	}

	return (
		<div className={cn("group relative rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-950", className)}>
			<div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
				<span className="font-mono text-[11px] uppercase tracking-widest text-neutral-500">{language}</span>
				<button
					onClick={onCopy}
					className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
					aria-label="Copy code"
				>
					{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
					{copied ? 'Copied' : 'Copy'}
				</button>
			</div>
			<pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
				<code className="font-mono text-neutral-200 whitespace-pre">{code}</code>
			</pre>
		</div>
	)
}
