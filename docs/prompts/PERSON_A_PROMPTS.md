# Person A: Paste-Ready Prompts

Tools: **ChatGPT** (thinking/pitch), **Claude CLI** (build; run from repo root `D:\Infinium\CIBC-Hackathon`), **Antigravity** (parallel agents/testing).
Paste each block as-is, in order. Tag shows the tool. Don't skip step 0.

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

## STEP 0: Claude CLI: repo bootstrap (do first, tonight)

```
You are setting up a hackathon repo in the current directory (git repo already
initialised). Read docs/AI_WORKFLOW.md first. Then:
1. Create this structure with .gitkeep where empty: backend/pipeline,
   backend/decisioning, backend/nlq, backend/api/routers, data/raw, data/curated,
   data/gold, contracts/mock, frontend, pitch, docs.
2. Write CLAUDE.md at the root: project goal (Collections 360 + NL access + Next
   Best Action with governance), stack (Python 3.11, DuckDB, FastAPI, LightGBM,
   sqlglot, pytest; React+Vite+Tailwind frontend), folder ownership (A owns
   backend/pipeline, backend/decisioning, backend/api, contracts, data; B owns
   backend/nlq, backend/api/routers/nlq.py, frontend, pitch), and rules: never
   commit secrets, never use protected attributes (age, gender, ethnicity,
   religion, marital status, postal code as proxy) in decisioning, every AI
   decision returns an explanation, SELECT-only SQL for NLQ.
3. Write .gitignore (node_modules, .venv, __pycache__, .env, data/raw/*,
   data/curated/*, data/gold/*, *.duckdb, dist), .env.example (LLM_API_KEY=,
   LLM_MODEL=, DUCKDB_PATH=data/collections.duckdb), and a README skeleton with
   setup + run steps placeholders.
4. Create backend/requirements.txt (duckdb, fastapi, uvicorn, pandas, lightgbm,
   scikit-learn, shap, sqlglot, pydantic, python-dotenv, pytest, pyyaml,
   rapidfuzz, httpx) and a Makefile with targets: setup, pipeline, api, test.
5. Commit on a branch a/bootstrap and push; tell me the PR command.
Don't write business logic yet.
```

---

## STEP 1: ChatGPT: scope sanity check (tonight, 10 min)

```
[Paste SHARED CONTEXT first]
Critique our plan: one vertical slice (DuckDB medallion pipeline -> "Ask"
NL-to-SQL showing SQL + refusal -> Next Best Action with explanation and
human override queue, with governance panel). What will judges love? What's the
biggest risk in 36h for 2 people? What should we cut? Give a final must-have
list (max 5) and non-goals (max 4). Be blunt.
```

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
```

## STEP 3: Claude CLI: architecture doc (tonight)

```
Read docs/AI_WORKFLOW.md section 1 and CLAUDE.md. Write docs/ARCHITECTURE.md
(max 3 pages) covering: components; data flow source -> raw -> silver -> gold
C360 -> feature store -> (NLQ, NBA) -> UI; where AI is used per layer and why
(mapping suggestions, SQL codegen, drift detection, NL-to-SQL, RAG, LLM-extracted
features, NBA explanations); scalability (how DuckDB/Python moves to a
warehouse + streaming + feature store service); business value with collections
KPIs (roll rate, cure rate, promise-to-pay kept rate, contact efficiency, agent
handle time) and a rough impact estimate with stated assumptions; governance
controls per layer; risks and mitigations. Include one Mermaid diagram. Specific
to our stack, no filler. Use the governance table below as input:
<paste ChatGPT's step 2 output here>
```

## STEP 4: Claude CLI: contracts (tonight / before B needs them)

```
Create in /contracts, without touching /frontend or /backend/nlq:
1. data_contract.yaml for the gold.c360 data product: name, owner (Collections
   Data Product Owner), purpose, version, schema (column, type, description, PII
   class), lineage (source tables), quality rules (unique golden_id, not-null keys,
   referential integrity to source ids, DPD between 0 and 365, balance >= 0
   except credit balances flagged, freshness < 24h, match_confidence between 0
   and 1), allowed uses, prohibited uses (no protected attributes in decisions),
   retention.
2. schema.md: the gold tables and curated tables the NL-to-SQL layer may query,
   with columns and plain-English descriptions: gold.c360 (golden_id, name,
   segment, consent flags, product counts, total_balance, max_dpd, bucket,
   hardship_flag, match_confidence, last_contact_at), gold.promises_to_pay,
   gold.contact_history, gold.model_scores (golden_id, model_name, score_date,
   break_prob, top_reason), gold.nba_decisions. Mark which columns are
   disallowed for NLQ (PII, protected).
3. api.md: GET /customers/{golden_id}/c360, POST /ask {question} ->
   {answer, sql, tables_used, understood_as[], followups[], citations[],
   refused, refusal_reason}, GET /nba/queue, GET /nba/{id}, POST
   /nba/{id}/decision {action: approve|override, reason, new_treatment},
   GET /governance/audit, GET /governance/contract, GET /dq/report. Full request
   and response JSON examples and error shape.
4. mock/*.json: one mock file per endpoint with realistic, believable Canadian
   collections data (10 customers, varied DPD buckets, one hardship case).
Keep it minimal and consistent: these are the source of truth for both of us.
```

## STEP 5: Claude CLI: data pipeline (Build Day 1 AM, once real data is in data/raw)

```
Real datasets are in /data/raw. First inspect every file (columns, types, nulls,
duplicates, ID formats) and write docs/DATA_PROFILE.md. Then implement
/backend/pipeline in Python + DuckDB, run via `python -m pipeline.run`
(idempotent, rebuilds from scratch):
- raw: load every file as-is.
- curated (silver): typed, trimmed, deduped, standardised dates/currency/
  phone/name; reject table for bad rows with reasons.
- gold.c360: one row per golden customer, product rollups, DPD/bucket, contact
  summary, hardship_flag placeholder.
- Customer identity resolution across sources: deterministic keys first, then
  fuzzy match (rapidfuzz on name + DOB/postcode/phone) with match_confidence and
  the source IDs preserved (lineage columns/table gold.identity_map).
- Run every quality rule in contracts/data_contract.yaml; output
  data/gold/dq_report.json and docs/DQ_REPORT.md with pass/fail counts.
- Schema-drift check: compare incoming file columns/types to an expected
  schema and report differences.
- Write the final DuckDB to data/collections.duckdb with schemas raw, curated, gold.
Add pytest tests (dup customers, missing IDs, negative balances, DPD outliers).
Commit after each stage. At the end, tell me when the gold DB is ready to share
with my teammate.
```

## STEP 6: Claude CLI: feature store + model + NBA (Build Day 1 PM - Day 2 AM)

```
Implement /backend/decisioning:
1. features.py: a feature registry (name, entity, type, source, refresh, built_by
   SQL|LLM). SQL features: dpd_max_current, ptp_broken_count_90d,
   payroll_delay_days, card_utilisation, sms_response_rate_30d,
   bureau_score_delta_90d, days_since_last_contact. Materialise into
   gold.feature_store. The same function must serve offline training and online
   scoring.
2. llm_features.py: use the LLM (env LLM_API_KEY/LLM_MODEL) to extract from
   agent_notes/call_transcripts: hardship_signal (enum clear|possible|severe),
   stated_delay_reason (category), dispute_flag (bool), ptp_intent_strength
   (0-1), sentiment_last_call. Each feature stored with prompt, prompt version,
   and an eval script scoring it against 20 hand-labelled examples I'll put in
   data/labels/. Cache results; make it resumable and rate-limit safe; cap spend.
3. model.py: train a LightGBM (or logistic) model predicting promise-to-pay
   break from the feature store. Time-based train/test split, report AUC, write
   gold.model_scores with break_prob and top reasons (SHAP). Include a test
   asserting that no protected attribute (age, gender, ethnicity, religion,
   marital_status, postal code) is in the feature list.
4. nba.py: combine model score, bucket, consent flags, contact-hour limits and
   channel response rates to output treatment (reminder / call / payment plan /
   hardship referral / escalate), channel and timing, plus a plain-English
   explanation citing the top 3 drivers. hardship_signal != clear ALWAYS routes to
   a human hardship specialist and never gets an automated aggressive treatment.
5. audit.py: every decision and every human approval/override written to
   gold.audit_log (who, when, inputs, model version, explanation, outcome).
Expose via /backend/api (FastAPI) exactly per contracts/api.md: /nba/queue,
/nba/{id}, /nba/{id}/decision, /governance/audit, /governance/contract,
/dq/report, /customers/{id}/c360. Add smoke tests per endpoint. If anything
requires a contract change, stop and tell me.
```

## STEP 7: Claude CLI: review B's PRs (each time)

```
Review the diff of branch <b/branch-name> against main. Check: matches
contracts/api.md and schema.md exactly; the NL-to-SQL path is SELECT-only with
table/column allow-list and enforced LIMIT; no raw string interpolation of
user input into SQL; no protected/PII columns exposed; no hard-coded keys;
loading/empty/error states exist; refusal path works. List issues by severity
with file:line. Don't rewrite anything.
```

## STEP 8: Antigravity: parallel agents (run in separate agents; Day 1 PM onward)

```
Agent 1 (tests): In /backend/pipeline, write pytest tests for edge cases:
duplicate customers across sources, missing IDs, inconsistent date formats,
negative balances, DPD outliers, name variants (e.g. "Robert"/"Bob", casing,
accents). Run them and report failures; don't change pipeline code, only tests.
Agent 2 (labels): Read 40 random agent_notes and call_transcripts from
/data/raw and write data/labels/hardship_labels.csv with columns
(source_id, hardship_signal clear|possible|severe, stated_delay_reason,
dispute_flag) so we can evaluate the LLM feature extractor. Mark uncertain ones.
Agent 3 (e2e): Once app is running at http://localhost:5173, use the browser:
open a customer C360, ask 3 questions, ask 1 out-of-scope question, approve one
NBA and override another. Screenshot each step. Report console errors, broken
states and slow calls.
```

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
```
