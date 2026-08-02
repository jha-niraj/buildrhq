import Image from 'next/image'
import { BLOG_CATEGORIES, type BlogCategory } from '@/content/blog'

interface Props {
    title: string
    category: BlogCategory
    heroImage?: string
    priority?: boolean
}

// Per-category accent so covers are visually distinguishable at a glance while staying
// inside the brand's warm neutral palette.
const ACCENTS: Record<BlogCategory, string> = {
    'interview-prep': 'from-neutral-900/25 via-neutral-900/10',
    'career': 'from-neutral-900/25 via-neutral-900/10',
    'resume': 'from-rose-500/20 via-neutral-900/10',
    'dsa': 'from-emerald-500/20 via-teal-500/10',
    'portfolio': 'from-neutral-800/25 via-rose-500/10',
    'open-source': 'from-teal-500/20 via-emerald-500/10',
    'ai-tools': 'from-neutral-800/25 via-neutral-900/10',
}

/**
 * Article hero. Posts with a bespoke image render it; posts without one get a designed
 * typographic cover rather than a broken image or a duplicated stock graphic.
 */
export function PostCover({ title, category, heroImage, priority = false }: Props) {
    if (heroImage) {
        return (
            <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
                <Image
                    src={heroImage}
                    alt={title}
                    fill
                    className="object-cover"
                    priority={priority}
                    sizes="(max-width: 768px) 100vw, 900px"
                />
            </div>
        )
    }

    return (
        <div
            aria-hidden
            className="relative flex aspect-[1200/630] w-full items-end overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 dark:border-neutral-800"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${ACCENTS[category]} to-transparent`} />
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />
            <div className="relative w-full p-8 sm:p-12">
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/70 sm:text-[11px]">
                    ShipItHQ · {BLOG_CATEGORIES[category]}
                </p>
                <p className="max-w-[85%] text-xl font-bold leading-[1.15] tracking-tight text-white sm:text-3xl">
                    {title}
                </p>
            </div>
        </div>
    )
}
