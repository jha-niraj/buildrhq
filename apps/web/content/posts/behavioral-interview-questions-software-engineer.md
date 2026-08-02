Most engineers prepare for the technical rounds and improvise the behavioural one. That is backwards. Technical rounds have a high floor - if you have done the work, you will probably survive. Behavioural rounds have no floor at all, and they are where a surprising number of otherwise strong candidates get rejected, particularly at mid-level and above.

This is the question bank. Thirty questions that actually come up in software engineering interviews, grouped by what they are testing, with notes on what a good answer contains and worked examples where the trap is subtle.

Before you use it: these are not thirty answers to memorise. They are thirty probes into roughly six underlying stories. Work out your six stories first - the [STAR method guide](/blogs/star-method-interview-software-engineers) covers how to build and structure them - then use this list to stress-test whether those six actually cover the ground.

## How Behavioural Rounds Are Actually Scored

Interviewers are not scoring charisma. At most companies with a structured process they are scoring against named competencies, and the questions are chosen to probe specific ones.

Amazon is the clearest public example: its behavioural loop maps questions directly onto its [Leadership Principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles), and interviewers write feedback against a named principle. Google publishes less detail but describes the same idea in [how we hire](https://careers.google.com/how-we-hire/interview/) - past behaviour as a predictor of future behaviour. Even at companies with no formal rubric, the hiring manager is answering three questions: can this person own something, can they work with people, and what happens when they are wrong.

Everything below maps to one of those three.

## Ownership and Initiative

These probe whether you do things nobody asked you to do, and whether you finish what you start.

**1. Tell me about a project you owned end to end.**
The word that matters is "owned." Show the unglamorous parts: the rollout, the monitoring, the thing that broke two weeks later and how you found out.

**2. Tell me about a time you went beyond what was asked.**
Avoid heroics stories where you worked a weekend. Better: you noticed a problem adjacent to your task, scoped it, and either fixed it or wrote it down for someone else.

**3. Describe something you built that you are proud of.**
Interviewers use this to find out what you value. If the thing you are proudest of is that it was technically clever, say so - but connect it to why it mattered to someone.

**4. Tell me about a time you identified a problem nobody else had noticed.**
The strong version includes how you convinced people it was real, not just that you spotted it.

**5. Have you ever pushed back on a requirement? What happened?**
They are testing whether you are a ticket-taker. A good answer shows you understood *why* the requirement existed before you challenged it.

**6. Tell me about a time you had to make a decision without enough information.**
Show the decision-making process: what you would have wanted to know, what you did instead, and how you reduced the downside of being wrong.

## Collaboration and Conflict

These probe whether you are pleasant to work with when things are not going well - which is when it counts.

**7. Tell me about a disagreement with a coworker.**
The single most-asked behavioural question in engineering. Two traps: picking a disagreement where you were obviously right and they were obviously stupid, and picking one where you simply caved. The good version is a real technical disagreement resolved through evidence, ideally where your position shifted at least partly.

**8. Tell me about a time you disagreed with your manager.**
Same shape, higher difficulty. Interviewers want to see that you will raise things upward, and that you can commit to a decision you argued against.

**9. How do you handle code review feedback you disagree with?**
Concrete process answer expected. Something like: reply in the thread once with reasoning, and if there is still disagreement after one round, move it to a call rather than a fourteen-comment argument.

**10. Tell me about a time you had to give difficult feedback.**
Even if you have never managed anyone, you have reviewed someone's code. Show that you separated the work from the person and were specific.

**11. Describe working with a difficult teammate.**
Never characterise them as difficult. Describe the behaviour, describe what you tried, describe what worked. Candidates who spend this answer being aggrieved fail it immediately.

**12. Tell me about a time you had to influence people without authority.**
Increasingly common at senior level. The mechanism matters: a written doc, a prototype, a small pilot. "I convinced them" is not an answer; "I built a two-day prototype so we could compare rather than speculate" is.

**13. How do you work with product managers or designers?**
They are checking whether you treat non-engineers as an obstacle. Have one story where their input changed what you built for the better.

**14. Tell me about a time you helped someone else succeed.**
Mentoring, onboarding, unblocking. Small and specific beats grand and vague.

## Failure and Being Wrong

The highest-signal group. Also the one candidates most often ruin by being defensive.

**15. Tell me about a time you failed.**
Pick a real failure with consequences. Own your part without hedging. Spend most of the answer on what you changed afterwards. A worked example is in [the STAR method guide](/blogs/star-method-interview-software-engineers) - the pattern is: real damage, honest sequence of events including the bits where you made it worse, concrete process change.

**16. Tell me about a time you broke production.**
Almost the same question, but they want the incident-response behaviour specifically: how fast you noticed, whether you communicated, whether you escalated, whether you resisted the urge to fix it silently.

**17. Describe a technical decision you regret.**
Good answers are architectural rather than tactical. "I chose a document database for data that turned out to be highly relational, and we spent a year working around it."

**18. Tell me about receiving critical feedback.**
Say what the feedback was, verbatim if you can. Candidates who paraphrase feedback into something flattering are transparent about it.

**19. When did you realise you were wrong about something technical?**
Testing intellectual honesty. Bonus points if you were the one who found out you were wrong.

**20. Tell me about a project that did not go well.**
Distinct from personal failure - this is about a project that failed for structural reasons. They want to see whether you can analyse a failure without assigning all blame externally or all of it to yourself.

## Prioritisation and Delivery

These probe judgement under constraint, which is most of the actual job.

**21. Tell me about a time you had to cut scope.**
Show what you cut and why, and that you communicated it before the deadline rather than after.

**22. How do you decide what to work on when everything is urgent?**
A real answer has a mechanism: impact versus effort, blast radius, who is blocked. "I talk to my manager" is a partial answer at best.

**23. Tell me about a time you missed a deadline.**
The signal is when you raised it. Missing a deadline you flagged three weeks out is a planning story. Missing one you flagged the day before is a communication failure.

**24. Describe a time you had to balance speed against quality.**
Have a real position. Engineers who claim they never compromise quality have either not shipped much or are not being straight.

**25. How do you handle being blocked?**
Short answer, but they are listening for a time limit. "I give it thirty minutes, then I ask" is a much better answer than "I keep digging until I solve it."

## Motivation and Fit

Lower-signal individually, but a bad answer here can sink an otherwise clean loop.

**26. Tell me about yourself.**
Not a biography. A 90-second arc: where you are now, one or two things you built that matter, why this role is the logical next step. Rehearse this one specifically - it is the first thing you will be asked and a weak opening colours everything after.

**27. Why do you want to work here?**
Requires ten minutes of real research. Name a product decision, an engineering blog post, or a problem in their domain. Anything that could apply to fifty companies is a wasted answer. Engineering blogs are the best source here - most companies of any size publish one, and reading two posts gives you something specific to point at.

**28. Where do you want to be in three years?**
They are checking that your trajectory is compatible with the role, not testing ambition. If you are unsure between the IC and management tracks, saying so is fine and honest - [the career path guide](/blogs/software-engineer-career-path) covers what the two tracks actually involve.

**29. Why are you leaving your current role?**
Never trash your current employer, however justified. Frame it as moving toward something rather than away.

**30. What kind of engineering culture do you work best in?**
An honest answer here serves you. If you hate on-call, or you need a lot of autonomy, this is the moment to find out whether that is compatible - and it sets up [the questions you ask them](/blogs/questions-to-ask-interviewer-software-engineer) at the end.

## Preparation That Actually Moves the Needle

Three passes, in this order:

**Pass one: inventory.** Go through your last two years of work - tickets, PRs, incidents, docs. Write down every situation that had friction in it. You will get twenty or thirty. Most of your best material is stuff you have already forgotten.

**Pass two: map.** Group those into the six story categories. Any category with nothing in it is your weak spot, and it is usually conflict or failure, because those are the memories people suppress.

**Pass three: rehearse out loud.** Not reading - telling. Record it. The gap between how good your story feels in your head and how it sounds on playback is the entire problem this exercise exists to solve.

Then get follow-up questions from someone or something that will push back. The rehearsed version of a story survives the first question and falls apart on the second. Volume of reps matters more than the sophistication of the mock, which is why [structured mock interview practice](/blogs/mock-technical-interview-guide) beats reading more lists like this one.

One final note. Everything above assumes you have real experience to draw on. If you are a student or new grad, university projects, hackathons, part-time work and open source contributions are all legitimate material - a merged pull request with a maintainer who disagreed with your approach is a genuine conflict story. [Getting your first PR merged](/blogs/open-source-contribution-beginners) is one of the fastest ways to generate material you can actually talk about.

---

*ShipItHQ's AI mock interviews cover behavioural rounds with follow-up questions and feedback on structure and specificity - the two things you cannot self-assess. [Start free](/pricing).*
