import Link from 'next/link'
import { Clock } from 'lucide-react'
import { BLOG_CATEGORIES, type BlogPostWithSlug } from '@/content/blog'

// Hand-picked related posts, not an algorithmic "you may also like". This is the main
// internal-linking mechanism in the cluster - every post links to three siblings, so no
// article is ever more than a couple of hops from any other.
export function RelatedPosts({ posts }: { posts: BlogPostWithSlug[] }) {
    if (posts.length === 0) return null

    return (
        <section aria-labelledby="related-heading" className="pt-12">
            <h2
                id="related-heading"
                className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500"
            >
                Keep reading
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Link
                        key={post.slug}
                        href={`/blogs/${post.slug}`}
                        className="group flex flex-col rounded-2xl border border-neutral-200 p-5 transition-colors hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
                    >
                        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
                            {BLOG_CATEGORIES[post.category]}
                        </p>
                        <h3 className="mb-2 text-[15px] font-semibold leading-snug tracking-tight text-neutral-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                            {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                            {post.description}
                        </p>
                        <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                            <Clock className="h-3 w-3" aria-hidden />
                            {post.readingTime} min read
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    )
}
