# Slide 4: Governance and Responsible AI

**Topic:** Built-In Ethics, Fairness Proof, and Human-in-the-Loop Oversight  
**Evaluation Rubric:** Governance & Responsible AI is explicitly scored  

---

### The 5 Concrete Governance Pillars

#### 1. Formal Data Contract (`contracts/data_contract.yaml`)
- Explicit ownership, freshness SLA (daily batch T+1), and cryptographic PII classification.
- Automated validation rules executed on every pipeline run: primary key uniqueness, referential integrity, and valid DPD boundaries `[0, 365]`.
- Generates live, transparent data quality reports (`GET /dq/report`).

#### 2. Mathematical Fairness: Zero Protected Demographic Attributes
- Age, Date of Birth, Gender, Ethnicity, Religion, Marital Status, and Postal Code (geographic proxy) are strictly barred from the feature store and decisioning algorithms.
- **Automated Verification:** Verified by unit test `test_no_protected_attrs` asserting that the feature matrix contains zero prohibited fields.

#### 3. Hardship & Vulnerability Circuit Breaker
- Regulatory & Ethical Imperative: Automated aggressive collection actions on customers experiencing severe vulnerability can cause profound harm and prompt severe regulatory penalties.
- **Circuit Breaker Action:** Any account where `hardship_signal = true` (detected via speech analytics or customer disclosure) is immediately removed from automated digital queues and routed exclusively to accredited human hardship specialists.

#### 4. Read-Only NL-to-SQL Guardrails
- Queries constructed via natural language pass through a multi-stage deterministic safety gate using `sqlglot`:
  - Enforces `SELECT`-only statements (rejection of `DROP`, `UPDATE`, `INSERT`, `ALTER`, etc.).
  - Restricts access strictly to allow-listed schema tables and columns.
  - Enforces automatic `LIMIT 50` (max 200) to prevent resource exhaustion.
  - Connects using a DuckDB read-only connection.

#### 5. Immutable Decision Audit Trail & Human-in-the-Loop (HITL)
- AI never executes collection interventions autonomously.
- Specialists review recommended actions in the Next Best Action queue and must choose to **Approve** or **Override**.
- Overrides require a categorized reason code and mandatory specialist rationale.
- All decisions, approvals, and overrides are written to a permanent audit log (`GET /governance/audit`).
