import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/landingpage/homepagenavbar'
import Footer from '@/components/landingpage/footer'

export const metadata: Metadata = {
    title: 'Page not found',
    robots: { index: false, follow: true },
}

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
            <Navbar />
            <main className="flex flex-1 items-center justify-center px-6 pt-16">
                <div className="max-w-md text-center">
                    <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-orange-500">
                        404
                    </p>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        This page does not exist.
                    </h1>
                    <p className="mb-8 leading-relaxed text-neutral-500 dark:text-neutral-400">
                        The link may be out of date, or the page may have moved. The blog and pricing
                        pages are the best places to pick up from.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/"
                            className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-100"
                        >
                            Back to home
                        </Link>
                        <Link
                            href="/blogs"
                            className="rounded-xl border border-neutral-300 px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                        >
                            Read the blog
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}
