import type { Metadata } from 'next'
import AboutUsClient from './AboutUsClient'

export const metadata: Metadata = {
    title: 'About ShiprHQ - Built for Serious Developers',
    description: 'Meet the team behind ShiprHQ - the engineering intelligence suite helping CS students and software engineers build portfolios, ace interviews, and land top engineering roles.',
    openGraph: {
        title: 'About ShiprHQ - Built for Serious Developers',
        description: 'Meet the team behind ShiprHQ and learn why we are building the engineering intelligence suite for the next generation of software engineers.',
        images: [{ url: '/og/home.webp', width: 1200, height: 630 }],
    },
    alternates: { canonical: '/aboutus' },
}

export default function AboutUsPage() {
    return <AboutUsClient />
}
