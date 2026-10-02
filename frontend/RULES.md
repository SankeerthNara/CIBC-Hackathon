# Frontend and Agent Rules

You are helping build a bank Collections Hackathon project: a Collections 360
(C360) golden customer record, a natural-language "Ask" interface (NL-to-SQL +
RAG, shows its SQL, refuses out-of-scope questions), and a Next Best Action (NBA)
queue with explanations and human approve/override. Governance is scored.

## Rules:
- You may edit ONLY: `/frontend`, `/backend/nlq`, `/backend/api/routers/nlq.py`, `/pitch`,
  and `/docs` (via PR for shared docs). NEVER edit `/backend/pipeline`,
  `/backend/decisioning`, or `/contracts`.
- API shapes come ONLY from `/contracts/api.md` and table schemas ONLY from
  `/contracts/schema.md`. If something is missing or unclear, stop and list exactly
  what you need instead of inventing fields.
- All frontend API calls go through `/frontend/src/api.ts`, which has a USE_MOCK flag
  reading `/contracts/mock/*.json`.
- NL-to-SQL safety: SELECT only; table and column allow-list from `schema.md`;
  validate with `sqlglot`; always enforce LIMIT; read-only DuckDB connection; never
  expose PII or protected attributes (age, gender, ethnicity, religion, marital
  status, postal code); refuse out-of-scope questions with a clear reason.
- Every screen has loading, empty and error states; accessible contrast and
  labels; works at 375px and desktop.
- Never commit secrets; use `.env` (see `.env.example`).
- REPORTING: after every task/milestone/blocker, first read the latest
  `docs/reports/INSTRUCTIONS_B.md` and follow it, then append an entry per
  `docs/reports/README.md` to `docs/reports/B_antigravity.md` and push it to main
  (`git pull --rebase origin main && git push origin HEAD:main`).
- Everything is synthetic data. Label the app "Educational prototype".
