# ARGUS — Team Ownership & Development Guidelines
# Developer: Aman — Backend 2

- **Developer:** Aman
- **Role:** Backend Developer 2 (AI, Multi-Agent Coordination & Intelligence Layer)
- **Active Git Branch:** `aman/backend-2`
- **Repository:** `ARGUS`

---

## 1. Ownership & Assigned Areas

Aman owns the artificial intelligence, multi-agent investigation swarm, and institutional intelligence layer:

### AI Routing & Intent Classification
- **AI Router:** Incoming inquiry analysis and dynamic dispatch.
- **Classification Engine:** Categorization of customer complaints (e.g. Billing Duplicate, Delivery GPS Drift, Expired Lot, High-Value Return Deficit).
- **Routing Logic:** Deterministic routing between automated FAQ resolution and multi-agent deep-dive investigation.

### FAQ & RAG Knowledge Retrieval
- **Knowledge Retrieval:** Semantic and keyword search across approved policy documents, SOPs, and SLAs.
- **RAG Architecture:** Vector embeddings, chunk retrieval, knowledge ranking, and hallucination-free answer generation with approved source citations.

### Specialized Investigation Agents
- **Billing Agent:** Financial ledger checks, Stripe/PayPal payment capture audits, double-dip invoice detection, escrow validation.
- **Order Agent:** OMS state verification, inventory reservations, license pool allocation, fulfillment status.
- **Technical Agent:** Distributed lock TTL verification, server cron race condition diagnostics, Vision OCR label verification, carrier GPS telemetry analysis, warehouse scale hardware sensor checks.
- **Specialized Domain Agents:** Return Inspection Agent, Carrier Dispute Agent, Seller Compliance Agent.

### Multi-Agent Orchestration & Consensus
- **Coordinator Agent:** Parallel DAG workflow orchestration, inter-agent state synchronization, consensus aggregation, and confidence score calculation.
- **Investigation State Machine:** Sequential stage transitions (`Ingestion` → `Classification` → `Agents Assigned` → `Evidence Retrieved` → `Investigation` → `Contradiction Check` → `Root Cause` → `Resolution` → `Escalation`).

### Investigation Intelligence & Safeguards
- **Contradiction Detection Engine:** Neutral discrepancy detection between customer assertions and physical telemetry with explicit *"Contradiction ≠ Proof of Fraud"* safeguards.
- **Root Cause Engine:** Deterministic fault tree isolation (*Evidence → Finding → Root Cause*).
- **Resolution Engine:** Formulation of customer-facing explanations and internal remediation actions (e.g. instant refunds, DLQ replays, inventory quarantines).
- **Human Escalation Logic:** Automatic escalation triggers when confidence drops below consensus threshold or exposure exceeds dollar auto-resolve caps.

### Longitudinal Case Intelligence
- **Case Memory:** Vector memory indexing of resolved cases and longitudinal customer reliability indexing.
- **Pattern Detection Engine:** Cross-case correlation across sellers (e.g. expired batches), delivery carriers (e.g. spatial geofence drift), payment gateways (e.g. 504 timeouts), and warehouse bins.
- **Prevention Recommendations:** Formulation of systemic rule interventions and adaptive dynamic evidence protocols.

---

## 2. Directory & File Boundaries

### Primary Files & Directories Owned by Aman
```text
backend/
├── ai/                    # AI Router, intent classifier, RAG retrieval, vector search
├── agents/                # BillingAgent, OrderAgent, TechnicalAgent, CoordinatorAgent
├── intelligence/          # ContradictionDetector, RootCauseEngine, ResolutionEngine,
│                          # PatternDetector, CaseMemory, PreventionEngine
└── workflows/             # LangGraph / DAG multi-agent state graph definitions
```

### Files & Directories to AVOID Modifying
- **Frontend Codebase:** `src/` (components, pages, views, styles).
- **Core Database Tables & Migrations:** Owned by AmanSR (Backend 1).
- **Core API Server Infrastructure:** FastAPI setup and base routes owned by AmanSR.

---

## 3. Integration Boundaries & Rules

1. **Backend 1 (AmanSR) Integration:**
   - Aman writes agent intelligence logic that consumes models and database sessions established by AmanSR.
   - Do NOT unilaterally modify SQLAlchemy base models, migrations, or database connection pools without alignment.
2. **Frontend 1 (Anxhu) Integration:**
   - Expose agent findings, execution metrics, timeline events, and contradiction analysis through standard schemas so Anxhu's DAG and Evidence UI can render them accurately.
3. **No UI in Backend:**
   - Keep all agent logic decoupled from UI markup. All agent responses must be structured JSON payloads.

---

## 4. Git & Workflow Standards

- **Branch:** `aman/backend-2`
- **Workflow:** Branch from `main` → Implement AI/Agent logic → Test unit outputs → Review diff → Commit with descriptive message → Push to `origin/aman/backend-2` → Open PR into `main`.
