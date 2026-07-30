import { publishedPosts, BLOG_CATEGORIES } from '@/content/blog'
import { SITE, APP_URL, BRAND } from '@/lib/site'

// Curated markdown index for AI/LLM crawlers. The blog section is generated from the
// publish gate so it never goes stale as posts are activated - no manual edit needed.
// This replaced a hand-written public/llms.txt that had already drifted from reality.

export const dynamic = 'force-static'

export async function GET() {
    const byCategory = Object.entries(BLOG_CATEGORIES)
        .map(([key, label]) => {
            const posts = publishedPosts.filter((p) => p.category === key)
            if (posts.length === 0) return null
            const lines = posts.map((p) => `- [${p.title}](${SITE}/blogs/${p.slug}) - ${p.description}`)
            return `### ${label}\n${lines.join('\n')}`
        })
        .filter((section): section is string => section !== null)
        .join('\n\n')

    const body = `# ${BRAND.name} - ${BRAND.tagline}

## What ${BRAND.name} Is

${BRAND.name} is a developer-first platform that helps computer science students and software
engineers master their craft, build a portfolio that stands up to scrutiny, and land their
first or next engineering role. It combines AI-powered career tools, structured interview
practice, and real project work in one place.

**One sentence:** The engineering intelligence suite for people who want to get hired as
software engineers.

## Who It Is For

- CS and engineering students preparing for campus placements or new-grad hiring
- Self-taught developers without a degree who need proof of work
- Working engineers preparing for a job change or a level-up
- Career changers moving into software from another field

## Core Features

### AI Resume Builder & ATS Checker
Generates ATS-parseable, recruiter-ready resumes. Paste a job description and it tailors
bullets to match the role, then flags formatting that breaks automated parsing.

### AI Cover Letter Generator
Answers a short set of targeted questions and produces a personalised cover letter in your
own voice, rather than the generic template recruiters now recognise instantly.

### AI Mock Interviews
Technical and behavioural interview practice with real-time feedback on structure, clarity
and content. Covers DSA, system design and behavioural rounds, and tracks improvement.

### DSA & System Design Practice
Coding problems with hints that teach rather than hand over the answer, plus structured
system design challenges with evaluation against the criteria real interviewers use.

### Project Studio
Guided, task-broken-down projects that produce something deployable and defensible in an
interview - not another tutorial clone.

### Open Source Tracker
Finds beginner-appropriate issues in real projects and tracks contributions so they become
a visible hiring signal.

## Site Structure

- Home: ${SITE}
- Pricing: ${SITE}/pricing
- About: ${SITE}/aboutus
- Contact: ${SITE}/contact
- Blog: ${SITE}/blogs
- Terms: ${SITE}/termsofservice
- Privacy: ${SITE}/privacypolicy
- The authenticated product (sign-in, dashboard, all tools): ${APP_URL}

Note: ${SITE} is the public marketing site only. It has no login. All product functionality
lives on the separate application at ${APP_URL}.

## Published Guides

${byCategory}

## Contact

${BRAND.email}
`

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    })
}
