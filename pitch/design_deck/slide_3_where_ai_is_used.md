# Slide 3: Where AI is Used and Why

**Topic:** Strategic AI Deployment with Deterministic Guardrails  
**Governing Rule:** *The LLM proposes or extracts; deterministic code validates and decides.*  

---

### AI Deployment Matrix Across Layers

| Layer | AI Capability | Implementation Mechanism | Why It Earns Its Place | Deterministic Guardrail |
|---|---|---|---|---|
| **L1: Data Factory** | **Source-to-Target Mapping & Codegen** | LLM drafts field mapping and data cleaning SQL | Accelerates integration across 9 disparate schemas from days to minutes | Human review of generated code; automated DQ schema checks enforce contracts |
| **L1: Data Factory** | **Schema Drift & Anomaly Detection** | Statistical tests + LLM delta summarizer | Detects breaking upstream schema changes before data reaches downstream models | Non-compliant records quarantined to a reject table with error codes |
| **L2: Insight & NLP** | **Natural Language to SQL** | In-context LLM prompt with strict schema allow-list | Allows frontline managers and auditors to query data without technical SQL skills | `sqlglot` AST parser rejects non-SELECT, multi-statement, or prohibited column queries |
| **L2: Insight & NLP** | **Transcript RAG & Evidence Retrieval** | Speaker-turn vector chunking with source linking | Unlocks conversational context and "why" behind customer delinquency | Verifiable citations: displays exact Source Doc ID, customer key, and snippet |
| **L3: AI Decisioning** | **Unstructured Feature Extraction** | Zero-shot LLM classification of `hardship_signal`, `dispute_flag`, etc. | Turns qualitative dialogue into structured, testable quantitative model features | Evaluated against a labelled test set (20+ samples); prompt versioned and audited |
| **L3: AI Decisioning** | **PTP Break Risk & NBA Recommendation** | LightGBM classification model + SHAP tree explainer | Predicts probability of commitment breach and suggests optimal intervention | Top 3 drivers in plain English; zero protected demographic attributes in feature store |

---

### Non-Negotiable Principle: Truth in Numbers
- **No Hallucinated Figures:** All metrics, row counts, exposure totals, and probabilities shown to end-users originate directly from DuckDB query execution or trained ML models.
- **Explicit Refusals:** Queries attempting to access out-of-scope tables or protected attributes trigger an immediate, explanatory refusal card.
