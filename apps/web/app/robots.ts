import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

// Marketing site - fully crawlable. AI/LLM crawlers are welcomed explicitly because
// answer-engine visibility is a real referral channel for this niche.
//
// Auth/product paths are deliberately NOT disallowed: they are 307 redirects to the app
// (see next.config.mjs), and blocking a redirect only stops crawlers from learning that
// it redirects. The app deploy is responsible for keeping itself out of the index.
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
            { userAgent: 'Googlebot', allow: '/' },
            { userAgent: 'Googlebot-Image', allow: '/' },
            { userAgent: 'Bingbot', allow: '/' },
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'OAI-SearchBot', allow: '/' },
            { userAgent: 'ChatGPT-User', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'Claude-Web', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'Google-Extended', allow: '/' },
        ],
        sitemap: `${SITE}/sitemap.xml`,
        host: SITE,
    }
}
