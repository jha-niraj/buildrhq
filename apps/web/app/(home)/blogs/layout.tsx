import { ReactNode } from "react"
import Navbar from "@/components/landingpage/homepagenavbar"
import SmoothScroll from "@/components/smoothscroll"

// Server component on purpose - the only interactive parts (navbar, smooth scroll)
// are already client components, and passing `children` through them keeps the blog
// pages themselves server-rendered.
//
// SmoothScroll wraps the whole blog tree, not just the article page: moving between
// the index and a post shouldn't change how scrolling feels. Lenis mounts with
// `root`, so it drives the window scroller.
export default function BlogsLayout({ children }: { children: ReactNode }) {
	return (
		<SmoothScroll>
			<div className="flex min-h-screen w-full flex-col bg-white dark:bg-neutral-950">
				<Navbar />
				{/* pt-20 clears the floating navbar: h-16 plus the pt-3 on its fixed wrapper. */}
				<main className="flex-1 pt-20">{children}</main>
			</div>
		</SmoothScroll>
	)
}
