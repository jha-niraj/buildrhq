import { ReactNode } from "react"
import Navbar from "@/components/landingpage/homepagenavbar"

// Server component on purpose - the only interactive part is the navbar, which is
// already a client component. No reason to opt the whole blog tree into client JS.
export default function BlogsLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen w-full flex-col bg-white dark:bg-neutral-950">
			<Navbar />
			<main className="flex-1 pt-16">{children}</main>
		</div>
	)
}
