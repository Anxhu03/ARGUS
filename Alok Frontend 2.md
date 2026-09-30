# ARGUS — Team Ownership & Development Guidelines
# Developer: Alok — Frontend 2

- **Developer:** Alok
- **Role:** Frontend Developer 2 (Customer-Facing Experiences & Auxiliary Interfaces)
- **Active Git Branch:** `alok/frontend-2`
- **Repository:** `ARGUS`

---

## 1. Ownership & Assigned Areas

Alok is responsible for customer-facing frontend experiences and frontend areas that are not part of Anxhu's core application/investigation ownership:

### Customer-Facing Frontend Experiences
- **Customer Portal / Self-Service Pages:** Dedicated customer-facing views where users track their disputes, view ticket progress, and receive resolution notices.
- **Customer Case & Dispute History:** Customer-facing chronological timeline and complaint submission history presentation.
- **Extended Help Center Presentation:** Supplementary Help Center views, customer onboarding guides, and interactive policy explainers.
- **Customer-Facing Intelligence Views:** Customer reliability score explanations, verified proof badges, and transparency reports.
- **Assigned Pattern & Prevention Views:** Specialized merchant-facing or customer-facing pattern summaries where specifically assigned.
- **Supporting Frontend Components:** Reusable UI widgets, cards, and modal components supporting customer flows.

---

## 2. Directory & File Boundaries

### Primary Files & Directories Owned by Alok
```text
src/
├── components/
│   ├── customer/          # Customer-facing views, dispute tracking portal, history widgets
│   ├── help/              # Extended customer help center, guide presentations
│   └── common/            # Shared reusable UI primitives (coordinated with Anxhu)
```

### Files & Directories to AVOID Modifying
- **Anxhu's Core Application Shell:** `src/components/layout/` (`AppShell.jsx`, `TopBar.jsx`, `Sidebar.jsx`)
- **Anxhu's Core Dashboard:** `src/components/dashboard/` (`DashboardView.jsx`)
- **Anxhu's Investigation Interface:** `src/components/investigation/` (`CaseDetailView.jsx`, `AgentVisualizationGraph.jsx`, etc.)
- **Anxhu's Case Management:** `src/components/cases/` (`CasesListView.jsx`)
- **Anxhu's Support Intake:** `src/components/support/` (`SupportView.jsx`, `FAQDetailModal.jsx`)
- **Backend Codebases:** `backend/`, database models, FastAPI routes, and agent scripts.

---

## 3. Integration Boundaries & Rules

1. **Design System Consistency:**
   - Consume design tokens, typography, and color variables from `src/index.css`.
   - Ensure customer-facing pages match the clean, premium enterprise aesthetic of the reference dashboard.
2. **Coordination with Anxhu (Frontend 1):**
   - Do NOT rewrite or overwrite Anxhu's core dashboard, investigation UI, or application shell without explicit coordination.
   - When shared components in `src/components/common/` or `src/index.css` require enhancements, coordinate changes cleanly.
3. **Backend API Integration:**
   - Consume standard backend REST endpoints provided by AmanSR (Backend 1).
   - Do not implement duplicate mock data or divergent API interfaces.

---

## 4. Git & Workflow Standards

- **Branch:** `alok/frontend-2`
- **Workflow:** Create branch from `main` → Implement assigned work → Test (`npm.cmd run build`) → Review `git diff` → Commit with descriptive message → Push to `origin/alok/frontend-2` → Open PR into `main`.
- **Conflict Prevention:** Keep all customer-facing work within dedicated customer components and views to prevent overlap with Anxhu's investigation views.
