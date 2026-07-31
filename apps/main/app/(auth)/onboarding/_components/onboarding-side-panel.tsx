"use client"

import { useTheme } from "@repo/ui/components/themeprovider"
import { motion } from "framer-motion"
import { Code2, Check, Sun, Moon, Lock } from "lucide-react"
import type { FlowNav } from "@repo/ui/components/typeform-flow"

// Staggered entrance so the left panel eases in like the right (form) side.
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.08 } } }
const stepsContainer = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } } }
const item = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

// Every theme-dependent class is a light/dark PAIR resolved by CSS, never a JS boolean. The
// `dark` class is on <html> before first paint (next-themes' blocking script), so the panel is
// correct on its very first frame and server and client render identical markup — computing
// `isDark` in JS instead would always take the LIGHT branch first and then flip, which is
// exactly the flicker this avoids.
const INK = "text-neutral-900 dark:text-white"
const INK_DIM = "text-neutral-500 dark:text-white/55"
const INK_FAINT = "text-neutral-400 dark:text-white/40"
const HAIRLINE = "border-neutral-900/10 dark:border-white/10"
const FILL_SOFT = "bg-neutral-900/5 dark:bg-white/10"
const HOVER_SOFT = "hover:bg-neutral-900/[0.03] dark:hover:bg-white/5"
const MARKER_DONE = "border-neutral-900 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
const MARKER_CURRENT = "border-neutral-900 text-neutral-900"
const TOGGLE = "text-neutral-700 hover:bg-neutral-900 dark:bg-white/5 dark:text-white dark:text-neutral-900 dark:hover:bg-white/10"

const STEP_CAPTIONS: Record<string, string> = {
	username: "Your handle across BuildrHQ",
	avatar: "A face for your profile",
	university: "Where you study or studied",
	semester: "Where you are right now",
	interests: "What you want to get better at",
	resume: "Powers your AI tools (optional)",
}

/**
 * Left panel for the onboarding flow: brand, a live step list the user can jump
 * around, and a light/dark toggle. Receives navigation state from TypeformFlow
 * via `renderSidePanel`.
 */
export function OnboardingSidePanel({ nav }: { nav: FlowNav }) {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<div className="relative h-full overflow-hidden bg-neutral-50 dark:bg-neutral-950">
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="relative z-10 flex h-full flex-col p-8 xl:p-10"
			>
				{/* Brand */}
				<motion.div variants={item} className="flex items-center gap-2.5">
					<span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900/10 border border-neutral-900/20">
						<Code2 className="h-5 w-5 text-neutral-900" />
					</span>
					<span className={`text-lg font-semibold tracking-tight ${INK}`}>BuildrHQ</span>
				</motion.div>

				{/* Heading */}
				<motion.div variants={item} className="mt-10">
					<h2 className={`text-[26px] font-bold leading-tight tracking-tight ${INK}`}>
						Set up your profile
					</h2>
					<p className={`mt-2 text-sm leading-relaxed ${INK_DIM}`}>
						A minute of setup — everything here can be changed later in Settings.
					</p>
				</motion.div>

				{/* Step list */}
				<motion.nav variants={item} className="mt-9 flex-1">
					<motion.ol variants={stepsContainer} className="space-y-1">
						{nav.realSteps.map((step, i) => {
							const isCurrent = i === nav.realIdx
							const isDone = i < nav.realIdx || (nav.isDone && i <= nav.maxRealIdx)
							const isReachable = i <= nav.maxRealIdx && !nav.isDone
							const caption = STEP_CAPTIONS[step.id]

							return (
								<motion.li variants={item} key={step.id}>
									<button
										type="button"
										onClick={() => isReachable && nav.goToRealStep(i)}
										disabled={!isReachable}
										aria-current={isCurrent ? "step" : undefined}
										className={`group flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
											isReachable ? "cursor-pointer" : "cursor-default"
										} ${isCurrent ? FILL_SOFT : isReachable ? HOVER_SOFT : ""}`}
									>
										<span
											className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors ${
												isDone
													? MARKER_DONE
													: isCurrent
														? MARKER_CURRENT
														: `${HAIRLINE} ${INK_FAINT}`
											}`}
										>
											{isDone ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
										</span>

										<span className="min-w-0 flex-1">
											<span className={`block text-sm font-semibold leading-snug ${isCurrent || isDone || isReachable ? INK : INK_FAINT}`}>
												{step.navLabel ?? step.question}
											</span>
											{caption && (
												<span className={`mt-0.5 block truncate text-xs ${isCurrent ? INK_DIM : INK_FAINT}`}>
													{caption}
												</span>
											)}
										</span>

										{!isReachable && !isDone && !isCurrent && (
											<Lock className={`mt-1 h-3 w-3 shrink-0 ${INK_FAINT}`} />
										)}
									</button>
								</motion.li>
							)
						})}
					</motion.ol>
				</motion.nav>

				{/* Footer: progress + theme toggle */}
				<motion.div variants={item} className={`mt-6 flex items-center justify-between border-t pt-5 ${HAIRLINE}`}>
					<span className={`text-xs font-medium ${INK_DIM}`}>
						Step {Math.min(nav.realIdx + 1, nav.realSteps.length)} of {nav.realSteps.length}
					</span>
					<button
						type="button"
						onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
						className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer ${HAIRLINE} ${TOGGLE}`}
						// A static label: a directional one ("Switch to light mode") would have to be
						// computed from the theme, which is the JS read this component avoids.
						aria-label="Toggle theme"
					>
						<Moon className="h-4 w-4 dark:hidden" aria-hidden />
						<Sun className="hidden h-4 w-4 dark:block" aria-hidden />
					</button>
				</motion.div>
			</motion.div>
		</div>
	)
}
