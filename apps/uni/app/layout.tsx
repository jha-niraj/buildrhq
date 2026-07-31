import type { Metadata } from "next";
import "@repo/ui/styles/globals.css";
import { ThemeProvider } from "@repo/ui/components/themeprovider";
import { Geist, Space_Grotesk, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import { Toaster as SonnerToaster } from "@repo/ui/components/ui/sonner";
import { Providers } from "./providers/providers";

// Canonical origin for this deploy. Overridable per environment so preview
// builds emit their own absolute URLs instead of the production ones.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://uni.buildrhq.com'

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
		default: "BuildrHQ University | Empower Your Institution",
		template: "%s | BuildrHQ University"
	},
	description: "The complete university management platform. Assign real-world coding projects, track student progress, and connect students directly to job opportunities.",
	keywords: ["University", "College", "Education", "Student Management", "Coding Assignments", "Placement", "Technical Education", "Academic Platform"],
	authors: [{ name: "Niraj Jha" }],
	creator: "BuildrHQ",
	publisher: "BuildrHQ",
	metadataBase: new URL(BASE_URL),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: BASE_URL,
		siteName: "BuildrHQ University",
		title: "BuildrHQ University - Empower Your Institution with Industry-Ready Learning",
		description: "The complete university management platform. Assign real-world coding projects, track student progress, and connect students directly to job opportunities.",
		images: [
			{
				url: "/mainlogo.jpeg",
				width: 1024,
				height: 1024,
				alt: "BuildrHQ University - Empower Your Institution",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "BuildrHQ University - Empower Your Institution",
		description: "The complete university management platform for technical education.",
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