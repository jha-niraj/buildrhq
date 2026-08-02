import { Check } from 'lucide-react'

// Sits above the article body. Serves two audiences at once: readers who will not read
// 3,000 words, and answer engines looking for an extractable summary near the top.
export function KeyTakeaways({ takeaways }: { takeaways: readonly string[] }) {
    if (takeaways.length === 0) return null

    return (
        <aside
            aria-labelledby="key-takeaways-heading"
            className="mb-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60"
        >
            <h2
                id="key-takeaways-heading"
                className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400"
            >
                Key takeaways
            </h2>
            <ul className="space-y-3">
                {takeaways.map((t) => (
                    <li key={t} className="flex gap-3 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-300">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-neutral-900 dark:text-white" aria-hidden />
                        <span>{t}</span>
                    </li>
                ))}
            </ul>
        </aside>
    )
}
