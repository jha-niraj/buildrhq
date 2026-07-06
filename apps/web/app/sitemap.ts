import type { MetadataRoute } from 'next'
import { allPosts } from '@/content/blog'

const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'https://www.buildrhq.com'

// Only pages that actually live on the marketing site (web). Product pages
// (/ai, /practice, /projects…) live on the app deploy and are excluded here.
const STATIC_PAGES: { url: string; lastModified: Date; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { url: '/',                 lastModified: new Date('2025-05-01'), priority: 1.0,  changeFrequency: 'weekly'  },
    { url: '/pricing',          lastModified: new Date('2025-05-01'), priority: 0.9,  changeFrequency: 'monthly' },
    { url: '/aboutus',          lastModified: new Date('2025-04-01'), priority: 0.7,  changeFrequency: 'monthly' },
    { url: '/blogs',            lastModified: new Date('2025-05-13'), priority: 0.8,  changeFrequency: 'weekly'  },
    { url: '/privacypolicy',    lastModified: new Date('2025-03-01'), priority: 0.3,  changeFrequency: 'yearly'  },
    { url: '/termsofservice',   lastModified: new Date('2025-03-01'), priority: 0.3,  changeFrequency: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
    const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map(p => ({
        url: `${BASE_URL}${p.url}`,
        lastModified: p.lastModified,
        changeFrequency: p.changeFrequency,
        priority: p.priority,
    }))

    const blogEntries: MetadataRoute.Sitemap = allPosts.map(post => ({
        url: `${BASE_URL}/blogs/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticEntries, ...blogEntries]
}
