# ARGUS — Phase-Wise Implementation Roadmap

**Document Version:** 1.0.0 (Phase 1 Baseline)  
**Author:** Principal Software Architect & Technical Lead  
**Execution Mode:** Solo-Developer Iterative Delivery  
**Status:** Approved Implementation Blueprint  

---

## 1. Roadmap Architecture & Phasing Strategy

To ensure zero regressions and maintain working, verifiable states throughout development, the implementation is partitioned into six sequential, testable milestones:

```
[ Milestone 1: Backend Scaffolding & Database Models ]
                         │
                         ▼
[ Milestone 2: Core REST APIs & Frontend Integration ]
                         │
                         ▼
[ Milestone 3: Multi-Agent Investigation DAG Engine ]
                         │
                         ▼
[ Milestone 4: FAQ Knowledge Base & Support Intake RAG ]
                         │
                         ▼
[ Milestone 5: Case Intelligence & Pattern Detection ]
                         │
                         ▼
[ Milestone 6: Automated Testing & Production Hardening ]
```

---

## 2. Milestone Specifications

### Milestone 1: Backend Scaffolding & Database Models
- **Goal:** Establish the Python FastAPI backend project structure, configure SQLAlchemy async ORM, define the 24 entity tables, generate initial Alembic migrations, and provide realistic seed data matching existing mock cases.
- **Affected Files & Modules:**
  - `backend/main.py`
  - `backend/app/core/config.py`, `database.py`
  - `backend/app/models/*.py` (24 database models)
  - `backend/alembic/` (initial schema migration)
  - `backend/scripts/seed.py` (populates `ARG-1042`, `ARG-1043`, `ARG-1044`, FAQ items, and patterns)
  - `backend/requirements.txt`
  - `.env.example`
- **Dependencies:** Python 3.11+, SQLAlchemy 2.0+, Pydantic v2, Alembic, SQLite/PostgreSQL.
- **Acceptance Criteria:**
  - Backend starts cleanly with `uvicorn app.main:app --port 8000`.
  - Database schema generates without syntax errors or foreign key circularities.
  - `seed.py` successfully populates tables with initial case files.
- **Testing Requirements:** `pytest tests/test_database.py` verifies table creation and seed data insertion.
- **Suggested Commit:** `feat(backend): scaffold FastAPI application and SQLAlchemy database models`

---

### Milestone 2: Core REST APIs & Frontend Service Integration
- **Goal:** Expose REST endpoints for Cases, Dashboard metrics, Evidence, and Status updates, and update `src/services/api.js` to communicate with the live backend with automatic offline mock fallback.
- **Affected Files & Modules:**
  - `backend/app/api/v1/endpoints/cases.py`
  - `backend/app/api/v1/endpoints/dashboard.py`
  - `backend/app/schemas/case.py`, `dashboard.py`
  - `src/services/api.js` (switches from purely in-memory store to `fetch()` with mock fallback)
  - `src/context/AppContext.jsx`
  - `vite.config.js` (adds dev server proxy for `/api`)
- **Dependencies:** Milestone 1.
- **Acceptance Criteria:**
  - `GET /api/v1/cases` returns paginated cases from database.
  - `GET /api/v1/dashboard/metrics` returns dynamic aggregations.
  - Frontend dashboard and case list load data directly from the backend API.
  - Creating or updating a case in the UI persists across browser reloads.
- **Testing Requirements:** `pytest tests/test_cases_api.py` and frontend production build check (`npm run build`).
- **Suggested Commit:** `feat(api): implement case management endpoints and wire frontend service layer`

---

### Milestone 3: Deterministic Multi-Agent Investigation DAG Engine
- **Goal:** Implement the parallel multi-agent orchestrator executing Billing, Order, and Technical agent runs, empirical evidence cross-examination, contradiction detection, and root cause synthesis.
- **Affected Files & Modules:**
  - `backend/app/agents/coordinator.py`
  - `backend/app/agents/billing_agent.py`
  - `backend/app/agents/order_agent.py`
  - `backend/app/agents/tech_agent.py`
  - `backend/app/agents/evidence_verifier.py`
  - `backend/app/agents/root_cause_engine.py`
  - `backend/app/api/v1/endpoints/investigations.py`
  - `src/components/investigation/CaseDetailView.jsx` (wire re-run action)
- **Dependencies:** Milestone 2.
- **Acceptance Criteria:**
  - Triggering `POST /api/v1/investigations/{case_id}/run` deploys agents concurrently via `asyncio.gather()`.
  - Discrepancy engine flags contradictions neutrally with ethical non-fraud safeguards.
  - Root cause causal chain is generated and persisted to database.
  - Agent telemetry updates live in `AgentVisualizationGraph.jsx`.
- **Testing Requirements:** Unit tests for each agent module with mocked third-party gateways (Stripe, OMS, Kafka).
- **Suggested Commit:** `feat(agents): implement deterministic multi-agent investigation DAG and root cause synthesis`

---

### Milestone 4: FAQ Knowledge Base, Support Intake & RAG
- **Goal:** Implement the dual-mode Support Hub backend, providing full-text/vector search for policy FAQ items and handling customer complaint intake with automated case provisioning.
- **Affected Files & Modules:**
  - `backend/app/api/v1/endpoints/support.py`
  - `backend/app/services/rag_service.py` (knowledge retrieval)
  - `backend/app/schemas/support.py`
  - `src/components/support/SupportView.jsx`
  - `src/components/support/FAQDetailModal.jsx`
- **Dependencies:** Milestone 2.
- **Acceptance Criteria:**
  - Submitting an inquiry in FAQ mode retrieves relevant policy citations within <200ms.
  - Submitting a dispute via the ARGUS Agent tab automatically provisions an `ARG-XXXX` case with an active investigation timeline.
- **Testing Requirements:** `pytest tests/test_support_faq.py` verifying search scoring and case creation.
- **Suggested Commit:** `feat(support): implement FAQ knowledge retrieval and complaint intake pipeline`

---

### Milestone 5: Case Intelligence, Pattern Detection & Prevention Rules
- **Goal:** Implement cross-case intelligence, institutional case memory search, systemic pattern clustering (Carrier, Seller, Product, Payment, System), and dynamic evidence protocol policies.
- **Affected Files & Modules:**
  - `backend/app/api/v1/endpoints/intelligence.py`
  - `backend/app/services/pattern_detector.py`
  - `backend/app/services/reliability_scorer.py`
  - `src/components/intelligence/IntelligenceView.jsx`
  - `src/components/investigation/CaseDetailView.jsx` (Customer Memory tab)
- **Dependencies:** Milestone 3 and Milestone 4.
- **Acceptance Criteria:**
  - Materialized patterns update dynamically based on resolved case outcomes.
  - Customer reliability band is calculated objectively from verified historical evidence.
  - Toggling prevention recommendation status updates operational rules in database.
- **Testing Requirements:** Deterministic test cases checking reliability scoring formula and pattern aggregation.
- **Suggested Commit:** `feat(intelligence): add cross-case pattern detection and reliability scoring`

---

### Milestone 6: Quality Hardening, Automated Test Suites & Production Packaging
- **Goal:** Install and configure frontend unit tests (Vitest + React Testing Library), expand backend pytest coverage, configure Docker containerization, and document production deployment.
- **Affected Files & Modules:**
  - `package.json` (add Vitest & test scripts)
  - `src/tests/**/*.test.jsx`
  - `backend/tests/**/*.py`
  - `Dockerfile`, `docker-compose.yml`
  - `README.md`
- **Dependencies:** Milestones 1 through 5.
- **Acceptance Criteria:**
  - `npm test` runs with 100% pass rate across core UI views.
  - `pytest` achieves >80% code coverage across backend endpoints and agent logic.
  - `docker-compose up` boots both frontend (port 3000) and backend (port 8000) in production mode.
- **Testing Requirements:** Full CI test suite execution and clean containerized builds.
- **Suggested Commit:** `chore(ci): configure automated test suites and docker containerization`
