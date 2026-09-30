# ARGUS — Team Ownership & Development Guidelines
# Developer: Anxhu — Frontend 1

- **Developer:** Anxhu (Anshuman)
- **Role:** Frontend Developer 1 (Lead Application UI & Core Investigation Workflows)
- **Active Git Branch:** `anxhu/frontend-1`
- **Repository:** `ARGUS`

---

## 1. Ownership & Assigned Areas

Anxhu owns the primary enterprise application experience, the main ARGUS dashboard, case management, the multi-agent investigation interface, and the core Support experience:

### Core Application UI
- **Application Shell:** Master app layout (`AppShell.jsx`), responsive container (`max-w-[1400px]`), off-canvas mobile drawer (`Sidebar.jsx`).
- **Top Navigation:** Centered pill navigation (`TopBar.jsx`) with active states, brand logo, notification alerts, and operator profile.
- **Executive Dashboard:** Primary KPI cards (Total Revenue, Total Orders, Active Customers, Refund Rate), 12-month dual bar velocity charts, Top Products / Case targets, Customer Orders sparkline, and Sales by Countries regional donut distribution matching the enterprise reference design.
- **Case Management:** Case repository (`CasesListView.jsx`), multi-status quick filtering (`Investigating`, `Contradiction Detected`, `Evidence Required`, `Human Review`, `Resolved`), priority filters, customer reliability indicators, and search.
- **Investigation Interface:** Full investigation orchestrator (`CaseDetailView.jsx`):
  - Case Header with customer reliability band and verbatim complaint callout.
  - 9-Stage deterministic Investigation Timeline.
  - **Multi-Agent DAG Visualization Graph:** Non-chatbot deterministic visualization showing parallel Billing, Order, and Technical agents feeding into the Coordinator.
  - Agent Diagnostic Telemetry Modal with verified findings, latency metrics, and execution times.
  - Verified Evidence Matrix with cryptographic records, system logs, WMS scans, and expandable raw JSON payload viewer.
  - **Contradiction Detection Card:** Neutral discrepancy analysis between customer statements and physical telemetry with explicit *"Contradiction ≠ Proof of Fraud"* safeguard.
  - **Root Cause Diagnosis Card:** Deterministic chain (*Evidence → Finding → Root Cause*).
  - **Actionable Resolution Card:** Generated customer response message and automated internal system interventions.
  - **Human Escalation Review Card:** Risk level indicators and specialist review controls.

### Support Experience
- **FAQ Knowledge Base:** Categorized policy articles, search, approved source citations, and `FAQDetailModal`.
- **ARGUS Agent Investigation Launcher:** Problem intake form for complex issues with pre-filled verbatim complaint, order reference, category, priority, and proof upload simulation.
- **Continuous Flow:** Support → Multi-Agent Investigation pipeline transition.

### Core Intelligence Presentation
- Primary presentation layer for investigation history, cross-case patterns, case memory search, and systemic prevention policy toggles.

---

## 2. Directory & File Boundaries

### Primary Files & Directories Owned by Anxhu
```text
src/
├── components/
│   ├── layout/            # AppShell.jsx, TopBar.jsx, Sidebar.jsx
│   ├── dashboard/         # DashboardView.jsx
│   ├── cases/             # CasesListView.jsx
│   ├── investigation/     # CaseDetailView.jsx, CaseHeader.jsx, InvestigationTimeline.jsx,
│   │                      # AgentVisualizationGraph.jsx, AgentDetailModal.jsx, EvidenceMatrix.jsx,
│   │                      # ContradictionCard.jsx, RootCauseCard.jsx, ResolutionCard.jsx, EscalationCard.jsx
│   ├── support/           # SupportView.jsx, FAQDetailModal.jsx
│   ├── intelligence/      # IntelligenceView.jsx
│   └── settings/          # SettingsView.jsx
├── services/api.js        # Frontend client service adapter
└── index.css              # Core design tokens, layout utilities, and animations
```

### Files & Directories to AVOID Modifying
- **Customer Portal / Standalone Customer Pages:** Owned by Alok (Frontend 2).
- **Backend API & Infrastructure:** Owned by AmanSR (Backend 1).
- **AI Agent Orchestration & LLM Engines:** Owned by Aman (Backend 2).

---

## 3. Integration Boundaries & Rules

1. **Frontend / Backend Contract:**
   - Frontend communicates with backend through agreed REST API contracts (e.g. `GET /api/v1/cases`, `GET /api/v1/cases/{id}`, `POST /api/v1/support/intake`).
   - Do not modify backend models or endpoints unilaterally.
2. **Coordination with Alok (Frontend 2):**
   - Share global design tokens from `src/index.css` and reusable common primitives from `src/components/common/`.
   - Avoid modifying customer-facing pages owned by Alok without prior alignment.
3. **Coordination with Aman (Backend 2):**
   - Ensure the multi-agent DAG UI matches the actual agent nodes orchestrated by Aman (Billing, Order, Technical, Coordinator).
4. **Coordination with AmanSR (Backend 1):**
   - Align on schema definitions for cases, evidence payloads, customer reliability tiers, and status codes.

---

## 4. Git & Workflow Standards

- **Branch:** `anxhu/frontend-1`
- **Workflow:** Implement → Run `npm.cmd run build` → Review `git status` → Commit with clear conventional message → Push to `origin/anxhu/frontend-1`.
- **Pull Requests:** Clearly state what changed, why it changed, files affected, and testing performed.
