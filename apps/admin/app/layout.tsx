import type { Metadata } from "next";
import "@repo/ui/styles/globals.css";
import { ThemeProvider } from "@repo/ui/components/themeprovider";
import { Geist, Space_Grotesk, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Toaster as SonnerToaster } from "@repo/ui/components/ui/sonner";
import { Providers } from "./providers";

// Canonical origin for this deploy. Overridable per environment so preview
// builds emit their own absolute URLs instead of the production ones.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://admin.shiprhq.com'

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-space-grotesk',
})
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800"],
	display: "swap",
	// Registered as --font-display, which globals.css maps to the `font-display`
	// utility - so every h1/h2 and the sidebar pick it up without each app
	// restating the stack.
	variable: "--font-display",
});

export const metadata: Metadata = {
	title: {
		default: "ShiprHQ Admin",
		template: "%s | ShiprHQ Admin"
	},
	description: "The Engineering Intelligence Platform for Computer Science Students",
	keywords: ["Learn", "Build Projects", "Computer Science", "Programming", "Coding", "Developer", "Tech Community", "Coding Resources", "Tech Articles", "Coding Tutorials"],
	authors: [{ name: "Niraj Jha" }],
	creator: "Shunya Tech",
	publisher: "Shunya Tech",
	metadataBase: new URL(BASE_URL),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: BASE_URL,
		siteName: "ShiprHQ Admin",
		title: "ShiprHQ - The Engineering Intelligence Platform for Computer Science Students",
		description: "The Engineering Intelligence Platform for Computer Science Students",
		images: [
			{
				url: "/og/home.webp",
				width: 1200,
				height: 630,
				alt: "ShiprHQ Admin - The Engineering Intelligence Platform for Computer Science Students",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "ShiprHQ Admin - The Engineering Intelligence Platform for Computer Science Students",
		description: "The Engineering Intelligence Platform for Computer Science Students",
		images: ["/og/home.webp"],
		creator: "@shiprhq",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		// Add your verification codes here when you have them
		// google: "your-google-verification-code",
		// yandex: "your-yandex-verification-code",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`
				${spaceGrotesk.className} ${bricolage.variable} ${geistSans.variable} ${geistMono.variable} antialiased 
			`}>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						// NOT disableTransitionOnChange: that injects `* { transition: none !important }`
						// around the class swap, which cancels the colour crossfade that
						// packages/ui/src/lib/theme-transition.ts installs for the switch. With it
						// on, the theme snapped between states instead of animating - the flicker.
					>
							{children}
						{/* Position, close button and styling are the shared defaults in
						    @repo/ui - deliberately not set per app, so all five stay in sync. */}
						<SonnerToaster />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}