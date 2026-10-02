# Person A: Claude CLI prompts

Run `claude` from the repo root `D:\Infinium\CIBC-Hackathon`. Paste one step at a time, in order. Reports go to `docs/reports/A_claude-cli.md`.
Order of play and handoffs: [README.md](README.md). Plan: [../AI_WORKFLOW.md](../AI_WORKFLOW.md).

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
   decision returns an explanation, SELECT-only SQL for NLQ. Reporting: after every task, read the latest docs/reports/INSTRUCTIONS_A.md, then append a report entry per docs/reports/README.md to docs/reports/A_claude-cli.md (Antigravity agents use A_antigravity.md) and push it to main.
3. Write .gitignore (node_modules, .venv, __pycache__, .env, data/raw/*,
   data/curated/*, data/gold/*, *.duckdb, dist), .env.example (LLM_API_KEY=,
   LLM_MODEL=, DUCKDB_PATH=data/collections.duckdb), and a README skeleton with
   setup + run steps placeholders.
4. Create backend/requirements.txt (duckdb, fastapi, uvicorn, pandas, lightgbm,
   scikit-learn, shap, sqlglot, pydantic, python-dotenv, pytest, pyyaml,
   rapidfuzz, httpx) and a Makefile with targets: setup, pipeline, api, test.
5. Commit on a branch a/bootstrap and push; tell me the PR command.
Don't write business logic yet.


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_claude-cli.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

---

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


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_claude-cli.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

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


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_claude-cli.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

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


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_claude-cli.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

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


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_claude-cli.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

## STEP 7: Claude CLI: review B's PRs (each time)

```
Review the diff of branch <b/branch-name> against main. Check: matches
contracts/api.md and schema.md exactly; the NL-to-SQL path is SELECT-only with
table/column allow-list and enforced LIMIT; no raw string interpolation of
user input into SQL; no protected/PII columns exposed; no hard-coded keys;
loading/empty/error states exist; refusal path works. List issues by severity
with file:line. Don't rewrite anything.


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_claude-cli.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

