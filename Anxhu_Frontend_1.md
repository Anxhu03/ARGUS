# ARGUS — Anxhu Frontend 1

**Developer:** Anxhu  
**Role:** Frontend Developer 1  
**Branch:** `anxhu/frontend-1`  
**Application:** ARGUS — Autonomous AI Customer Support & Multi-Agent Investigation Platform  

---

## 1. Scope & Ownership (Frontend 1)

As Frontend Developer 1, this workspace implements the complete primary ARGUS frontend experience:
1. **Global Application Shell:**
   - Responsive sidebar navigation with active luminous glow and badge counters
   - Sticky glassmorphic topbar with global search, live multi-agent status indicator, and notifications
   - High-performance dark SaaS design system (Vanilla CSS, luminous cyan/teal accents `#00f2fe`, `#4facfe`, `#06b6d4`, subtle glass panels, backdrop filters)

2. **Executive Overview / Dashboard:**
   - 6 KPI metrics cards (Active Cases, Cases Resolved, Auto-Resolved %, Human Escalations, Investigations Running, Contradictions Detected)
   - Real-time active investigations list with live agent status tags
   - Pipeline architecture summary card (Parallel DAG vs Chatbot)
   - Recent cases log with quick-audit actions

3. **Case Management:**
   - Search, status filtering (Investigating, Contradiction Detected, Evidence Required, Human Review, Resolved), category, and priority filters
   - Case cards with customer reliability badges, order ID references, and agent assignment indicators

4. **Case Investigation Deep-Dive:**
   - Case Header with customer reliability band and verbatim customer complaint callout
   - 9-Stage deterministic Investigation Timeline (Complaint Ingestion → Case Classification → Agents Deployed → Evidence Retrieval → Investigation → Contradiction Check → Root Cause Diagnosis → Resolution Generation → Human Escalation)
   - **Multi-Agent DAG Visualization Graph:** Non-chatbot workflow displaying parallel Billing Agent, Order Agent, and Technical Agent nodes feeding into the Coordinator & Consensus Engine
   - Agent Diagnostic Telemetry Modal with verified findings, metrics, and execution timing
   - Dedicated Evidence Matrix with cryptographic records, system logs, WMS scans, carrier telemetry, and expandable raw JSON payload viewer
   - **Contradiction Detection Card:** Neutral discrepancy analysis between customer statements and physical telemetry with explicit *"Contradiction ≠ Proof of Fraud"* safeguard
   - **Root Cause Diagnosis Card:** Visual deterministic chain (*Evidence → Finding → Root Cause*)
   - **Actionable Resolution Card:** Generated customer notification response and automated internal system interventions
   - **Human Escalation Review Card:** Risk level indicators and specialist review controls

5. **Support Intelligence Hub (Dual Mode):**
   - **FAQ & Knowledge Base Mode (Information Retrieval):** Category filter tabs, search bar, policy article cards, and `FAQDetailModal` with approved source citations and related inquiries
   - **ARGUS Agent Investigation Mode (Investigation & Diagnosis):** Problem intake form for complex issues with pre-filled verbatim complaint, order reference, category, priority, and proof upload simulation
   - Continuous Support → Agent investigation flow seamlessly transitioning into the multi-agent investigation pipeline

6. **Customer Case Memory & Prevention:**
   - Longitudinal reliability indexing based on verified evidence history
   - Cross-case pattern detection across sellers, delivery partners, and software components
   - Systemic prevention recommendations with actionable policy toggles
   - Adaptive dynamic evidence protocols (Low-Risk, Medium-Risk, Quality Pattern, and High-Risk Tiers)

7. **System Settings & Tuning:**
   - Sliders for consensus threshold, dollar auto-resolution cap, and carrier spatial tolerance
   - Active mock gateway health indicators (Stripe, PostgreSQL OMS, FastTrack Logistics, Kafka, Vision OCR)

---

## 2. Directory & Component Architecture

```
d:/ARGUS/
├── Anxhu_Frontend_1.md                 # Frontend 1 Workspace documentation
├── Alok_Frontend_2.md                  # Frontend 2 Workspace placeholder (unmodified)
├── AmanSR_backend_1.md                 # Backend 1 Workspace placeholder (unmodified)
├── Aman_backend_2.md                   # Backend 2 Workspace placeholder (unmodified)
├── package.json                        # Vite, React 18, Lucide React dependencies
├── vite.config.js                      # Dev server configuration (Port 3000)
├── index.html                          # Root HTML with Google Fonts (Outfit, Inter, JetBrains Mono)
└── src/
    ├── main.jsx                        # React root entrypoint
    ├── App.jsx                         # App router and shell layout
    ├── index.css                       # Complete ARGUS dark glassmorphism design tokens & styles
    ├── context/
    │   └── AppContext.jsx              # Global state, navigation, case selection, and toast notifications
    ├── services/
    │   └── api.js                      # Clean async API client and mock service layer
    ├── mock/
    │   └── mockData.js                 # Realistic cases, agents, evidence, contradictions, FAQ, and patterns
    └── components/
        ├── common/
        │   ├── GlassCard.jsx           # Glassmorphism panel with luminous glow variants
        │   ├── MetricCard.jsx          # KPI card with delta indicators
        │   ├── StatusBadge.jsx         # Status badges with animated pulse rings
        │   ├── Toast.jsx               # Floating toast notifications
        │   ├── Modal.jsx               # Accessible dialog with ESC close and backdrop blur
        │   ├── Drawer.jsx              # Side drawer component
        │   ├── LoadingState.jsx        # Luminous cyan spinner with pulse text
        │   └── EmptyState.jsx          # Empty state fallback with contextual action
        ├── layout/
        │   ├── AppShell.jsx            # Master layout wrapping sidebar, topbar, and main container
        │   ├── Sidebar.jsx             # ARGUS branding, navigation links, and active indicators
        │   └── TopBar.jsx              # Search, live agent pill, and quick navigation
        ├── dashboard/
        │   └── DashboardView.jsx       # Operational metrics, active investigations, recent case log
        ├── cases/
        │   └── CasesListView.jsx       # Case repository with multi-attribute filtering
        ├── investigation/
        │   ├── CaseDetailView.jsx      # Master investigation orchestrator
        │   ├── CaseHeader.jsx          # Case ID, customer reliability, and verbatim complaint
        │   ├── InvestigationTimeline.jsx# 9-stage investigation sequence
        │   ├── AgentVisualizationGraph.jsx # Multi-agent DAG workflow
        │   ├── AgentDetailModal.jsx    # Telemetry and verified empirical findings modal
        │   ├── EvidenceMatrix.jsx      # Cryptographic evidence with JSON payload viewer
        │   ├── ContradictionCard.jsx   # Conflict callout with non-fraud safeguard
        │   ├── RootCauseCard.jsx       # Deterministic Evidence → Finding → Root Cause chain
        │   ├── ResolutionCard.jsx      # Customer response and automated actions
        │   └── EscalationCard.jsx      # Human specialist controls and risk tiers
        ├── support/
        │   ├── SupportView.jsx         # Dual FAQ Knowledge Base & ARGUS Agent Launcher
        │   └── FAQDetailModal.jsx      # Policy details, citations, and related inquiries
        ├── intelligence/
        │   └── IntelligenceView.jsx    # Pattern detection, prevention rules, and evidence protocols
        └── settings/
            └── SettingsView.jsx        # Consensus tuning, dollar caps, and gateway health
```

---

## 3. Running & Verifying Locally

- **Development Server:**
  ```bash
  npm.cmd run dev
  ```
  Runs at `http://localhost:3000/`.

- **Production Build:**
  ```bash
  npm.cmd run build
  ```
  Generates production-optimized bundle in `dist/`.
