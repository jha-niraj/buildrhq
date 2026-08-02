Most full stack roadmaps are diagrams with two hundred boxes on them. They are technically accurate and practically useless, because they present everything as equally important and give you no idea what to do on Monday morning.

This one is opinionated. It says what to learn, in what order, roughly how long each stage takes, and - the part usually missing - what to deliberately ignore until later.

The reference diagram worth keeping open alongside it is [roadmap.sh's full stack path](https://roadmap.sh/full-stack), which is the most comprehensive community-maintained version. Use it as a map; use this as a route.

## The Core Principle

**One frontend framework. One backend runtime. One database. Ship something with those before adding anything.**

The most common way this goes wrong is not laziness, it is breadth. People learn a bit of React, a bit of Vue, some Node, some Django, a little Docker and a little Kubernetes, and end up unable to build a complete working application in any of them. Depth in one stack beats familiarity with six, and it is not close.

## Stage 0: The Fundamentals (6-10 weeks)

Skipping this is the most expensive mistake in the entire roadmap. People who jump straight to React spend the next two years confused about things that are actually JavaScript, not React.

**HTML** - semantic elements, forms, and accessibility basics. A week. Genuinely one week; people either skip it entirely or spend a month on it, and both are wrong.

**CSS** - the box model, flexbox, grid, and responsive design with media queries. Three weeks. Flexbox and grid are the whole game for layout now. Learn plain CSS before Tailwind, or you will not understand what Tailwind is doing.

**JavaScript** - this is the big one and where the time goes. Variables, types, functions, arrays and objects, the array methods (`map`, `filter`, `reduce`), destructuring, modules, promises, `async`/`await`, `fetch`, and the DOM. [MDN's JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) is the reference; [javascript.info](https://javascript.info/) is the best structured tutorial.

You will know you are done when you can build a working to-do app that talks to a public API with no framework at all.

**Git** - branching, merging, resolving conflicts, reading history. Learn this early, because you will use it every day for the rest of your career.

## Stage 1: Frontend (8-12 weeks)

**Pick React.** Not because it is technically superior - Vue and Svelte are both excellent - but because it has the largest job market by a wide margin, which matters when you are trying to get hired. The [Stack Overflow Developer Survey](https://survey.stackoverflow.co/) tracks this year to year if you want to check the current picture.

What to learn, in order:

1. Components and props
2. State with `useState`
3. Lists, keys and conditional rendering
4. Effects with `useEffect` - and specifically when *not* to use them
5. Forms and controlled inputs
6. Fetching data, including loading and error states
7. Routing
8. One state management approach beyond `useState`, only when you feel the pain

**Then TypeScript.** After JavaScript, not instead of it. You need to understand what TypeScript is adding before the additions make sense. Almost every professional codebase you join will be TypeScript, so this is not optional in practice - but three weeks in, not on day one.

**Then a meta-framework.** Next.js or Remix. This is where routing, server rendering and data loading get handled for you. Do not start here; you will not understand what is being handled.

**What to ignore for now:** Redux (most apps do not need it), micro-frontends, module federation, and every state library that trended last month.

## Stage 2: Backend (10-14 weeks)

**Node with Express, or Node with a framework like Fastify or NestJS.** Staying in JavaScript means you are not learning a second language at the same time as learning backend concepts. If you would rather switch languages, Python with FastAPI or Go are both fine choices - the concepts transfer entirely.

The concepts, which matter more than the framework:

**HTTP properly.** Methods, status codes, headers, what a request and response actually contain, CORS and why it exists. Self-taught developers are reliably weak here and it shows immediately in interviews. [MDN's HTTP documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP) is the reference.

**REST API design.** Resource naming, versioning, pagination, meaningful error responses. Then look at GraphQL so you know what it is for, but do not build your first API with it.

**Authentication and authorisation.** Sessions versus tokens, password hashing, what a JWT is and - importantly - what it is not good for. This is the area where beginners most often ship something genuinely dangerous. [The OWASP Top Ten](https://owasp.org/www-project-top-ten/) is the standard reference for what actually gets exploited.

**Validation and error handling.** Never trust input. Return errors that mean something.

**Background jobs.** Anything slow does not belong in a request handler.

## Stage 3: Databases (4-6 weeks)

The most under-learned area on this list, and the one that most separates people who have worked professionally from people who have not.

**Start with PostgreSQL.** Free, excellent, and the default choice for most new applications. [The Postgres documentation](https://www.postgresql.org/docs/current/tutorial.html) is unusually good.

Learn, in order:

1. Schema design and normalisation - enough to know why you do not store a comma-separated list in a column
2. `SELECT`, `INSERT`, `UPDATE`, `DELETE`
3. `JOIN`s, until they are genuinely comfortable
4. Indexes - what they are, when they help, what they cost on writes
5. Transactions and what happens under concurrency
6. `EXPLAIN`, so you can find out why a query is slow rather than guessing

Then an ORM - Prisma or Drizzle in the TypeScript world - but only after raw SQL, so you can tell when the ORM is generating something terrible.

**NoSQL later.** MongoDB is not easier, it is different, and choosing a document store for relational data is one of the most common architectural regrets in the industry.

## Stage 4: Shipping (4-6 weeks)

You are not a full stack developer until something you built is running somewhere other than your laptop.

**Deployment.** Vercel, Netlify, Railway, Fly.io or Render will all get you deployed quickly. Pick one and deploy something this week rather than reading about all five.

**Environment variables and secrets.** Nothing sensitive in the repository, ever.

**Docker, basics only.** Enough to write a Dockerfile and use docker-compose for local Postgres. You do not need Kubernetes and you will not for years.

**CI.** A GitHub Actions workflow that runs your tests on every push. Twenty minutes to set up, and it is what a professional workflow actually looks like.

**Monitoring.** Error tracking (Sentry's free tier is enough) and logs. Knowing when your thing is broken is part of the job.

## Stage 5: The Professional Layer (ongoing)

This is where "can build things" becomes "can be hired".

**Testing.** Unit tests for logic, integration tests for API endpoints, and a handful of end-to-end tests for critical paths. You do not need 100% coverage. You need enough that you can change code without fear.

**Debugging.** Breakpoints and a debugger, not `console.log` everywhere. Reading a stack trace properly. Bisecting to find which commit broke something.

**Code review.** Both directions. If you have never had code reviewed by someone with no reason to be nice, [contributing to open source](/blogs/open-source-contribution-beginners) is the fastest way to fix that.

**Performance basics.** Where the time actually goes. Usually a database query, not your JavaScript.

## What to Skip (For Now)

Actively ignore these until you have shipped a real application:

- Kubernetes
- Microservices - your first project should be a monolith, and probably your fifth
- gRPC, message queues, event sourcing
- WebAssembly
- Redux, unless a real project forces you into it
- Every framework that trended on Hacker News this month

None of these are useless. All of them are premature, and time spent on them at this stage is time not spent on databases, which you actually need.

## How You Know You Are Ready to Apply

Not by finishing a list. By passing this test:

**Given an empty folder, can you build and deploy a working application with user accounts, a database, a REST API, a frontend that consumes it, tests for the important parts, and a README - without following a tutorial?**

If yes, you are ready to apply, whatever the roadmap diagram still has unticked. If no, whichever part you got stuck on is what to work on next. That is the whole diagnostic.

## Rough Total Timeline

| Stage | Time |
|---|---|
| Fundamentals | 6-10 weeks |
| Frontend | 8-12 weeks |
| Backend | 10-14 weeks |
| Databases | 4-6 weeks |
| Shipping | 4-6 weeks |
| **Total** | **8-12 months part-time** |

Add three to six months for portfolio work, interview preparation and the job search itself - which is a separate project with its own skills. [The path into the first job](/blogs/how-to-become-a-software-engineer) covers that side, and [the portfolio guide](/blogs/software-engineering-portfolio-guide) covers what to build so it counts.

The people who finish are not the fastest learners. They are the ones who picked one stack and did not restart every time something new trended.

---

*ShipItHQ turns this roadmap into guided projects with real tasks and reviewable output, so you finish with something deployed rather than a folder of tutorials. [Start free](/pricing).*
