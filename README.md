# ARGUS — AI-Powered Customer Support Investigation Platform

ARGUS is an advanced AI intelligence platform designed to autonomously investigate complex customer disputes, detect cross-system discrepancies, and formulate deterministic root-cause resolutions across Billing, Order Fulfillment, and Technical Event streams.

---

## Architecture Overview

- **Frontend**: React 18, Vite, Lucide Icons, Pure CSS Design System (Outfit, Inter, JetBrains Mono).
- **Backend API**: Python 3.10+, FastAPI, Pydantic, Uvicorn.
- **Persistence**: SQLite (Hybrid relational-document schema with auto-seeding).
- **Testing**: Pytest (15 unit/integration tests).

---

## Quick Start

### 1. Start the Backend API (FastAPI)
```bash
# In virtual environment with requirements installed:
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Health Check: [http://127.0.0.1:8000/health](http://127.0.0.1:8000/health)  
API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start the Frontend (React + Vite)
```bash
npm install
npm run dev
```
Application URL: [http://localhost:3000](http://localhost:3000)

For detailed developer setup, database schema, and test instructions, see [docs/BACKEND_SETUP.md](docs/BACKEND_SETUP.md).
