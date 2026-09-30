# ARGUS — Team Ownership & Development Guidelines
# Developer: AmanSR — Backend 1

- **Developer:** AmanSR
- **Role:** Backend Developer 1 (Backend Foundation, API Infrastructure & Data Layer)
- **Active Git Branch:** `amanSR/backend-1`
- **Repository:** `ARGUS`

---

## 1. Ownership & Assigned Areas

AmanSR owns the backend foundation, REST API infrastructure, database models, schemas, and data pipelines:

### Backend Foundation & Infrastructure
- **FastAPI Framework:** Application initialization, CORS configuration, dependency injection, middleware, error handling, and server lifecycle.
- **Security & Authentication:** JWT authentication, role-based access control (Admin, Specialist, Operator), API key management, and session tokens.
- **API Routing Architecture:** Base route registration (`/api/v1/`), rate limiting, request validation, and OpenAPI / Swagger documentation.

### Database Architecture & Models
- **Database Engine & ORM:** PostgreSQL / SQLite configuration, connection pooling, and SQLAlchemy ORM setup.
- **Core Entities & Relationships:**
  - `Customer` (name, email, tier, reliability score, joined date)
  - `Order` (order ID, amount, items, tracking status, courier info)
  - `Case` (case ID, title, customer ID, category, status, priority, timeline, root cause, resolution)
  - `Evidence` (evidence ID, case ID, type, source, timestamp, verification status, metadata payload)
  - `FAQItem` (question, short answer, full answer, category, source doc, helpful count)
  - `Pattern` (pattern ID, dimension, severity, affected cases, recommendations)
  - `PreventionPolicy` (rule ID, title, status, impact, trigger pattern)
- **Migrations:** Alembic migration scripts and version-controlled database schema changes.

### Core CRUD & REST APIs
- **Case Management APIs:** `GET /api/v1/cases`, `GET /api/v1/cases/{id}`, `PATCH /api/v1/cases/{id}/status`, `POST /api/v1/cases/{id}/escalate`, `POST /api/v1/cases/{id}/approve`.
- **Order & Customer APIs:** `GET /api/v1/orders/{id}`, `GET /api/v1/customers/{id}`.
- **Support & FAQ APIs:** `GET /api/v1/support/faq`, `POST /api/v1/support/intake`.
- **Evidence APIs:** `GET /api/v1/cases/{id}/evidence`, `POST /api/v1/cases/{id}/evidence/upload`.
- **Intelligence & KPI APIs:** `GET /api/v1/intelligence/patterns`, `GET /api/v1/intelligence/kpis`.

### Data Seeding & Utilities
- Realistic database seed scripts (`seed.py`), demo dataset fixtures, and database backup/restore utilities.

---

## 2. Directory & File Boundaries

### Primary Files & Directories Owned by AmanSR
```text
backend/
├── core/                  # FastAPI main app, config, security, auth, dependencies
├── db/                    # Session management, base class, Alembic migrations
├── models/                # SQLAlchemy models (Case, Customer, Order, Evidence, etc.)
├── schemas/               # Pydantic request/response validation schemas
├── api/                   # Route handlers (/cases, /orders, /support, /intelligence)
└── data/                  # Seed scripts, demo fixtures, sample payloads
```

### Files & Directories to AVOID Modifying
- **AI Agent Intelligence & LLM Prompts:** Owned by Aman (Backend 2).
- **Frontend Codebase:** `src/` (React components, layouts, pages, CSS).

---

## 3. Integration Boundaries & Rules

1. **Backend 2 (Aman) Integration:**
   - Provide clean database repositories, models, and session dependencies that Aman's agents use to persist findings and retrieve evidence.
   - Do NOT implement AI agent reasoning, LLM chains, or contradiction algorithms without explicit coordination with Aman.
2. **Frontend Developers (Anxhu & Alok) Integration:**
   - Maintain stable, documented REST API contracts with consistent HTTP status codes, error models, and JSON payloads.
   - When API schemas must change, coordinate with frontend developers before releasing breaking changes.
3. **No Frontend Logic in Backend:**
   - Keep backend routes headless, performant, and decoupled from frontend UI representation.

---

## 4. Git & Workflow Standards

- **Branch:** `amanSR/backend-1`
- **Workflow:** Branch from `main` → Implement backend endpoints/models → Run database migrations & unit tests → Review `git diff` → Commit with descriptive message → Push to `origin/amanSR/backend-1` → Open PR into `main`.
