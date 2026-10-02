# Instructions for Person B (and Antigravity agents)

Written by the Claude Code lead. Newest entry first. Before every new step, read the top entry.
Entry id format: `B-I<number>`.

## B-I5 | 2 Oct 18:10 IST | Lead built the submission deck: stop B-I4 step 3
- The design submission deck is done by the lead: `pitch/design_submission/HackIt_Resolve360_Design.pptx` + `.pdf` (branch `a/design-submission`). **Do not build a separate submission deck** (B-I4 step 3 is cancelled).
- Our concept is now **Resolve360** (team Hack It): affordability-first Next Best Action, hardship score, trust score, Ask over governed metrics, live re-decisioning. Read the deck so your wireframes and UI match it.
- Still do: B-I3 fixes + PRs for `b/architecture-deck` and `b/ui-wireframes`.
- Then: Step 3 frontend scaffold on the contracts. If time allows tonight, build the C360 and NBA screens on mocks so we can add real screenshots to the deck.

## B-I4 | 2 Oct 17:25 IST | Design submission = PDF/PPT before 9 PM. You own the file.
Status: contracts are now MERGED on main (`git pull origin main`; no need for `git checkout origin/a/contracts`). Your two branches have no PRs yet and no B-I3 fixes yet.

Do in this order:
1. **(by 18:15) B-I3 fixes 1-5** on `b/architecture-deck`: `?` glyphs in the SVG, overlapping text, unsourced numbers labelled as assumptions, drop "99%+" and "SIN hashing". Rebase on main, open PR, report.
2. **(by 18:15) B-I3 fix 7** on `b/ui-wireframes`: endpoint names per contracts/api.md. Open PR, report.
3. **(by 20:00) Submission deck, PPTX + PDF**, in `/pitch/design_submission/`. Extend your 5 slides to about 10:
   1. Title: team, "Educational prototype, synthetic data"
   2. Problem (assumptions labelled)
   3. Solution overview: one vertical slice (C360 -> Ask -> NBA), 3 must-haves
   4. Architecture diagram (fixed SVG, full slide)
   5. Data Product Factory: C360, identity resolution, data contract, DQ rules (from contracts/data_contract.yaml)
   6. Ask (NL-to-SQL + RAG): show SQL, refusal; use the mock `ask.json` examples
   7. Next Best Action: model, explanation drivers, human approve/override, hardship routing (mock `nba_detail.json` NBA-0001)
   8. Governance & responsible AI (ARCHITECTURE.md section 5)
   9. **Implementation plan**: 36h build timeline from docs/AI_WORKFLOW.md section 3, team split (A: pipeline + decisioning + API; B: NLQ/RAG + UI), the contract-first workflow, the AI-tool workflow, and how we'll evaluate (NLQ benchmark pass rate, model AUC, DQ report, LLM-feature accuracy vs labels)
   10. Business value + scalability (assumptions labelled)
   Optional: 1-2 UI wireframe mockups from UI_WIREFRAMES.md.
   Make it as a real .pptx (python-pptx or Antigravity), and export a PDF too. Check every slide renders with no overlaps and no `?` glyphs. No emoji.
4. **(20:00) Push and report.** The lead will review; final submission by 20:45.
5. Only after that: Step 3 frontend scaffold.

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
