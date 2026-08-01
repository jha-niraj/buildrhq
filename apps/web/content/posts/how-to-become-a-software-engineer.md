Every guide to becoming a software engineer is written by someone selling something - a bootcamp, a course, a subscription. So here is the version with the uncomfortable parts left in.

You can become a software engineer without a degree. It takes longer than the marketing says. The entry-level market is harder than it was in 2021. And the single biggest predictor of whether you make it is not talent or which language you pick, it is whether you are still doing this in month fourteen.

## Is It Still Worth Doing?

Yes, with caveats worth stating plainly.

The US Bureau of Labor Statistics [projects employment of software developers to grow much faster than the average occupation](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm) through the early 2030s. That is the long-run picture and it remains good.

The short-run picture is different from the one people remember. Entry-level hiring contracted sharply after 2022 and has not fully recovered. Junior roles get hundreds of applicants. Companies that would once have hired three juniors now hire one mid-level engineer and expect AI tooling to cover the difference.

What that changes is not whether to do it, but how. Credentials alone were briefly enough during the boom. They are not now. Proof of work - things you have built, shipped and can defend - does most of the lifting.

## The Honest Timeline

**12 to 24 months** of consistent, structured effort to reach employable, starting from no programming background and working seriously part-time.

If you can study full-time, the low end is achievable. If you are working another job and studying evenings, plan for the high end. Bootcamp claims of "job-ready in 12 weeks" describe when the classroom ends, not when someone pays you.

A realistic shape:

| Phase | Duration | What you are doing |
|---|---|---|
| Fundamentals | Months 1-3 | One language, syntax through functions, data structures, control flow |
| Building | Months 4-8 | Small projects, then a real one. Git, HTTP, databases, deployment |
| Depth | Months 9-14 | One stack properly. Testing, debugging, reading other people's code |
| Job-ready | Months 15-20 | Portfolio, open source, interview preparation, applications |

The phase people skip is the third one, and it is the one that separates people who get hired from people who have completed a lot of tutorials.

## Degree or Not

Both routes work. They fail for different reasons.

**A CS degree** gives you fundamentals you will not naturally seek out - algorithms, operating systems, networks, how a computer actually works - plus a graduate recruitment pipeline and a cohort of peers who will refer you for jobs over the next decade. That last part is undervalued and hard to replicate.

Its weakness is that many programmes will not teach you to ship anything. Graduating without having deployed a working application is common and is why [campus placement preparation](/blogs/campus-placement-preparation-guide) exists as a separate discipline from the degree itself.

**Self-taught** is faster and cheaper and you will be building real things within weeks. Its weakness is systematic gaps - self-taught developers are reliably weakest on databases, networking and anything algorithmic, because nothing forces you to learn them. And you have no pipeline, so every application is cold.

If you go the self-taught route, close the fundamentals gap deliberately. [Harvard's CS50x](https://cs50.harvard.edu/x/) is free and is the single best-regarded introduction available. [Teach Yourself CS](https://teachyourselfcs.com/) is a curated list of the nine subjects that matter most, with a recommended book and course for each - it is the closest thing to a CS curriculum you can follow on your own.

**Bootcamps** compress the timeline and provide structure and accountability, which is the actual product. Their placement statistics should be read carefully - many count any employment, and the market they were designed for has changed. If a bootcamp will not show you outcome data for the last two cohorts specifically, that tells you something.

## Which Language First

Python or JavaScript for almost everyone.

**Python** has clean syntax, an enormous ecosystem, and a natural path into data, backend and machine learning work. It is the easier of the two to learn.

**JavaScript** is unavoidable if you want to build anything that runs in a browser, and it is the only language that covers frontend and backend with one syntax. That means one language gets you to a full working application faster than any other choice.

The choice genuinely matters far less than committing to it. Six months of Python beats two months each of Python, Go and Rust. If you truly cannot decide: pick JavaScript if you want to build websites, Python if you want to work with data.

What not to start with: C++ or Rust (you will fight the language instead of learning to program), and anything chosen because someone said it pays well.

For a concrete sequence once you have picked, [the full stack roadmap](/blogs/full-stack-developer-roadmap) lays out what to learn in what order and - more usefully - what to ignore.

## The Skills Nobody Lists

The job listing says React, Node, Postgres. The things that determine whether you keep the job are elsewhere.

**Debugging.** Most of the work is figuring out why something that should work does not. This is a learnable skill and almost nobody practises it deliberately. Do this: when something breaks, form a hypothesis before you change anything. Most beginners change things at random and call it debugging.

**Reading code you did not write.** You will spend far more time reading than writing. The only way to build this is to read code - a small library in your language, end to end, is a better use of an afternoon than another tutorial.

**Git, properly.** Not just commit and push. Branching, rebasing, resolving conflicts, and reading history to find when something broke.

**Asking good questions.** What you tried, what you expected, what happened, what you have ruled out. Engineers who can do this get help; engineers who paste an error message and say "help" do not.

**Writing.** Design docs, PR descriptions, postmortems. Increasingly the differentiator at every level above junior.

## Building Proof

This is the part that matters most in the current market, and it is the part most people do least.

**Three real projects beats twelve tutorials.** A project counts if it is deployed and reachable at a URL, has a README explaining the problem and your decisions, handles errors, and is something you can talk about for ten minutes. Tutorial follow-alongs do not count, and interviewers can tell.

**At least one should solve a problem you actually have.** Clone projects prove you can follow instructions. Original problems prove you can identify what to build, which is the harder skill.

**Contribute to open source.** This is the highest-leverage single activity available to someone without professional experience, because it is public evidence of how you write code, take review and communicate in a codebase you did not create. [Good First Issue](https://goodfirstissue.dev/) and [GitHub's own guide](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github) are the standard entry points; the full process is in [the first pull request guide](/blogs/open-source-contribution-beginners).

The details of what makes a project portfolio-worthy are in [the portfolio guide](/blogs/software-engineering-portfolio-guide).

## Getting the First Job

The first job is by far the hardest. Everything after is easier.

**Referrals dominate.** Cold applications convert at a very low rate for juniors. A referral is not nepotism - it is how most hiring works, and asking for one from a stranger is normal. The mechanics are in [the new grad job guide](/blogs/new-grad-software-engineer-jobs).

**Apply to companies you have heard of less.** Everyone applies to the same twenty names. Mid-sized companies, agencies, and non-tech companies with internal engineering teams hire more juniors and get a fraction of the applications.

**Widen what counts as a first job.** QA automation, internal tools, support engineering, technical implementation roles. These are real engineering jobs, they hire people without a track record, and moving internally after eighteen months is far easier than getting in from outside.

**Expect it to take months.** A job search of three to six months for a first role is normal right now. This is the point at which most people quit, and it is worth knowing in advance that the plateau is expected rather than a signal that you have failed.

Your resume needs to survive automated filtering before a human sees it - [the ATS resume guide](/blogs/ats-resume-software-engineer) covers what actually gets filtered and why.

## What About AI

The honest position: AI has raised the floor and moved the bar.

It has genuinely made some junior work cheaper to do without a junior, which is part of why entry-level hiring is tight. It has also made learning to program dramatically easier, if you use it correctly.

Using it correctly means: generate a solution, then explain why it works before you accept it. If you cannot explain it, you have not learned anything and you have introduced code you cannot debug. Developers who accept output uncritically plateau fast, and it shows in interviews - the follow-up question is always "why did you do it that way?"

Learn to work with these tools, because refusing to is a competitive disadvantage. Just do not outsource the understanding. [The AI tools guide](/blogs/ai-tools-developers-2025) covers where the line sits in practice.

## The Actual Answer

Pick one language. Build things badly, then build them better. Read other people's code. Deploy something with your name on it. Contribute to a project you did not start. Get one person to refer you.

Then do it again for eighteen months without stopping.

There is no shortcut, and the people who make it are not the fastest learners - they are the ones still going in month fourteen when it stopped being novel and had not yet started paying.

---

*ShiprHQ gives new engineers a structured path: guided projects that produce something deployable, DSA practice, and AI mock interviews for when you start applying. [Start free](/pricing).*
