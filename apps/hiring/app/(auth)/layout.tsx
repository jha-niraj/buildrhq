import Footer from "@/components/landingpage/footer";
import Navbar from "@/components/landingpage/navbar";
import { Metadata } from "next";

// Canonical origin for this deploy. Overridable per environment so preview
// builds emit their own absolute URLs instead of the production ones.
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://hiring.shiprhq.com'

export const metadata: Metadata = {
	title: {
		default: "ShiprHQ",
		template: "%s | ShiprHQ"
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
		siteName: "ShiprHQ",
		title: "ShiprHQ - The Engineering Intelligence Platform for Computer Science Students",
		description: "The Engineering Intelligence Platform for Computer Science Students",
		images: [
			{
				url: "/og/home.webp",
				width: 1200,
				height: 630,
				alt: "ShiprHQ - The Engineering Intelligence Platform for Computer Science Students",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "ShiprHQ - The Engineering Intelligence Platform for Computer Science Students",
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

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}