# Design-Phase Deck: Apex Collections 360 + Ask + NBA
**Governed AI Vertical Slice for Intelligent Bank Debt Resolution**  
**Educational Prototype | CIBC Hackathon 2026**  
**Palette:** Navy (`#141B2D`), Cream (`#F6F2EA`), Red-Orange (`#C73E1D`), Amber (`#FFD580`)  

---

## Slide 1: The Problem & The Solution
**Headline:** From 9 Fragmented Systems to One Governed Collections Cockpit

### The Frontline Problem
- **Data Fragmentation:** Collections agents navigate up to 9 siloed systems (core banking, credit cards, mortgages, auto loans, collections CRM, dialer logs, bureau scores) to piece together a single customer's situation.
- **Lost Recovery Time:** Average call handle time is ~10 minutes, with over 3 minutes wasted solely on manual lookup and cross-referencing account numbers (assumed baseline hypothesis).
- **High Broken Commitments:** A 40% Promise-to-Pay (PTP) break rate (assumed baseline) because outreach timing and channel are disconnected from customer context.
- **Vulnerability Blind Spots:** Hardship disclosures (medical emergencies, job disruptions) buried in unstructured call transcripts are missed, exposing the bank to regulatory sanctions and damaging customer trust.

### Our Solution: One Vertical Slice Across 3 Governed Layers
1. **Layer 1 (Data Product Factory):** Unifies fragmented customer records into an authoritative **Collections 360 (C360)** Golden Record in DuckDB, with automated entity resolution and data contract enforcement.
2. **Layer 2 (Insight & NLP):** **"Collections Ask"** natural-language conversational interface that writes verifiable DuckDB SQL, cites unstructured notes/transcripts via RAG, and explicitly refuses out-of-scope or sensitive questions.
3. **Layer 3 (AI Decisioning):** **Next Best Action (NBA)** engine pairing a LightGBM PTP break model with plain-English SHAP explanations, automated hardship routing, and human-in-the-loop approve/override workflows.

---

## Slide 2: End-to-End System Architecture
**Headline:** A Cohesive, Auditable Pipeline from Raw Data to Actionable UI

![System Architecture](../../docs/architecture.svg)

### Key Architectural Pillars
- **Source Ingestion:** Ingests core banking, loans, cards, contact history, bureau data, agent notes, and speech transcripts.
- **Layer 1 (Data Product Factory - Owner A):**
  - Raw -> Curated (Silver) -> Golden C360.
  - Deterministic keys (shared IDs, normalised name + date of birth/phone where present), then fuzzy matching (with lineage source IDs).
  - Formal Data Contract (`contracts/data_contract.yaml`) + Automated Data Quality assertions (`dq_report.json`).
- **Layer 2 (Insight & NLP - Owner B):**
  - Schema allow-list parser & semantic translation.
  - `sqlglot` security guardrail (SELECT-only, enforced LIMIT 50/200, PII/protected column blocker).
  - RAG vector retrieval over chunked notes and speaker-turn call transcripts with verifiable source citations.
- **Layer 3 (AI Decisioning - Owner A):**
  - Unified feature store combining SQL aggregations and LLM-extracted hardship/delay signals.
  - LightGBM PTP break risk scoring + plain-English SHAP decision driver generation.
  - Policy engine evaluating contact consent windows before channel selection.
- **Presentation Layer (React + Vite + Tailwind - Owner B):**
  - Fast, accessible (WCAG 2.1 AA) UI for C360, Ask, NBA Queue, and Governance Cockpit.
  - Seamless toggle between contract mock data (`VITE_USE_MOCK=true`) and live FastAPI backend.
- **Unified Governance Foundation:** Spans all tiers with data contracts, zero demographic bias, hardship circuit breakers, and tamper-evident audit logging.

---

## Slide 3: Where AI is Used and Why
**Headline:** AI to Accelerate & Explain; Deterministic Code to Validate & Enforce

| Layer | AI Capability | Implementation Mechanism | Why It Earns Its Place | Deterministic Guardrail |
|---|---|---|---|---|
| **L1** | **Source-to-Target Mapping & Codegen** | LLM drafts column mappings and cleaning SQL | Cuts schema integration time across 9 disparate sources from days to minutes | Human engineer reviews SQL before commit; DQ checks enforce types and uniqueness |
| **L1** | **Schema Drift & Anomaly Detection** | Statistical checks + LLM schema change summarizer | Prevents silent upstream upstream format breaks from polluting downstream models | Strict reject quarantine table for non-compliant records |
| **L2** | **Natural Language to SQL** | Contextual prompt with schema allow-list | Empowers non-technical team leads and recovery analysts to query data in plain English | `sqlglot` validates AST: SELECT-only, read-only DB connection, enforced row limits |
| **L2** | **Transcript RAG & Evidence Retrieval** | Vector chunking by speaker turns + citation linker | Surfaces critical customer qualitative context ("why" payments were missed) | Returns exact source document IDs and excerpts; strictly never invents facts |
| **L3** | **Unstructured Feature Extraction** | Zero-shot extraction of `hardship_signal`, `dispute_flag`, `stated_delay_reason` | Converts free-text phone transcripts into structured, model-ready numerical features | Evaluated against 20+ ground-truth test labels; prompt versioned and audited |
| **L3** | **PTP Break Prediction & NBA** | LightGBM classifier with SHAP tree explainers | Ranks high-risk delinquency accounts and recommends optimal treatment/channel | Top 3 drivers rendered in plain English; protected attributes mathematically barred |

**Core Philosophy:** *The LLM proposes or extracts; deterministic logic validates, bounds, and executes. Numbers shown to users always come directly from SQL execution or model output, never from generative completion.*

---

## Slide 4: Governance, Fairness & Responsible AI
**Headline:** Responsible by Design — Not an Afterthought

```
+----------------------------------------------------------------------------------------------------+
|                                  5 GOVERNANCE PILLARS                                             |
|                                                                                                    |
|  1. FORMAL DATA CONTRACT          2. MATHEMATICAL FAIRNESS        3. HARDSHIP CIRCUIT BREAKER     |
|  YAML contract schema with        Zero protected demographic      Accounts with hardship signals   |
|  uniqueness, not-null, and        attributes (Age, Gender,        instantly bypass automated queues|
|  valid DPD range rules [0,365].   Race, Religion, Postal Code)    and route to human specialists.  |
|  Automated nightly DQ reports.    verified by unit tests.                                          |
|                                                                                                    |
|  4. SQL SAFETY GUARDRAIL          5. IMMUTABLE AUDIT TRAIL & HITL                                 |
|  sqlglot AST validation ensures   Every decision, approval, and override (with mandatory reason)   |
|  SELECT-only, enforced LIMIT,     is captured in a tamper-evident audit log for full traceability. |
|  and read-only database access.                                                                    |
+----------------------------------------------------------------------------------------------------+
```

### Key Differentiators for Judges
- **Demographic Neutrality Proof:** We include a dedicated automated test (`test_no_protected_attrs`) verifying that no protected features (or postal code proxies) enter the feature store or model matrix.
- **Hardship Safeguard:** Automated debt collection can harm vulnerable individuals. Our system identifies medical emergencies, bereavement, or job disruptions from call logs and freezes aggressive treatment, requiring human specialist engagement.
- **Auditable Human Override:** System recommendations are never autonomous actions. Field specialists retain final authority to approve or override recommendations, providing an empirical Human-in-the-Loop (HITL) override rate (target: 10–15%).

---

## Slide 5: Business Impact & Scalability Roadmap
**Headline:** Quantifiable Recovery ROI with an Enterprise Production Path

### Target Operational KPIs (Synthetic Data Baseline)
| Collections KPI | Assumed baseline | Operational Mechanism | Target Improvement |
|---|---|---|---|
| **PTP Kept Rate** | 60% | Early intervention on high break-risk accounts; dynamic reminder timing | **+5% (to 65%)** |
| **Contact Efficiency** | 20% (1 in 5 connect) | Optimized channel selection based on historical response times | **+15% relative lift** |
| **Agent Handle Time** | 10.0 min / call | C360 eliminates 9-system searches; instant pre-computed timeline | **-2.0 min (-20% reduction)** |
| **Analyst Turnaround** | 2–3 days / request | Self-serve Collections Ask with visible, validated SQL | **< 30 seconds** |

*Capacity Impact:* On a 100-collector team handling 60 accounts/day, shaving 2 minutes per call frees **20 full-time agent equivalents** of capacity to focus on high-touch recovery conversations.

### Production Scalability Roadmap
```
PROTOTYPE (Hackathon 36h)             ENTERPRISE PRODUCTION (Target State)
----------------------------------     -------------------------------------
DuckDB local embedded database         Cloud Data Lakehouse (Snowflake / Databricks)
Batch pipeline script (pipeline.run)   Orchestrated dbt + Apache Airflow DAGs
Local CSV & JSON mock ingestion        Kafka / Debezium Real-Time Event Streaming
Scikit-Learn / LightGBM batch scoring  MLflow Model Registry + Drift Monitoring
Local sentence embeddings index        Managed Enterprise Vector Database (pgvector/Pinecone)
FastAPI single-process server          Kubernetes Container Cluster + API Gateway
Single-user mock authentication        Enterprise SSO (Okta / Azure AD) + Fine-Grained RBAC
```

---
*Apex Collections 360 — Educational Prototype | Synthetic Data Only*
