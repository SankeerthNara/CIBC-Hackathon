# Schema: tables the NL-to-SQL layer may query

Source of truth for the NLQ allow-list. DuckDB, file `data/collections.duckdb`. Read-only connection, SELECT only, always LIMIT.
Today in the mock/demo data is **2026-10-02**. Buckets: `current`, `1-30`, `31-60`, `61-90`, `90+`. Currency CAD.

Legend: **OK** = allowed for NLQ. **BLOCKED** = never selectable, filterable or joinable via NLQ.

## gold.c360 (one row per golden customer)
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| golden_id | VARCHAR | Golden customer id, e.g. G-004817 | OK |
| display_name | VARCHAR | Initial + surname, e.g. R. Mitchell | OK |
| segment | VARCHAR | salaried, hourly_wage, self_employed, other | OK |
| province | VARCHAR | Province code | OK |
| preferred_language | VARCHAR | EN or FR | OK |
| customer_since | DATE | First product opened | OK |
| consent_call / consent_sms / consent_email | BOOLEAN | May be contacted on that channel | OK |
| card_count / loan_count / deposit_count | INTEGER | Open accounts by type | OK |
| total_balance | DECIMAL(12,2) | Owed balance across credit products | OK |
| total_overdue | DECIMAL(12,2) | Overdue amount across products | OK |
| has_credit_balance | BOOLEAN | Any account in credit | OK |
| max_dpd | INTEGER | Highest days past due | OK |
| bucket | VARCHAR | DPD bucket | OK |
| hardship_flag | VARCHAR | clear / possible / severe | OK |
| match_confidence | DOUBLE | Identity match confidence 0-1 | OK |
| last_contact_at | TIMESTAMP | Latest contact attempt | OK |
| refreshed_at | TIMESTAMP | Row build time | OK |

## gold.identity_map (lineage)
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| golden_id | VARCHAR | Golden id | OK |
| source_system | VARCHAR | cards, loans, deposits, collections, crm, contacts, notes, transcripts, bureau | OK |
| source_id | VARCHAR | Id in the source system | OK |
| match_confidence | DOUBLE | Confidence for this link | OK |

## gold.promises_to_pay
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| ptp_id | VARCHAR | Promise id | OK |
| golden_id | VARCHAR | Customer | OK |
| product | VARCHAR | Credit card, Personal loan, Auto loan, Line of credit | OK |
| ptp_amount | DECIMAL(12,2) | Promised amount | OK |
| ptp_due_date | DATE | Promised date | OK |
| ptp_status | VARCHAR | open, kept, broken, partial | OK |
| created_at | TIMESTAMP | When the promise was taken | OK |
| created_channel | VARCHAR | call, sms, email, app | OK |
| agent_id | VARCHAR | Agent who took it (e.g. A. Roy -> AG-0842) | OK |

## gold.contact_history
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| contact_id | VARCHAR | Contact id | OK |
| golden_id | VARCHAR | Customer | OK |
| contact_at | TIMESTAMP | When | OK |
| channel | VARCHAR | call, sms, email, app, letter | OK |
| direction | VARCHAR | outbound, inbound | OK |
| outcome | VARCHAR | right_party_contact, no_answer, promise_made, payment_made, delivered_no_response, bounced | OK |
| agent_id | VARCHAR | Agent, null for automated | OK |
| summary | VARCHAR | One-line summary, no personal identifiers | OK |
| transcript_id | VARCHAR | Link to a call transcript (RAG source), nullable | OK |

## gold.model_scores
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| golden_id | VARCHAR | Customer | OK |
| model_name | VARCHAR | e.g. ptp_break | OK |
| model_version | VARCHAR | e.g. 2026.10.02-a | OK |
| score_date | DATE | Scoring date | OK |
| break_prob | DOUBLE | Probability the customer breaks a promise to pay, 0-1 | OK |
| top_reason | VARCHAR | Top driver in plain English | OK |

## gold.nba_decisions
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| decision_id | VARCHAR | e.g. NBA-0001 | OK |
| golden_id | VARCHAR | Customer | OK |
| created_at | TIMESTAMP | Recommendation time | OK |
| treatment | VARCHAR | reminder, call, payment_plan, hardship_referral, escalate | OK |
| channel | VARCHAR | call, sms, email, app | OK |
| recommended_time | TIMESTAMP | Suggested contact time (customer local) | OK |
| break_prob | DOUBLE | Score at decision time | OK |
| requires_specialist | BOOLEAN | True for hardship cases; human specialist must review | OK |
| status | VARCHAR | pending, approved, overridden | OK |
| final_treatment | VARCHAR | After human review, null if pending | OK |
| explanation | VARCHAR | Plain-English reasons | OK |
| model_version | VARCHAR | Scoring model | OK |

## curated.collections_cases (for "which strategy worked best" questions)
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| case_id | VARCHAR | Case id | OK |
| golden_id | VARCHAR | Customer | OK |
| product_type | VARCHAR | credit_card, personal_loan, auto_loan, line_of_credit, unsecured_loan (= personal_loan + line_of_credit) | OK |
| bucket_at_open | VARCHAR | Bucket when opened | OK |
| bucket_at_close | VARCHAR | Bucket at closure or now (roll = worse than at open) | OK |
| opened_at / closed_at | DATE | Dates, closed_at null if open | OK |
| treatment | VARCHAR | reminder, call, payment_plan, hardship_referral, escalate | OK |
| outcome | VARCHAR | cured, rolled, partial, open | OK |
| amount_recovered | DECIMAL(12,2) | CAD recovered | OK |

## curated.card_accounts / curated.loan_accounts
| Column | Type | Meaning | NLQ |
|---|---|---|---|
| account_id | VARCHAR | Account id (internal) | OK |
| account_mask | VARCHAR | Masked number, last 4 digits only, e.g. ****4417 | OK |
| golden_id | VARCHAR | Customer | OK |
| product | VARCHAR | Visa, Mastercard, Personal loan, Auto loan, Line of credit | OK |
| balance | DECIMAL(12,2) | Owed balance (negative = credit balance) | OK |
| credit_limit | DECIMAL(12,2) | Cards only, null for loans | OK |
| utilisation | DOUBLE | Cards only, 0-1 | OK |
| overdue_amount | DECIMAL(12,2) | Overdue now | OK |
| dpd | INTEGER | Days past due | OK |
| status | VARCHAR | current, delinquent, charged_off | OK |

## BLOCKED (never queryable via NLQ; not stored in gold tables)
- Direct PII: legal_name, date_of_birth, sin, phone, email, street_address, postal_code, full account numbers.
- Protected attributes: age, gender, ethnicity, religion, marital_status. Postal code is also blocked as a proxy.
- Tables: raw.*, gold.feature_store, gold.audit_log, restricted.*.
- Unknown tables or columns, any write operation, multiple statements.

If a question cannot be answered from the OK tables above, NLQ must refuse with a reason (`refused: true`).
