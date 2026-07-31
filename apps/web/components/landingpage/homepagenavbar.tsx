"use client";

import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTitle } from "@repo/ui/components/ui/sheet";
import { ArrowRight, Command, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@repo/ui/components/themetoggle";
import { APP_LINKS } from "@/lib/site";

// Marketing navigation only. This site has no session and no auth client - "Get started"
// always deep-links to the app deploy, which owns sign-in/sign-up entirely.
const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/blogs", label: "Blog" },
    { href: "/pricing", label: "Pricing" },
    { href: "/aboutus", label: "About" },
    { href: "/aboutus#contact", label: "Contact" },
] as const;

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === "/";

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const linkBaseClasses = "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200";
    const standardLinkClasses =
        "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white";

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        // A floating pill rather than a full-bleed bar: the outer <nav> only positions
        // and pads, the inner div is the visible surface, capped at max-w-7xl so it
        // lines up with the page content beneath it. `theme-vt-glass` lets the theme
        // wipe swap this to a solid background — a translucent + backdrop-blur bar is
        // exactly what flashes during a View Transition snapshot.
        <nav className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
            <div
                className={`theme-vt-glass mx-auto max-w-7xl rounded-2xl transition-all duration-300
                ${isHome
                        ? scrolled
                            ? "bg-white/75 dark:bg-neutral-950/75 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm"
                            : "border border-transparent bg-transparent"
                        : "bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm"
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <Link href="/" className="flex items-center gap-2" aria-label="BuildrHQ home">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
                        <Command className="h-4 w-4" />
                    </span>
                    <span className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-white">
                        BuildrHQ
                    </span>
                </Link>

                <div
                    className={`hidden md:flex items-center space-x-1 rounded-full transition-all duration-300 p-1
                    ${isHome
                            ? scrolled
                                ? "bg-transparent"
                                : "bg-white/40 dark:bg-neutral-900/30 backdrop-blur-md border border-neutral-200/30 dark:border-white/5 shadow-sm"
                            : "bg-neutral-100/60 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800"
                        }`}
                >
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-current={isActive(link.href) ? "page" : undefined}
                            className={`${linkBaseClasses} ${standardLinkClasses} ${isActive(link.href)
                                ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm"
                                : ""
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-center space-x-3">
                    <ThemeToggle />
                    <a href={APP_LINKS.signup} className="hidden sm:block">
                        <Button className="cursor-pointer rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black transition-all">
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </a>
                    <Button
                        onClick={() => setIsMobileMenuOpen(true)}
                        variant="ghost"
                        size="icon"
                        aria-label="Open menu"
                        className="md:hidden text-neutral-900 cursor-pointer dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
                </div>
            </div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetContent className="max-w-[500px] h-screen p-0 border-l-0 bg-white dark:bg-neutral-950">
                    <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                    <div className="flex flex-col h-full">
                        <div className="flex-1 overflow-auto py-6 px-4 font-medium">
                            <div className="grid grid-cols-1 gap-2">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`rounded-lg px-4 py-3 text-lg transition-all ${isActive(link.href)
                                            ? "bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white"
                                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900 dark:bg-white hover:text-neutral-900 dark:hover:text-white dark:text-neutral-900"
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
                            <a href={APP_LINKS.signup} className="block">
                                <Button className="w-full rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </nav>
    );
}
