Forty minutes in, the interviewer says "we have about five minutes left - do you have any questions for me?" and a lot of candidates say some version of "no, I think you covered everything."

That is a scored moment, and it scores badly. Not because it is rude, but because it tells the interviewer you are evaluating nothing. Strong candidates have options and are working out whether they want this job. Candidates with no questions are hoping to be chosen.

It also wastes the only part of the interview where information flows toward you. You are about to commit one to four years of your working life on the basis of about four hours of conversation. These five minutes are your entire due diligence window.

## The Rules

**Two or three questions, not seven.** You have five minutes and they will want to answer properly. Prepare five or six so you are not stranded when the conversation has already covered three of them.

**Match the question to the person.** An engineer cannot tell you about headcount plans and a recruiter cannot tell you about the test suite. Asking the wrong person a question you should have known they could not answer is itself a small negative signal.

**Ask about reality, not perks.** The benefits page already told you about the health insurance. Ask about the things that are not written down anywhere.

**Do not ask about compensation here.** Not because it is taboo - it is not - but because the technical round is the wrong venue. That conversation belongs with the recruiter or hiring manager, where it will not consume time you could spend learning about the work. Get the market data separately; [Levels.fyi](https://www.levels.fyi/) is the most useful public source for engineering compensation bands.

## Questions for the Engineers

These are the people who will tell you the truth, partly because they have less incentive to sell and partly because engineers find it hard to lie about their own tooling.

**"How long does it take for a one-line change to go from my laptop to production?"**

The single highest-information question in this list. The answer tells you about CI, test suite health, review culture, release process and organisational trust, all at once. A crisp "about twenty minutes, we deploy on merge" and a hesitant "well, it depends, there's a release train on Thursdays but it has to go through QA first" describe two completely different jobs.

If you want to calibrate what a good answer looks like, the [DORA metrics](https://dora.dev/) research is the standard reference on deployment frequency and lead time - it is worth knowing roughly where the industry distribution sits before you ask.

**"What does the on-call rotation look like?"**

Ask this every time. How often, how many pages a week, whether daytime-only, whether you are compensated, and whether people actually take the time back. Vagueness here is the most reliable red flag in the whole interview.

**"What is the test suite like, honestly?"**

The word "honestly" gives them permission, and most engineers will take it. You are listening for whether they trust it. "It's slow but we trust it" is a fine answer. "We mostly rely on manual QA" is information you need.

**"What is the most frustrating part of working here?"**

Everyone has one. A candidate answer of "nothing really" means they are either new or not being straight with you. What you want is a specific, survivable complaint - "the monorepo build is slow" or "we have too many meetings on Wednesdays" - which tells you both that they are honest and what the actual cost of the job is.

**"What is something you would change about the codebase if you had a free month?"**

Engineers love answering this and it gets you a genuine architecture assessment in ninety seconds.

**"How does code review work here?"**

Turnaround time, whether it is required, whether it is one approver or two, whether it is adversarial. A team where PRs sit for three days is a team where you will be context-switching constantly.

## Questions for the Hiring Manager

Different person, different information.

**"How did the team decide what to build this quarter?"**

This is a proxy for whether engineering has any input into the roadmap, or receives it. Both can be fine, but you should know which one you are signing up for.

**"What does success look like for this role in six months?"**

If they cannot answer this specifically, the role is not well-defined, and undefined roles are how people end up doing something completely different from what they interviewed for.

**"Why is this position open?"**

Growth, backfill, or someone left. All three are acceptable answers; a non-answer is not. If it is a backfill, "what did the previous person go on to do?" is a fair and revealing follow-up.

**"How do you handle underperformance on the team?"**

Slightly uncomfortable to ask, which is why it works. You learn whether there is a real feedback process or whether problems get ignored until someone is managed out abruptly.

**"What is the split between new feature work and maintenance?"**

Anyone who says 100% greenfield is either wrong or describing a team that will be drowning in its own tech debt within a year.

**"How do people get promoted here?"**

You are listening for whether a written ladder exists. Companies with published frameworks - [Dropbox's engineering career framework](https://dropbox.github.io/dbx-career-framework/) is a well-known public example - tend to have more predictable progression than those where promotion is a conversation. If none exists, that is worth knowing before you join, not two years in. What each level actually means is covered in [the software engineer career path guide](/blogs/software-engineer-career-path).

## Questions for the Recruiter

Process questions, mostly, and this is where compensation belongs.

- What are the remaining stages and the expected timeline?
- What is the band for this level, and where in it does the offer typically land?
- Is the level fixed, or determined by interview performance?
- How many people are at the final stage for this role?

That last one is more useful than it looks. It tells you whether you are being seriously considered or filling out a pipeline.

## Real Red Flags in the Answers

These are the patterns worth acting on:

**They cannot name a recent deploy.** If nobody in the loop can tell you when something last shipped, either they are far from the work or nothing ships.

**On-call is described vaguely.** "It's pretty manageable" with no numbers usually means it is not.

**"We're like a family."** Families do not make you redundant, and the phrase is most often used by organisations with poor boundaries. This is not a hard rule, but it earns a follow-up.

**A long pause on work-life balance.** The pause is the answer.

**Every engineer has been there under a year.** Ask how long the team has existed. Complete turnover in a two-year-old team is a real signal.

**They cannot describe the on-call or release process consistently.** Ask two different interviewers the same process question. If the answers disagree substantially, the process does not exist.

**Nobody can explain what the previous person did.** Especially in a small team.

To be fair about it: one red flag is not a reason to walk. Every company has something wrong with it, and a small team with no formal ladder and a slow test suite might still be the best job you ever have. The point is to know what you are trading rather than discover it in month three.

## Questions Not to Ask

**Anything answered on the careers page.** "How many people work here?" signals you did no preparation.

**"What does the company do?"** Ends the interview in practice, if not formally.

**"How soon can I be promoted?"** Reads as impatient before you have delivered anything. Ask how promotion works instead.

**"Do I have to come into the office?"** if the listing says onsite five days. Asking is fine; asking as though it might not be true is not.

**Nothing at all.** Covered at the top, and it remains the most common mistake.

## Putting It Together

Pick two per interviewer type and write them down. Bringing a notebook with questions in it is not a negative signal - it reads as preparation, and it means you will not blank when you are tired at the end of the fourth round.

Then actually listen to the answers. The point of asking "how long does a one-line change take to reach production" is not to demonstrate that you know the question. It is that the answer should change your decision.

If you are still in the earlier rounds and want the other half of this conversation handled, [the behavioural question bank](/blogs/behavioral-interview-questions-software-engineer) and [the STAR method guide](/blogs/star-method-interview-software-engineers) cover the part where they are asking you.

---

*ShiprHQ helps engineers prepare for every stage of the loop - technical, system design and behavioural - with AI mock interviews and structured feedback. [Try it free](/pricing).*
