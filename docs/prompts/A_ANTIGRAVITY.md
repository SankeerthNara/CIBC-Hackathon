# Person A: Antigravity prompts

Open the repo as an Antigravity workspace; one prompt per agent in Agent Manager. Reports go to `docs/reports/A_antigravity.md`.
Order of play and handoffs: [README.md](README.md). Plan: [../AI_WORKFLOW.md](../AI_WORKFLOW.md).

---

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


REPORTING (mandatory): when finished, and at each milestone or blocker, first read the latest docs/reports/INSTRUCTIONS_A.md and follow it, then append an entry (template in docs/reports/README.md) to docs/reports/A_antigravity.md, then commit and push it: git add docs/reports && git commit -m "report" && git pull --rebase origin main && git push origin HEAD:main. Include real numbers, errors and any contract changes you need.
```

---

