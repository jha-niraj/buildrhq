/**
 * The artwork on the brand panel of an auth screen.
 *
 * Each motif depicts something the product actually does - a contribution grid,
 * a commit graph, a one-time code being entered, a candidate funnel - and each
 * is matched to the screen it sits on, so the panel explains rather than
 * decorates. The previous set (orbits, constellations) was abstract pattern: it
 * looked like a screensaver and told a developer nothing.
 *
 * Three constraints:
 *
 *  1. Pure inline SVG. Nothing to download, and the whole thing inherits the
 *     panel's colour through `currentColor`, so it needs no light/dark
 *     branching.
 *
 *  2. Animated with CSS keyframes (the `av-*` rules in styles/globals.css), NOT
 *     framer-motion. A motion `initial -> animate` one-shot restarts on every
 *     React re-render, and the theme toggle re-renders synchronously (flushSync,
 *     inside startViewTransition) - which is why the artwork used to replay its
 *     draw-in whenever the theme was switched.
 *
 *  3. Everything lives inside the 360×300 viewBox with a comfortable margin.
 *     The old orbit motif ran its rings past the edge and got clipped by the
 *     panel, which read as broken rather than as a crop.
 *
 * Not a client component: no state, no effects, no handlers - it renders on the
 * server and ships no JS.
 */

export type AuthVisualVariant =
    | "contributions"
    | "commit-graph"
    | "otp-mail"
    | "shield"
    | "otp-cells"
    | "roster"
    | "funnel"
    | "terminal"

const d = (seconds: number) => ({ animationDelay: `${seconds}s` })

// ─── contributions ───────────────────────────────────────────────────────────
// The contribution heatmap every developer recognises, filling column by column.
// For sign-in: the work already behind you, waiting where you left it.
function Contributions() {
    const cols = 20
    const rows = 7
    const cell = 13
    const gap = 3.4
    const x0 = 26
    const y0 = 74
    // A fixed pseudo-random density so the grid looks like real activity rather
    // than a uniform block - deterministic, so server and client agree.
    const level = (c: number, r: number) => ((c * 7 + r * 13 + ((c * r) % 5)) % 10) / 10

    return (
        <>
            {Array.from({ length: cols }).map((_, c) =>
                Array.from({ length: rows }).map((_, r) => {
                    const v = level(c, r)
                    if (v < 0.25) {
                        return (
                            <rect key={`${c}-${r}`} x={x0 + c * (cell + gap)} y={y0 + r * (cell + gap)}
                                width={cell} height={cell} rx={2.6}
                                fill="currentColor" fillOpacity={0.05} />
                        )
                    }
                    return (
                        <rect
                            key={`${c}-${r}`}
                            x={x0 + c * (cell + gap)} y={y0 + r * (cell + gap)}
                            width={cell} height={cell} rx={2.6}
                            fill="currentColor" fillOpacity={0.16 + v * 0.62}
                            className="av-cell"
                            style={d(c * 0.14)}
                        />
                    )
                }),
            )}
            {/* Day labels, as on the real thing - they anchor the grid as a calendar. */}
            {["M", "W", "F"].map((t, i) => (
                <text key={t} x={14} y={y0 + 10 + i * 2 * (cell + gap)} fill="currentColor" fillOpacity={0.3}
                    fontSize={9} fontFamily="ui-monospace, monospace">{t}</text>
            ))}
            <text x={26} y={56} fill="currentColor" fillOpacity={0.5} fontSize={11}
                fontFamily="ui-monospace, monospace">contributions</text>
            <text x={26} y={214} fill="currentColor" fillOpacity={0.72} fontSize={15}
                fontFamily="ui-monospace, monospace" fontWeight={600}>134-day streak</text>
            <rect x={26} y={224} width={92} height={2} rx={1} fill="currentColor" fillOpacity={0.55}
                className="av-ol av-meter" />
        </>
    )
}

// ─── commit-graph ────────────────────────────────────────────────────────────
// A branch diverging from main, gaining commits, then merging back.
// For register: your first commit on the board.
function CommitGraph() {
    const main = 196
    const branch = 118
    // Named rather than indexed off an array: the tsconfig has
    // noUncheckedIndexedAccess, so xs[1] is `number | undefined` and cannot be
    // used in arithmetic without a guard on every single access.
    const forkX = 92
    const b1X = 144
    const b2X = 196
    const mergeX = 248
    const xs = [40, forkX, b1X, b2X, mergeX, 300]
    const branchPath =
        `M ${forkX} ${main} C ${forkX + 26} ${main}, ${forkX + 26} ${branch}, ${b1X} ${branch} ` +
        `H ${b2X} C ${mergeX - 26} ${branch}, ${mergeX - 26} ${main}, ${mergeX} ${main}`

    return (
        <>
            {/* main line */}
            <path d={`M 30 ${main} H 320`} stroke="currentColor" strokeOpacity={0.16} strokeWidth={1.5} />
            {/* branch out and back */}
            <path
                d={branchPath}
                stroke="currentColor" strokeOpacity={0.22} strokeWidth={1.5}
                pathLength={1} strokeDasharray={1} className="av-draw"
            />
            {/* a packet running the branch, so the graph reads as active */}
            <path
                d={branchPath}
                stroke="currentColor" strokeOpacity={0.9} strokeWidth={2} strokeLinecap="round"
                pathLength={1} strokeDasharray="0.12 0.88" className="av-travel"
            />
            {/* commits on main */}
            {xs.map((x, i) => (
                <circle key={`m${i}`} cx={x} cy={main} r={5.5} fill="currentColor"
                    className="av-o av-pop" style={d(i * 0.3)} />
            ))}
            {/* commits on the branch */}
            {[b1X, b2X].map((x, i) => (
                <circle key={`b${i}`} cx={x} cy={branch} r={5.5} fill="currentColor"
                    className="av-o av-pop" style={d(0.9 + i * 0.3)} />
            ))}
            <text x={30} y={172} fill="currentColor" fillOpacity={0.42} fontSize={10}
                fontFamily="ui-monospace, monospace">feat/first-project</text>
            <text x={30} y={228} fill="currentColor" fillOpacity={0.42} fontSize={10}
                fontFamily="ui-monospace, monospace">main</text>
            <text x={30} y={70} fill="currentColor" fillOpacity={0.62} fontSize={13}
                fontFamily="ui-monospace, monospace" fontWeight={600}>6 commits · 1 merged</text>
        </>
    )
}

// ─── otp-mail ────────────────────────────────────────────────────────────────
// An envelope with a six-digit code lifting out of it.
// For forgot-password: the code is on its way to your inbox.
function OtpMail() {
    const digits = ["4", "8", "2", "1", "9", "6"]
    return (
        <>
            <rect x={78} y={128} width={204} height={128} rx={10}
                stroke="currentColor" strokeOpacity={0.24} strokeWidth={1.5} />
            <path d="M 78 138 L 180 202 L 282 138" stroke="currentColor" strokeOpacity={0.24} strokeWidth={1.5}
                fill="none" pathLength={1} strokeDasharray={1} className="av-draw" />
            {/* the code, lifting clear of the envelope */}
            <g className="av-o av-lift">
                {digits.map((n, i) => (
                    <g key={i}>
                        <rect x={72 + i * 36} y={54} width={28} height={38} rx={6}
                            fill="currentColor" fillOpacity={0.07} />
                        <rect x={72 + i * 36} y={54} width={28} height={38} rx={6}
                            stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.25} />
                        <text
                            x={86 + i * 36} y={81} textAnchor="middle"
                            fill="currentColor" fillOpacity={0.9} fontSize={19}
                            fontFamily="ui-monospace, monospace" fontWeight={600}
                            className="av-o av-pop" style={d(i * 0.22)}
                        >{n}</text>
                    </g>
                ))}
            </g>
            <path d="M 180 108 V 126" stroke="currentColor" strokeOpacity={0.28} strokeWidth={1.25}
                strokeDasharray="3 4" />
            <text x={180} y={280} textAnchor="middle" fill="currentColor" fillOpacity={0.5} fontSize={11}
                fontFamily="ui-monospace, monospace">expires in 10:00</text>
        </>
    )
}

// ─── shield ──────────────────────────────────────────────────────────────────
// A padlock over a strength meter that fills as you go.
// For reset-password: choosing something stronger.
function Shield() {
    const segs = [0, 1, 2, 3]
    return (
        <>
            <path
                d="M 180 44 L 262 76 V 152 C 262 200, 224 236, 180 252 C 136 236, 98 200, 98 152 V 76 Z"
                stroke="currentColor" strokeOpacity={0.22} strokeWidth={1.5}
                pathLength={1} strokeDasharray={1} className="av-draw"
            />
            <path
                d="M 180 44 L 262 76 V 152 C 262 200, 224 236, 180 252 C 136 236, 98 200, 98 152 V 76 Z"
                fill="currentColor" fillOpacity={0.04}
            />
            {/* padlock */}
            <path d="M 162 138 V 122 A 18 18 0 0 1 198 122 V 138"
                stroke="currentColor" strokeOpacity={0.55} strokeWidth={2.5} fill="none" strokeLinecap="round" />
            <rect x={152} y={138} width={56} height={44} rx={7} fill="currentColor" fillOpacity={0.7} />
            <circle cx={180} cy={158} r={4} fill="currentColor" fillOpacity={0.15} />
            <rect x={178.5} y={158} width={3} height={12} rx={1.5} fill="currentColor" fillOpacity={0.15} />
            {/* strength meter */}
            {segs.map((i) => (
                <g key={i}>
                    <rect x={122 + i * 32} y={206} width={26} height={5} rx={2.5}
                        fill="currentColor" fillOpacity={0.1} />
                    <rect x={122 + i * 32} y={206} width={26} height={5} rx={2.5}
                        fill="currentColor" fillOpacity={0.45 + i * 0.16}
                        className="av-ol av-meter" style={d(i * 0.32)} />
                </g>
            ))}
            <text x={180} y={286} textAnchor="middle" fill="currentColor" fillOpacity={0.5} fontSize={11}
                fontFamily="ui-monospace, monospace">strong password</text>
        </>
    )
}

// ─── otp-cells ───────────────────────────────────────────────────────────────
// Six code boxes filling one at a time, then a tick.
// For verify: literally the thing the user is doing on that screen.
function OtpCells() {
    const digits = ["2", "0", "7", "4", "1", "5"]
    return (
        <>
            <text x={180} y={104} textAnchor="middle" fill="currentColor" fillOpacity={0.5} fontSize={11}
                fontFamily="ui-monospace, monospace">enter the 6-digit code</text>
            {digits.map((n, i) => (
                <g key={i}>
                    <rect x={40 + i * 48} y={126} width={38} height={52} rx={8}
                        fill="currentColor" fillOpacity={0.05} />
                    <rect x={40 + i * 48} y={126} width={38} height={52} rx={8}
                        stroke="currentColor" strokeOpacity={0.24} strokeWidth={1.25} />
                    <text
                        x={59 + i * 48} y={162} textAnchor="middle"
                        fill="currentColor" fillOpacity={0.92} fontSize={22}
                        fontFamily="ui-monospace, monospace" fontWeight={600}
                        className="av-o av-pop" style={d(i * 0.26)}
                    >{n}</text>
                    {/* caret sits in the cell that is currently being filled */}
                    <rect x={57 + i * 48} y={140} width={2} height={24} rx={1}
                        fill="currentColor" fillOpacity={0.6}
                        className="av-caret" style={d(i * 0.26)} />
                </g>
            ))}
            <path d="M 158 214 l 14 14 l 30 -32" stroke="currentColor" strokeOpacity={0.75} strokeWidth={3}
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                pathLength={1} strokeDasharray={1} className="av-draw" style={d(1.7)} />
            <circle cx={180} cy={216} r={34} stroke="currentColor" strokeWidth={1.25}
                className="av-o av-ripple" style={d(1.7)} />
        </>
    )
}

// ─── roster ──────────────────────────────────────────────────────────────────
// Rows of people joining a list, one after another.
// For the university app: students and faculty arriving on the platform.
function Roster() {
    const rows = [0, 1, 2, 3, 4]
    return (
        <>
            <text x={38} y={70} fill="currentColor" fillOpacity={0.5} fontSize={11}
                fontFamily="ui-monospace, monospace">cohort · 2026</text>
            {rows.map((i) => (
                <g key={i} className="av-o av-pop" style={d(i * 0.3)}>
                    <rect x={34} y={90 + i * 38} width={292} height={30} rx={8}
                        fill="currentColor" fillOpacity={0.05} />
                    <circle cx={54} cy={105 + i * 38} r={9} fill="currentColor" fillOpacity={0.42} />
                    <rect x={72} y={99 + i * 38} width={104 - i * 9} height={5} rx={2.5}
                        fill="currentColor" fillOpacity={0.32} />
                    <rect x={72} y={109 + i * 38} width={62} height={4} rx={2}
                        fill="currentColor" fillOpacity={0.16} />
                    {/* enrolled tick */}
                    <path d={`M 296 ${104 + i * 38} l 5 5 l 11 -12`}
                        stroke="currentColor" strokeOpacity={0.6} strokeWidth={2}
                        fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
            ))}
            <text x={34} y={292} fill="currentColor" fillOpacity={0.62} fontSize={13}
                fontFamily="ui-monospace, monospace" fontWeight={600}>+248 enrolled</text>
        </>
    )
}

// ─── funnel ──────────────────────────────────────────────────────────────────
// Applicants narrowing through stages to one hire.
// For the hiring app: the pipeline it manages.
function Funnel() {
    const stages = [
        { y: 66, w: 268, label: "applied", n: "1,204" },
        { y: 118, w: 206, label: "screened", n: "312" },
        { y: 170, w: 144, label: "interviewed", n: "48" },
        { y: 222, w: 82, label: "hired", n: "6" },
    ]
    return (
        <>
            {stages.map((s, i) => (
                <g key={i}>
                    <rect x={180 - s.w / 2} y={s.y} width={s.w} height={36} rx={8}
                        fill="currentColor" fillOpacity={0.05} />
                    <rect x={180 - s.w / 2} y={s.y} width={s.w} height={36} rx={8}
                        stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.25} />
                    <rect x={180 - s.w / 2} y={s.y} width={s.w} height={36} rx={8}
                        fill="currentColor" fillOpacity={0.1 + i * 0.07}
                        className="av-ol av-meter" style={d(i * 0.3)} />
                    <text x={180 - s.w / 2 + 12} y={s.y + 23} fill="currentColor" fillOpacity={0.62}
                        fontSize={11} fontFamily="ui-monospace, monospace">{s.label}</text>
                    <text x={180 + s.w / 2 - 12} y={s.y + 23} textAnchor="end" fill="currentColor"
                        fillOpacity={0.85} fontSize={12} fontFamily="ui-monospace, monospace"
                        fontWeight={600}>{s.n}</text>
                    {i < stages.length - 1 && (
                        <path d={`M 180 ${s.y + 36} v 16`} stroke="currentColor" strokeOpacity={0.25}
                            strokeWidth={1.25} strokeDasharray="3 3" />
                    )}
                </g>
            ))}
            <circle cx={180} cy={276} r={9} fill="currentColor" fillOpacity={0.75}
                className="av-o av-flare" />
            <circle cx={180} cy={276} r={18} stroke="currentColor" strokeWidth={1.25}
                className="av-o av-ripple" />
        </>
    )
}

// ─── terminal ────────────────────────────────────────────────────────────────
// A build log typing itself out and passing.
// For screens about shipping: the thing that happens when your work is done.
function Terminal() {
    const lines = [
        { t: "$ pnpm build", w: 118, o: 0.72 },
        { t: "✓ 42 tests passed", w: 152, o: 0.5 },
        { t: "✓ types clean", w: 118, o: 0.5 },
        { t: "→ deploying…", w: 128, o: 0.5 },
    ]
    return (
        <>
            <rect x={26} y={56} width={308} height={196} rx={12}
                fill="currentColor" fillOpacity={0.04} />
            <rect x={26} y={56} width={308} height={196} rx={12}
                stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.25} />
            <path d="M 26 84 H 334" stroke="currentColor" strokeOpacity={0.16} strokeWidth={1.25} />
            {[0, 1, 2].map((i) => (
                <circle key={i} cx={44 + i * 15} cy={70} r={4} fill="currentColor"
                    fillOpacity={0.2 + i * 0.06} />
            ))}
            {lines.map((l, i) => (
                <g key={i}>
                    <text x={44} y={116 + i * 32} fill="currentColor" fillOpacity={l.o} fontSize={13}
                        fontFamily="ui-monospace, monospace">{l.t}</text>
                    {/* a wipe that reveals the line, so it reads as being typed */}
                    <rect x={44} y={104 + i * 32} width={l.w} height={16}
                        fill="currentColor" fillOpacity={0.001}
                        className="av-ol av-type" style={d(i * 0.42)} />
                </g>
            ))}
            <rect x={44} y={232} width={9} height={15} fill="currentColor" fillOpacity={0.7}
                className="av-caret" />
            <text x={310} y={244} textAnchor="end" fill="currentColor" fillOpacity={0.4} fontSize={10}
                fontFamily="ui-monospace, monospace">shipithq</text>
        </>
    )
}

const VARIANTS: Record<AuthVisualVariant, () => React.JSX.Element> = {
    contributions: Contributions,
    "commit-graph": CommitGraph,
    "otp-mail": OtpMail,
    shield: Shield,
    "otp-cells": OtpCells,
    roster: Roster,
    funnel: Funnel,
    terminal: Terminal,
}

export function AuthVisual({
    variant = "contributions",
    className = "",
}: {
    variant?: AuthVisualVariant
    className?: string
}) {
    const Motif = VARIANTS[variant] ?? Contributions

    return (
        <div className={`pointer-events-none select-none ${className}`} aria-hidden>
            <svg viewBox="0 0 360 300" className="h-full w-full" fill="none" preserveAspectRatio="xMidYMid meet">
                <Motif />
            </svg>
        </div>
    )
}

export default AuthVisual
