# Slide 5: Business Impact & Scalability Roadmap

**Topic:** Measurable Collections ROI & Migration Path to Enterprise Production  
**Context:** Educational prototype with transparent assumptions based on synthetic data  

---

### Quantifiable Operational Impact

| Collections KPI | Industry Baseline (Assumed) | Improvement Mechanism | Target Impact (Assumed) |
|---|---|---|---|
| **Promise-to-Pay (PTP) Kept Rate** | 60.0% | Prioritize high break-risk promises with tailored, early reminders | **+5.0 pts (to 65.0%)** |
| **Contact Efficiency** | 20.0% (1 in 5 connect) | Match contact channel and timing to historical customer response patterns | **+15.0% relative lift** |
| **Agent Call Handle Time** | 10.0 min per account | C360 eliminates 9 disparate system searches; pre-computed timeline & rollups | **-2.0 min (-20% reduction)** |
| **Analyst Ad-Hoc Query Turnaround** | 2–3 business days | Self-serve Collections Ask interface with visible, audited DuckDB SQL | **< 30 seconds** |

#### Capacity Unlocked
- In an operational unit of **100 frontline collectors** handling **60 calls per day**:
- A **2-minute reduction** on a 10-minute average handle time unlocks **20 agent equivalents** of productive operational capacity (~25% more accounts handled per agent per day).

---

### Scalability Roadmap: From Hackathon Prototype to Enterprise

| Architecture Tier | Hackathon Prototype (36h Build) | Enterprise Target State |
|---|---|---|
| **Data Storage** | Local embedded DuckDB database files | Cloud Lakehouse (Snowflake / Databricks / BigQuery) with Medallion architecture |
| **Data Ingestion** | Batch CSV / JSON ingestion scripts | Real-time streaming Change Data Capture (CDC via Kafka / Debezium) |
| **Feature Store** | SQL feature tables in DuckDB | Centralized Enterprise Feature Store (Feast / Hopsworks) with sub-10ms lookup |
| **ML Model Ops** | LightGBM batch scoring in Python | MLflow model registry, automated retraining pipelines, and champion/challenger drift checks |
| **NLP & Semantic** | In-process DuckDB NL-to-SQL + local embeddings | Enterprise semantic layer (Cube / dbt MetricFlow) + managed vector DB (pgvector / Pinecone) |
| **API & Security** | Single-process FastAPI server | Containerized Kubernetes cluster, API Gateway, Okta/Azure AD SSO & column-level encryption |
