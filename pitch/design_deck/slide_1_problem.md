# Slide 1: The Problem & The Solution

**Topic:** From 9 Fragmented Systems to One Governed Collections Cockpit  
**Target Audience:** Hackathon Judges, Collections Operations Executives, Risk Governance  

---

### The Frontline Collections Problem
- **Data Fragmentation Across 9 Systems:** Frontline collections agents must juggle core banking records, card accounts, unsecured loan ledgers, dialer logs, collections CRM, external bureau feeds, and audio notes.
- **Wasted Capacity & High Handle Time:** Call handle times average ~10 minutes, with over 3 minutes lost navigating disparate legacy systems to identify customer exposure (assumed baseline hypothesis).
- **High Broken Commitments:** A 40% Promise-to-Pay (PTP) break rate (assumed baseline) results from uncoordinated, aggressive, or mistimed outreach.
- **Vulnerability Blind Spots:** Crucial customer hardship disclosures (medical distress, job loss, family bereavement) buried in agent notes or call transcripts go unnoticed.

---

### Our Solution: One Governed Vertical Slice
- **Layer 1 (Data Product Factory):** Unifies raw sources into a certified **Collections 360 (C360)** Golden Customer Record with automated identity matching and data contract validation.
- **Layer 2 (Insight & NLP):** **"Collections Ask"** natural-language conversational interface that executes audited DuckDB SQL, cites unstructured transcripts via RAG, and enforces strict query refusal boundaries.
- **Layer 3 (AI Decisioning):** **Next Best Action (NBA)** engine pairing a LightGBM PTP break risk model with plain-English SHAP explanations, automated hardship routing, and human-in-the-loop approve/override workflows.
- **Universal Governance:** Data contracts, zero demographic bias, hardship circuit breakers, and immutable audit logging running through every layer.
