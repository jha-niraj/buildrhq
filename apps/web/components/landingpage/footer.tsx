import Link from "next/link";
import { Linkedin, Github, Command } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { NewsletterSubscription } from "../homepage/newslettersubscription";
import { APP_LINKS, APP_URL, BRAND } from "@/lib/site";

// Marketing footer. Two kinds of destination and no third:
//   - internal Next <Link>s for pages that exist on THIS site
//   - plain <a> to the app origin for anything behind a login
// Nothing here points at a route that only resolves via a redirect hop, and nothing is a
// "coming soon" toast pretending to be a link (the previous version had four of those).
const LINK_GROUPS: {
    title: string;
    links: { name: string; href: string; external?: boolean }[];
}[] = [
        {
            title: "Platform",
            links: [
                { name: "Projects", href: `${APP_URL}/projects`, external: true },
                { name: "Practice", href: `${APP_URL}/practice`, external: true },
                { name: "Mock Interviews", href: `${APP_URL}/mock`, external: true },
                { name: "AI Tools", href: `${APP_URL}/ai`, external: true },
                { name: "Pricing", href: "/pricing" },
            ],
        },
        {
            title: "Resources",
            links: [
                { name: "Blog", href: "/blogs" },
                { name: "Interview Prep", href: "/blogs/topics/interview-prep" },
                { name: "Career Guides", href: "/blogs/topics/career" },
                { name: "DSA & Practice", href: "/blogs/topics/dsa" },
            ],
        },
        {
            title: "Company",
            links: [
                { name: "About", href: "/aboutus" },
                { name: "Contact", href: "/aboutus#contact" },
                { name: "Terms of Service", href: "/termsofservice" },
                { name: "Privacy Policy", href: "/privacypolicy" },
            ],
        },
    ];

const SOCIALS = [
    { name: "X", href: BRAND.social.twitter, Icon: FaXTwitter },
    { name: "GitHub", href: BRAND.social.github, Icon: Github },
    { name: "LinkedIn", href: BRAND.social.linkedin, Icon: Linkedin },
];

export default function Footer() {
    return (
        <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl px-6 py-12">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="flex h-full flex-col justify-between lg:col-span-4">
                        <div>
                            <Link href="/" className="mb-6 flex items-center gap-2">
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 font-bold text-white dark:bg-white dark:text-neutral-900">
                                    <Command className="h-4 w-4" />
                                </span>
                                <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                                    {BRAND.name}
                                </span>
                            </Link>
                            <p className="mb-8 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                The engineering intelligence suite. Build real projects, practise
                                interviews, and land your next software role.
                            </p>
                        </div>
                        <NewsletterSubscription />
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-8">
                        {LINK_GROUPS.map((group) => (
                            <div key={group.title}>
                                <h2 className="mb-6 text-sm font-semibold text-neutral-900 dark:text-white">
                                    {group.title}
                                </h2>
                                <ul className="space-y-3">
                                    {group.links.map((link) => (
                                        <li key={link.name}>
                                            {link.external ? (
                                                <a
                                                    href={link.href}
                                                    className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                                                >
                                                    {link.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    href={link.href}
                                                    className="text-sm text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-neutral-200 pt-8 dark:border-neutral-800 md:flex-row">
                    <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
                        <p className="text-xs text-neutral-500">
                            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
                        </p>
                        <a
                            href={APP_LINKS.signin}
                            className="text-xs text-neutral-500 transition-colors hover:text-neutral-900 dark:hover:text-white"
                        >
                            Sign in to the app →
                        </a>
                    </div>
                    <div className="flex items-center gap-6">
                        {SOCIALS.map(({ name, href, Icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${BRAND.name} on ${name}`}
                                className="text-neutral-400 transition-colors hover:text-neutral-900 dark:hover:text-white"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
