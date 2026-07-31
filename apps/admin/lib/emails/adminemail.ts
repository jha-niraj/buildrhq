import { Resend } from "resend";
import { shell, resolveFromAddress } from "@repo/email";

function getResend(): Resend {
    if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY environment variable is not set");
    }
    return new Resend(process.env.RESEND_API_KEY);
}

function fromEmail(): string {
    return resolveFromAddress();
}

// ─── Shell ────────────────────────────────────────────────────────────────────


// ─── Sender ───────────────────────────────────────────────────────────────────

export async function adminSendEmail({
    to,
    subject,
    text,
}: {
    to: string;
    subject: string;
    text: string;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const html = shell({
            title: subject,
            body: `<p style="margin:0;font-size:14px;color:#525252;line-height:1.7;white-space:pre-wrap;">${text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`,
        });

        const result = await getResend().emails.send({
            from: fromEmail(),
            to,
            subject,
            html,
        });

        if (result.error) {
            return { success: false, error: result.error.message || "Failed to send email" };
        }
        return { success: true };
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to send email"
        return { success: false, error: message };
    }
}
