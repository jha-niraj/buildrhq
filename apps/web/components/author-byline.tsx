import Image from 'next/image'
import { AUTHORS, type AuthorKey } from '@/content/authors'

// Visible authorship block. The matching Person JSON-LD is emitted by the post page -
// this is the human-readable half of the same E-E-A-T signal, and Google explicitly
// looks for both.
export function AuthorByline({
    authorKey,
    dateModified,
}: {
    authorKey: AuthorKey
    dateModified: string
}) {
    const author = AUTHORS[authorKey]
    if (!author) return null

    return (
        <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900/60">
            <Image
                src={author.image}
                alt={author.name}
                width={52}
                height={52}
                className="h-13 w-13 shrink-0 rounded-full ring-1 ring-neutral-200 dark:ring-neutral-700"
            />
            <div className="min-w-0">
                <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-600 dark:text-neutral-400">
                    Written by
                </p>
                <p className="font-bold text-neutral-900 dark:text-white">{author.name}</p>
                <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">{author.role}</p>
                <p className="mt-3 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {author.bio}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                    {author.sameAs.map((url) => (
                        <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer me"
                            className="text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 hover:underline dark:text-neutral-400 dark:hover:text-white"
                        >
                            {new URL(url).hostname.replace('www.', '')}
                        </a>
                    ))}
                    <span className="font-mono text-neutral-500 dark:text-neutral-400">
                        Last updated {dateModified}
                    </span>
                </div>
            </div>
        </div>
    )
}
