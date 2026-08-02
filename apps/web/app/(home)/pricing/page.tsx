import type { Metadata } from 'next'
import PricingClient from './_components/pricing-client'
import { pricingFaqs } from './_components/pricing-faqs'

export const metadata: Metadata = {
    title: 'Pricing - Simple, Credit-Based Pricing',
    description:
        'ShipItHQ pricing is credit-based - no subscriptions, no idle-time charges. Buy credits once and spend them on AI mock interviews, project generation, assessments and more. Credits never expire.',
    openGraph: {
        title: 'ShipItHQ Pricing - Pay Only for What You Run',
        description:
            'Credit-based pricing with no subscriptions. Credits never expire. Free credits to get started.',
        images: [{ url: '/og/home.webp', width: 1200, height: 630 }],
    },
    alternates: { canonical: '/pricing' },
}

// FAQ rich-result structured data, built from the same list the page renders.
const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pricingFaqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
}

export default function PricingPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <PricingClient />
        </>
    )
}
