// ─────────────────────────────────────────────────────────────────────────────
// @repo/email - ShipItHQ shared email design system.
//
// One brand-safe HTML shell + composable helpers, so every app renders the same
// editorial look (warm-neutral card, ink headings, serif-italic accents, mono
// eyebrow labels, pill buttons). Brand rule: monochrome ink/neutral only - NO
// orange, blue, indigo, purple or brown. Green is used solely for positive states.
//
// ── Why this file looks like 2005 HTML ───────────────────────────────────────
// Email clients are not browsers. Outlook 2016-2021 on Windows renders with the
// WORD engine, which ignores `max-width` on a <div>, drops `border-radius`, and
// mishandles padding on block elements. Gmail strips <style> blocks in some
// contexts and does not load remote fonts at all. So:
//
//   * Layout is TABLES with role="presentation", not divs.
//   * Every style is INLINE. The one <style> block holds only the mobile media
//     query and dark-mode overrides, both of which degrade safely when stripped.
//   * Buttons are "bulletproof": a VML <v:roundrect> for Outlook plus a padded
//     anchor for everything else, so the CTA is a real tappable block everywhere
//     rather than a bare underlined link.
//   * The webfont <link> is progressive enhancement only (it works in Apple Mail
//     and little else) - the fallback stack is what most recipients actually see,
//     so it is chosen to look right on its own.
//
// Usage stays drop-in compatible with the previous `shell({title, subtitle,
// body, footerNote})` signature, so existing templates upgrade for free.
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
    accent: "#171717", // ink (brand accent - the palette is monochrome)
    accentSoft: "#F5F5F5",
    accentBorder: "#E5E5E5",
    ok: "#15803D", // green - positive states only
    warn: "#57534E", // warm grey - warnings
    white: "#FFFFFF",
} as const;

// The first family in each stack is the webfont; everything after it is what the
// recipient almost certainly gets. Ordered so the fallback carries the same
// personality - Segoe/Roboto for UI text, Georgia for the serif flourish.
export const F = {
    sans: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    mono: "'Geist Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
    serif: "'Instrument Serif', Georgia, 'Times New Roman', serif",
} as const;

const FONT_LINK =
    '<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />';

/** Escape a value that will sit inside an HTML attribute (href, alt, …). */
function attr(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ── Brand mark ───────────────────────────────────────────────────────────────
// The stepped-block mark, built out of nested table cells rather than an image.
//
// The previous version base64-encoded an SVG into an <img src>. Gmail strips
// SVG outright and Outlook cannot render it at all, so for a large share of
// recipients the mark was simply missing - and the old artwork was the retired
// terminal-chevron logo besides.
//
// Tables and background colours are the one drawing primitive every mail client
// supports, so the mark is laid out as a 3x3 grid with six filled cells. Outlook
// ignores border-radius and renders square blocks, which is a fine degradation:
// the silhouette still reads.
export function logoMark(size = 30): string {
    // Proportions mirror the real mark: the grid fills ~65% of the tile, with
    // the gap a quarter of a block.
    const grid = Math.round(size * 0.65);
    const block = Math.round((grid - 2 * Math.round(grid * 0.115)) / 3);
    const gap = Math.round(grid * 0.115);
    const radius = Math.max(1, Math.round(block * 0.16));

    // Row-major, top to bottom. `true` = filled.
    const cells: boolean[][] = [
        [false, false, true],
        [false, true, true],
        [true, true, true],
    ];

    const rows = cells
        .map((row) => {
            const tds = row
                .map((on, i) => {
                    const pad = i < 2 ? `padding-right:${gap}px;` : "";
                    const fill = on
                        ? `background:#FFFFFF;border-radius:${radius}px;`
                        : "";
                    return `<td width="${block}" height="${block}" style="width:${block}px;height:${block}px;line-height:${block}px;font-size:0;${pad}"><div style="width:${block}px;height:${block}px;${fill}">&nbsp;</div></td>`;
                })
                .join("");
            return `<tr>${tds}</tr>`;
        })
        // Vertical gaps: a spacer row between each block row.
        .join(
            `<tr><td colspan="3" height="${gap}" style="height:${gap}px;line-height:${gap}px;font-size:0;">&nbsp;</td></tr>`,
        );

    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;">
      <tr><td width="${size}" height="${size}" align="center" valign="middle" style="width:${size}px;height:${size}px;background:${C.accent};border-radius:${Math.round(size / 3.6)}px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">${rows}</table>
      </td></tr>
    </table>`;
}

function logoRow(brand: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td valign="middle">${logoMark(30)}</td>
      <td valign="middle" style="padding-left:9px;font-family:${F.sans};font-size:18px;font-weight:700;letter-spacing:-0.02em;color:${C.ink};">${brand}</td>
    </tr></table>`;
}

// ── Composable helpers (use inside a template `body`) ─────────────────────────

/** Mono, uppercase, letter-spaced eyebrow label. */
export function eyebrow(text: string): string {
    return `<p style="margin:0 0 14px;font-family:${F.mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${text}</p>`;
}

/** Large, light-weight heading. Wrap an emphasis word in `serif(...)` for the signature italic flourish. */
export function heading(html: string): string {
    return `<h1 class="bhq-h1" style="margin:0 0 16px;font-family:${F.sans};font-size:27px;line-height:1.2;font-weight:600;letter-spacing:-0.02em;color:${C.ink};">${html}</h1>`;
}

/** Serif-italic ink emphasis - the brand flourish. */
export function serif(text: string): string {
    return `<em style="font-family:${F.serif};font-style:italic;font-weight:400;color:${C.accent};">${text}</em>`;
}

export function paragraph(html: string): string {
    return `<p style="margin:0 0 18px;font-family:${F.sans};font-size:15px;line-height:1.65;color:${C.ink2};">${html}</p>`;
}

/**
 * The hero OTP panel - mono code on a warm tinted panel with an orange accent bar.
 *
 * The digits are spaced with a wide letter-spacing and a trailing hair space:
 * without the trailing space the last glyph sits visually off-centre, because
 * letter-spacing is applied AFTER every character including the final one.
 */
export function otpPanel(otp: string, label = "Verification code", note = "Valid for 10 minutes"): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:26px 0;border:1px solid ${C.border};border-radius:14px;background:${C.hero};">
      <tr><td style="height:3px;line-height:3px;font-size:0;background:${C.accent};border-radius:14px 14px 0 0;">&nbsp;</td></tr>
      <tr><td align="center" style="padding:26px 20px;">
        <p style="margin:0 0 12px;font-family:${F.mono};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${C.muted};">${label}</p>
        <p class="bhq-otp" style="margin:0;font-family:${F.mono};font-size:38px;font-weight:700;letter-spacing:0.16em;color:${C.ink};white-space:nowrap;">${otp}&#8202;</p>
        <p style="margin:12px 0 0;font-family:${F.mono};font-size:10.5px;color:${C.faint};">${note}</p>
      </td></tr>
    </table>`;
}

/** Bulletproof pill button. `bg` is the fill, `fg` the label colour. */
function button(label: string, href: string, bg: string, fg: string): string {
    const safeHref = attr(href);
    // Outlook's VML needs an explicit pixel width; approximate from the label so
    // short and long CTAs both keep their padding instead of being clipped.
    const width = Math.max(180, label.length * 9 + 56);
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center" style="padding:26px 0;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${safeHref}" style="height:46px;v-text-anchor:middle;width:${width}px;" arcsize="50%" stroke="f" fillcolor="${bg}">
        <w:anchorlock/>
        <center style="color:${fg};font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">${label}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <a href="${safeHref}" style="display:inline-block;font-family:${F.sans};background:${bg};color:${fg};text-decoration:none;padding:14px 30px;border-radius:999px;font-size:15px;font-weight:600;letter-spacing:-0.01em;mso-hide:all;">${label}</a>
      <!--<![endif]-->
    </td></tr></table>`;
}

/** Ink pill button - the primary CTA. */
export function primaryButton(label: string, href: string): string {
    return button(label, href, C.ink, C.white);
}

/** Secondary pill button - same ink family, used for lower-emphasis CTAs. */
export function accentButton(label: string, href: string): string {
    return button(label, href, C.accent, C.white);
}

/** Neutral callout with an ink left border. */
export function callout(html: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0;background:${C.accentSoft};border-radius:0 10px 10px 0;">
      <tr>
        <td width="2" style="width:2px;background:${C.accent};font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding:14px 16px;font-family:${F.sans};font-size:13.5px;line-height:1.6;color:${C.ink2};">${html}</td>
      </tr>
    </table>`;
}

/** Warning callout - warm grey, brand-safe. */
export function warnCallout(html: string): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0;background:#FDF5E9;border-radius:0 10px 10px 0;">
      <tr>
        <td width="2" style="width:2px;background:${C.warn};font-size:0;line-height:0;">&nbsp;</td>
        <td style="padding:14px 16px;font-family:${F.sans};font-size:13.5px;line-height:1.6;color:${C.ink2};">${html}</td>
      </tr>
    </table>`;
}

/** Monospace copy-paste URL fallback box. */
export function urlFallback(url: string): string {
    return `<p style="margin:6px 0 0;font-family:${F.sans};font-size:12.5px;color:${C.muted};">Or copy and paste this URL into your browser:</p>
    <p style="margin:6px 0 0;padding:11px 12px;border:1px solid ${C.line};border-radius:10px;background:${C.hero};word-break:break-all;font-family:${F.mono};font-size:11.5px;color:${C.ink2};">${url}</p>`;
}

/** A tinted feature list with an ink check for each row. */
export function featureList(title: string, items: string[]): string {
    const rows = items
        .map(
            (i) => `<tr><td valign="top" style="padding:6px 0;width:24px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="16" height="16" align="center" valign="middle" style="width:16px;height:16px;border-radius:999px;background:${C.accent};color:${C.white};font-family:${F.sans};font-size:10px;font-weight:700;line-height:16px;">&#10003;</td></tr></table>
      </td><td style="padding:6px 0 6px 8px;font-family:${F.sans};font-size:14px;line-height:1.55;color:${C.ink2};">${i}</td></tr>`,
        )
        .join("");
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0;border:1px solid ${C.border};border-radius:14px;background:${C.hero};">
      <tr><td style="padding:18px 20px;">
        <p style="margin:0 0 10px;font-family:${F.mono};font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${C.muted};">${title}</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${rows}</table>
      </td></tr>
    </table>`;
}

/** Thin horizontal rule matching the card's hairline. */
export function divider(): string {
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0;"><tr><td style="height:1px;line-height:1px;font-size:0;background:${C.line};">&nbsp;</td></tr></table>`;
}

// ── The shell ─────────────────────────────────────────────────────────────────

export interface ShellParams {
    title: string;
    subtitle?: string;
    eyebrow?: string;
    body: string;
    footerNote?: string;
    /** Product/app name shown in the footer + header wordmark context. */
    brand?: string;
    /**
     * Inbox preview text - the grey line next to the subject in Gmail/Apple Mail.
     * Left unset, clients scrape the first words of the body, which for an OTP mail
     * is the eyebrow label ("EMAIL VERIFICATION · SHIPITHQ") rather than anything
     * useful. Setting it is one of the cheapest open-rate wins available.
     */
    preheader?: string;
}

export function shell(params: ShellParams): string {
    const year = new Date().getFullYear();
    const brand = params.brand ?? "ShipItHQ";
    const headerBlock = `${params.eyebrow ? eyebrow(params.eyebrow) : ""}${
        params.subtitle
            ? `<p style="margin:0;font-family:${F.sans};font-size:13px;color:${C.muted};">${params.subtitle}</p>`
            : ""
    }`;

    // Zero-height, zero-opacity preheader, padded so the client cannot pull body
    // copy in after it to fill the preview line.
    const preheader = params.preheader
        ? `<div style="display:none;font-size:1px;color:${C.bgOuter};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${params.preheader}${"&#847;&zwnj;&nbsp;".repeat(60)}</div>`
        : "";

    return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${params.title}</title>
    <!--[if mso]>
    <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
    <![endif]-->
    ${FONT_LINK}
    <style>
      /* Stripped by some clients - everything here is an enhancement, never a
         requirement. The inline styles already produce a correct layout. */
      @media only screen and (max-width: 620px) {
        .bhq-wrap { padding: 16px 10px 8px !important; }
        .bhq-pad { padding-left: 20px !important; padding-right: 20px !important; }
        .bhq-h1 { font-size: 23px !important; }
        .bhq-otp { font-size: 30px !important; letter-spacing: 0.12em !important; }
      }
      /* Gmail/Outlook dark mode invert the card to near-black; pin the ink text
         back to something readable on it rather than letting it invert to a
         low-contrast grey. */
      @media (prefers-color-scheme: dark) {
        .bhq-ink { color: ${C.ink} !important; }
      }
      a { color: ${C.accent}; }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${C.bgOuter};font-family:${F.sans};color:${C.ink};-webkit-font-smoothing:antialiased;">
    ${preheader}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.bgOuter};">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" class="bhq-wrap" style="width:600px;max-width:600px;padding:28px 16px 8px;">

          <!-- brand bar above the card -->
          <tr><td style="padding:2px 4px 16px;">${logoRow(brand)}</td></tr>

          <!-- card -->
          <tr><td>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${C.card};border:1px solid ${C.border};border-radius:16px;">
              ${
                  headerBlock
                      ? `<tr><td class="bhq-pad" style="padding:24px 30px 4px;background:${C.card};border-radius:16px 16px 0 0;">${headerBlock}</td></tr>`
                      : ""
              }
              <tr><td class="bhq-pad bhq-ink" style="padding:22px 30px 30px;background:${C.body};border-radius:${headerBlock ? "0 0 16px 16px" : "16px"};">
                ${params.body}
              </td></tr>
            </table>
          </td></tr>

          <!-- footer card -->
          <tr><td style="padding:14px 0 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid ${C.border};border-radius:14px;background:${C.card};">
              <tr><td class="bhq-pad" style="padding:18px 22px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;"><tr>
                  <td valign="middle">${logoMark(22)}</td>
                  <td valign="middle" style="padding-left:8px;font-family:${F.sans};font-size:13px;font-weight:600;color:${C.ink};">${brand}</td>
                </tr></table>
                <p style="margin:0;font-family:${F.sans};font-size:12px;line-height:1.6;color:${C.muted};">
                  ${params.footerNote ?? "This is an automated message from ShipItHQ. Please do not reply directly to this email."}
                </p>
                <p style="margin:10px 0 0;font-family:${F.mono};font-size:10.5px;letter-spacing:0.02em;color:${C.faint};">&copy; ${year} ShipItHQ &middot; Learn, build &amp; get hired.</p>
              </td></tr>
            </table>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

export type EmailContent = { subject: string; html: string };

// ── Sender address ───────────────────────────────────────────────────────────

/**
 * The verified Resend sender for every transactional email in the monorepo.
 *
 * Set per app, because the display name differs by surface:
 *   RESEND_FROM_MAIL="ShipItHQ <noreply@shipithq.com>"
 *   RESEND_FROM_MAIL="ShipItHQ University <noreply@shipithq.com>"
 *
 * `RESEND_FROM_EMAIL` is the previous name, still read so an already-deployed
 * environment keeps working through the rename. Prefer RESEND_FROM_MAIL.
 *
 * Throws rather than falling back to a literal. Every app used to carry its own
 * `DEFAULT_FROM = "... <noreply@shipithq.com>"`, a domain from a previous product
 * that is not verified in Resend - so the "safe" fallback silently produced sends
 * that the API rejects. Failing loudly at send time, exactly like the missing
 * RESEND_API_KEY check does, surfaces a misconfigured environment immediately.
 */
export function resolveFromAddress(): string {
    const from = process.env.RESEND_FROM_MAIL || process.env.RESEND_FROM_EMAIL;
    if (!from) {
        throw new Error(
            'RESEND_FROM_MAIL environment variable is not set. ' +
            'Expected a verified Resend sender, e.g. "ShipItHQ <noreply@shipithq.com>".',
        );
    }
    return from;
}
