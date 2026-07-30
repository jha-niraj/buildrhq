import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { BLOG_POSTS, BLOG_CATEGORY_KEYS, getPostsByCategory, publishedPosts } from '@/content/blog'

// Every public/SEO URL lives on this marketing deploy. Product pages (/ai, /practice,
// /projects…) belong to the app and are excluded - they 307 away from here anyway.
//
// STATIC_LAST_MODIFIED is a FIXED date, not `new Date()`, on purpose: if every URL
// reported lastmod = build time, each deploy would tell crawlers "everything changed
// just now". Google treats that as an unreliable signal and then ignores lastmod
// entirely - which would also devalue the accurate per-post dates below. Bump it only
// on a real content revamp of the static pages.
const STATIC_LAST_MODIFIED = '2026-07-30'

const ROUTES: Record<string, [number, MetadataRoute.Sitemap[number]['changeFrequency']]> = {
    '': [1.0, 'weekly'],
    'pricing': [0.9, 'monthly'],
    'blogs': [0.8, 'weekly'],
    'aboutus': [0.6, 'monthly'],
    'termsofservice': [0.3, 'yearly'],
    'privacypolicy': [0.3, 'yearly'],
}

export default function sitemap(): MetadataRoute.Sitemap {
    const staticEntries: MetadataRoute.Sitemap = Object.entries(ROUTES).map(([path, [priority, changeFrequency]]) => ({
        url: path ? `${SITE}/${path}` : SITE,
        lastModified: STATIC_LAST_MODIFIED,
        changeFrequency,
        priority,
    }))

    // Only activated posts. Drafted-ahead posts stay noindex and unlisted until their
    // slug is added to content/active-posts.ts. Each reports its own real dateModified,
    // which only moves when the post is actually edited.
    const postEntries: MetadataRoute.Sitemap = publishedPosts.map((post) => ({
        url: `${SITE}/blogs/${post.slug}`,
        lastModified: post.dateModified,
        changeFrequency: 'monthly',
        priority: post.featured ? 0.8 : 0.7,
    }))

    // Topic hubs, but only those with at least one published post - an empty hub is a
    // thin page and is noindex'd on the page itself too. A hub's lastmod is the newest
    // dateModified among its posts, so it moves only when its content really changes.
    const topicEntries: MetadataRoute.Sitemap = BLOG_CATEGORY_KEYS
        .filter((key) => getPostsByCategory(key).length > 0)
        .map((key) => {
            const newest = getPostsByCategory(key)
                .map((p) => BLOG_POSTS[p.slug]?.dateModified ?? STATIC_LAST_MODIFIED)
                .sort()
                .at(-1) ?? STATIC_LAST_MODIFIED
            return {
                url: `${SITE}/blogs/topics/${key}`,
                lastModified: newest,
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            }
        })

    return [...staticEntries, ...postEntries, ...topicEntries]
}
