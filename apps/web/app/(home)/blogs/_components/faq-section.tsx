// Rendered as plain semantic markup (not an accordion) so the answers are in the HTML
// with no JavaScript required. The same content is emitted as FAQPage JSON-LD by the
// post page, which is what makes it eligible for rich results and AI answer citation.
export function FaqSection({ faqs }: { faqs: readonly { q: string; a: string }[] }) {
    if (faqs.length === 0) return null

    return (
        <section aria-labelledby="faq-heading" className="mt-16">
            <h2
                id="faq-heading"
                className="mb-8 border-b border-neutral-200 pb-3 text-2xl font-bold tracking-tight text-neutral-900 dark:border-neutral-800 dark:text-white"
            >
                Frequently asked questions
            </h2>
            <dl className="space-y-8">
                {faqs.map((faq) => (
                    <div key={faq.q}>
                        <dt className="mb-2 text-[17px] font-semibold text-neutral-900 dark:text-white">
                            {faq.q}
                        </dt>
                        <dd className="text-[16px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {faq.a}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    )
}
