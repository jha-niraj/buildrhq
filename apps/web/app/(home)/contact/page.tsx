import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import Navbar from '@/components/landingpage/homepagenavbar'
import Footer from '@/components/landingpage/footer'
import { SITE, BRAND } from '@/lib/site'
import ContactClient from './_components/contact-client'

const TITLE = 'Contact BuildrHQ'
const DESCRIPTION =
    'Get in touch with the BuildrHQ team - general enquiries, bulk credits for universities and bootcamps, partnerships, billing and bug reports.'

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE}/contact` },
    openGraph: {
        type: 'website',
        url: `${SITE}/contact`,
        siteName: BRAND.name,
        title: `${TITLE} | ${BRAND.name}`,
        description: DESCRIPTION,
    },
}

export default function ContactPage() {
    const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: TITLE,
        description: DESCRIPTION,
        url: `${SITE}/contact`,
        mainEntity: {
            '@type': 'Organization',
            name: BRAND.name,
            url: SITE,
            email: BRAND.email,
        },
    }

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
            <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
                <Navbar />
                <main className="flex-1 pt-16">
                    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
                        <nav aria-label="Breadcrumb" className="mb-8">
                            <ol className="flex items-center gap-2 text-[13px] text-neutral-400 dark:text-neutral-500">
                                <li><Link href="/" className="transition-colors hover:text-neutral-900 dark:hover:text-white">Home</Link></li>
                                <li aria-hidden className="text-neutral-300 dark:text-neutral-700">/</li>
                                <li aria-current="page" className="text-neutral-600 dark:text-neutral-300">Contact</li>
                            </ol>
                        </nav>

                        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
                            <div>
                                <h1 className="mb-5 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-5xl">
                                    Get in touch
                                </h1>
                                <p className="mb-8 text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
                                    Questions about the platform, bulk credits for a university or bootcamp,
                                    partnerships, or something that is broken. We read everything.
                                </p>

                                <div className="space-y-6 text-sm">
                                    <div>
                                        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                                            Email
                                        </p>
                                        <a
                                            href={`mailto:${BRAND.email}`}
                                            className="inline-flex items-center gap-2 text-neutral-900 underline-offset-4 hover:underline dark:text-white"
                                        >
                                            <Mail className="h-4 w-4" aria-hidden />
                                            {BRAND.email}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                                            Response time
                                        </p>
                                        <p className="text-neutral-600 dark:text-neutral-400">Within two working days.</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-500">
                                            Account & billing
                                        </p>
                                        <p className="text-neutral-600 dark:text-neutral-400">
                                            Already have an account? Billing and account settings live in the app -
                                            this form is for everything else.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <ContactClient />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}
