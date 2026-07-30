import type { MetadataRoute } from 'next'
import { BRAND } from '@/lib/site'

// Web app manifest for the marketing site. Next serves it at /manifest.webmanifest and
// auto-links it from every page's <head>. `display: browser` is deliberate - this is a
// website, not an installable app; the product PWA belongs to the app deploy.
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: `${BRAND.name} - ${BRAND.tagline}`,
        short_name: BRAND.name,
        description:
            'AI-powered career tools for CS students and software engineers: mock interviews, DSA practice, portfolio projects and ATS resumes.',
        start_url: '/',
        display: 'browser',
        background_color: '#0a0a0a',
        theme_color: '#0a0a0a',
        icons: [
            { src: '/mainlogo.png', sizes: '512x512', type: 'image/png' },
            { src: '/mainlogo.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
    }
}
