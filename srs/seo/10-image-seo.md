# Image SEO — OG Images, WebP, Alt Text, and Performance

> Images are the most common cause of slow LCP and broken social previews.
> This file documents every image-related SEO decision and the right approach for each.

---

## OG Images (Open Graph)

Every page that can be shared needs an OG image. This is what appears when someone shares your URL on Twitter, LinkedIn, Slack, WhatsApp, or iMessage.

**Required for every page:**
- Blog posts
- Case studies
- Homepage
- Product/pricing pages
- VS comparison pages

**Spec:**
- Size: exactly **1200×630px**
- Format: **PNG** (not JPG — PNG handles text rendering better)
- File location: `public/og/[page-slug].png`
- File size: under 300KB if possible (large OG images slow social crawlers)

**What makes a good OG image:**
1. Post title in large, readable text
2. Company/site name in smaller text
3. Brand color background or relevant visual
4. High contrast — must be readable as a small thumbnail
5. No important content in the edges — some platforms crop differently

**How to reference in Next.js metadata:**
```typescript
// In sections.ts
'your-post-slug': {
  ogImage: '/og/your-post-slug.png',
  // ...
}

// In generateMetadata():
openGraph: {
  images: [{ url: `${SITE_URL}${meta.ogImage}`, width: 1200, height: 630 }],
}
```

**How to generate OG images:**
- Figma: Create a 1200×630 frame, design once, export as PNG for each post
- DALL-E / ChatGPT image generation: Use the prompt template in the project's OG image guide
- Vercel OG (@vercel/og): Generate dynamically from code if you want automation

**Testing OG images:**
- Twitter card validator: cards-dev.twitter.com/validator
- Facebook sharing debugger: developers.facebook.com/tools/debug/
- LinkedIn post inspector: linkedin.com/post-inspector/

---

## BuildrHQ OG Image Implementation (as of June 2026)

### How it works in BuildrHQ (apps/main)

**Two-layer system:**

**Layer 1 — Global fallback** (`apps/main/app/layout.tsx`)
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.buildrhq.com'

openGraph: {
  images: [{ url: "/og/home.webp", width: 1200, height: 630, alt: "..." }],
}
twitter: {
  card: "summary_large_image",
  images: ["/og/home.webp"],
}
```
File location: `apps/main/public/og/home.webp`

**Layer 2 — Per-blog override** (`apps/main/app/(home)/blogs/[slug]/page.tsx`)
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(slug)
  return {
    openGraph: {
      type: 'article',
      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [post.ogImage],
    },
  }
}
```

**Blog post data** (`apps/main/content/blog.ts`)
```typescript
{
  slug: 'my-post',
  ogImage: '/og/blog/my-post-hero.webp',   // used in <meta> tags
  heroImage: '/og/blog/my-post-hero.webp', // used in the page hero image
}
```

File location: `apps/main/public/og/blog/[post-slug]-hero.webp`

### WebP for OG images

BuildrHQ uses **WebP** for all OG images (not PNG). Modern crawlers on WhatsApp, LinkedIn, Twitter/X, iMessage, and Slack all support WebP. The savings are significant: WebP files are 25–50% smaller than equivalent PNGs, which means social crawlers fetch and cache them faster.

Scripts to convert: `scripts/to-webp.sh` (single file) and `scripts/convert-og-to-webp.sh` (batch all PNGs in `apps/main/public/og/`).

### Missing OG images — action required

| App | Status | File needed | Priority |
|---|---|---|---|
| `apps/main` | ✅ Done | `public/og/home.webp` + blog images | — |
| `apps/hiring` | ❌ Missing | `public/hiring-og.png` (referenced in layout.tsx but not in public/) | High |
| `apps/uni` | ❌ Wrong format | Uses `mainlogo.jpeg` (1024×1024 logo, not 1200×630 OG image) | High |

To fix hiring and uni:
1. Design a 1200×630 image in Figma (brand colors, product name, tagline)
2. Export as PNG, save to the respective `public/` folder
3. Run `scripts/to-webp.sh` on it
4. Update the `url` in the metadata to the `.webp` path

---

## WebP Conversion

**Why WebP:**
- 25–35% smaller than equivalent JPEG
- 25–50% smaller than equivalent PNG
- Same visual quality at lower file size
- Supported by all modern browsers (>96% coverage)

**When to convert to WebP:**
- All hero images
- All blog post images
- All case study images
- All OG images (WhatsApp, LinkedIn, Twitter, iMessage all support WebP)
- Any image over 100KB

**How to convert:**
```bash
# Install cwebp
brew install webp  # macOS

# Basic conversion
cwebp input.jpg -o output.webp

# With quality and resize (for hero images — 1920px wide)
cwebp -q 85 -m 6 -resize 1920 0 hero.jpg -o hero.webp

# For blog post images (resize to 2× container, e.g. 672px container = 1344px image)
cwebp -q 85 -m 6 -resize 1344 0 post-image.jpg -o post-image.webp

# Batch convert all JPGs in a folder
for f in *.jpg; do cwebp -q 85 "$f" -o "${f%.jpg}.webp"; done
```

**Quality settings:**
- `-q 85`: Good quality/size balance for hero images
- `-q 75`: Acceptable for smaller inline images
- `-m 6`: Maximum compression effort (slower but smaller file)
- `-resize W 0`: Resize to width W, height calculated automatically

**After converting:**
- Commit `.webp` files to the repo
- Delete original `.jpg`/`.png` from `public/` to keep repo size manageable
- Update references in MDX files — or use the auto-conversion pattern below

**Auto-conversion pattern (getcreatr approach):**
```typescript
// mdx-components.tsx
function toWebp(src: string): string {
  return src.replace(/\.(png|jpe?g)$/i, '.webp')
}

// Usage:
export function HeaderImage({ src, alt }: { src: string; alt: string }) {
  return <img src={toWebp(src)} alt={alt} />
}
```

With this pattern, you write `/image.jpg` in MDX and it automatically serves `/image.webp`. No need to update MDX content when you convert images.

---

## Alt Text

Alt text serves two purposes: accessibility (screen readers) and SEO (Google uses it to understand image content).

**Rules:**
1. Every `<img>` tag must have an `alt` attribute
2. Describe what's in the image, specifically
3. Include the target keyword naturally if the image is relevant to it
4. Don't start with "Image of" or "Photo of" — just describe the content
5. Empty alt (`alt=""`) is correct for purely decorative images

**Good alt text examples:**
```html
<!-- ❌ Bad -->
<img src="/crm.webp" alt="image" />
<img src="/crm.webp" alt="CRM" />
<img src="/crm.webp" alt="Photo of a CRM dashboard" />

<!-- ✅ Good -->
<img src="/crm.webp" alt="SalesCRM pipeline dashboard showing contact stages and trade show attribution" />
<img src="/team.webp" alt="Prince and Kartik, co-founders of Creatr" />
<img src="/ai-apps.webp" alt="Market map of 70+ AI app builders launched 2023-2025" />
```

**For OG images:** Alt text isn't shown in social shares, but include it for accessibility.

---

## Header Images vs Inline Images

### Header Image (Hero/Top of Post)

This is typically the LCP element on blog posts. Performance matters most.

```typescript
// Use fetchPriority="high" and eager loading
<img
  src={toWebp(src)}
  alt={alt}
  width={1344}
  height={756}
  loading="eager"
  fetchPriority="high"
/>
```

Key rules:
- `loading="eager"` — load immediately, don't defer
- `fetchPriority="high"` — tell the browser this is the most important image
- Explicit `width` and `height` — prevents layout shift
- Use pre-generated WebP — don't rely on `/_next/image` on Cloudflare Workers

### Inline Images (Body of Post)

These are lower priority — load them lazily.

```typescript
<img
  src={toWebp(src)}
  alt={alt}
  width={1344}
  height={756}
  loading="lazy"  // defer until near viewport
/>
```

---

## Cloudflare Workers Image Gotchas

**The problem:**
`/_next/image` (Next.js built-in image optimization) is NOT edge-cached on Cloudflare Workers. Every unique image request hits the Worker → IMAGES binding → full transform → response. This adds ~500ms per request, every time, even for the same image.

**The fix:**
Pre-generate WebP files and serve them as static assets via `unoptimized`:

```typescript
// ❌ Goes through /_next/image — not cached
<Image src="/hero.jpg" width={1920} height={1080} />

// ✅ Served from ASSETS binding — immutable edge-cached headers, ~50ms
<Image src="/hero.webp" width={1920} height={1080} unoptimized />
```

**The ASSETS binding automatically adds:**
```
cache-control: public, max-age=31536000, immutable
```

This means the first visitor at any Cloudflare edge location pays ~375ms. Every subsequent visitor at that edge pays ~50ms.

**How to configure in `public/_headers`:**
```
/images/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## Image Sizing for Different Contexts

| Context | Recommended Width | Aspect Ratio |
|---|---|---|
| OG image | 1200px | 1200×630 (1.91:1) |
| Hero/header image | 1344px | 16:9 or freeform |
| Inline blog image | 1344px | 16:9 or container-fit |
| Carousel/product screenshot | 1920px | 16:9 |
| Author avatar | 200px | 1:1 |
| Logo | Original SVG preferred | — |

**Why 1344px for blog images?**
Most blog content columns are 672px wide. Retina displays (2x DPR) need 1344px to look sharp. Higher than 1344px for a 672px column wastes bandwidth.

---

## Checklist: Before Deploying Images

```
[ ] Image converted to WebP
[ ] Image resized to appropriate width (not unnecessarily large)
[ ] Explicit width and height on every <img> tag
[ ] Alt text is descriptive and includes keyword where natural
[ ] Hero/LCP image has loading="eager" and fetchPriority="high"
[ ] Inline images have loading="lazy"
[ ] OG image is exactly 1200×630px (PNG for design, then convert to WebP with scripts/to-webp.sh)
[ ] OG image referenced correctly in metadata (use .webp path)
[ ] No images served through /_next/image on Cloudflare Workers (use unoptimized)
```
