// ─────────────────────────────────────────────────────────────────────────────
// @repo/email — BuildrHQ shared email design system.
//
// One premium, brand-safe HTML shell + composable helpers, so every app renders
// the same editorial look (warm-neutral card, ink headings, serif-italic accents,
// mono eyebrow labels, pill buttons). Brand rule: NO blue / indigo / purple /
// brown — the accent is orange; green is used only for positive states.
//
// Usage stays drop-in compatible with the old per-app `shell({title, subtitle,
// body, footerNote})`, so existing templates upgrade for free.
// ─────────────────────────────────────────────────────────────────────────────

// ── Design tokens ────────────────────────────────────────────────────────────
export const C = {
    bgOuter: "#EFEDE5", // warm neutral page background
    card: "#FFFFFF",
    body: "#FBFAF6", // inner body panel
    hero: "#F5F2EA",
    border: "#E7E3D8",
    line: "#EFEAE0",
    ink: "#1A1A17",
    ink2: "#3A3A34",
    muted: "#6E6C63",
    faint: "#9A978C",
    accent: "#EA580C", // orange (brand)
    accentSoft: "#FDECE0",
    accentBorder: "#F6C9A8",
    ok: "#15803D", // green — positive states only
    warn: "#B45309", // amber — warnings (NOT brown)
    white: "#FFFFFF",
} as const;

export const F = {
    sans: "'Geist', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    mono: "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Courier New', monospace",
    serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
} as const;

const FONT_LINK =
    '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />';

// ── Brand mark (inline SVG — no external image dependency) ────────────────────
// Orange rounded square with a white terminal chevron + underscore.
export function logoMark(size = 30): string {
    return `<span style="display:inline-block;vertical-align:middle;width:${size}px;height:${size}px;">
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill="${C.accent}"/>
        <path d="M9 11.5L13 16L9 20.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.5 21H23" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    </span>`;
}

function logoRow(): string {
    return `<span style="display:inline-block;line-height:${1};">
      ${logoMark(30)}
      <span style="display:inline-block;vertical-align:middle;margin-left:9px;font-family:${F.sans};font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};">BuildrHQ</span>
    </span>`;
}

// ── Composable helpers (use inside a template `body`) ─────────────────────────

/** Mono, uppercase, letter-spaced eyebrow label. */
export function eyebrow(text: string): string {
    return `<p style="margin:0 0 14px;font-family:${F.mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${text}</p>`;
}

/** Large, light-weight heading. Wrap an emphasis word in `serif(...)` for the signature italic flourish. */
export function heading(html: string): string {
    return `<h1 style="margin:0 0 16px;font-family:${F.sans};font-size:27px;line-height:1.15;font-weight:500;letter-spacing:-0.02em;color:${C.ink};">${html}</h1>`;
}

/** Serif-italic orange emphasis — the brand flourish. */
export function serif(text: string): string {
    return `<em style="font-family:${F.serif};font-style:italic;font-weight:400;color:${C.accent};">${text}</em>`;
}

export function paragraph(html: string): string {
    return `<p style="margin:0 0 18px;font-family:${F.sans};font-size:14.5px;line-height:1.62;color:${C.ink2};">${html}</p>`;
}

/** The hero OTP panel — mono code on a warm tinted panel with an orange accent bar. */
export function otpPanel(otp: string, label = "Verification code", note = "Valid for 10 minutes"): string {
    return `<div style="margin:24px 0;border:1px solid ${C.border};border-radius:14px;overflow:hidden;background:${C.hero};">
      <div style="height:3px;background:${C.accent};"></div>
      <div style="padding:26px 20px;text-align:center;">
        <p style="margin:0 0 12px;font-family:${F.mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${label}</p>
        <p style="margin:0;font-family:${F.mono};font-size:38px;font-weight:700;letter-spacing:0.16em;color:${C.ink};">${otp}</p>
        <p style="margin:12px 0 0;font-family:${F.mono};font-size:10.5px;color:${C.faint};">${note}</p>
      </div>
    </div>`;
}

/** Ink pill button — the premium primary CTA. */
export function primaryButton(label: string, href: string): string {
    return `<p style="text-align:center;margin:26px 0;">
      <a href="${href}" style="display:inline-block;font-family:${F.sans};background:${C.ink};color:${C.white};text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:-0.01em;">${label}</a>
    </p>`;
}

/** Orange pill button — for high-emphasis conversion CTAs. */
export function accentButton(label: string, href: string): string {
    return `<p style="text-align:center;margin:26px 0;">
      <a href="${href}" style="display:inline-block;font-family:${F.sans};background:${C.accent};color:${C.white};text-decoration:none;padding:13px 26px;border-radius:999px;font-size:14px;font-weight:600;letter-spacing:-0.01em;">${label}</a>
    </p>`;
}

/** Neutral callout with an orange left border. */
export function callout(html: string): string {
    return `<div style="margin:18px 0;padding:14px 16px;border-left:2px solid ${C.accent};background:${C.accentSoft};border-radius:0 10px 10px 0;font-family:${F.sans};font-size:13px;line-height:1.55;color:${C.ink2};">${html}</div>`;
}

/** Amber warning callout (brand-safe, not brown). */
export function warnCallout(html: string): string {
    return `<div style="margin:18px 0;padding:14px 16px;border-left:2px solid ${C.warn};background:#FDF5E9;border-radius:0 10px 10px 0;font-family:${F.sans};font-size:13px;line-height:1.55;color:${C.ink2};">${html}</div>`;
}

/** Monospace copy-paste URL fallback box. */
export function urlFallback(url: string): string {
    return `<p style="margin:6px 0 0;font-family:${F.sans};font-size:12.5px;color:${C.muted};">Or copy and paste this URL into your browser:</p>
    <p style="margin:6px 0 0;padding:11px 12px;border:1px solid ${C.line};border-radius:10px;background:${C.hero};word-break:break-all;font-family:${F.mono};font-size:11.5px;color:${C.ink2};">${url}</p>`;
}

/** A tinted feature list with an orange check for each row. */
export function featureList(title: string, items: string[]): string {
    const rows = items
        .map(
            (i) => `<tr><td style="padding:5px 0;vertical-align:top;width:22px;">
        <span style="display:inline-block;width:16px;height:16px;border-radius:999px;background:${C.accentSoft};color:${C.accent};text-align:center;line-height:16px;font-size:11px;font-weight:700;">✓</span>
      </td><td style="padding:5px 0;font-family:${F.sans};font-size:13.5px;line-height:1.5;color:${C.ink2};">${i}</td></tr>`,
        )
        .join("");
    return `<div style="margin:18px 0;padding:18px 20px;border:1px solid ${C.border};border-radius:14px;background:${C.hero};">
      <p style="margin:0 0 10px;font-family:${F.mono};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};">${title}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${rows}</table>
    </div>`;
}

// ── The shell ─────────────────────────────────────────────────────────────────
// Drop-in compatible with the old per-app shell. `eyebrow` is optional; if a
// template already emits its own eyebrow/heading in `body`, omit `title`/`subtitle`.

export interface ShellParams {
    title: string;
    subtitle?: string;
    eyebrow?: string;
    body: string;
    footerNote?: string;
    /** Product/app name shown in the footer + header wordmark context. */
    brand?: string;
}

export function shell(params: ShellParams): string {
    const year = new Date().getFullYear();
    const brand = params.brand ?? "BuildrHQ";
    const headerBlock = `${params.eyebrow ? eyebrow(params.eyebrow) : ""}${
        params.subtitle
            ? `<p style="margin:0;font-family:${F.sans};font-size:13px;color:${C.muted};">${params.subtitle}</p>`
            : ""
    }`;

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <title>${params.title}</title>
    ${FONT_LINK}
  </head>
  <body style="margin:0;padding:0;background:${C.bgOuter};font-family:${F.sans};color:${C.ink};-webkit-font-smoothing:antialiased;">
    <div style="max-width:600px;margin:0 auto;padding:28px 16px 8px;">

      <!-- brand bar above the card -->
      <div style="padding:2px 4px 16px;">${logoRow()}</div>

      <!-- card -->
      <div style="background:${C.card};border:1px solid ${C.border};border-radius:16px;overflow:hidden;">
        ${
            headerBlock
                ? `<div style="padding:24px 30px 4px;background:${C.card};">${headerBlock}</div>`
                : ""
        }
        <div style="padding:22px 30px 30px;background:${C.body};">
          ${params.body}
        </div>
      </div>

      <!-- footer card -->
      <div style="margin:14px 0 0;padding:18px 22px;border:1px solid ${C.border};border-radius:14px;background:${C.card};">
        <div style="margin:0 0 8px;">${logoMark(22)}<span style="display:inline-block;vertical-align:middle;margin-left:8px;font-family:${F.sans};font-size:13px;font-weight:600;color:${C.ink};">${brand}</span></div>
        <p style="margin:0;font-family:${F.sans};font-size:12px;line-height:1.6;color:${C.muted};">
          ${params.footerNote ?? "This is an automated message from BuildrHQ. Please do not reply directly to this email."}
        </p>
        <p style="margin:10px 0 0;font-family:${F.mono};font-size:10.5px;letter-spacing:0.02em;color:${C.faint};">© ${year} BuildrHQ · Learn, build & get hired.</p>
      </div>

    </div>
  </body>
</html>`;
}

export type EmailContent = { subject: string; html: string };
