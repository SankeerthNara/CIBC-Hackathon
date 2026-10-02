# API Contract

Source of truth for frontend and backend. Base URL `http://localhost:8000`. JSON only. Timestamps ISO-8601 with offset. Currency CAD. Mock "today" is 2026-10-02.
Full example payloads live in `contracts/mock/*.json` (regenerate with `python contracts/mock/_generate.py`). Frontend `USE_MOCK` serves those files.

## Conventions

**Auth stand-in (prototype):** headers `X-User-Id: AG-0620` and `X-User-Role: agent | specialist | supervisor`. Defaults to `AG-0620` / `agent` if absent.

**Error shape (all endpoints):**
```json
{"error": {"code": "not_found", "message": "Customer G-999999 not found", "details": {}}}
```
| HTTP | code | When |
|---|---|---|
| 400 | `validation_error` | Bad body or params |
| 403 | `forbidden` | Role not allowed (e.g. only supervisor reads audit) |
| 404 | `not_found` | Unknown id |
| 409 | `hardship_requires_specialist` | Non-specialist tries to approve/override a hardship decision |
| 409 | `already_decided` | Decision is not pending |
| 422 | `reason_required` | Override without reason |
| 500 | `internal_error` | Unexpected |

Enums: `bucket` = current, 1-30, 31-60, 61-90, 90+. `hardship_flag` = clear, possible, severe. `treatment` = reminder, call, payment_plan, hardship_referral, escalate. `channel` = call, sms, email, app. `status` = pending, approved, overridden.

---

## GET /customers/{golden_id}/c360
Includes the contact timeline (`contact_timeline`); there is no separate timeline endpoint.
Mock: `c360.json` (object keyed by golden_id; the response is one value).

Response 200 (abridged; see mock for all fields):
```json
{
  "golden_id": "G-004817", "display_name": "R. Mitchell", "segment": "hourly_wage", "province": "ON",
  "preferred_language": "EN", "customer_since": "2016-03-14",
  "consent": {"call": true, "sms": true, "email": true},
  "summary": {"card_count": 1, "loan_count": 1, "deposit_count": 1, "total_balance": 27080.0, "total_overdue": 1612.0,
              "has_credit_balance": false, "max_dpd": 34, "bucket": "31-60", "hardship_flag": "severe",
              "last_contact_at": "2026-09-25T14:12:00-04:00", "refreshed_at": "2026-10-02T06:00:00-04:00"},
  "products": [{"product": "Credit card (Visa)", "account_mask": "****4417", "balance": 8430.0, "overdue_amount": 452.0,
                "dpd": 28, "status": "delinquent", "credit_limit": 10000.0}],
  "contact_timeline": [{"contact_id": "CT-101", "contact_at": "2026-09-25T14:12:00-04:00", "channel": "call", "direction": "outbound",
                        "outcome": "promise_made", "summary": "New PTP $800 by 2 Oct, agent A. Roy", "agent_id": "AG-0842", "transcript_id": "T-8843"}],
  "identity": {"match_confidence": 0.97, "review_required": false,
               "sources": [{"system": "cards", "source_id": "C-88013", "match_confidence": 0.97}]},
  "quality": [{"field": "max_dpd", "rule": "DQ-04", "status": "pass", "lineage": "cards/loans dpd", "refreshed_at": "2026-10-02T06:00:00-04:00"}],
  "break_prob": 0.81, "current_decision_id": "NBA-0001"
}
```
Notes: `contact_timeline` newest first. No DOB, SIN, phone, email, address or postal code anywhere. 404 `not_found` for unknown id.

---

## POST /ask
Mock: `ask.json` with keys `answered` (SQL route), `rag_answer` (RAG route), `refused`. The mock is for the frontend only: the real service picks by question.

Request:
```json
{"question": "Which customers are most likely to break a promise to pay this week?", "context": {"golden_id": null}}
```
`context` optional; if `golden_id` is set the question is scoped to that customer.

Response 200 (always 200, including refusals; `refused` tells the story):
```json
{
  "question": "Which customers are most likely to break a promise to pay this week?",
  "answer": "8 open promises are most likely to break, with $12,990 at risk. R. Mitchell (0.81) and S. Tremblay (0.78) are the highest.",
  "sql": "SELECT c.golden_id, ... ORDER BY s.break_prob DESC LIMIT 8",
  "tables_used": ["gold.promises_to_pay", "gold.model_scores", "gold.c360"],
  "understood_as": [{"token": "open promises to pay", "kind": "filter", "editable": true},
                    {"token": "top 8", "kind": "limit", "editable": true}],
  "columns": ["golden_id", "display_name", "product", "ptp_amount", "ptp_due_date", "break_prob", "top_reason"],
  "rows": [["G-004817", "R. Mitchell", "Personal loan + Credit card", 800.0, "2026-10-02", 0.81, "Payroll deposit missing for 14 days"]],
  "row_count": 8,
  "followups": ["Why is G-004817 high risk?", "Which have hardship flags?"],
  "citations": [],
  "refused": false, "refusal_reason": null,
  "route": "sql"
}
```
- `understood_as[].kind`: filter, time_window, sort, limit, source. Editing a token: re-POST with the rewritten question, or with `"overrides": [{"token": "top 8", "replace_with": "top 20"}]` (optional).
- `route`: `sql`, `rag`, `both`, `refused`. `sql` is null for pure RAG; `citations` non-empty for RAG: `{source_type, source_id, golden_id, snippet, date}`.
- Refusal: `refused: true`, `refusal_reason` set, `answer`/`sql` null, `rows` empty. Reasons include direct PII or protected attributes, tables outside `contracts/schema.md`, write operations, non-collections topics, prompt injection.
- Errors: 400 `validation_error` (empty question, over 500 chars).

---

## GET /nba/queue
Query: `status` (default `pending`), `treatment`, `hardship_only` (bool), `page` (1), `page_size` (50, max 200). Sorted by `break_prob` desc. Mock: `nba_queue.json`.

Response 200:
```json
{
  "items": [{
    "decision_id": "NBA-0001", "golden_id": "G-004817", "display_name": "R. Mitchell",
    "products": ["Credit card", "Personal loan"], "bucket": "31-60", "max_dpd": 34, "total_overdue": 1612.0,
    "break_prob": 0.81, "top_reason": "Payroll deposit missing for 14 days",
    "treatment": "hardship_referral", "channel": "call", "recommended_time": "2026-10-03T10:00:00-04:00",
    "requires_specialist": true, "status": "pending", "hardship_flag": "severe"
  }],
  "total": 10, "page": 1, "page_size": 50
}
```

## GET /nba/{decision_id}
Mock: `nba_detail.json` (object keyed by decision_id).

Response 200:
```json
{
  "decision_id": "NBA-0001", "golden_id": "G-004817", "display_name": "R. Mitchell", "bucket": "31-60", "max_dpd": 34,
  "break_prob": 0.81, "treatment": "hardship_referral", "channel": "call", "recommended_time": "2026-10-03T10:00:00-04:00",
  "requires_specialist": true, "status": "pending", "hardship_flag": "severe",
  "explanation": "Hardship signals in the last call and a missed payroll deposit. Route to a hardship specialist; do not apply automated collection pressure.",
  "drivers": [{"feature": "payroll_delay_days", "value": 29, "direction": "increases_risk", "plain_english": "No payroll deposit for 29 days"}],
  "consent": {"call": true, "sms": true, "email": true},
  "model_version": "2026.10.02-a", "created_at": "2026-10-02T06:10:00-04:00",
  "reviewed_by": null, "reviewed_at": null, "final_treatment": null, "override_reason": null
}
```
`drivers` has the top 3 in plain English. `direction`: increases_risk | decreases_risk.

---

## POST /nba/{decision_id}/decision
Mock: `nba_decision.json` keys `approve_example`, `override_example`, `error_hardship_example`.

Request (approve):
```json
{"action": "approve"}
```
Request (override; `reason` and `new_treatment` required):
```json
{"action": "override", "reason": "Customer asked to be contacted by email only this week", "new_treatment": "payment_plan"}
```
Response 200:
```json
{"decision_id": "NBA-0005", "status": "overridden", "final_treatment": "payment_plan", "reviewed_by": "AG-0711",
 "reviewed_at": "2026-10-02T09:40:00-04:00", "override_reason": "Customer asked to be contacted by email only this week", "audit_id": "AUD-0103"}
```
Rules: if `requires_specialist` is true and `X-User-Role` is not `specialist`, return 409 `hardship_requires_specialist`. Every call writes an audit row. 409 `already_decided`; 422 `reason_required` if override has no reason.

Error example:
```json
{"error": {"code": "hardship_requires_specialist", "message": "This decision involves a hardship case and must be reviewed by a specialist.",
           "details": {"decision_id": "NBA-0001", "required_role": "specialist", "actor_role": "agent"}}}
```

---

## GET /governance/audit
Query: `decision_id`, `golden_id`, `event`, `page`, `page_size`. Newest first. Prototype: readable by all roles so the demo works; production would restrict to supervisor/specialist (403). Mock: `governance_audit.json`.

Response 200:
```json
{"items": [{"audit_id": "AUD-0103", "at": "2026-10-02T09:40:00-04:00", "event": "overridden", "decision_id": "NBA-0005",
            "golden_id": "G-003318", "actor": "AG-0711", "actor_role": "agent", "model_version": "2026.10.02-a",
            "detail": "Override: payment_plan instead of call. Reason: customer asked to be contacted by email only this week",
            "outcome": "overridden"}],
 "total": 13, "page": 1, "page_size": 50}
```
`event`: nba_recommended, hardship_routed, approved, overridden.

## GET /governance/contract
Returns the parsed `contracts/data_contract.yaml` as JSON (same structure). Mock: `governance_contract.json`.

## GET /dq/report
Latest data quality run. Mock: `dq_report.json` (illustrative numbers).
```json
{"dataset": "gold.c360", "run_at": "2026-10-02T06:00:00-04:00", "contract_version": "1.0.0",
 "summary": {"rules_total": 9, "passed": 7, "warned": 2, "failed": 0},
 "row_counts": {"raw": {"customers": 1000}, "curated": {"customers": 987, "rejected": 13}, "gold": {"c360": 962, "identity_map": 4120}},
 "rules": [{"id": "DQ-05", "name": "balance_non_negative", "status": "warn", "checked": 962, "failed": 7, "note": "7 credit balances flagged, not rejected"}],
 "schema_drift": [{"table": "raw.contact_history", "change": "new column", "column": "sentiment", "severity": "info"}],
 "identity_resolution": {"golden_customers": 962, "avg_sources_per_customer": 4.3, "avg_match_confidence": 0.94, "below_threshold": 23}}
```
`rules[].status`: pass | warn | fail.

## GET /transcripts/{transcript_id}
Full call transcript for a timeline item or a RAG citation. Mock: `transcripts.json` (keyed by transcript_id: T-8812, T-8843, T-8870, T-8895, T-8901; every transcript_id in c360 timelines has one).
```json
{"transcript_id": "T-8812", "golden_id": "G-004817", "contact_id": "CT-104", "date": "2026-09-12", "channel": "call", "agent_id": "AG-0711", "duration_sec": 412,
 "turns": [{"speaker": "customer", "text": "Shifts at the plant got cut in August, I can do $1,000 by the 15th."}],
 "summary": "Customer reports reduced shifts since August; promised $1,000 by 15 Sep.",
 "llm_features": {"hardship_signal": "severe", "stated_delay_reason": "reduced_income", "ptp_intent_strength": 0.6}}
```
`speaker`: agent | customer. 404 `not_found` if unknown.

## GET /governance/fairness
Fairness and human-in-the-loop evidence for the Governance screen. Mock: `governance_fairness.json`.
```json
{"model_version": "2026.10.02-a",
 "protected_attributes_excluded": {"status": "pass", "checked_attributes": ["age", "gender", "ethnicity", "religion", "marital_status", "postal_code"],
                                   "features_in_model": ["dpd_max_current", "..."], "test": "tests/test_no_protected_attributes.py::test_feature_list",
                                   "last_run": "2026-10-02T06:00:00-04:00"},
 "human_in_the_loop": {"decisions_total": 10, "pending": 8, "approved": 1, "overridden": 1, "override_rate": 0.5},
 "hardship": {"severe_routed_to_specialist": 1, "possible_flagged_for_agent_review": 1, "automated_treatment_blocked": 1},
 "segment_outcomes": [{"segment": "salaried", "customers": 5, "avg_break_prob": 0.57, "aggressive_treatment_rate": 0.4}]}
```
`override_rate` = overridden / (approved + overridden). `aggressive_treatment` = call or escalate.

## GET /health
`{"status": "ok", "db": "data/collections.duckdb", "contract_version": "1.0.0"}`

---

## Change policy
Any change here needs a PR that both of us approve. Frontend never invents fields; backend never removes them. Report needed changes in `docs/reports/` under "Contract changes needed".
