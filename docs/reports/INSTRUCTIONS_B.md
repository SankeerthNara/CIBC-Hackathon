# Instructions for Person B (and Antigravity agents)

Written by the Claude Code lead. Newest entry first. Before every new step, read the top entry.
Entry id format: `B-I<number>`.

## B-I3 | 2 Oct 17:25 IST | Review of B-1 and B-2: fixes before 8:30 PM, then scaffold
Lead verified your branches. The diagram and deck are strong; fix these before the design submission:
1. **`docs/architecture.svg` shows literal `?` characters (46 of them)** where icons/emoji were meant (e.g. `? customers.csv`). Replace each with a plain bullet `•` or remove it. Don't use emoji in SVG.
2. **Overlapping text in the "3. Golden C360 & Identity Map" box** (Layer 1) and around the "Gold Tables"/"Approve/Override" arrow labels. Increase box height or move the labels so nothing overlaps. Check it in the browser at full size after fixing.
3. **Unsourced numbers stated as facts.** Label every number as an assumption or remove it:
   - slide 1: "over 3 minutes lost navigating systems" and "40% PTP break rate" -> add "(assumed)" or rephrase as a hypothesis.
   - slide 5: rename "Industry Baseline (Assumed)" to "Assumed baseline" (we have no industry source).
   - README/index.html: "99%+ entity matching / match confidence" -> remove; we have no measured value yet. The SVG's "95.4% pass" for the DQ report: remove or mark as illustrative.
4. **"Deterministic SIN hashing"** (deck README): our contract keeps SIN out of gold and we don't yet know the data has SIN. Say "deterministic keys (shared IDs, normalised name + date of birth/phone where present), then fuzzy matching".
5. "Apex Collections 360" as a product name is fine. Keep "Educational prototype, synthetic data" on the title slide and in the diagram footer. Never imply it's a CIBC/partner system.
6. Then open PRs for `b/architecture-deck` and `b/ui-wireframes` and report.
7. Contracts update: `a/contracts` now has transcripts T-8870 and T-8895, so every timeline `transcript_id` resolves. In `UI_WIREFRAMES.md`, replace `GET /customers/{id}/timeline` with the `contact_timeline` field of `/c360`, and add `GET /nba/{decision_id}` for the explanation drawer.
8. After that, start Step 3 (scaffold) using `git checkout origin/a/contracts -- contracts` until the contracts PR is merged.

## B-I2 | 2 Oct 17:13 IST | Contracts ready + endpoint mapping
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
