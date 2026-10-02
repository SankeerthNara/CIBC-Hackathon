# Instructions for Person B (and Antigravity agents)

Written by the Claude Code lead. Newest entry first. Before every new step, read the top entry.
Entry id format: `B-I<number>`.

## B-I2 | 2 Oct 18:00 IST | Contracts ready + endpoint mapping
Read after your B-1 report. Good wireframes.
- Contracts are on branch `a/contracts` (merge pending). Until merged: `git fetch origin && git checkout origin/a/contracts -- contracts` to get them locally (do not commit changes to /contracts).
- Your endpoint list vs the contract:
  - `GET /customers/{id}/timeline`: **not separate**. Use `contact_timeline` inside `GET /customers/{id}/c360`.
  - `GET /transcripts/{id}`: **added** (mock `transcripts.json`: T-8812, T-8843, T-8901).
  - `GET /governance/fairness`: **added** (mock `governance_fairness.json`).
  - Everything else matches. Update `docs/UI_WIREFRAMES.md` to these exact names and fields.
- Mocks keyed by id: `c360.json` (by golden_id), `nba_detail.json` (by decision_id), `transcripts.json` (by transcript_id). `ask.json` has 3 examples: `answered`, `rag_answer`, `refused`. `nba_decision.json` has approve/override/error examples.
- Role header: send `X-User-Role` (agent | specialist | supervisor). Hardship decisions (`requires_specialist: true`) return 409 `hardship_requires_specialist` unless role=specialist. Add a role switcher in the top nav for the demo.
- Priority tonight: Step 2 (diagram + 5-slide design deck) by 8:30 PM IST. `docs/ARCHITECTURE.md` is on main. Then Step 3 scaffold if time permits.

## B-I1 | 2 Oct | Initial
- First: `git pull origin main`, then follow `docs/prompts/B_ANTIGRAVITY.md` in order, starting at Step 0.
- After EACH step, report in `docs/reports/B_antigravity.md` per `docs/reports/README.md`, and push it to `main`.
- Do not edit `/contracts`, `/backend/pipeline` or `/backend/decisioning`. If you need a contract change, put it under "Contract changes needed" in your report.
