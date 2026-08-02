"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
	X, Send, SquarePen, Loader2, Sparkles, History, Trash2, Maximize2, Minimize2,
	Copy, Check, StopCircle,
} from "lucide-react";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { cn } from "@repo/ui/lib/utils";
import toast from "@repo/ui/components/ui/sonner";
import MarkdownRenderer from "@/components/common/markdown-renderer";
import { useAIPanelStore, type AIChatMessage } from "@/app/store/aiPanelStore";

const SUGGESTIONS = [
	"Review my resume for a backend role",
	"Give me a 4-week DSA plan",
	"Design a URL shortener - walk me through it",
	"What project should I build next?",
];

/**
 * A lightweight, human-readable label for the page the user is on, so the
 * assistant is page-aware without anyone having to tag anything. Pointer, not
 * payload: only the route + title are sent.
 */
function buildPageContext(pathname: string): { route: string; title: string } {
	let title = "";
	if (typeof document !== "undefined" && document.title) {
		title = document.title.replace(/\s*[|\---]\s*ShipItHQ.*$/i, "").trim();
	}
	if (!title) {
		const segments = pathname.split("/").filter(Boolean);
		// Drop trailing id-like segments (cuid/uuid/numeric) for a cleaner label.
		const readable = segments.filter(
			(s) => !/^[0-9]+$/.test(s) && !/^(c[a-z0-9]{20,}|[0-9a-f-]{16,})$/i.test(s),
		);
		title = readable
			.map((s) => s.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
			.join(" › ") || "Dashboard";
	}
	return { route: pathname || "/", title };
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message, isStreaming }: { message: AIChatMessage; isStreaming: boolean }) {
	const [copied, setCopied] = useState(false);
	const isUser = message.role === "user";

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(message.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			toast.error("Couldn't copy to clipboard");
		}
	};

	if (isUser) {
		return (
			<div className="flex justify-end">
				<div className="max-w-[85%] rounded-2xl rounded-br-md bg-neutral-900 dark:bg-white px-3.5 py-2.5 text-sm leading-relaxed text-white dark:text-neutral-900">
					{message.content}
				</div>
			</div>
		);
	}

	return (
		<div className="group flex flex-col gap-1.5">
			<div className="flex items-center gap-1.5">
				<span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-900/10">
					<Sparkles className="h-3 w-3 text-neutral-900" />
				</span>
				<span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">ShipItHQ AI</span>
			</div>
			<div className="min-w-0 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
				{message.content ? (
					<MarkdownRenderer content={message.content} />
				) : isStreaming ? (
					<span className="inline-flex items-center gap-2 text-neutral-400">
						<Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
					</span>
				) : null}
			</div>
			{message.content && !isStreaming && (
				<button
					type="button"
					onClick={copy}
					className="inline-flex w-fit cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-xs text-neutral-400 opacity-0 transition-opacity hover:text-neutral-600 group-hover:opacity-100 dark:hover:text-neutral-200"
				>
					{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
					{copied ? "Copied" : "Copy"}
				</button>
			)}
		</div>
	);
}

// ─── Panel ────────────────────────────────────────────────────────────────────

/**
 * The chat surface - header, conversation, composer - and nothing about WHERE it
 * sits. It fills whatever box it is given.
 *
 * Placement is the app shell's job (`app/(main)/layout.tsx`): on lg+ it mounts
 * this as a real docked column beside the page, so the page narrows instead of
 * being covered; below lg it mounts the same component inside a Sheet. Keeping
 * the two concerns apart is what lets one implementation serve both without a
 * `variant` flag threading through every element.
 */
export function AIPanel() {
	const {
		close, isMaximized, toggleMaximized,
		sessions, activeSessionId, newSession, selectSession, deleteSession,
		addUserMessage, addAssistantPlaceholder, appendToLastAssistant, replaceLastAssistant,
		isStreaming, setStreaming,
	} = useAIPanelStore();

	const pathname = usePathname();
	const [input, setInput] = useState("");
	const [historyOpen, setHistoryOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const abortRef = useRef<AbortController | null>(null);

	const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;
	// Memoised so the empty-history case doesn't hand a fresh `[]` to the
	// scroll-to-bottom effect on every render (which would re-run it forever).
	const messages = useMemo(() => activeSession?.messages ?? [], [activeSession?.messages]);

	// Below lg the panel is a full-width sheet, so there is nothing to drag.
	useEffect(() => {
		const mq = window.matchMedia("(max-width: 1023px)");
		const update = () => setIsMobile(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	// Keep the newest message in view as tokens arrive.
	useEffect(() => {
		const el = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
		if (el) el.scrollTop = el.scrollHeight;
	}, [messages, isStreaming]);

	// The shell only mounts this while the panel is open, so mounting IS opening.
	useEffect(() => {
		const t = setTimeout(() => textareaRef.current?.focus(), 250);
		return () => clearTimeout(t);
	}, []);

	// Abort any in-flight response when the panel unmounts, so a closed panel
	// can't keep writing into a conversation nobody is looking at.
	useEffect(() => () => abortRef.current?.abort(), []);

	// ── Send ──────────────────────────────────────────────────────────────────
	const send = useCallback(async (text: string) => {
		const content = text.trim();
		if (!content || isStreaming) return;

		setInput("");
		addUserMessage(content);
		addAssistantPlaceholder();
		setStreaming(true);

		// Read the history AFTER the user message is in the store, so the request
		// includes the turn we're answering.
		const state = useAIPanelStore.getState();
		const session = state.sessions.find((s) => s.id === state.activeSessionId);
		const history = (session?.messages ?? [])
			.filter((m) => m.content.trim().length > 0)
			.map((m) => ({ role: m.role, content: m.content }));

		const controller = new AbortController();
		abortRef.current = controller;

		try {
			const res = await fetch("/api/ai/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: history, page: buildPageContext(pathname) }),
				signal: controller.signal,
			});

			if (!res.ok || !res.body) {
				const detail = await res.json().catch(() => null) as { error?: string } | null;
				replaceLastAssistant(detail?.error ?? "Something went wrong. Please try again.");
				return;
			}

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			for (;;) {
				const { done, value } = await reader.read();
				if (done) break;
				appendToLastAssistant(decoder.decode(value, { stream: true }));
			}
		} catch (error) {
			// A user-initiated stop is not an error - keep whatever streamed in.
			if ((error as Error)?.name !== "AbortError") {
				replaceLastAssistant("The assistant couldn't be reached. Please try again.");
			}
		} finally {
			abortRef.current = null;
			setStreaming(false);
		}
	}, [
		isStreaming, pathname, addUserMessage, addAssistantPlaceholder,
		appendToLastAssistant, replaceLastAssistant, setStreaming,
	]);

	const stop = () => abortRef.current?.abort();

	const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			void send(input);
		}
	};

	return (
		<div className="flex h-full w-full min-w-0 flex-col bg-white dark:bg-neutral-950">
			{/* Header */}
			<header className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
				<div className="flex min-w-0 items-center gap-2">
					<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-900/10">
						<Sparkles className="h-4 w-4 text-neutral-900" />
					</span>
					<span className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
						{activeSession?.messages.length ? activeSession.title : "ShipItHQ AI"}
					</span>
				</div>
				<div className="flex shrink-0 items-center gap-0.5">
					<IconButton label="Chat history" onClick={() => setHistoryOpen((v) => !v)} active={historyOpen}>
						<History className="h-4 w-4" />
					</IconButton>
					<IconButton label="New chat" onClick={() => { newSession(); setHistoryOpen(false); }}>
						<SquarePen className="h-4 w-4" />
					</IconButton>
					{!isMobile && (
						<IconButton label={isMaximized ? "Restore panel" : "Maximize panel"} onClick={toggleMaximized}>
							{isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
						</IconButton>
					)}
					<IconButton label="Close" onClick={close}>
						<X className="h-4 w-4" />
					</IconButton>
				</div>
			</header>

			{/* History drawer */}
			<AnimatePresence>
				{historyOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="shrink-0 overflow-hidden border-b border-neutral-200 dark:border-neutral-800"
					>
						<div className="max-h-56 overflow-y-auto p-2">
							{sessions.length === 0 ? (
								<p className="px-2 py-3 text-center text-sm text-neutral-400">No conversations yet</p>
							) : (
								sessions.map((s) => (
									<div
										key={s.id}
										className={cn(
											"group flex items-center gap-2 rounded-lg px-2 py-1.5",
											s.id === activeSessionId
												? "bg-neutral-900/10"
												: "hover:bg-neutral-100 dark:hover:bg-neutral-900",
										)}
									>
										<button
											type="button"
											onClick={() => { selectSession(s.id); setHistoryOpen(false); }}
											className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm text-neutral-700 dark:text-neutral-300"
										>
											{s.title}
										</button>
										<button
											type="button"
											onClick={() => deleteSession(s.id)}
											aria-label={`Delete "${s.title}"`}
											className="shrink-0 cursor-pointer rounded p-1 text-neutral-400 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
										>
											<Trash2 className="h-3.5 w-3.5" />
										</button>
									</div>
								))
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Conversation */}
			<ScrollArea ref={scrollRef} className="min-h-0 flex-1">
				<div className={cn(
					"space-y-5 px-4 py-5",
					// A maximized panel is far wider than a comfortable reading
					// measure, so the column is capped and centred there.
					isMaximized && "mx-auto max-w-3xl",
				)}>
					{messages.length === 0 ? (
						<div className="flex flex-col items-center py-10 text-center">
							<span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900/10">
								<Sparkles className="h-6 w-6 text-neutral-900" />
							</span>
							<h2 className="text-base font-semibold text-neutral-900 dark:text-white">
								How can I help?
							</h2>
							<p className="mt-1 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">
								Ask about your projects, interview prep, DSA, or your resume.
							</p>
							<div className="mt-5 grid w-full gap-2">
								{SUGGESTIONS.map((s) => (
									<button
										key={s}
										type="button"
										onClick={() => void send(s)}
										className="cursor-pointer rounded-xl border border-neutral-200 px-3 py-2.5 text-left text-sm text-neutral-700 transition-colors hover:border-neutral-900/50 hover:bg-neutral-900/5 dark:border-neutral-800 dark:text-neutral-300"
									>
										{s}
									</button>
								))}
							</div>
						</div>
					) : (
						messages.map((m, i) => (
							<MessageBubble
								key={m.id}
								message={m}
								isStreaming={isStreaming && i === messages.length - 1}
							/>
						))
					)}
				</div>
			</ScrollArea>

			{/* Composer */}
			<div className={cn("shrink-0 border-t border-neutral-200 p-3 dark:border-neutral-800", isMaximized && "mx-auto w-full max-w-3xl")}>
				<div className="flex items-end gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-3 py-2 focus-within:border-neutral-900 dark:border-neutral-800 dark:bg-neutral-900">
					<textarea
						ref={textareaRef}
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={onKeyDown}
						rows={1}
						placeholder="Ask anything…"
						disabled={isStreaming}
						className="max-h-40 min-h-[24px] w-full resize-none bg-transparent py-1 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-60 dark:text-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					/>
					{isStreaming ? (
						<button
							type="button"
							onClick={stop}
							aria-label="Stop generating"
							className="shrink-0 cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:text-red-500"
						>
							<StopCircle className="h-4.5 w-4.5" />
						</button>
					) : (
						<button
							type="button"
							onClick={() => void send(input)}
							disabled={!input.trim()}
							aria-label="Send message"
							className="shrink-0 cursor-pointer rounded-lg bg-neutral-900 dark:bg-white p-1.5 text-white dark:text-neutral-900 transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
						>
							<Send className="h-4 w-4" />
						</button>
					)}
				</div>
				<p className="mt-1.5 px-1 text-center text-xs text-neutral-400">
					Enter to send · Shift+Enter for a new line
				</p>
			</div>
		</div>
	);
}

function IconButton({ label, onClick, active, children }: {
	label: string;
	onClick: () => void;
	active?: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			title={label}
			className={cn(
				"cursor-pointer rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white",
				active && "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white",
			)}
		>
			{children}
		</button>
	);
}

export default AIPanel;
