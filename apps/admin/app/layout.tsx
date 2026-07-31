import type { Metadata } from "next";
import "@repo/ui/styles/globals.css";
import { ThemeProvider } from "@repo/ui/components/themeprovider";
import { Geist, Space_Grotesk, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Toaster as SonnerToaster } from "@repo/ui/components/ui/sonner";
import { Providers } from "./providers";

// Canonical origin for this deploy. Overridable per environment so preview
// builds emit their own absolute URLs instead of the production ones.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://admin.buildrhq.com'

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
	// utility — so every h1/h2 and the sidebar pick it up without each app
	// restating the stack.
	variable: "--font-display",
});

export const metadata: Metadata = {
	title: {
		default: "BuildrHQ Admin",
		template: "%s | BuildrHQ Admin"
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
		siteName: "BuildrHQ Admin",
		title: "BuildrHQ - The Engineering Intelligence Platform for Computer Science Students",
		description: "The Engineering Intelligence Platform for Computer Science Students",
		images: [
			{
				url: "/mainlogo.jpeg",
				width: 1024,
				height: 1024,
				alt: "BuildrHQ Admin - The Engineering Intelligence Platform for Computer Science Students",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "BuildrHQ Admin - The Engineering Intelligence Platform for Computer Science Students",
		description: "The Engineering Intelligence Platform for Computer Science Students",
		images: ["/mainlogo.jpeg"],
		creator: "@buildrhq",
	},
	icons: {
		icon: [
			{ url: "/mainlogo.ico", sizes: "any" },
			{ url: "/mainlogo.jpeg", type: "image/jpeg", sizes: "512x512" },
		],
		apple: [
			{ url: "/mainlogo.jpeg", sizes: "180x180", type: "image/jpeg" },
		],
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
		<html lang="en">
			<body className={`
				${spaceGrotesk.className} ${bricolage.variable} ${geistSans.variable} ${geistMono.variable} antialiased 
			`}>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
							{children}
						<SonnerToaster position="top-center" closeButton richColors />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}