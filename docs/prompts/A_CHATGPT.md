# Person A: ChatGPT prompts

ChatGPT (browser/app). Paste SHARED CONTEXT first in every new chat. ChatGPT cannot touch the repo: copy its REPORT block into `docs/reports/A_chatgpt.md` and push it.
Order of play and handoffs: [README.md](README.md). Plan: [../AI_WORKFLOW.md](../AI_WORKFLOW.md).

---

## SHARED CONTEXT (paste at the start of every NEW ChatGPT chat)

```
Context: I'm in a 2-person team in a bank "Collections Hackathon" (IST).
Challenge: "Design a student-ready solution for the Collections function that
unifies enterprise and interaction data, enables natural-language access, and
powers operational AI use cases." Collections = contacting customers who missed
card/loan payments, agreeing a plan, recovering what's owed.
Three layers: (1) Data Product Factory: raw -> curated -> golden Collections 360
(C360), customer ID matching, data contract with quality rules, DQ report.
(2) Insight & NLP: NL-to-SQL + RAG over notes/transcripts, show SQL/sources for
every answer, refuse questions outside allowed data. (3) AI Decisioning: pick a
use case (next best action / agent assist / routing / channel optimisation /
post-call summary / QA), with feature store, working model/agent, explanation per
decision, human review/override. Governance throughout: data contract, explain
every decision, human in the loop, fairness (no protected attributes; flag
hardship/vulnerability).
Data (fully synthetic, messy): customers, card_accounts, loan_accounts,
deposit_accounts, collections_cases, contact_history (CSV); agent_notes (text);
call_transcripts (JSON); voice_samples (WAV, optional); external bureau scores (CSV).
Phases: design submission 2 Oct 5-9 PM; 36h build 3 Oct 9AM - 4 Oct 9PM;
submit repo + architecture diagram + data contract file + 5-min demo video +
10-slide deck. Scoring: business impact, technical quality + working demo, smart
AI use, governance/responsible AI, storytelling.
Our plan: one vertical slice. Stack: Python, DuckDB, FastAPI, LightGBM, React.
Me = pipeline (L1) + decisioning (L3) + API. Teammate = NL-to-SQL/RAG (L2) + UI.
```

---

---

## STEP 1: ChatGPT: scope sanity check (tonight, 10 min)

```
[Paste SHARED CONTEXT first]
Critique our plan: one vertical slice (DuckDB medallion pipeline -> "Ask"
NL-to-SQL showing SQL + refusal -> Next Best Action with explanation and
human override queue, with governance panel). What will judges love? What's the
biggest risk in 36h for 2 people? What should we cut? Give a final must-have
list (max 5) and non-goals (max 4). Be blunt.


At the very end, add a section titled REPORT (max 10 lines, using the template fields from docs/reports/README.md: status, what you decided, results, blockers, questions, next) that I will paste into the repo.
```

---

## STEP 2: ChatGPT: governance design (tonight)

```
[Paste SHARED CONTEXT first]
List concrete responsible-AI controls we can implement AND demo in a prototype,
for each of: data contract, role-based access, excluded protected attributes
(and how to prove exclusion with a test), hardship/vulnerability detection and
how treatment changes, human-in-the-loop points, audit log, per-decision
explanation, fairness check across segments, consent/contact-hour limits. For
each give: implementation in under 2 hours, and what we show on screen. Output
as a table.


At the very end, add a section titled REPORT (max 10 lines, using the template fields from docs/reports/README.md: status, what you decided, results, blockers, questions, next) that I will paste into the repo.
```

---

## STEP 9: ChatGPT: pitch, video script, judge Q&A (Day 2 PM)

```
[Paste SHARED CONTEXT first]
Our solution: C360 golden record with identity resolution and lineage; "Collections
Ask" NL-to-SQL that shows its SQL and refuses out-of-scope questions; Next Best
Action with feature store, promise-to-pay break model, plain-English
explanations, hardship routing to humans, audit log. Write:
1. A 10-slide deck outline (title, content bullets, the visual on each), mapping
   each slide to a judging criterion. Open with a customer story scattered across
   9 systems.
2. A 5-minute demo-video script with timestamps, what's on screen, narration.
3. Business-case numbers with explicit assumptions (cure-rate uplift, handle-time
   reduction, contact-cost saving) as a simple table.
4. 15 tough judge questions (fairness, hallucinated SQL, privacy, scale to a
   real bank, ROI, why not just a dashboard) with crisp 2-3 sentence answers.
Facts I'll give you for the numbers: <paste real DQ report + model AUC + benchmark pass rate>.


At the very end, add a section titled REPORT (max 10 lines, using the template fields from docs/reports/README.md: status, what you decided, results, blockers, questions, next) that I will paste into the repo.
```

---

