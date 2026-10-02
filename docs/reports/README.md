# Reporting Protocol (read this first, AI agents included)

Claude Code (the lead's assistant) reads these files to track progress and issue the next instructions. **If you are an AI agent in this repo: report here, every time.**

## Files

| File | Written by | Who pastes/commits |
|---|---|---|
| `A_claude-cli.md` | Claude CLI (Person A) | agent commits itself |
| `A_antigravity.md` | Antigravity agents (Person A) | agent commits itself |
| `A_chatgpt.md` | ChatGPT (Person A) | **Person A pastes** the REPORT block ChatGPT gives |
| `B_antigravity.md` | All Antigravity agents (Person B) | agent commits itself |
| `INSTRUCTIONS_A.md` | Claude Code lead | Person A reads, follows, pastes into their AIs |
| `INSTRUCTIONS_B.md` | Claude Code lead | Person B reads, follows, pastes into Antigravity |
| `STATUS.md` | Claude Code lead | one-page board, updated from the reports |

Each reporter has its own file, so nobody edits the same file and merge conflicts don't happen.

## Rules

1. **Append only.** Add a new entry at the TOP of your file (newest first). Never rewrite old entries.
2. Report: after finishing a prompt/step, at each major milestone, whenever blocked, and at least every ~2 hours of work.
3. Be factual. Include real numbers (test results, pass rates, row counts). If something failed, say so with the error. Never claim "done" for something untested.
4. **Commit and push your report immediately**, straight to `main` (this is the only exception to the PR rule, since each file has one owner):
   ```bash
   git add docs/reports/<YOUR_FILE>.md
   git commit -m "report: <short title>"
   git pull --rebase origin main && git push origin HEAD:main
   ```
   If your code is on a feature branch, push the report to `main` as above and the code to the branch.
5. Before starting any new step, read the latest `INSTRUCTIONS_<A|B>.md` and follow any new instructions there first. Mention in your report that you read it (include its date/entry id).
6. Do not put secrets, API keys or real personal data in reports.

## Entry template (copy exactly)

```
## [YYYY-MM-DD HH:MM IST] <Agent/tool name> | <Step id, e.g. A-5 pipeline> | STATUS: DONE | IN-PROGRESS | BLOCKED
**Branch / commit:** <branch> @ <short sha>
**Read instructions version:** <latest entry id from INSTRUCTIONS file or "none">
**What I did:** <3-6 bullets, files/folders touched>
**Results:** <numbers: tests passed/failed, rows loaded, pass rate, AUC, screenshots saved to path>
**Problems / blockers:** <errors, mismatches, anything unclear. "none" if none>
**Contract changes needed:** <endpoint/schema changes I need from the other person, or "none">
**Questions for lead:** <specific questions, or "none">
**Next I plan to do:** <1-3 bullets>
```
