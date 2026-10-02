# CLAUDE.md

## Project goal
Collections hackathon (educational prototype, synthetic data). Build a vertical slice through three layers:
1. **Collections 360 (C360)**: raw -> curated -> golden customer record in DuckDB, with identity resolution, lineage, a data contract and a data quality report.
2. **Natural-language access**: NL-to-SQL (shows its SQL, refuses out-of-scope questions) plus RAG over agent notes/transcripts.
3. **Next Best Action (NBA)**: feature store, promise-to-pay break model, plain-English explanations, human approve/override queue.
Governance runs through every layer. Full plan: `docs/AI_WORKFLOW.md`.

## Stack
Python 3.11, DuckDB, FastAPI, LightGBM, sqlglot, pytest. Frontend: React + Vite + Tailwind.

## Folder ownership (do not edit the other person's folders)
- **Person A:** `backend/pipeline`, `backend/decisioning`, `backend/api`, `contracts`, `data`
- **Person B:** `backend/nlq`, `backend/api/routers/nlq.py`, `frontend`, `pitch`
- Shared (via PR): `docs`, `README.md`, `Makefile`, `backend/requirements.txt`
- `/contracts` (data_contract.yaml, schema.md, api.md, mock/) is the source of truth for both.

## Rules
- Never commit secrets. Use `.env` (see `.env.example`).
- Never use protected attributes (age, gender, ethnicity, religion, marital status, postal code as a proxy) in decisioning.
- Every AI decision returns an explanation.
- NL-to-SQL is SELECT-only, with a table/column allow-list and an enforced LIMIT.
- Branches: `a/<feature>`, `b/<feature>`; small PRs into `main`; `git pull --rebase origin main` before each work block.

## Reporting
After every task, read the latest `docs/reports/INSTRUCTIONS_A.md`, then append a report entry per `docs/reports/README.md` to `docs/reports/A_claude-cli.md` (Antigravity agents use `A_antigravity.md`) and push it to `main`.
