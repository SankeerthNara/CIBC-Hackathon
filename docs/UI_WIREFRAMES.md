# UI Wireframes & Screen Specifications
**Collections Hackathon — Educational Prototype**  
**Role:** Person B (UI, NLQ & Front-of-House Experience)  
**Status:** Design Phase Wireframe Specification (Step 1)  

---

## 1. Global Application Shell & Design Tokens

### 1.1 Brand & Visual System
- **Deep Navy:** `#141B2D` (Primary header, sidebar, heavy text, solid action buttons)
- **Warm Cream Background:** `#F6F2EA` (Canvas background, soft card surfaces `#FFFFFF`)
- **Red-Orange Accent:** `#C73E1D` (Hardship badges, high-risk flags, severe overdue alerts, override tags)
- **Amber Highlight:** `#FFD580` (Medium risk, pending approvals, editable token highlights)
- **Forest Green (Success):** `#2D6A4F` (Approved actions, paid/kept commitments, passed DQ checks)
- **Typography:**
  - Headings / Display: Serif typeface (e.g. *Source Serif Pro*, *Playfair Display*, or *Merriweather*) for authoritative, established banking credibility.
  - Body / UI / Tables: Clean Sans-Serif (e.g. *Inter*, *system-ui*) with high legibility at 12–14px.
  - Code / SQL: Monospace font (e.g. *JetBrains Mono*, *Fira Code*).

### 1.2 Layout & Persistent Elements
- **Persistent Top Navigation Bar (Height: 64px):**
  - Brand Logo + Title: **"Apex Collections 360"** (Serif, Navy `#141B2D`).
  - Navigation Tabs:
    - `Collections 360` (`/customer/:id` — defaults to active customer)
    - `Collections Ask` (`/ask`)
    - `Next Best Action` (`/nba`)
    - `Governance & Trust` (`/governance`)
  - Role Switcher (`X-User-Role`): `agent` | `specialist` | `supervisor` (enforces RBAC; hardship accounts require `specialist`).
  - Global Search / Quick Customer Switcher: Fast jump input to any Customer Golden ID (e.g., `G-004817`).
  - Environment Chip: "Mock Data Active" or "Live Backend Connected".
- **Persistent Bottom Legal Footer (Height: 40px):**
  - Centered text: `Educational prototype — synthetic data only. Not endorsed by financial institutions.`
  - Contrast: Accessible slate text on muted cream border.
- **Universal Responsive Standard:**
  - **Desktop (1280px+):** Multi-column, rich data density, side drawers for details.
  - **Tablet (768px – 1024px):** 2-column wrapping, collapsible panels.
  - **Mobile (375px min):** Single-column stacked cards, full-screen overlay drawers, horizontal table scrolling with frozen first columns.
- **Universal States (Required on all 4 screens):**
  - **Loading:** Shimmer / Skeleton cards and tables (matching component shapes, no plain spinners).
  - **Empty:** Contextual empty state with custom icon, explanatory message, and clear next action.
  - **Error:** Accessible error alert banner with error message, technical code details collapsible, and a "Retry" button.

---

## 2. Screen 1: Collections 360 (`/customer/:id`)

### 2.1 Purpose & User Story
As a frontline collections specialist or recovery agent, I need a single unified view of a customer's total financial exposure, multi-product delinquency status, prior contact history, and verifiable data lineage so that I can have an empathetic, informed, and compliant conversation without bouncing between legacy siloed systems.

### 2.2 Wireframe Layout (Desktop 1440px)
```
+----------------------------------------------------------------------------------------------------+
| TOP NAV: [Apex Collections]  | C360 (Active) | Ask | NBA Queue | Governance |  [Quick Jump: CUST-01] |
+----------------------------------------------------------------------------------------------------+
| BREADCRUMBS: Accounts > Delinquency Queue > CUST-10492 (Eleanor Vance)                             |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | CUSTOMER HEADER CARD                                                                           | |
| | Eleanor Vance  [GOLD-10492]                 Total Balance: $14,280.50   Max DPD: 64 Days (Bucket 3)  |
| | Segment: Prime Non-Card Delinquent          Total Overdue:  $2,140.00   Risk Score: 742 (Medium) | |
| | Consent Chips: [x SMS (09:00-18:00)] [x Email] [o Voice - Opted Out]                          | |
| | Hardship Status: [! HARDSHIP DETECTED - Medical Vulnerability (Sep 2026)]                     | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +-------------------------------------------------------+  +-------------------------------------+ |
| | PRODUCT HOLDINGS TABLE                                |  | IDENTITY RESOLUTION & LINEAGE       | |
| | Product         Acct No.     Balance   Overdue   DPD  |  | Golden ID: GOLD-10492               | |
| |-------------------------------------------------------|  | Sources Resolved:                   | |
| | Visa Infinite   *4829       $5,420    $850      64    |  | - Core Banking: CB-98210 (99.8%)    | |
| | Personal Loan   *1092       $8,860    $1,290    45    |  | - Credit Card:  CC-44829 (99.4%)    | |
| | Everyday Cheq   *3301       $310      $0         0    |  | - Loan System:  LN-01092 (99.1%)    | |
| |                                                       |  | Rule: Deterministic IDs, then Fuzzy | |
| | Total Exposure: 3 Products | $2,140 Overdue           |  | Quality Checks: 12/12 Passed [View] | |
| +-------------------------------------------------------+  +-------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | CONTACT TIMELINE & INTERACTIONS                                                                | |
| | [Filter: All Channels v] [Filter: Outcomes v]                                                  | |
| | - 2026-09-28 | SMS Outbound     | Delivered | PTP Broken ($500 promised on Sep 27)             | |
| | - 2026-09-22 | Inbound Phone    | Completed | Note: Customer disclosed medical leave [Read Note] |
| | - 2026-09-15 | Automated Email  | Opened    | 30-Day Reminder Notice Sent                      | |
| | - 2026-09-02 | Agent Outbound   | Left Msg  | Voice call voicemail left                        | |
| +------------------------------------------------------------------------------------------------+ |
| FOOTER: Educational prototype — synthetic data only.                                               |
+----------------------------------------------------------------------------------------------------+
```

### 2.3 Mobile Wireframe (375px)
- Single column stacked in order:
  1. Customer Header Card with wrapped chips.
  2. Urgent Alert Banner: Red Hardship Warning if applicable.
  3. Product Holdings (Horizontal swipe / responsive card tiles per product).
  4. Identity Resolution Card (Collapsible accordion).
  5. Contact Timeline (Vertical compact timeline cards with "View Transcript" modals).

### 2.4 Data Fields & Components
1. **Header Block:**
   - `customer_name`: String (e.g. Eleanor Vance)
   - `golden_id`: String (Unique Golden Customer Key)
   - `segment`: String (e.g. Retail Prime, Small Business, Near-Prime)
   - `total_balance`: Currency formatted (CAD)
   - `total_overdue`: Currency formatted (CAD)
   - `max_dpd`: Integer days past due with color badge (0: Green, 1–30: Muted Amber, 31–60: Amber, 61+: Red `#C73E1D`)
   - `consent_channels`: Array of `{ channel: 'sms'|'voice'|'email', allowed: boolean, time_window?: string }`
   - `hardship_flag`: Boolean + reason string + detection date
2. **Product Holdings Table:**
   - Columns: Product Name, Masked Account Number, Balance, Overdue Amount, DPD, Status Badge (Active, Delinquent, Written-off).
   - Summary Row: Aggregate counts and dollar balances.
3. **Contact Timeline:**
   - Items: `timestamp`, `channel` (SMS, Email, Phone, Digital), `direction` (Inbound, Outbound), `outcome` (PTP Kept, PTP Broken, No Answer, Hardship Disclosed, Left Voicemail), `agent_id`, `has_transcript` (boolean), `has_note` (boolean).
   - Interaction: Clicking "Read Note" or "View Transcript" opens a slide-over modal displaying conversation turns or raw agent notes with redactions.
4. **Identity Lineage Panel:**
   - Tree/Graph list: Source system keys mapped into the Golden Customer Record.
   - Match Confidence: Percentage bar with method label (Deterministic keys [shared IDs, normalised name + DOB/phone], then fuzzy matching).
   - Data Quality Check Badge: Count of passed validation rules (e.g. 12/12 rules passed).

### 2.5 States
- **Loading:** Skeleton placeholder cards for Header, Table rows, and Timeline items.
- **Empty:** If Customer ID does not exist, display: "Customer Golden ID not found in C360 catalogue" with quick search box.
- **Error:** "Unable to retrieve customer 360 profile. [Retry Button]".

### 2.6 API Calls Needed
- `GET /customers/{golden_id}/c360`: Fetches profile, aggregated balances, product holdings, identity lineage, consent, and `contact_timeline` (chronological interaction history embedded; no separate timeline endpoint).
- `GET /transcripts/{transcript_id}`: Fetches speaker-turn dialog and metadata for the transcript modal.

---

## 3. Screen 2: Collections Ask (`/ask`)

### 3.1 Purpose & User Story
As a collections operations manager, compliance auditor, or analyst, I want to query our collections data in natural English, inspect the exact SQL query and tables utilized, inspect transcript citations, and receive strict refusal explanations for prohibited or out-of-scope queries so that I can extract operational insights with 100% auditability and zero hallucination risk.

### 3.2 Wireframe Layout (Desktop 1440px)
```
+----------------------------------------------------------------------------------------------------+
| TOP NAV: [Apex Collections]  | C360 | Ask (Active) | NBA Queue | Governance |  [Quick Jump: CUST-01] |
+----------------------------------------------------------------------------------------------------+
| HERO SEARCH:                                                                                       |
|  [ Which customers are in the 31-60 DPD bucket for unsecured loans?                        [Ask] ] |
|                                                                                                    |
| STARTER QUESTION CHIPS:                                                                            |
|  [+ PTP Break Risk This Week]  [+ Roll-Rate Deterioration Drivers]  [+ Hardship Contacts Last 14d] |
|                                                                                                    |
| UNDERSTOOD AS (Editable Semantic Tokens):                                                          |
|  [Product: Unsecured Loans (x)]  [DPD Range: 31-60 (x)]  [Sort: Balance Desc (x)]  [Limit: 50 (x)] |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | LLM EXECUTIVE INSIGHT                                                                          | |
| | Analysis: 42 customers hold delinquent unsecured personal loans between 31 and 60 DPD, totaling| |
| | $218,450 in overdue balances. 68% of these accounts experienced payroll disruption.           | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | "HOW I GOT THIS" (Collapsible SQL & Provenance Panel)                             [v Hide SQL] | |
| | Data Products Used: [gold_c360] [curated_loans]              Safety: [SELECT ONLY] [LIMIT 50]  | |
| | Runtime: 18ms | DuckDB Read-Only                                                               | |
| | ```sql                                                                                         | |
| | SELECT customer_id, customer_name, loan_id, balance, overdue_amount, dpd                        | |
| | FROM gold_c360 JOIN curated_loans USING (customer_id)                                          | |
| | WHERE product_type = 'unsecured_loan' AND dpd BETWEEN 31 AND 60                                | |
| | ORDER BY overdue_amount DESC LIMIT 50;                                                         | |
| | ```                                                                                            | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +-------------------------------------------------------+  +-------------------------------------+ |
| | QUERY RESULTS TABLE (42 Rows)             [Export CSV]|  | RAG CITATIONS & EVIDENCE            | |
| | Customer ID   Name         Loan ID   Overdue   DPD    |  | Citing 2 notes & 1 transcript:      | |
| |-------------------------------------------------------|  | 1. Note #N-8821 (GOLD-10492)        | |
| | CUST-10492    E. Vance     LN-1092   $1,290    45     |  |    "...customer on medical leave..."| |
| | CUST-20184    M. Chen      LN-4819   $2,450    58     |  | 2. Transcript #TR-3012 (GOLD-20184) | |
| | CUST-39102    J. Miller    LN-0922   $890      34     |  |    "Agent: When can we expect PTP?" | |
| +-------------------------------------------------------+  +-------------------------------------+ |
|                                                                                                    |
| FOLLOW-UP SUGGESTIONS:                                                                             |
|  [> Show recommended NBA actions for these 42 customers]   [> How many have broken prior PTPs?]  |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | REFUSAL STATE EXAMPLE (Triggered on out-of-scope / protected attributes):                       | |
| | [ ! QUERY REFUSED BY GOVERNANCE GUARDRAILS ]                                                   | |
| | Reason: "Your query requested protected attributes ('ethnicity', 'marital_status'). Under our  | |
| | Fair Banking Data Charter and Collections Guardrails, demographic and protected attributes are| |
| | strictly barred from retrieval and model training."                                            | |
| | Suggested Compliant Alternative: "Query loan balances and delinquency stages by product type." | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

### 3.3 Components & Data Fields
1. **Search Bar & Starter Chips:**
   - Multi-line text input with auto-expand and clear button.
   - 5 Quick-query starter chips pre-populated from benchmark set.
2. **"Understood As" Semantic Filter Tokens:**
   - Parsed parameters returned by NLP: e.g. `{ key: "DPD", operator: "BETWEEN", value: [31, 60] }`.
   - Removable & clickable: removing a token re-executes query without manual prompt retyping.
3. **LLM Insight Summary Box:**
   - Narrative overview grounded strictly in query output rows.
4. **"How I Got This" SQL Drawer/Card:**
   - Validated DuckDB SELECT SQL query with syntax highlighting.
   - Allow-list confirmation badge, table dependencies list, execution duration (ms), limit tag.
5. **Results Grid:**
   - Dynamic columns based on returned SQL projection.
   - Client-side sorting, column filtering, and CSV download.
6. **RAG Citations Sidebar:**
   - Displayed when question touches notes or transcripts.
   - Cards showing: Document Type, ID, Customer Golden ID, Date, Snippet text with search term highlighted.
7. **Refusal Display Banner:**
   - Clear red/amber card when `refused: true`.
   - Distinct reason explanation, category (PII, Protected Attribute, DDL/Injection, Out of Scope), and remediation suggestion.
8. **Follow-Up Query Chips:**
   - Clickable suggestions that populate the search bar for continuous exploration.

### 3.4 States
- **Loading:** Step progress indicator: 1. Analyzing intent -> 2. Generating & validating SQL -> 3. Executing DuckDB query -> 4. Synthesizing insight.
- **Empty:** Clean landing screen with example prompts categorized by persona (Risk Manager, Frontline Agent, Auditor).
- **Refused State:** Non-intrusive yet unmistakable governance rejection card.
- **Error State:** Database execution error or timeout banner with technical details and retry.

### 3.5 API Calls Needed
- `POST /ask`:
  - Request: `{ query: string, filters?: Record<string, any> }`
  - Response: `{ answer: string, sql: string, tables_used: string[], understood_as: Token[], followups: string[], citations: Citation[], refused: boolean, refusal_reason: string | null, data?: any[] }`

---

## 4. Screen 3: Next Best Action (NBA) Queue (`/nba`)

### 4.1 Purpose & User Story
As a collections strategy manager or senior collector, I need a prioritized work queue of delinquent accounts, accompanied by explainable ML risk drivers (PTP break probability), system-recommended actions, and a human-in-the-loop approve/override workflow with mandatory vulnerability routing, so that we maximize cure rates ethically while adhering to strict compliance standards.

### 4.2 Wireframe Layout (Desktop 1440px)
```
+----------------------------------------------------------------------------------------------------+
| TOP NAV: [Apex Collections]  | C360 | Ask | NBA Queue (Active) | Governance |  [Quick Jump: CUST-01] |
+----------------------------------------------------------------------------------------------------+
| QUEUE METRICS HEADER:                                                                              |
|  Total Queue: 148 Accounts  |  High Break Risk: 38  |  Pending Review: 24  |  Hardship Routed: 12  |
|  Model: ptp_break_v1.2 (Trained 2026-09-25) | Features: 18 (0 Protected Attributes)                |
|                                                                                                    |
| CONTROLS: [Filter: Risk Tier v] [Filter: Treatment v] [Search Customer...]   [Sort: Risk Desc v]   |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | ACTIONABLE ACCOUNTS QUEUE                                                                      | |
| | Rank  Customer             Overdue   Break Prob.   Recommended Treatment  Channel  Timing Status | |
| |------------------------------------------------------------------------------------------------| |
| | #1    Eleanor Vance        $2,140    [||||||| 84%] Specialist Hardship   Phone    Urgent ROUTED | |
| |       GOLD-10492                     [! HARDSHIP FLAGGED: Auto-approval disabled]     TO SPEC    | |
| |                                                                                                | |
| | #2    Marcus Chen          $4,120    [||||||  72%] Restructure 3-Mo Plan  Email    10:00  PENDING| |
| |       GOLD-20184                     Drivers: High Card Util, Broken PTP           [Approve][Ovr]|
| |                                                                                                | |
| | #3    Sarah Jenkins        $890      [||||    48%] SMS Payment Reminder   SMS      14:30  PENDING| |
| |       GOLD-30419                     Drivers: First Delinquency, Good DPD          [Approve][Ovr]|
| |                                                                                                | |
| | #4    David K. Ross        $1,450    [||      22%] Digital App Push       App      18:00  APPR'D | |
| |       GOLD-40912                     Approved by Agent AG-44 on 2026-10-02 11:20                 | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | SLIDE-OVER EXPLANATION & OVERRIDE DRAWER (Opened upon clicking Account #2 Marcus Chen)          | |
| | Customer: Marcus Chen (GOLD-20184) | Exposure: $12,400 | Max DPD: 58 Days                      | |
| | Recommended Action: 3-Month Short-Term Payment Restructure (Expected Cure Improvement: +24%)   | |
| | Channel: Email + Secure Portal Link | Recommended Contact Window: Weekday Mornings             | |
| |                                                                                                | |
| | TOP 3 DECISION DRIVERS (Explainable AI - SHAP Values):                                         | |
| |  1. Multiple Broken PTPs (+31% risk): Broken 2 commitments in the last 60 days.                | |
| |  2. Credit Card Revolving Stress (+22% risk): Aggregate card utilization reached 94.2%.        | |
| |  3. Recent Positive Inbound (+8% cure): Customer reached out on Sep 26 requesting terms.        | |
| |                                                                                                | |
| | GOVERNANCE & FAIRNESS BADGE:                                                                   | |
| |  [x 0 Protected Attributes Used] [Model Audited for Segment Parity]                            | |
| |                                                                                                | |
| | HUMAN-IN-THE-LOOP ACTIONS:                                                                     | |
| |  [ Approve Treatment ]       [ Override Recommendation ]                                       | |
| |                                                                                                | |
| |  (If Override clicked -> Modal / Inline Expansion):                                            | |
| |   Select Override Reason: [ Customer requested alternative terms                      v ]      | |
| |   Select New Treatment:   [ Offer 6-Month Hardship Concession                          v ]      | |
| |   Specialist Rationale:   [ Customer verified job transition starting Nov 1. Rationale entered ]|
| |   [ Confirm Override & Log Audit ]    [ Cancel ]                                               | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

### 4.3 Hardship Safeguard & Governance Routing
- If an account has `hardship_flag = true` (or vulnerability detected via speech NLP), the UI:
  1. Displays an amber/red warning banner on the row: `ROUTED TO SPECIALIST — HUMAN REVIEW REQUIRED`.
  2. Disables the "Quick Approve" button to prevent automated algorithmic handling.
  3. Enforces that only an accredited hardship specialist can review and assign a relief program.

### 4.4 Data Fields & Components
1. **Queue Summary Bar:** Total accounts count, high-risk breakdown, pending approvals count, hardship case count, active model version and fairness validation tag.
2. **Prioritized Table:**
   - Columns: Priority Rank, Customer Name & Golden ID, Total Overdue, Break Probability (visual progress bar with color thresholds: <40% Green, 40-70% Amber, >70% Red `#C73E1D`), Recommended Treatment, Recommended Channel, Recommended Timing, Current Status (`pending`, `approved`, `overridden`, `routed_specialist`).
   - Interactive row click triggers the Explanation Drawer.
3. **Explanation Drawer (Slide-Over):**
   - Customer profile summary.
   - Recommended treatment and optimal contact window.
   - **Top 3 Plain-English Decision Drivers:** Formatted driver cards with directional contribution (+/- % impact on PTP break risk).
   - Model Lineage & Fairness Assertion: Model version ID, feature timestamp, confirmation that age/gender/ethnicity are excluded.
4. **Approval & Override Modals:**
   - "Approve": Instant optimistic UI status update with toast confirmation.
   - "Override": Mandatory modal requiring:
     - Reason dropdown (`Customer requested alternative`, `Dispute active`, `Temporary seasonal income`, `Settlement negotiated`, `Other`).
     - Alternative treatment selection.
     - Free-text specialist justification notes.
   - State rollback if backend API returns failure.

### 4.5 States
- **Loading:** Shimmer table with animated progress bars.
- **Empty:** "No pending decisions in this queue. All accounts reviewed!" with filter reset button.
- **Error:** "Failed to load Next Best Action queue. [Retry]".

### 4.6 API Calls Needed
- `GET /nba/queue`: Returns prioritized accounts with recommended treatments, break probabilities, top drivers, and status.
- `GET /nba/{decision_id}`: Fetches detailed explanation, top SHAP drivers, feature values, and recommendation metadata for the slide-over drawer.
- `POST /nba/{decision_id}/decision`:
  - Headers: `X-User-Role: agent | specialist | supervisor`, `X-User-Id: AG-0620`
  - Request (approve): `{"action": "approve"}`
  - Request (override): `{"action": "override", "reason": "Customer requested alternative terms", "new_treatment": "payment_plan"}`
  - Response: `{"decision_id": "NBA-0005", "status": "overridden", "final_treatment": "payment_plan", "reviewed_by": "AG-0711", "reviewed_at": "2026-10-02T09:40:00-04:00", "override_reason": "...", "audit_id": "AUD-0103"}`
  - Error: 409 `hardship_requires_specialist` when non-specialist role attempts decision on hardship case.

---

## 5. Screen 4: Governance & Trust Cockpit (`/governance`)

### 5.1 Purpose & User Story
As a risk executive, internal auditor, or compliance officer, I need an interactive governance portal that displays the formal data contract, data quality test results, an immutable audit log of all human and AI decisions, and verifiable proof that protected demographic attributes are strictly excluded from all features and models.

### 5.2 Wireframe Layout (Desktop 1440px)
```
+----------------------------------------------------------------------------------------------------+
| TOP NAV: [Apex Collections]  | C360 | Ask | NBA Queue | Governance (Active) |  [Quick Jump: CUST-01] |
+----------------------------------------------------------------------------------------------------+
| GOVERNANCE OVERVIEW TABS:                                                                          |
|  [Tab 1: Data Contract]  [Tab 2: Data Quality Report]  [Tab 3: Audit Log]  [Tab 4: Fairness & Trust]|
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | TAB 1 CONTENT: DATA CONTRACT VIEW (Rendered from contracts/data_contract.yaml)                 | |
| | Data Product: Collections 360 Golden Record (c360_gold)        Version: 1.0.0                  | |
| | Owner: Collections Data Platform Team                         Status: Certified Active         | |
| | Freshness SLA: Daily batch update (T+1 04:00 EST)             Security: Internal Restricted    | |
| |                                                                                                | |
| | ALLOWED & PROHIBITED USE POLICIES:                                                             | |
| |  [x ALLOWED] Collections contact prioritization and channel selection                          | |
| |  [x ALLOWED] Early intervention hardship assistance and payment arrangement structuring        | |
| |  [! PROHIBITED] Automated credit limit revocation without human review                         | |
| |  [! PROHIBITED] Use of demographic or protected attributes for collections segmentation       | |
| |                                                                                                | |
| | SCHEMA CATALOG & PII CLASSIFICATION:                                                           | |
| | Column Name        Data Type   Null%   PII Tier        Allowed in Models?  Quality Rule Applied| |
| | customer_id        VARCHAR     0%      Internal Key    No (ID only)        Primary Key, Unique | |
| | total_overdue_amt  DECIMAL     0%      Financial       Yes                 Value >= 0          | |
| | max_dpd            INTEGER     0%      Operational     Yes                 Range: [0, 365]     | |
| | hardship_signal    BOOLEAN     0%      Sensitive       Specialist Only     Boolean Valid       | |
| | ssn_sin_excluded   VARCHAR     0%      Confidential    STRICTLY BANNED     Excluded from Gold  | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | TAB 2 CONTENT: DATA QUALITY REPORT (Live Assertions)                                           | |
| | Overall DQ Score: 99.4% Passed   |  Total Tests Run: 48 Rules  |  Failed: 0  |  Warnings: 1     | |
| | Status: [ ALL CONTRACT ASSERTIONS PASSING - CERTIFIED HEALTHY ]                                | |
| |                                                                                                | |
| | Rule Name             Target Table     Type           Rows Scanned   Pass/Fail   Last Run      | |
| |------------------------------------------------------------------------------------------------| |
| | pk_customer_unique    gold_c360        Uniqueness     25,000         PASS (100%) 10m ago       | |
| | dpd_range_check       curated_loans    Range [0,365]  34,200         PASS (100%) 10m ago       | |
| | foreign_key_integrity gold_to_curated  Ref Integrity  25,000         PASS (100%) 10m ago       | |
| | contact_freshness_7d  contact_history  Freshness      12,040         WARN (98.2%) 10m ago      | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | TAB 3 CONTENT: AUDIT LOG (Immutable Decision Trail)                                             | |
| | Filter: [Action Type: All v]  [Actor: All v]  [Date Range: Last 7 Days v]  [Search Account ID] | |
| |                                                                                                | |
| | Timestamp        Account ID    Actor/Agent   Action      Reason / Details             Model Ver| |
| |------------------------------------------------------------------------------------------------| |
| | 2026-10-02 11:20 GOLD-40912    Agent AG-44   APPROVE     SMS Payment Reminder accepted ptp-v1.2| |
| | 2026-10-02 10:45 GOLD-20184    Agent AG-12   OVERRIDE    Reason: Customer requested    ptp-v1.2| |
| |                                                           alt terms (6-mo restructure)         | |
| | 2026-10-02 09:15 GOLD-10492    SYSTEM_GUARD  ROUTED_SPEC Hardship detected; bypassed  ptp-v1.2| |
| |                                                           auto-queue for specialist            | |
| +------------------------------------------------------------------------------------------------+ |
|                                                                                                    |
| +------------------------------------------------------------------------------------------------+ |
| | TAB 4 CONTENT: FAIRNESS & RESPONSIBLE AI CERTIFICATION                                         | |
| | 1. PROTECTED ATTRIBUTES EXCLUSION CERTIFICATE:                                                 | |
| |    Status: VERIFIED ZERO DEMOGRAPHIC BIAS BY DESIGN                                            | |
| |    The following protected attributes are mathematically excluded from feature stores & models:| |
| |    - Age / Date of Birth          [ EXCLUDED - Test: test_no_protected_attrs PASS ]            | |
| |    - Gender / Pronouns            [ EXCLUDED - Test: test_no_protected_attrs PASS ]            | |
| |    - Ethnicity / Race / Language  [ EXCLUDED - Test: test_no_protected_attrs PASS ]            | |
| |    - Religion / Marital Status    [ EXCLUDED - Test: test_no_protected_attrs PASS ]            | |
| |    - Postal Code / FSA Geo Proxy  [ EXCLUDED - Test: test_no_protected_attrs PASS ]            | |
| |                                                                                                | |
| | 2. HUMAN-IN-THE-LOOP (HITL) METRICS:                                                           | |
| |    - Total System Recommendations: 1,420                                                       | |
| |    - Human Approval Rate: 87.2% (1,238 accounts)                                               | |
| |    - Human Override Rate: 12.8% (182 accounts) -> Active oversight confirmed                   | |
| |    - Specialist Hardship Escalations: 54 accounts (100% human-managed)                         | |
| +------------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

### 5.3 Data Fields & Components
1. **Tab Navigation:** Seamless switching between `Data Contract`, `Data Quality Report`, `Audit Log`, and `Fairness & Controls`.
2. **Data Contract Viewer:**
   - Clean card-based visual rendering of YAML contract structure.
   - Metadata badges: Owner, SLA, Freshness, Version.
   - Allow / Prohibit policy cards.
   - Interactive Schema Table with PII and Model-eligibility indicators.
3. **Data Quality Report:**
   - Summary statistics cards: Overall Score %, Total Assertions, Pass/Fail count.
   - Table of all executed rules: Rule ID, Table, Assertion Type (Uniqueness, Non-Null, Referential Integrity, Range, Freshness), Pass Rate %, Execution Timestamp.
4. **Audit Trail Table:**
   - Timestamp, Customer Golden ID, Actor (Agent ID or System Rule), Event Type (`APPROVE`, `OVERRIDE`, `ROUTED_SPECIALIST`, `SQL_EXECUTED`, `QUERY_REFUSED`), Reason text, Model Version.
   - Search and date filter controls.
5. **Fairness & Controls Panel:**
   - "Protected Attributes Excluded" proof checklist with links to automated unit test status.
   - Human-in-the-loop metrics (Approval rate, Override rate, Vulnerability triage counts).

### 5.4 States
- **Loading:** Multi-section tab skeleton loaders.
- **Empty:** Contextual empty state for audit log search if no records match criteria.
- **Error:** "Failed to load governance records. [Retry Button]".

### 5.5 API Calls Needed
- `GET /governance/contract`: Fetches parsed data contract schema, owner, policies, and PII tags.
- `GET /dq/report`: Fetches latest data quality assertion results, pass rates, and failure counts.
- `GET /governance/audit`: Fetches paginated decision audit log entries with filter parameters.
- `GET /governance/fairness`: Fetches model feature exclusion certificates and HITL statistics.

---

## 6. Comprehensive API Call Matrix

| Screen | Endpoint | HTTP Method | Request Body / Query Params / Headers | Response Objects / Keys |
|---|---|---|---|---|
| **C360** | `/customers/{golden_id}/c360` | `GET` | `golden_id` (path) | `{ golden_id, display_name, segment, province, preferred_language, customer_since, consent: {}, summary: {}, products: [], contact_timeline: [], identity: {}, quality: [], break_prob, current_decision_id }` |
| **C360** | `/transcripts/{transcript_id}` | `GET` | `transcript_id` (path) | `{ transcript_id, golden_id, customer_name, channel, timestamp, agent_id, turns: [{ speaker, text }], key_phrases: [], hardship_detected }` |
| **Ask** | `/ask` | `POST` | Body: `{"question": string, "context"?: {"golden_id": string}}` | `{ question, answer, sql, tables_used, understood_as: [], columns: [], rows: [[]], row_count, followups: [], citations: [], refused: boolean, refusal_reason: string \| null, route: string }` |
| **NBA** | `/nba/queue` | `GET` | `status`, `treatment`, `hardship_only`, `page`, `page_size` | `{ items: [{ decision_id, golden_id, display_name, products: [], bucket, max_dpd, total_overdue, break_prob, top_reason, treatment, channel, recommended_time, requires_specialist, status, hardship_flag }], total, page, page_size }` |
| **NBA** | `/nba/{decision_id}` | `GET` | `decision_id` (path) | `{ decision_id, golden_id, display_name, bucket, max_dpd, break_prob, treatment, channel, recommended_time, requires_specialist, status, hardship_flag, explanation, drivers: [], consent: {}, model_version }` |
| **NBA** | `/nba/{decision_id}/decision` | `POST` | Headers: `X-User-Role`, `X-User-Id`<br>Body: `{"action": "approve"}` or `{"action": "override", "reason": string, "new_treatment": string}` | `{ decision_id, status, final_treatment, reviewed_by, reviewed_at, override_reason, audit_id }`<br>*(Throws 409 `hardship_requires_specialist` if role != specialist on hardship accounts)* |
| **Governance** | `/governance/contract` | `GET` | None | `{ product_name, version, owner, freshness_sla, allowed_uses: [], prohibited_uses: [], schema: [] }` |
| **Governance** | `/dq/report` | `GET` | None | `{ dataset, run_at, contract_version, summary: {}, row_counts: {}, rules: [], schema_drift: [], identity_resolution: {} }` |
| **Governance** | `/governance/audit` | `GET` | `decision_id`, `golden_id`, `event`, `page`, `page_size` | `{ items: [{ audit_id, at, event, decision_id, golden_id, actor, actor_role, model_version, detail, outcome }], total, page, page_size }` |
| **Governance** | `/governance/fairness`| `GET` | None | `{ model_version, audit_date, protected_attributes_excluded: [], demographic_parity_tests: [], hitl_metrics: {} }` |

---

## 7. Accessibility, Visual Hierarchy & Device Readiness

1. **Accessibility Standards (WCAG 2.1 AA):**
   - High contrast ratios: Navy text (`#141B2D`) on Cream (`#F6F2EA`) exceeds `14:1` (far above the `4.5:1` minimum).
   - Red-Orange alert text (`#C73E1D`) paired with white background maintains `5.2:1` contrast ratio.
   - Screen-reader labels (`aria-label`) on all icon-only buttons (copy SQL, expand drawer, filter chips).
   - Full keyboard navigation: Visual focus rings (`focus:ring-2 focus:ring-[#141B2D]`) on all interactive controls, table rows, and modals.
2. **Device Width Optimization:**
   - **375px (Mobile Phone):** Single-column stacked cards, full-width buttons, horizontal scroll for tables with sticky customer column, touch-friendly tap targets (>44x44px).
   - **768px (Tablet):** 2-column dashboard layout with collapsible side drawer.
   - **1280px+ (Desktop):** Full-density operational workstation with side-by-side lineage and explanation panels.
3. **Data Integrity & Mock Switching:**
   - Every UI component consumes data strictly from `/frontend/src/api.ts`.
   - Toggle `VITE_USE_MOCK=true` serves exact JSON contract matches from `/contracts/mock/*.json`.
   - Switching `VITE_USE_MOCK=false` requires zero UI changes; contracts dictate wire shapes.
