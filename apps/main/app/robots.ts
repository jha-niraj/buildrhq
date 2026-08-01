import type { MetadataRoute } from 'next'

// This is the app deploy (app.shiprhq.com). Public/marketing SEO + the sitemap
// live on the web deploy (shiprhq.com). Keep the private product areas out of
// the index and point crawlers at the marketing sitemap.
const WEB_URL = process.env.NEXT_PUBLIC_WEB_URL ?? 'https://www.shiprhq.com'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/home/',
                    '/settings/',
                    '/profile/',
                    '/transactions/',
                    '/sharecredits/',
                    '/onboarding/',
                    '/_next/',
                    '/admin/',
                    '/signin',
                    '/register',
                    '/forgotpassword',
                    '/resetpassword',
                ],
            },
            // Allow AI crawlers explicitly (drives LLM-sourced referral traffic)
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'Googlebot', allow: '/' },
        ],
        sitemap: `${WEB_URL}/sitemap.xml`,
    }
}
