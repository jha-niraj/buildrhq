import { NextRequest } from "next/server";
import { getSession } from "@repo/auth";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import { openai } from "@/lib/openai-client";

export const runtime = "nodejs";
// The response is a token stream, so it can never be cached or prerendered.
export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini";

/** Newest-last, and capped: the panel keeps unlimited local history, but only the
 *  tail is worth the tokens — and an unbounded client array is untrusted input. */
const MAX_HISTORY_MESSAGES = 20;
const MAX_MESSAGE_CHARS = 8000;

interface IncomingMessage {
    role: "user" | "assistant";
    content: string;
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
        "You are the BuildrHQ assistant — an engineering-career copilot for CS students and software engineers.",
        "You help with: building portfolio projects, DSA and system-design practice, resumes and cover letters, technical interview prep, and open-source contribution.",
        "",
        "How to answer:",
        "- Be direct and concrete. Lead with the answer, then the reasoning.",
        "- Prefer short paragraphs and tight bullet lists over walls of text.",
        "- Use fenced code blocks with a language tag for any code.",
        "- If a question is outside engineering/career help, answer briefly and steer back.",
        "- Never invent BuildrHQ features, prices, or user data you weren't given.",
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

    let stream: AsyncGenerator<unknown>;
    try {
        stream = (await openai.chat.completions.create({
            model: MODEL,
            messages: [{ role: "system", content: system }, ...history],
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
