# Collections Hackathon: Team Split & AI Workflow

**Challenge:** Unify collections data (C360), enable natural-language access, power operational AI use cases, with governance throughout.
**Team:** Person A (Claude CLI + ChatGPT + Antigravity) · Person B (Antigravity only)

## 0. Key dates (IST)

| When | What | Our output |
|---|---|---|
| 2 Oct 5-9 PM | System design phase | Architecture doc + diagram + governance plan (top 50 advance) |
| 3 Oct 9 AM - 4 Oct 9 PM | 36h build | Working demo |
| 4 Oct 9 PM | Submission deadline | Repo, architecture diagram, data contract file, 5-min demo video, 10-slide deck |
| Later | Finalists refine + present at partner office | Polish + pitch |

Note: the brief's slide 12 weights (Business 20, Tech/demo 30, Innovation 15, Team 15, Story 20) differ from the kickoff text (Business 25, Tech/demo 25, AI 20, Governance 10, Story 20). Confirm which is current; the plan covers both.

---

## 1. Solution concept (decide/confirm tonight)

One **thin vertical slice through all 3 layers**, rather than three shallow ones:

| Layer | What we build | Owner |
|---|---|---|
| **L1 Data Product Factory** | Raw -> curated (silver) -> golden **Collections 360** in DuckDB. Customer ID matching across sources with match confidence, lineage, one data contract (YAML) with quality rules, data quality report | **A** |
| **L2 Insight & NLP** | "Collections Ask": NL-to-SQL over curated/golden data, **shows SQL + data products used**, shows "understood as" tokens, **refuses** out-of-scope questions, RAG over agent notes/transcripts, follow-up suggestions | **B** |
| **L3 AI Decisioning** | **Next Best Action** (treatment + channel + timing): feature store (SQL + LLM-extracted features like `hardship_signal`), promise-to-pay break model, per-decision explanation, **human review/override queue**. Stretch: post-call summary | **A** |
| **UI** | C360 customer view (lineage, timeline), Ask screen, NBA queue with explain + approve/override, governance panel | **B** |
| **Governance** | Contract, no protected attributes in features, hardship/vulnerability flag, audit log, HITL | A builds, B surfaces |

Stack (keep boring, fast): **Python + DuckDB + FastAPI + scikit-learn/LightGBM**, **React + Vite + Tailwind** frontend, one LLM API for NL-to-SQL / extraction / summaries.

Why this split: A owns the data -> model chain (everything depends on clean gold tables). B owns everything a judge *sees and asks* (NLQ + UI), which is the demo, 20-30% of the score, and works well inside a single IDE.

---

## 2. Repo layout & ownership (no one edits the other's folders)

```
/backend
  /pipeline      (A) L1: ingest, curate, golden, ID match, DQ checks
  /decisioning   (A) L3: features, model, NBA, explanations, audit
  /nlq           (B) L2: NL-to-SQL, RAG, guardrails
  /api           (A) FastAPI app; B adds routers only under /api/routers/nlq.py
/data            (A) raw/, curated/, gold/, collections.duckdb (gitignore big files)
/contracts       (A writes) data_contract.yaml, api.md, schema.md, mock/*.json
/frontend        (B)
/docs            architecture, governance, decisions, this file (shared via PR)
/pitch           (B slides + video, A script and numbers)
```

**Git:** `main` always runs. Branches `a/<feat>`, `b/<feat>`. Small PRs, other person merges after a 2-min skim. `git pull --rebase origin main` at the start of every work block. `.env` for keys, never committed; commit `.env.example`.

**The unlock:** `/contracts/schema.md` (gold table schema) + `/contracts/api.md` + `/contracts/mock/*.json` are written first, tonight/morning, so B builds NLQ and UI against them without waiting for A.

---

## 3. Schedule

### Tonight (2 Oct, 5-9 PM): design submission
| | A | B |
|---|---|---|
| 5:00-5:45 | ChatGPT: scope/idea + governance (A1, A2) | Antigravity: read brief, sketch the 4 screens (B1) |
| 5:45-7:30 | Claude CLI: write `docs/ARCHITECTURE.md` + data flow + scalability + business value (A3) | Antigravity: architecture diagram + design deck (B2) |
| 7:30-8:30 | Claude CLI: draft `data_contract.yaml`, `schema.md`, `api.md` (A4) | Antigravity: scaffold frontend on mocks (B3) |
| 8:30-9:00 | Review each other's work, submit | |

### Build (3 Oct 9 AM - 4 Oct 9 PM)
| Block | A | B |
|---|---|---|
| Day 1 AM | Load the real datasets; raw -> silver pipeline; ID matching | NL-to-SQL service on schema.md + sample data; guardrails |
| Day 1 PM | Golden C360 + data contract + DQ report | Ask UI + C360 view; RAG over notes/transcripts |
| Day 1 eve | Feature store (SQL features); push **gold DuckDB** to repo/shared | Switch NLQ onto real gold; 15+ benchmark questions |
| Day 2 AM | LLM features (hardship etc.), model, NBA + explanation | NBA queue UI, explain panel, override flow |
| Day 2 PM | Audit log, governance checks, integration, deploy | Polish, demo path, screenshots |
| Day 2 eve (to 9 PM) | **Freeze at ~5 PM.** Demo video, README, deck, submit | Slides, 5-min video, rehearsal |

Insight session for top-10 designs falls in the build phase; keep the architecture doc current so it's presentable.

---

## 4. Person A: AI workflow

- **ChatGPT**: scope decisions, banking/collections domain grounding, governance framing, storytelling and judge Q&A.
- **Claude CLI**: main builder (pipeline, model, API, tests), reviews B's PRs. Keep `CLAUDE.md` current.
- **Antigravity**: parallel agents (synthetic edge cases, DQ test generation) and browser end-to-end testing of the full demo.

Loop: ChatGPT decides -> Claude CLI builds -> Antigravity tests -> ChatGPT pitches.

### Prompts

**A1. ChatGPT: scope**
```
We're a 2-person team in a bank Collections hackathon (IST, 36h build).
Challenge: unify collections data (cards, loans, deposits, collections cases,
contact history, agent notes, call transcripts, external bureau scores) into a
Collections 360 golden record, give natural-language access (NL-to-SQL + RAG),
and power ONE operational AI use case. Judged on business impact, technical
quality + working demo, smart use of AI, governance/responsible AI, storytelling.
Our plan: DuckDB medallion pipeline -> Ask (NL-to-SQL showing its SQL, refusing
out-of-scope) -> Next Best Action with explanations and human override.
Critique this plan. What will judges love, what's the biggest risk in 36h,
what should we cut? Give a 3-item must-have list and 3 non-goals.
```

**A2. ChatGPT: governance**
```
For a collections AI system, list concrete responsible-AI controls we can
actually implement in a prototype: data contract, access control by role,
excluded protected attributes (and how to prove it), hardship/vulnerability
detection and what treatment changes, human-in-the-loop points, audit log,
explanation per decision, bias check across segments, consent-aware channel
limits (e.g. contact hours). For each: how to implement in <2h and how to show it
in the demo.
```

**A3. Claude CLI: architecture doc** (repo root)
```
Read docs/AI_WORKFLOW.md section 1 and the challenge brief. Write
docs/ARCHITECTURE.md: components, data flow (source -> raw -> silver -> gold C360
-> feature store -> NBA/NLQ -> UI), where AI is used at each layer and why,
scalability story (how this moves from DuckDB to a warehouse/streaming),
business value (collections KPIs: roll-rate, cure rate, contact efficiency,
agent handle time), and governance (controls per layer). Add a Mermaid diagram.
Be specific to our stack; no generic filler. Keep under 3 pages.
```

**A4. Claude CLI: contracts**
```
Create in /contracts: (1) data_contract.yaml for the gold c360 data product:
owner, purpose, schema with types, quality rules (uniqueness, not-null,
referential integrity, freshness, valid DPD range), allowed/disallowed uses,
PII classification. (2) schema.md describing gold tables and the curated tables
the NLQ layer may query. (3) api.md: endpoints for GET /customers/{id}/c360,
POST /ask, GET /nba/queue, POST /nba/{id}/decision (approve/override with
reason), GET /governance/audit, GET /dq/report. (4) mock/*.json with realistic
Canadian-collections data. Don't touch /frontend or /backend/nlq.
```

**A5. Claude CLI: pipeline**
```
Using the real datasets in /data/raw, implement /backend/pipeline in Python +
DuckDB: raw -> curated (typed, deduped, standardised) -> gold.c360. Implement
customer identity resolution across sources with match confidence and lineage
columns. Run quality rules from contracts/data_contract.yaml, emit a data
quality report (JSON + markdown). Add schema-drift detection (compare against
contract). Idempotent: `python -m pipeline.run` rebuilds everything. Add tests.
```

**A6. Claude CLI: features + NBA**
```
Implement /backend/decisioning: (1) feature store (SQL features: dpd_max,
ptp_broken_count_90d, payroll_delay_days, utilisation, contact response rates;
LLM features from notes/transcripts: hardship_signal, stated_delay_reason,
dispute_flag, each with prompt + version + eval against a labelled sample of
20). Same definition for offline training and online scoring. (2) A promise-to-pay
break model (LightGBM/logistic) with SHAP or coefficient-based reasons. (3) NBA
rules+model that returns treatment, channel, timing, top reasons in plain English.
Exclude protected attributes; add a test that asserts they are not in the
feature list. Hardship signal must route to a human specialist. Log every
decision to an audit table.
```

**A7. Claude CLI: review B's PR**
```
Review branch <b/branch> vs main. Check it matches contracts/api.md and
schema.md, never builds SQL from raw user input unsafely, only allows SELECT on
allowed tables, has no hard-coded keys, and handles error/empty states. List
issues by severity; do not rewrite.
```

**A8. Antigravity: parallel agents**
```
Agent 1: write pytest data-quality and edge-case tests for /backend/pipeline
(duplicate customers, missing IDs, negative balances, DPD outliers).
Agent 2: open the running app in the browser and walk the demo flow
(customer C360 -> Ask 3 questions -> NBA queue -> override a decision). Report
console errors, broken states, slow calls with screenshots.
```

**A9. ChatGPT: pitch + judge Q&A**
```
Write a 10-slide outline and a 5-minute demo-video script for our Collections
solution. Open with the agent's pain (customer story scattered across 9
systems), then C360, Ask with visible SQL, NBA with explanation + human
override, governance. Map each slide to a judging criterion. Then give 15 tough
judge questions (fairness, hallucinated SQL, scale, privacy, ROI) with crisp answers.
```

---

## 5. Person B: AI workflow (Antigravity only)

Use **Agent Manager**: one planner agent for design, parallel agents per feature, the **browser agent** to verify UI and NLQ answers.

Put this in `/frontend/RULES.md` (and as Antigravity workspace rules):
```
- Edit only /frontend, /backend/nlq, /backend/api/routers/nlq.py, /pitch.
- Never edit /backend/pipeline, /backend/decisioning, or /contracts.
- API shapes come ONLY from /contracts/api.md; table schemas ONLY from
  /contracts/schema.md. If something is missing, stop and list what's needed.
- All frontend API calls go through /frontend/src/api.ts with a USE_MOCK flag.
- NL-to-SQL: SELECT-only, allow-list of tables/columns, always LIMIT, never
  expose protected attributes, return {answer, sql, tables_used, understood_as}.
  Out-of-scope questions get a refusal with a reason.
- Every screen needs loading, empty, and error states; accessible contrast.
```

### Prompts

**B1. Understand + sketch (tonight)**
```
Read the attached challenge brief (Collections Hackathon). Propose 4 screens:
(1) Collections 360 customer view with product holdings, contact timeline,
identity-resolution + lineage panel; (2) "Collections Ask" with editable
"understood as" tokens, results table, visible SQL, follow-up chips;
(3) Next Best Action queue with explanation and approve/override; (4)
Governance panel (data contract, DQ report, audit log). Produce a wireframe-level
description for each and the data each one needs. Don't write code yet.
```

**B2. Architecture diagram + design deck (tonight)**
```
Using docs/ARCHITECTURE.md, produce a clean architecture diagram (SVG or
Mermaid exported to PNG) showing: sources -> Layer 1 raw/curated/golden ->
Layer 2 NLQ/RAG -> Layer 3 features/model/NBA -> UI, with a governance bar
running across every layer. Save to /docs/architecture.svg. Then a 5-slide
design-phase deck in /pitch (problem, architecture, AI use, governance,
business value).
```

**B3. Scaffold on mocks**
```
Create a React + Vite + Tailwind app in /frontend. Read /contracts/api.md and
/contracts/mock. Build src/api.ts with USE_MOCK. Set up routes for the 4 screens.
Design system: deep navy (#141B2D), warm cream background (#F6F2EA), red-orange
accent (#C73E1D), amber highlight (#FFD580), serif headings. Trustworthy
banking feel. Document tokens in /frontend/DESIGN.md. Plan first, then build.
```

**B4. NL-to-SQL service**
```
Build /backend/nlq in Python: given a question, call the LLM with
/contracts/schema.md as context to produce DuckDB SQL, validate it (SELECT only,
allow-listed tables/columns via sqlglot, LIMIT enforced), execute against
data/collections.duckdb (read-only), then return {answer, sql, tables_used,
understood_as, followups}. Refuse questions about data outside the allow-list
or asking for protected attributes. Write a benchmark file of 20 questions
(e.g. "Which customers are most likely to break a promise to pay this week?",
"Which strategy worked best for unsecured loans in the last 90 days?", "Top
drivers of roll-rate deterioration this week?") plus 5 should-refuse questions,
and a script that scores pass/fail.
```

**B5. RAG over notes and transcripts**
```
Add RAG to /backend/nlq over agent_notes and call_transcripts: chunk, embed
(local or API embeddings), store in a simple index (e.g. DuckDB vss or FAISS),
return answers with cited source ids. Router: decide per question whether it
needs SQL, RAG, or both. Show citations in the Ask UI.
```

**B6. Parallel UI agents**
```
Agent 1: C360 customer screen. Agent 2: Ask screen with editable tokens, SQL
panel, follow-ups. Agent 3: NBA queue with explanation drawer and
approve/override-with-reason. Agent 4: Governance panel (contract, DQ report,
audit log). All use api.ts, follow DESIGN.md, include all states.
```

**B7. Browser verification**
```
Run the app. In the browser, walk the demo: open a customer, ask 3 benchmark
questions, ask 1 out-of-scope question and confirm the refusal, approve one NBA
and override another. Screenshot each step at desktop and 375px. Fix visual
bugs and console errors. List any API mismatches rather than guessing fields.
```

**B8. Pitch assets**
```
From the repo and screenshots, build the 10-slide deck in /pitch and a
shot-by-shot plan for the 5-minute demo video (what's on screen, narration cue).
Include the architecture diagram and a governance slide.
```

---

## 6. Sync rules

- 5-min sync every ~3h: done / blocked / contract changes.
- **Contract is truth.** Mismatch -> B reports in chat, A fixes backend or PRs the contract.
- **Handoff #1 (Day 1 midday):** A pushes the first gold DuckDB (even partial); B switches NLQ from sample to real data.
- **Handoff #2 (Day 2 AM):** A exposes `/nba/*`; B wires the queue.
- **Freeze ~5 PM on 4 Oct.** Only bugfixes, README, video, deck. Submit by 8 PM, a 1h buffer.
- Record a backup demo video before the final polish.

## 7. Submission checklist

- [ ] GitHub repo with one-command setup (`make run` or README steps)
- [ ] Architecture diagram (`docs/architecture.svg`)
- [ ] Data contract file (`contracts/data_contract.yaml`)
- [ ] 5-minute demo video
- [ ] 10-slide pitch deck
- [ ] DQ report, NLQ benchmark results, audit log sample in the repo
- [ ] No secrets committed; labelled as an educational prototype (not endorsed by the industry partner)
