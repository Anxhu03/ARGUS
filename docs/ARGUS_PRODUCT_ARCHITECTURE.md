# ARGUS — Product Architecture & System Specification

**Document Version:** 1.0.0 (Phase 1 Baseline)  
**Author:** Principal Software Architect & Technical Lead  
**Repository:** [ARGUS (github.com/Anxhu03/ARGUS)](https://github.com/Anxhu03/ARGUS)  
**Target Audience:** Solo Developer, Engineering Reviewers, and System Integrators  
**Status:** Approved Technical Blueprint  

---

## 1. Product Overview & Vision

**ARGUS** is an autonomous, AI-powered customer support investigation and case intelligence platform. Traditional e-commerce and enterprise customer support systems rely on shallow conversational chatbots that hallucinate policies, frustrate users with circular scripts, and cannot verify external operational records.

ARGUS decouples support into two distinct, specialized operational engines:
1. **FAQ & Knowledge Retrieval Engine:** Immediate, direct retrieval of approved policies, guidelines, and transactional procedures for deterministic answers.
2. **Autonomous Multi-Agent Investigation Engine:** A deterministic, multi-agent directed acyclic graph (DAG) that ingests complex disputes, audits distributed system telemetry (payment gateways, order management systems, warehouse scans, carrier GPS, and message queues), cross-examines evidence, isolates root causes, and formulates verified resolutions or human escalations.

### Core Architectural Principles

- **No Hallucinated Records:** Agents only assert facts backed by cryptographic, database, or API evidence. If evidence is missing, the system marks it as `UNVERIFIED` or requests data.
- **Deterministic Consensus over Free-Form Chat:** Agents run structured tasks in parallel and feed structured findings into a consensus coordinator.
- **Ethical Safeguard (*Contradiction ≠ Proof of Fraud*):** Discrepancies between customer statements and physical telemetry are flagged neutrally as contradictions for investigation, never as ad-hominem fraud accusations.
- **Continuous Intelligence Feedback Loop:** Every resolved case feeds institutional memory, generating cross-case pattern detection and systemic prevention rules.

---

## 2. Dual Support Workflows

The platform unifies customer assistance under the **Support Intelligence Hub** (`SupportView.jsx`) while strictly separating direct information retrieval from autonomous case investigation:

```
                                  [ CUSTOMER SUPPORT INTAKE ]
                                               │
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
         [ WORKFLOW A: FAQ KNOWLEDGE BASE ]             [ WORKFLOW B: ARGUS AI AGENT ]
                       │                                               │
             Simple / Repetitive                             Complex / Disputed
         (Policies, Times, How-Tos)                     (Missing Orders, Sync Latency, Refunds)
                       │                                               │
                       ▼                                               ▼
              Vector / Hybrid Search                         Case & Complaint Intake
                       │                                               │
                       ▼                                               ▼
               Approved Articles                             Investigation Coordinator
                       │                                               │
                       ▼                                 ┌─────────────┼─────────────┐
              Direct Response & Cited Sources            ▼             ▼             ▼
                                                   Billing Agent  Order Agent  Tech Agent
                                                         │             │             │
                                                         └─────────────┼─────────────┘
                                                                       │
                                                                       ▼
                                                              Evidence Verification
                                                                       │
                                                                       ▼
                                                            Root Cause Diagnosis
                                                                       │
                                                                       ▼
                                                       Resolution / Human Escalation
```

### Workflow A: FAQ — Direct Information Retrieval
- **Objective:** Instant answer resolution for non-investigative, informational queries.
- **Typical Queries:**
  - *"What is your refund policy window for open-box electronics?"*
  - *"How do I initiate a return label for an international order?"*
  - *"Which payment methods are eligible for instant store credit?"*
- **Mechanism:** User keyword/semantic query $\rightarrow$ Vector similarity & BM25 keyword search over `knowledge_sources` $\rightarrow$ Return curated, approved snippet with cited source documentation.

### Workflow B: ARGUS AI Agent — Multi-System Investigation
- **Objective:** Deep factual diagnosis for cross-system customer disputes.
- **Typical Dispute:**
  - *"My credit card was charged $199 on Friday, but my order status still shows 'Payment Pending' and no tracking number has been sent."*
- **Mechanism:** Structured intake $\rightarrow$ Case creation (`CasesStore`) $\rightarrow$ Coordinator DAG kicks off Billing, Order, and Technical Agents in parallel $\rightarrow$ Evidence matrix assembled $\rightarrow$ Statement vs. Telemetry cross-check $\rightarrow$ Root cause isolated $\rightarrow$ Automated remedy or Human Escalation.

---

## 3. The 25 Platform Modules

| # | Module Name | Primary User | Required UI Surfaces | Backend Capabilities | Data Dependencies | Implementation Priority |
| :- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Application Shell** | All Users | `AppShell.jsx`, `TopBar.jsx`, `Sidebar.jsx` | Session validation, route authorization | User profile, active notifications | **P0 (Complete in UI)** |
| **2** | **Main Dashboard** | Ops Lead / Manager | `DashboardView.jsx` | KPI metric aggregations, 7-day velocity series, activity streaming | Cases, Investigations, KPIs | **P0 (Complete in UI)** |
| **3** | **Support Intelligence Hub** | Customer / Agent | `SupportView.jsx` | Mode switcher (`faq` vs `agent`), category filter | FAQ search, case creation endpoint | **P0 (Complete in UI)** |
| **4** | **FAQ Knowledge Base** | Customer / Agent | `SupportView.jsx`, `FAQDetailModal.jsx` | Full-text & vector similarity search | `faq_entries`, `knowledge_sources` | **P1 (High)** |
| **5** | **ARGUS AI Agent Launcher** | Customer / Ops | `SupportView.jsx` (Agent tab) | Intake validation, payload simulation, case spawning | OMS orders, customer identity | **P1 (High)** |
| **6** | **Complaint Submission** | Customer / User | `SupportView.jsx`, Customer Portal | File attachment upload, complaint categorization | `complaints`, `customers` | **P1 (High)** |
| **7** | **Case Management** | Support Lead | `CasesListView.jsx` | Filtered pagination (status, category, priority, search) | `cases`, `customers` | **P0 (Complete in UI)** |
| **8** | **Investigation Workspace** | Investigator / Lead | `CaseDetailView.jsx`, `CaseHeader.jsx` | Master case state, multi-tab coordination, re-run trigger | Full Case Entity Graph | **P0 (Complete in UI)** |
| **9** | **Agent Activity Telemetry** | Investigator / Lead | `AgentVisualizationGraph.jsx`, `AgentDetailModal.jsx` | Parallel execution telemetry, agent logs, latency tracking | `agent_runs`, `agents_data` | **P0 (Complete in UI)** |
| **10** | **Billing Investigation** | Billing Agent / Ops | `AgentDetailModal.jsx`, `EvidenceMatrix.jsx` | Payment gateway query (Stripe/PayPal), escrow validation | `payments`, Gateway logs | **P1 (High)** |
| **11** | **Order Investigation** | Order Agent / Ops | `AgentDetailModal.jsx`, `EvidenceMatrix.jsx` | OMS state machine audit, WMS queue validation, carrier GPS | `orders`, WMS telemetry | **P1 (High)** |
| **12** | **Technical Investigation** | Tech Agent / SRE | `AgentDetailModal.jsx`, `EvidenceMatrix.jsx` | Ingress trace inspection, Kafka/RabbitMQ consumer lag, DLQ scan | System traces, application logs | **P1 (High)** |
| **13** | **Evidence Management** | Investigator / Auditor | `EvidenceMatrix.jsx` | Cryptographic SHA-256 verification, raw JSON viewer | `evidence`, storage bucket | **P0 (Complete in UI)** |
| **14** | **Contradiction Detection** | Investigator / SRE | `ContradictionCard.jsx` | Statement vs telemetry matrix, conflict classification | Evidence records, customer claims | **P1 (High)** |
| **15** | **Root Cause Analysis** | Investigator / SRE | `RootCauseCard.jsx` | Causal chain inference (*Evidence $\rightarrow$ Finding $\rightarrow$ Root Cause*) | Agent findings, consensus score | **P1 (High)** |
| **16** | **Resolution Management** | Support Lead / Ops | `ResolutionCard.jsx` | Automated customer communication, transactional rollback | System webhooks, email/SMS gateway | **P1 (High)** |
| **17** | **Human Escalation Review** | Senior Ops Specialist | `EscalationCard.jsx` | Specialist override, evidence requests, formal carrier dispute | Escalation queues, audit logs | **P1 (High)** |
| **18** | **Customer Case History** | Support Agent | `CaseDetailView.jsx` (Memory tab) | Historical case retrieval, resolution tracking | Past `cases`, `resolutions` | **P1 (High)** |
| **19** | **Case Intelligence** | Ops Lead / Analyst | `IntelligenceView.jsx` | Institutional memory search, cross-case aggregation | Historical vector embeddings | **P2 (Medium)** |
| **20** | **Pattern Detection** | Ops Lead / Analyst | `IntelligenceView.jsx` | Anomaly clustering (Carrier, Seller, Product, Payment, System) | Aggregated case attributes | **P2 (Medium)** |
| **21** | **Complaint Reliability** | Risk Analyst | `CaseHeader.jsx`, `IntelligenceView.jsx` | Objective reliability band scoring based on verified evidence | Historical dispute veracity | **P2 (Medium)** |
| **22** | **Fraud Risk Signals** | Risk Officer | `ContradictionCard.jsx`, `SettingsView.jsx` | Neutral anomaly indicators, delivery spatial mismatch flags | Spatial & behavioral heuristics | **P2 (Medium)** |
| **23** | **Dynamic Evidence Protocol**| Risk / Ops Lead | `IntelligenceView.jsx` | Adaptive proof requirement tiers (Tier 1 to Tier 4) | Customer score, order value | **P2 (Medium)** |
| **24** | **Prevention Recommendations**| Ops Lead / Product | `IntelligenceView.jsx` | Actionable policy toggle sync, engineering alerting | Detected pattern clusters | **P2 (Medium)** |
| **25** | **Settings & Configuration** | System Admin | `SettingsView.jsx` | Tuning thresholds (consensus %, dollar caps, spatial tolerance) | Platform configuration store | **P0 (Complete in UI)** |

---

## 4. System Architecture

ARGUS is designed as a maintainable, high-performance modular monolith appropriate for a solo engineer, avoiding fragile distributed microservices while cleanly separating the React frontend from the Python async backend.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     ARGUS FRONTEND (React SPA)                                   │
│  Vite Dev Server (Port 3000) • AppShell • Context Store (AppContext) • Clean Async Client (api.js)│
└────────────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                                 │ HTTPS / JSON REST & SSE
                                                 ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 ARGUS BACKEND API (Python FastAPI)                               │
│                                                                                                  │
│  ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────────────────┐  │
│  │   API Route Layer      │  │  Pydantic V2 Schemas   │  │   Auth & Security Middleware       │  │
│  │  /api/v1/cases         │  │  CaseResponse, Findings│  │   Bearer JWT, Role-Based Access    │  │
│  │  /api/v1/investigations│  │  EvidencePayload       │  │   CORS & Rate Limiter              │  │
│  │  /api/v1/support/faq   │  │  ResolutionPlan        │  │   Audit Logging Context            │  │
│  └───────────┬────────────┘  └────────────────────────┘  └────────────────────────────────────┘  │
│              │                                                                                   │
│              ▼                                                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                     ARGUS Multi-Agent Orchestrator (Async Python DAG)                      │  │
│  │                                                                                            │  │
│  │   Investigation Coordinator (Issue Triage & Task Partitioning)                             │  │
│  │     ├── Billing Agent (Stripe API / Gateway Ledger Inspection)                             │  │
│  │     ├── Order Agent (OMS State Machine / WMS Hold / Carrier Scans)                         │  │
│  │     └── Technical Agent (Ingress Telemetry / Kafka Lag / DLQ Inspection)                   │  │
│  │                                                                                            │  │
│  │   Evidence Verification & Cross-Examination Engine                                         │  │
│  │     ├── Statement vs. Telemetry Contradiction Matrix                                       │  │
│  │     └── Deterministic Root Cause Synthesizer                                               │  │
│  └───────────────────────────────────────────┬────────────────────────────────────────────────┘  │
│                                              │                                                   │
│                                              ▼                                                   │
│  ┌────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                          Persistence & Knowledge Layer (SQLAlchemy)                        │  │
│  │                                                                                            │  │
│  │   PostgreSQL / SQLite  •  SQLAlchemy Async ORM  •  Alembic Migrations                      │  │
│  │   Full-Text / Vector Store (pgvector / Chroma) for FAQ RAG & Institutional Memory          │  │
│  └────────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 4.1 Frontend Architecture
- **Framework:** React 18.3.1 with Vite bundler.
- **Routing:** Controlled SPA view orchestration via `AppContext.jsx` (`currentView`), supporting deep linking via URL parameters in Phase 2.
- **Design System:** Pure Vanilla CSS design tokens (`src/index.css`), avoiding heavyweight runtime CSS-in-JS dependencies while providing high-contrast dark SaaS aesthetics, custom SVG data visualizations, and glassmorphic panels.
- **Service Abstraction:** `src/services/api.js` exposes clean async promises. It currently reads from `mockData.js` and will seamlessly switch to HTTP fetch calls against `http://localhost:8000/api/v1` via environment configuration.

### 4.2 Backend Architecture
- **Framework:** Python 3.11+ with **FastAPI**.
  - *Rationale for Solo Developer:* FastAPI provides out-of-the-box asynchronous route execution, automated OpenAPI documentation (`/docs`), strict Pydantic v2 validation, and native compatibility with AI/LLM orchestration libraries.
- **Directory Structure:**
  ```
  backend/
  ├── app/
  │   ├── api/
  │   │   └── v1/
  │   │       ├── endpoints/
  │   │       │   ├── cases.py
  │   │       │   ├── investigations.py
  │   │       │   ├── support.py
  │   │       │   ├── intelligence.py
  │   │       │   └── settings.py
  │   │       └── router.py
  │   ├── core/
  │   │   ├── config.py             # Pydantic BaseSettings (.env loader)
  │   │   ├── security.py           # JWT password hashing & token verification
  │   │   └── database.py           # Async SQLAlchemy session factory
  │   ├── models/                   # SQLAlchemy ORM entity models
  │   ├── schemas/                  # Pydantic request & response models
  │   ├── agents/                   # Multi-agent worker logic
  │   │   ├── coordinator.py
  │   │   ├── billing_agent.py
  │   │   ├── order_agent.py
  │   │   ├── tech_agent.py
  │   │   └── consensus_engine.py
  │   └── services/                 # Business logic, RAG retrieval, evidence hashing
  ├── tests/                        # Pytest suite
  ├── requirements.txt
  └── main.py                       # FastAPI ASGI entrypoint
  ```

### 4.3 AI Orchestration & Multi-Agent Engine
- **No Infinite Agent Loops:** Agent workflows are executed as a deterministic DAG, not an unbounded conversational loop.
- **Parallel Dispatch:** Once the Investigation Coordinator classifies the complaint, it deploys the Billing, Order, and Technical agents concurrently using `asyncio.gather()`.
- **Structured Findings:** Every agent must return a validated Pydantic model (`AgentFinding`) containing:
  - `confidence_score` (Float between 0 and 100)
  - `empirical_facts` (List of verified database/API assertions)
  - `evidence_references` (List of cryptographic evidence IDs)
  - `anomalies_detected` (List of identified discrepancies)

---

## 5. Security, Error Handling & Governance

### 5.1 Evidence Integrity
- Every evidentiary document, telemetry log, or customer attachment ingested into ARGUS is assigned a SHA-256 cryptographic digest at intake.
- The raw payload is stored immutably in an evidence repository, preventing retroactive tampering during dispute resolution.

### 5.2 Structured Logging & Observability
- All incoming requests, agent runs, and state transitions are tagged with a unique `X-Trace-ID`.
- Logs are emitted in structured JSON format:
  ```json
  {
    "timestamp": "2026-10-04T18:00:00Z",
    "trace_id": "tr-arg-1042-991",
    "level": "INFO",
    "component": "OrderAgent",
    "case_id": "ARG-1042",
    "action": "OMS_STATUS_CHECK",
    "status": "COMPLETED",
    "duration_ms": 310
  }
  ```

### 5.3 Environment Variables & Configuration
- All configurable parameters are decoupled into an environment configuration schema (`.env` backed by `.env.example`):
  - `ARGUS_ENV`: `development` | `staging` | `production`
  - `ARGUS_API_PORT`: `8000`
  - `ARGUS_DATABASE_URL`: `sqlite+aiosqlite:///./argus.db` (local dev) or `postgresql+asyncpg://...` (prod)
  - `ARGUS_JWT_SECRET`: Secure 256-bit string
  - `ARGUS_LLM_PROVIDER`: `mock` | `openai` | `anthropic` | `gemini`
  - `ARGUS_AUTO_RESOLVE_LIMIT`: Numeric threshold (default: `$150.00`)
  - `ARGUS_CONSENSUS_THRESHOLD`: Percentage threshold (default: `90.0%`)
