# ARGUS — Phase 0: Repository Audit & Technical Assessment

**Audit Date:** October 2026  
**Auditor / Technical Lead:** Senior Full-Stack Engineer  
**Repository:** [ARGUS (github.com/Anxhu03/ARGUS)](https://github.com/Anxhu03/ARGUS)  
**Branch:** `anxhu/argus-phase-0`  
**Current Commit Baseline:** `35fabf1` (Merge pull request #1 from Anxhu03/anxhu/frontend-1)

---

## 1. Executive Summary

**ARGUS** is an AI-powered customer support investigation and case intelligence platform designed to replace fragile chatbot interactions with autonomous multi-agent dispute diagnostics, empirical evidence verification, neutral contradiction detection, and systemic prevention intelligence.

This Phase 0 audit establishes an exhaustive architectural baseline of the repository, evaluates its health and build stability, cross-references existing assets against the 19 core platform capabilities, and outlines a structured development roadmap for solo-developer execution.

---

## 2. Existing Architecture & Directory Map

### 2.1 Technology Stack Discovered

| Layer | Technology | Version | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | `18.3.1` | Active, fully implemented |
| **Build Tooling** | Vite | `5.4.11` / `5.4.21` | Configured on port `3000` |
| **UI Styling** | Vanilla CSS (Design Tokens) | Custom | `src/index.css` (850+ lines) |
| **Iconography** | Lucide React | `^0.460.0` | Comprehensive icons in use |
| **State Management** | React Context (`AppContext`) | Custom | Global view & case state |
| **Service Layer** | Async Client (`api.js`) | Custom | In-memory mock store with simulated latency |
| **Backend API** | *None* | — | Not yet implemented in repository |
| **Database / ORM** | *None* | — | In-memory client storage only |
| **Authentication** | *None* | — | Hardcoded operator context |
| **Automated Tests** | *None* | — | No test runner configured |

### 2.2 Complete Repository Tree

```
d:/ARGUS/
├── .gitignore                          # Standard Vite ignore (node_modules, dist, *.local)
├── index.html                          # Entry HTML with Outfit, Inter, JetBrains Mono Google fonts
├── package.json                        # Frontend dependencies & build scripts
├── package-lock.json                   # Deterministic lockfile
├── vite.config.js                      # Vite React plugin, port 3000, host: true
├── Alok_Frontend_2.md                  # Team reference placeholder (unmodified)
├── AmanSR_backend_1.md                 # Team reference placeholder (unmodified)
├── Aman_backend_2.md                   # Team reference placeholder (unmodified)
├── Anxhu_Frontend_1.md                 # Frontend 1 milestone & architecture documentation
├── docs/                               # Phase 0 Architecture & Governance documentation
│   ├── PROJECT_AUDIT.md                # This comprehensive audit
│   └── DEVELOPMENT_WORKFLOW.md         # Git safety & solo developer protocol
└── src/
    ├── main.jsx                        # React root mount
    ├── App.jsx                         # App shell routing & view orchestrator
    ├── index.css                       # Dark SaaS design system, glassmorphism tokens, and responsive layout
    ├── context/
    │   └── AppContext.jsx              # Global state (view switching, case loading, toasts, KPIs)
    ├── services/
    │   └── api.js                      # Async API abstraction layer with mock data store
    ├── mock/
    │   └── mockData.js                 # High-fidelity mock cases, multi-agent telemetry, FAQ, & patterns
    └── components/
        ├── common/
        │   ├── Drawer.jsx              # Accessible slide-over drawer
        │   ├── EmptyState.jsx          # Contextual empty state with action button
        │   ├── GlassCard.jsx           # Glassmorphism panel with luminous glow variants
        │   ├── LoadingState.jsx        # Luminous cyan spinner with animated status text
        │   ├── MetricCard.jsx          # KPI card with delta indicators
        │   ├── Modal.jsx               # Keyboard-accessible dialog (ESC close, backdrop blur)
        │   ├── StatusBadge.jsx         # Case status badges with animated pulse indicators
        │   └── Toast.jsx               # Floating stacked notification toast system
        ├── layout/
        │   ├── AppShell.jsx            # Master layout wrapping sidebar, topbar, and main container
        │   ├── Sidebar.jsx             # Off-canvas responsive mobile drawer & desktop branding
        │   └── TopBar.jsx              # Centered pill navbar, live multi-agent indicator, search
        ├── dashboard/
        │   └── DashboardView.jsx       # 4 KPI cards, interactive SVG velocity chart, active investigations, audit feed
        ├── cases/
        │   └── CasesListView.jsx       # Case repository with multi-filter search (status, category, priority)
        ├── investigation/
        │   ├── CaseDetailView.jsx      # Master investigation orchestrator & tab controller
        │   ├── CaseHeader.jsx          # Case ID, customer reliability badge, verbatim complaint callout
        │   ├── InvestigationTimeline.jsx# Deterministic 9-stage sequence timeline
        │   ├── AgentVisualizationGraph.jsx# Multi-agent parallel DAG workflow graph
        │   ├── AgentDetailModal.jsx    # Diagnostic telemetry, findings, and execution timing
        │   ├── EvidenceMatrix.jsx      # Cryptographic evidence records with raw JSON payload viewer
        │   ├── ContradictionCard.jsx   # Neutral conflict analysis with non-fraud ethical safeguard
        │   ├── RootCauseCard.jsx       # Deterministic chain (Evidence → Finding → Root Cause)
        │   ├── ResolutionCard.jsx      # Formulated customer message & automated internal interventions
        │   └── EscalationCard.jsx      # Human specialist controls, risk tiers, and override actions
        ├── support/
        │   ├── SupportView.jsx         # Dual-mode: Policy FAQ Knowledge Base & ARGUS Agent intake
        │   └── FAQDetailModal.jsx      # Policy answer, official citations, and related queries
        ├── intelligence/
        │   └── IntelligenceView.jsx    # Cross-case pattern detection, institutional memory, prevention rules
        └── settings/
            └── SettingsView.jsx        # Consensus tuning sliders, dollar caps, gateway health indicators
```

---

## 3. Current Implementation Status

### 3.1 Working Functionality (Frontend)

1. **Dashboard & Operational Telemetry (`DashboardView.jsx`):**
   - 4 metric KPI cards (Active Cases, Investigations Running, Resolved Cases, Contradictions Flagged) wired to dynamic state.
   - Interactive SVG bar chart tracking 7-day ingestion, resolution, and contradiction volume with hover tooltips.
   - Active investigations queue displaying participating agent micro-badges.
   - Agent Swarm Diagnostics card highlighting individual agent latency, confidence, and versioning.
   - Filterable Recent Cases table with category, status, and priority badges.
   - Live investigation activity stream feed.

2. **Case Management (`CasesListView.jsx`):**
   - Search bar querying case ID, customer name, title, and complaint body.
   - Status filters (All, Investigating, Contradiction Detected, Evidence Required, Human Review, Resolved).
   - Category filtering (Billing, Logistics/Delivery, Technical/Account, Product Quality).
   - Interactive case cards with customer reliability badges, order references, and direct inspection links.

3. **Multi-Stage Case Investigation Deep-Dive (`CaseDetailView.jsx`):**
   - **Case Header:** Displays verbatim customer complaint, customer account tier, and reliability score.
   - **9-Stage Investigation Sequence:** Deterministic progression pipeline (Complaint Ingested → Classified → Agents Assigned → Evidence Retrieved → Investigation Active → Contradiction Check → Root Cause Isolated → Resolution Formulated → Finalized).
   - **Parallel Agent DAG Visualization:** Visual nodes for Billing Agent, Order Agent, and Technical Agent routing into the Consensus Coordinator.
   - **Agent Telemetry Modal:** Detailed inspection of task definition, summary, confidence score, execution timing, and empirical findings.
   - **Evidence Matrix:** Filterable evidence list (carrier GPS telemetry, payment gateway records, WMS scans, customer statements) with expandable raw JSON payload inspector.
   - **Contradiction Detection:** Neutral side-by-side statement vs. physical telemetry comparison with explicit *"Contradiction ≠ Proof of Fraud"* safeguard.
   - **Root Cause Card:** Visual causal chain (*Evidence → Empirical Finding → Root Cause Diagnosis*).
   - **Actionable Resolution Card:** Dual-purpose output (customer-facing communication + automated internal system actions).
   - **Human Escalation Review Card:** Risk tiers, supervisor override approval, evidence request, and formal dispute buttons.

4. **Support Intelligence Hub (`SupportView.jsx`):**
   - **FAQ Knowledge Base Mode:** Category tabs, real-time search, policy cards, and deep-dive detail modal with cited policy sources.
   - **ARGUS Agent Investigation Launcher Mode:** Autonomous problem intake form with pre-filled test payloads, file attachment upload simulator, and direct dispatch into a newly provisioned case.

5. **Cross-Case Intelligence & Prevention (`IntelligenceView.jsx`):**
   - 5-dimensional pattern detection (Carrier/Logistics, Seller/Vendor, Payment/Gateway, Product SKU, System/Infra).
   - Institutional memory search across historical resolved incidents.
   - Systemic prevention recommendations with actionable policy enable/disable toggles.
   - Dynamic evidence protocol tier breakdown.

6. **System Settings & Tuning (`SettingsView.jsx`):**
   - Sliders for consensus threshold, dollar auto-resolution cap, and carrier spatial tolerance.
   - Visual mock gateway health cards (Stripe, PostgreSQL OMS, FastTrack Logistics, Kafka, Vision OCR).

### 3.2 Incomplete or Missing Architecture (Backend & Infrastructure)

1. **No Backend API Server:** There is no live REST or GraphQL server (FastAPI, Express, or Django) handling requests. All state mutations currently live in `src/services/api.js` using in-memory arrays.
2. **No Persistent Database:** Refreshing the browser or clearing the session resets all created cases and updated statuses back to the initial mock seed.
3. **No Live Multi-Agent Orchestrator:** The parallel agent DAG is a high-fidelity frontend representation. No live background worker or LangGraph/AGY agent pipeline actually executes backend tasks against third-party APIs.
4. **No Authentication or RBAC:** The application assumes a single operator ("Operations Lead"). There is no JWT, OAuth, or role-based access control separating customer users from support specialists.
5. **No Automated Test Framework:** No unit test runner (Vitest), component test suite (Testing Library), or end-to-end suite (Playwright) is installed or configured in `package.json`.

---

## 4. Evaluation Against 19 ARGUS Platform Modules

| # | Platform Capability | Current Repository Support | Architectural Gap / Next Requirement |
| :- | :--- | :--- | :--- |
| **1** | **Main Dashboard** | Fully visualized in `DashboardView.jsx` | Connect to live aggregation API endpoint |
| **2** | **Customer Support** | Fully visualized in `SupportView.jsx` | Integrate with support ticketing backend |
| **3** | **FAQ Knowledge Base** | Implemented with search & `FAQDetailModal` | Connect to vector database or knowledge search backend |
| **4** | **ARGUS AI Agent** | Intake form creates case in `AppContext` | Implement LLM/agentic complaint triage service |
| **5** | **Customer Complaint Submission** | Intake form in `SupportView.jsx` | Persistent POST `/api/complaints` endpoint |
| **6** | **Case Management** | Search, filter, inspect in `CasesListView` | PostgreSQL/Prisma persistent case data store |
| **7** | **Multi-Agent Investigation** | DAG graph in `AgentVisualizationGraph` | Background agent pipeline orchestrator (Python/FastAPI) |
| **8** | **Billing Investigation** | Modeled in `agentsData.billing` | Real Stripe / payment gateway adapter |
| **9** | **Order Investigation** | Modeled in `agentsData.order` | Real OMS / WMS inventory API adapter |
| **10** | **Technical Investigation** | Modeled in `agentsData.tech` | Real OpenTelemetry / Kafka / log collector adapter |
| **11** | **Evidence Verification** | Evidence matrix with raw JSON payloads | Cryptographic SHA-256 evidence hashing & storage |
| **12** | **Root Cause Analysis** | Visualized in `RootCauseCard` | Automated deterministic root cause inference logic |
| **13** | **Resolution & Escalation** | Visualized in `ResolutionCard` & `EscalationCard` | Automated webhook dispatch + human approval queue |
| **14** | **Customer Case History** | Customer Case Memory tab in `CaseDetailView` | Customer profile and dispute history service |
| **15** | **Case Intelligence** | Modeled in `IntelligenceView` | Cross-case embedding and similarity search |
| **16** | **Pattern Detection** | Modeled in `IntelligenceView` | Batch/streaming anomaly detection engine |
| **17** | **Complaint Reliability** | Neutral reliability scores & bands modeled | Statistical scoring algorithm based on historical records |
| **18** | **Fraud Risk Signals** | Neutral contradiction detection active | Heuristic and ML anomaly detection pipeline |
| **19** | **Prevention Recommendations** | Visualized with status toggles in `IntelligenceView`| Rule engine syncing recommendations to operational policy |

---

## 5. Technical Risks & Vulnerabilities

1. **State Volatility:** Because all mutations are client-side in-memory, test cases created during a demo or review are lost upon browser reload.
2. **Missing Automated Testing:** Without a test suite, refactoring or adding backend connectivity risks silently breaking existing UI workflows.
3. **Absence of Environment Variable Abstraction:** Configuration (such as API URLs or feature flags) is hardcoded, meaning transitioning to a real backend will require refactoring `src/services/api.js`.
4. **Vulnerability Alerts in Dependencies:** `npm audit` reports 2 vulnerabilities (1 moderate, 1 high) in transitive build dependencies (`esbuild` / Vite tooling).

---

## 6. Recommended Next Implementation Steps

- **Phase 1: Backend Foundation & API Architecture**
  - Establish backend service scaffold (e.g., Python FastAPI or Node.js) with structured API routing.
  - Implement relational database schema (PostgreSQL) for Cases, Agents, Evidence, and Audit Logs.
  - Introduce `.env.example` and environment configuration across frontend and backend.
- **Phase 2: Frontend-Backend Integration**
  - Point `src/services/api.js` to live REST endpoints while preserving mock fallback for offline development.
  - Add test harness (Vitest + React Testing Library) to validate view rendering and state transitions.
- **Phase 3: Multi-Agent Orchestration & External Connectors**
  - Implement real/mocked worker pipelines for Billing, Order, and Technical agent execution.
  - Implement deterministic consensus and root cause generation engine.
- **Phase 4: Case Intelligence, Memory & Hardening**
  - Connect pattern detection and institutional memory to vector storage.
  - Add authentication and production deployment configuration.
