import { NextRequest } from "next/server";
import { getSession } from "@repo/auth";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { openai } from "@/lib/openai-client";
import { TOOL_SPECS, runTool } from "@/lib/ai/tools";

export const runtime = "nodejs";
// The response is a token stream, so it can never be cached or prerendered.
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

/** Newest-last, and capped: the panel keeps unlimited local history, but only the
 *  tail is worth the tokens — and an unbounded client array is untrusted input. */
const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 8000;

/** How many times the model may call tools before it must answer in prose.
 *  Two rounds covers "look me up, then search on what you found"; anything
 *  beyond that is a loop, not a plan, and burns the user's tokens. */
const MAX_TOOL_ROUNDS = 2;

interface IncomingMessage {
    role: "user" | "assistant";
    content: string;
}

/** One entry in the message array we hand to the model. Wider than
 *  IncomingMessage because tool rounds add assistant-with-tool_calls and tool
 *  result messages, neither of which the client is allowed to send. */
interface ChatParam {
    role: "system" | "user" | "assistant" | "tool";
    content?: string | null;
    tool_call_id?: string;
    tool_calls?: ToolCall[];
}

interface ToolCall {
    id: string;
    type?: string;
    function?: { name?: string; arguments?: string };
}

interface CompletionResponse {
    choices?: Array<{ message?: { content?: string | null; tool_calls?: ToolCall[] } }>;
}

function systemPrompt(ctx: {
    name: string | null;
    username: string | null;
    university: string | null;
    semester: string | null;
    interests: string[];
    page?: { route: string; title: string } | null;
}): string {
    const lines = [
        "You are the ShiprHQ assistant — an engineering-career copilot for CS students and software engineers.",
        "You help with: building portfolio projects, DSA and system-design practice, resumes and cover letters, technical interview prep, and open-source contribution.",
        "",
        "How to answer:",
        "- Be direct and concrete. Lead with the answer, then the reasoning.",
        "- Prefer short paragraphs and tight bullet lists over walls of text.",
        "- Use fenced code blocks with a language tag for any code.",
        "- If a question is outside engineering/career help, answer briefly and steer back.",
        "- Never invent ShiprHQ features, prices, or user data you weren't given.",
        "",
        "Tools:",
        "- You can read this user's own ShiprHQ data and search the platform's project ideas and job posts.",
        "- Call a tool when the answer depends on their actual state (progress, goals, practice, profile) or on what the platform actually offers. Don't ask them to repeat something a tool can tell you.",
        "- Don't call a tool for general knowledge, code review, or explanations — just answer.",
        "- If a tool returns nothing or errors, say so plainly and answer with what you have. Never fabricate rows.",
        "",
        "About the person you're talking to:",
        `- Name: ${ctx.name ?? "unknown"}`,
    ];
    if (ctx.username) lines.push(`- Handle: @${ctx.username}`);
    if (ctx.university) lines.push(`- Studies at: ${ctx.university}${ctx.semester ? ` (${ctx.semester})` : ""}`);
    if (ctx.interests.length) lines.push(`- Wants to get better at: ${ctx.interests.join(", ")}`);
    if (ctx.page) {
        lines.push(
            "",
            // A pointer, not a payload: the model gets to know WHERE the user is so it
            // can be page-aware, without us shipping the page's contents into the prompt.
            `The user is currently on the "${ctx.page.title}" page (${ctx.page.route}). Take that into account when it's relevant; don't mention it otherwise.`,
        );
    }
    return lines.join("\n");
}

export async function POST(request: NextRequest) {
    const session = await getSession(request.headers);
    if (!session?.user?.id) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body: { messages?: unknown; page?: unknown };
    try {
        body = (await request.json()) as typeof body;
    } catch {
        return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Shape-check rather than cast: this array comes straight off the client.
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];
    const history: IncomingMessage[] = rawMessages
        .filter((m): m is IncomingMessage =>
            !!m &&
            typeof m === "object" &&
            typeof (m as IncomingMessage).content === "string" &&
            ((m as IncomingMessage).role === "user" || (m as IncomingMessage).role === "assistant"))
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }))
        .filter((m) => m.content.trim().length > 0)
        .slice(-MAX_HISTORY_MESSAGES);

    if (history.length === 0) {
        return new Response(JSON.stringify({ error: "No messages provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const page =
        body.page && typeof body.page === "object"
            ? {
                route: String((body.page as { route?: unknown }).route ?? "").slice(0, 200),
                title: String((body.page as { title?: unknown }).title ?? "").slice(0, 120),
            }
            : null;

    const [user] = await db
        .select({
            name: users.name,
            username: users.username,
            university: users.university,
            semester: users.semester,
            learningPreferences: users.learningPreferences,
        })
        .from(users)
        .where(eq(users.id, session.user.id))
        .limit(1);

    const system = systemPrompt({
        name: user?.name ?? session.user.name ?? null,
        username: user?.username ?? null,
        university: user?.university ?? null,
        semester: user?.semester ?? null,
        interests: user?.learningPreferences ?? [],
        page,
    });

    const conversation: ChatParam[] = [
        { role: "system", content: system },
        ...history,
    ];

    // ── Tool rounds ───────────────────────────────────────────────────────────
    // Resolved BEFORE streaming starts, not during it. A tool round is a
    // non-streamed completion: the model either answers (and we throw that draft
    // away, re-asking with streaming so the user sees tokens appear) or asks for
    // tools, which we run and feed back. Doing it this way means the response
    // body only ever carries prose — the client stays a plain text reader and
    // never has to understand tool framing.
    try {
        for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
            const decision = (await openai.chat.completions.create({
                model: MODEL,
                messages: conversation,
                temperature: 0.6,
                max_tokens: 1600,
                tools: TOOL_SPECS,
                tool_choice: "auto",
            })) as CompletionResponse;

            const choice = decision?.choices?.[0]?.message;
            const calls = choice?.tool_calls ?? [];
            if (calls.length === 0) break;

            conversation.push({
                role: "assistant",
                content: choice?.content ?? null,
                tool_calls: calls,
            });

            // Independent reads — run them together rather than serialising a
            // round trip to the database per call.
            const results = await Promise.all(
                calls.map((call) =>
                    runTool(call.function?.name ?? "", call.function?.arguments ?? "", session.user.id),
                ),
            );
            calls.forEach((call, i) => {
                conversation.push({
                    role: "tool",
                    tool_call_id: call.id,
                    content: results[i] ?? JSON.stringify({ error: "No result." }),
                });
            });
        }
    } catch (error) {
        // A failed tool round is recoverable: drop back to the plain history and
        // let the model answer from what it already knows.
        console.error("[ai/chat] tool round failed:", error);
        conversation.length = 0;
        conversation.push({ role: "system", content: system }, ...history);
    }

    let stream: AsyncGenerator<unknown>;
    try {
        stream = (await openai.chat.completions.create({
            model: MODEL,
            messages: conversation,
            temperature: 0.6,
            max_tokens: 1600,
            stream: true,
        })) as AsyncGenerator<unknown>;
    } catch (error) {
        console.error("[ai/chat] failed to start completion:", error);
        return new Response(JSON.stringify({ error: "The assistant is unavailable right now." }), {
            status: 502,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Plain UTF-8 token stream — no SSE framing. The client renders whatever has
    // arrived, so there is nothing for a richer protocol to buy here.
    const encoder = new TextEncoder();
    const body$ = new ReadableStream<Uint8Array>({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const delta = (chunk as {
                        choices?: Array<{ delta?: { content?: string } }>;
                    })?.choices?.[0]?.delta?.content;
                    if (delta) controller.enqueue(encoder.encode(delta));
                }
            } catch (error) {
                console.error("[ai/chat] stream error:", error);
                // Mid-stream failures can't change the status code, so surface the
                // problem as text the user can actually read.
                controller.enqueue(encoder.encode("\n\n_The response was cut short. Please try again._"));
            } finally {
                controller.close();
            }
        },
    });

    return new Response(body$, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store, no-transform",
            "X-Accel-Buffering": "no",
        },
    });
}
