# Prompt Index

| File | Who | Tool and steps |
|---|---|---|
| [A_CLAUDE_CLI.md](A_CLAUDE_CLI.md) | Person A | Claude CLI (main builder). Steps 0, 3, 4, 5, 6, 7 |
| [A_CHATGPT.md](A_CHATGPT.md) | Person A | ChatGPT (scope, governance, pitch). Shared context + Steps 1, 2, 9 |
| [A_ANTIGRAVITY.md](A_ANTIGRAVITY.md) | Person A | Antigravity (parallel agents). Step 8 |
| [B_ANTIGRAVITY.md](B_ANTIGRAVITY.md) | Person B | Antigravity (all of B's work). Steps 0-10 |

Overall plan, schedule and ownership: [../AI_WORKFLOW.md](../AI_WORKFLOW.md)

## Order of play

**Tonight (design phase, 5-9 PM IST)**
1. A: Step 0 (repo bootstrap, push). B: `git pull`, then Step 0 (rules) and Step 1 (wireframes).
2. A: Steps 1-2 (ChatGPT), Step 3 (architecture doc). B: Step 2 (diagram + deck) once the doc is pushed.
3. A: Step 4 (contracts). B: Step 3 (frontend scaffold) after pulling.

**Build Day 1 (3 Oct)**
- A: Step 5 (pipeline), then Step 6 (features, model, NBA). B: Step 4 (NLQ), Step 5 (RAG), Step 6 (UI agents).
- Handoff 1: A pushes gold DB -> B runs Step 8.

**Build Day 2 (4 Oct)**
- A: finish Step 6, Step 7 (review) and Step 8 (agents). B: finish UI, Step 7, Step 8 (switch to real API).
- Freeze ~5 PM. A: Step 9 (pitch). B: Steps 9-10. Submit by 8 PM.

## Reporting
Every prompt ends with a reporting instruction. Agents write progress to `docs/reports/` (see [../reports/README.md](../reports/README.md)) and read new instructions from `docs/reports/INSTRUCTIONS_A.md` / `INSTRUCTIONS_B.md`. ChatGPT cannot write to the repo: paste its REPORT block into `docs/reports/A_chatgpt.md` and push it.
