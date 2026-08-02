Ask five engineers what separates a mid-level engineer from a senior one and you will get five answers, most of them about years of experience or technical difficulty. Both are wrong, and believing either is the most common reason people stall at mid-level for years.

Levels are about **scope of ownership**. How large a problem can you be handed, and how much ambiguity can you absorb before someone has to help you? That is the ladder. Everything else - the code quality, the system design knowledge, the mentoring - is downstream of it.

## The Levels

Titles vary by company. The shape almost never does.

| Level | Typical title | Scope | Ambiguity you absorb |
|---|---|---|---|
| L1 | Intern / Junior | A task | None - you get told what to do |
| L2 | Software Engineer | A feature | Some - you fill in the details |
| L3 | Senior Engineer | A project or service | Most - you define the plan |
| L4 | Staff Engineer | Multiple teams | You find the problem yourself |
| L5 | Principal | An organisation | You decide what problems matter |

If you want to see how specific companies formalise this, several publish their frameworks. [Dropbox's engineering career framework](https://dropbox.github.io/dbx-career-framework/) and the community-collected [career ladders at levels.fyi](https://www.levels.fyi/) are the most useful public references, and reading two or three side by side makes the pattern obvious.

## Intern and Junior

**What you are given:** well-defined tasks with a clear definition of done. Someone else has decided what to build and roughly how.

**What you are actually judged on:** not code quality. Whether you finish things, whether you ask for help at the right time, and whether the same feedback has to be given twice.

**The thing that gets juniors stuck:** silence. Sitting on a blocker for two days because asking feels like admitting failure. Set a limit - thirty to sixty minutes - then ask, with what you tried and what you have ruled out. Nobody has ever been fired for asking too early; plenty of people have burned a sprint by asking too late.

**How you move up:** consistently deliver small things without supervision, and start noticing the work around the work - tests, documentation, the thing that will break in production.

## Mid-Level (Software Engineer)

Most engineers reach this in one to three years, and a lot of people stay here for their entire career - sometimes by choice, often not.

**What you are given:** a feature. "Build the notifications system." The what is decided; the how is yours.

**What you are judged on:** independence and reliability. Can you take a feature to production without your manager tracking it? Do your estimates mean anything? Do you flag problems early or on the deadline?

**What separates strong mid-level engineers:** they think about the thing after the thing. Not just "does this work" but what happens at 100x the data, what happens when the third-party API is down, what the on-call engineer will see at 3am.

**Why people stall here:** they get very good at executing well-defined work and never step into ambiguity. Promotion to senior does not come from doing mid-level work faster or more elegantly. If you are waiting to be handed a senior-sized problem, you will wait a long time.

## Senior Engineer

The most significant jump on the ladder, and the one people misunderstand most.

**What you are given:** a problem, not a solution. "Our checkout conversion drops on mobile and we do not know why."

**What you are judged on:** outcomes in the presence of ambiguity. You define the approach, identify what you do not know, sequence the work, and make the trade-offs. You are also expected to raise your team's level - through code review, design feedback, and mentoring.

**The specific thing that makes someone senior:** they can be handed a vague problem and come back in a week with a plan, a set of unknowns, and a recommendation - and they are usually right. That is it. It is not the technical depth, though depth is necessary. Plenty of technically excellent engineers never get there because they need the problem defined first.

**Timeline:** typically five to eight years, but it varies enormously with how much ownership you have actually been given. Five years at a company that hands you tickets can leave you less ready than three years where you owned a service.

**The trap:** becoming the person who knows everything about one system. It feels like seniority and it is a local maximum - your value is tied to a system that will eventually be replaced.

## Staff Engineer

Where the ladder forks. This is where the technical track stops being "senior, but more".

**What you are given:** nothing. You find the problem.

**What you are judged on:** impact across teams. The work becomes as much about influence, writing and technical direction as about code. Staff engineers often write less code than seniors, which surprises people who expected the technical track to mean more coding.

Will Larson's [StaffEng](https://staffeng.com/) is the definitive resource on what this level actually involves, including the different archetypes - the tech lead, the architect, the solver, the right hand - which are genuinely different jobs sharing a title.

**The main misconception:** that staff is a reward for being senior for long enough. It is not. Many companies have no staff headcount at all, and many senior engineers are happy to stay senior. It is a different job, not a better version of the last one.

## The Fork: Staff vs Engineering Manager

Around the senior level, most people face this. The framing that helps: these are **parallel tracks, not a hierarchy**.

**Engineering manager** - you drive outcomes through people. Hiring, performance, growth, unblocking, prioritisation. You will write very little code within a year, and if you are writing a lot, you are probably managing badly.

**Staff engineer** - you drive outcomes through technical direction and influence. Architecture, standards, hard problems, cross-team alignment. You keep your hands in the code, but you spend a lot of time writing documents and having conversations.

Honest questions to ask yourself:

- When a project succeeds, are you more satisfied by the system you designed or the person who grew doing it?
- Does a day of back-to-back meetings drain you or energise you?
- Are you comfortable being accountable for outcomes you cannot personally produce?

Management is not a promotion. It is a career change with a partial reset - your first year as a manager, you will be bad at your job in a way you have not been for years. That is normal and worth knowing in advance.

The move is also more reversible than people think. Engineers who manage for two years and go back to IC work are common and usually better engineers for it.

## How Promotion Actually Works

The mechanism, stated plainly, because it is rarely explained:

**You operate at the next level first. Then you get the title.**

Nearly every company works this way. Promotion committees ask for evidence you are *already* doing the job, not that you are ready to try it. Which means waiting to be given senior-level work before doing senior-level work is a deadlock.

What this means in practice:

**Take the ambiguous work.** The project nobody wants because the requirements are unclear is exactly the promotion case you need. Well-defined work does not demonstrate anything above your current level.

**Write things down.** Design docs, postmortems, technical proposals. Written artefacts are what a promotion committee that has never met you can actually evaluate. This is the single most underused lever available to engineers.

**Keep a brag document.** A running file of what you shipped, what it changed, and who it helped. Six months later you will not remember, and your manager definitely will not. Julia Evans' [write-up on brag documents](https://jvns.ca/blog/brag-documents/) is the standard reference and takes ten minutes to read.

**Make your manager's case easy.** Your manager is arguing for you in a room you are not in, from notes. Give them specifics: numbers, names of people you helped, links to docs.

**Ask directly what is missing.** "What would I need to demonstrate to be promoted at the next cycle?" If your manager cannot answer specifically, that is important information about your manager.

## When to Change Jobs

Three signals worth acting on:

**Your scope has not grown in two years.** Same size of problem, same level of ambiguity. You are being paid to stand still.

**There is no ladder above you.** Small companies often have no staff level and no plan to create one. That is a structural ceiling, not a performance issue.

**Compensation has drifted from market.** Internal raises rarely keep pace with external offers. Check the band for your level on [levels.fyi](https://www.levels.fyi/) periodically - not to leave, but so you know.

Against that: changing jobs every eighteen months has a real cost. You never see the consequences of your own architectural decisions, which is one of the main ways engineers actually learn judgement. Two to four years is where most people get the best of both.

## The Short Version

Levels track scope, not tenure. Promotion follows demonstrated behaviour at the next level, so the work comes before the title. The staff and management tracks are different jobs, not a ranking. And the highest-leverage habit at every level is writing things down.

If you are early on this path, [the route into the first job](/blogs/how-to-become-a-software-engineer) and [the new grad hiring guide](/blogs/new-grad-software-engineer-jobs) cover the stage before this one. If you are interviewing at a company now, the promotion process is one of the most useful things to probe - [the questions to ask your interviewer](/blogs/questions-to-ask-interviewer-software-engineer) covers how.

---

*ShipItHQ helps engineers at every stage - practice, portfolio work and mock interviews for the next move. [Start free](/pricing).*
