# ARGUS Backend API & Frontend Integration Guide

## 1. Overview
The ARGUS backend provides a lightweight, high-performance **FastAPI** service with an isolated **SQLite** data repository for customer support investigations and case intelligence.

The React frontend integrates with this backend via `src/services/api.js`, providing real-time data persistence with automatic fallback to local prototype data if the backend service is offline.

---

## 2. Prerequisites
- **Python**: 3.10+ (tested on Python 3.14)
- **Node.js**: 18+ and npm

---

## 3. Backend Setup & Installation

### Step A: Create and Activate Virtual Environment
```bash
# Windows (PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### Step B: Install Dependencies
```bash
pip install -r backend/requirements.txt
```

---

## 4. Running the Backend Server
Start the FastAPI server on port 8000:

```bash
# From repository root
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Health Check Endpoint**: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)
- **Interactive OpenAPI Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 5. Running the Frontend
In a separate terminal window:

```bash
# Install Node dependencies (if not already installed)
npm install

# Start Vite dev server
npm run dev
```

- **Frontend URL**: [http://localhost:3000](http://localhost:3000)

---

## 6. Running Backend Tests
Execute the pytest suite (15 unit and integration tests):

```bash
python -m pytest -v backend/tests
```

---

## 7. Configuration & Environment Variables

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `ARGUS_ENV` | `development` | Runtime environment (`development` / `production`). |
| `ARGUS_DEBUG` | `true` | Enables detailed error traces. |
| `ARGUS_DB_PATH` | `<root>/backend/argus.db` | Absolute path to the SQLite database file. |
| `ARGUS_SEED_PATH` | `<root>/backend/seed_data.json` | Path to JSON file used to seed the initial 9 cases. |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | (Frontend) Base URL for API requests. |

---

## 8. Persistence Architecture
- **Engine**: SQLite3 (`backend/argus.db`).
- **Data Model**: Hybrid relational-document pattern. Indexed columns (`id`, `title`, `status`, `priority`, `category`, `created_at`, `updated_at`, `order_id`, `amount`, `customer_name`, `customer_email`) enable fast filtering, sorting, and full-text searches. A `data_json` column preserves the complete, rich multi-agent investigation payload.
- **Auto-Seeding**: If `cases` table is empty on startup, the repository automatically populates it with all 9 initial cases from `backend/seed_data.json`.

---

## 9. Implemented Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Service health, version, uptime, and database status. |
| `GET` | `/api/cases` | List cases with search, filtering, and sorting query parameters. |
| `GET` | `/api/cases/{case_id}` | Retrieve full investigation details for a case. |
| `POST` | `/api/cases` | Create a new case from customer complaint intake. |
| `PATCH` | `/api/cases/{case_id}` | Partially update status, priority, team, notes, resolution, or findings. |

---

## 10. Current Limitations & Next Steps
- Real multi-agent LLM orchestration and external payment/carrier gateway webhooks are simulated with deterministic logic.
- Authentication tokens are stubbed for local development; JWT verification will be added in future security hardening phases.
- SQLite is optimized for single-node local development; PostgreSQL / Cloud SQL will be configured for production clustering.
