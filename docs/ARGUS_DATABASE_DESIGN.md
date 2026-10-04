# ARGUS — Database Design & Entity Relationship Specification

**Document Version:** 1.0.0 (Phase 1 Baseline)  
**Author:** Principal Software Architect & Technical Lead  
**Repository:** [ARGUS (github.com/Anxhu03/ARGUS)](https://github.com/Anxhu03/ARGUS)  
**Status:** Approved Technical Blueprint  

---

## 1. Overview & Data Architecture

The ARGUS database schema is designed to support high-throughput, auditable dispute investigations, empirical evidence verification, multi-agent telemetry, and cross-case intelligence.

### Key Database Design Principles:
1. **Append-Only Evidence & Audit Trails:** Evidence items, agent execution traces, and case timeline events are strictly immutable once created.
2. **Deterministic Foreign Key Integrity:** All investigation artifacts (findings, contradictions, root causes, resolutions) are tied directly to parent `investigations` and `cases`.
3. **Dual Support Separation:** Informational knowledge base models (`faq_entries`, `knowledge_sources`) are cleanly separated from operational dispute records (`cases`, `complaints`).
4. **Target Engine:** PostgreSQL 15+ (with `pgvector` extension for semantic search and pattern similarity). SQLite 3 with JSON1 is supported for local offline development.

---

## 2. Entity Relationship Diagram (Conceptual)

```
[Users] ──────────┐
                  ▼
[Customers] ───► [Cases] ◄─── [Complaints]
     │              │
     │              ├───────► [Case Events] (Timeline)
     │              │
     ▼              ▼
[Orders] ───► [Investigations] ───► [Agent Runs] ───► [Findings]
     │              │
     ▼              ├───────► [Evidence] ◄─── [Evidence Items]
[Payments]          │
                    ├───────► [Contradictions]
                    │
                    ├───────► [Root Causes]
                    │
                    ├───────► [Resolutions]
                    │
                    └───────► [Escalations]

[Knowledge Sources] ───► [FAQ Categories] ───► [FAQ Entries]

[Detected Patterns] ───► [Prevention Recommendations]
[Reliability Assessments] ◄─── [Risk Signals]
```

---

## 3. Detailed Entity Definitions (24 Entities)

### 3.1 Core Users & Actors

#### 1. `users`
- **Purpose:** Platform operators, support specialists, risk officers, and administrators.
- **Primary Key:** `id` (UUIDv4)
- **Important Fields:**
  - `email` (VARCHAR(255), UNIQUE, NOT NULL)
  - `hashed_password` (VARCHAR(255), NOT NULL)
  - `full_name` (VARCHAR(150), NOT NULL)
  - `role` (VARCHAR(50), NOT NULL, DEFAULT `'support_specialist'`) — Values: `'admin'`, `'operations_lead'`, `'specialist'`, `'auditor'`
  - `is_active` (BOOLEAN, NOT NULL, DEFAULT `TRUE`)
  - `last_login_at` (TIMESTAMP WITH TIME ZONE, NULL)
- **Timestamps:** `created_at`, `updated_at`

#### 2. `customers`
- **Purpose:** Customer accounts interacting with the support portal or subject to case investigations.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'CUST-8821'`)
- **Important Fields:**
  - `name` (VARCHAR(150), NOT NULL)
  - `email` (VARCHAR(255), UNIQUE, NOT NULL)
  - `phone` (VARCHAR(50), NULL)
  - `tier` (VARCHAR(50), NOT NULL, DEFAULT `'Standard'`) — Values: `'Standard'`, `'Premium'`, `'Enterprise Tier'`
  - `reliability_score` (FLOAT, NOT NULL, DEFAULT `90.0`)
  - `reliability_band` (VARCHAR(50), NOT NULL, DEFAULT `'High Reliability'`) — Values: `'Low'`, `'Moderate'`, `'High Reliability'`
  - `total_cases_count` (INTEGER, NOT NULL, DEFAULT `0`)
  - `disputed_cases_count` (INTEGER, NOT NULL, DEFAULT `0`)
- **Timestamps:** `created_at`, `updated_at`

---

### 3.2 E-Commerce & Transaction Domain Entities

#### 3. `orders`
- **Purpose:** E-commerce order entities subject to delivery, billing, or technical investigations.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'ORD-99124'`)
- **Foreign Keys:**
  - `customer_id` $\rightarrow$ `customers.id` (NOT NULL)
- **Important Fields:**
  - `order_number` (VARCHAR(100), UNIQUE, NOT NULL)
  - `total_amount` (DECIMAL(12, 2), NOT NULL)
  - `currency` (VARCHAR(3), NOT NULL, DEFAULT `'USD'`)
  - `fulfillment_status` (VARCHAR(50), NOT NULL) — Values: `'unfulfilled'`, `'processing'`, `'shipped'`, `'delivered'`, `'held'`
  - `carrier_name` (VARCHAR(100), NULL)
  - `tracking_number` (VARCHAR(100), NULL)
  - `shipping_address` (JSONB, NOT NULL)
- **Timestamps:** `created_at`, `updated_at`

#### 4. `products`
- **Purpose:** Catalog items purchased within disputed orders.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'SKU-7720'`)
- **Important Fields:**
  - `sku` (VARCHAR(100), UNIQUE, NOT NULL)
  - `title` (VARCHAR(255), NOT NULL)
  - `category` (VARCHAR(100), NOT NULL)
  - `price` (DECIMAL(10, 2), NOT NULL)
  - `seller_id` (VARCHAR(64), NOT NULL)
- **Timestamps:** `created_at`, `updated_at`

#### 5. `payments`
- **Purpose:** Transaction ledger records from payment gateways (Stripe, PayPal, Adyen).
- **Primary Key:** `id` (VARCHAR(64) e.g., `'ch_3M4zZ8891'`)
- **Foreign Keys:**
  - `order_id` $\rightarrow$ `orders.id` (NOT NULL)
- **Important Fields:**
  - `gateway_name` (VARCHAR(50), NOT NULL) — e.g., `'Stripe'`, `'PayPal'`
  - `amount` (DECIMAL(12, 2), NOT NULL)
  - `currency` (VARCHAR(3), NOT NULL, DEFAULT `'USD'`)
  - `payment_method` (VARCHAR(50), NOT NULL) — e.g., `'credit_card'`, `'apple_pay'`
  - `status` (VARCHAR(50), NOT NULL) — Values: `'authorized'`, `'captured'`, `'refunded'`, `'disputed'`, `'failed'`
  - `escrow_held` (BOOLEAN, NOT NULL, DEFAULT `FALSE`)
  - `raw_gateway_response` (JSONB, NOT NULL)
- **Timestamps:** `created_at`, `updated_at`

---

### 3.3 Customer Support & Case Lifecycle

#### 6. `complaints`
- **Purpose:** Verbatim dispute submissions from customers or support agents.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `customer_id` $\rightarrow$ `customers.id` (NOT NULL)
  - `order_id` $\rightarrow$ `orders.id` (NULL)
- **Important Fields:**
  - `raw_text` (TEXT, NOT NULL)
  - `channel` (VARCHAR(50), NOT NULL, DEFAULT `'portal'`) — Values: `'portal'`, `'email'`, `'agent_intake'`, `'chat'`
  - `claimed_issue_category` (VARCHAR(100), NOT NULL)
  - `urgency_level` (VARCHAR(20), NOT NULL, DEFAULT `'Normal'`)
  - `attachments_meta` (JSONB, NULL)
- **Timestamps:** `created_at`

#### 7. `cases`
- **Purpose:** Master case record orchestrating investigation, evidence, and resolution.
- **Primary Key:** `id` (VARCHAR(32) e.g., `'ARG-1042'`)
- **Foreign Keys:**
  - `customer_id` $\rightarrow$ `customers.id` (NOT NULL)
  - `complaint_id` $\rightarrow$ `complaints.id` (NOT NULL)
  - `order_id` $\rightarrow$ `orders.id` (NULL)
  - `assigned_specialist_id` $\rightarrow$ `users.id` (NULL)
- **Important Fields:**
  - `title` (VARCHAR(255), NOT NULL)
  - `category` (VARCHAR(100), NOT NULL) — e.g., `'Billing & Order Sync'`, `'Logistics & Delivery'`
  - `status` (VARCHAR(50), NOT NULL, DEFAULT `'Investigating'`) — Values: `'Investigating'`, `'Evidence Required'`, `'Contradiction Detected'`, `'Human Review'`, `'Resolved'`, `'Closed'`
  - `priority` (VARCHAR(20), NOT NULL, DEFAULT `'Medium'`) — Values: `'Low'`, `'Medium'`, `'High'`, `'Critical'`
  - `disputed_amount` (DECIMAL(12, 2), NULL)
  - `currency` (VARCHAR(3), NOT NULL, DEFAULT `'USD'`)
  - `resolution_type` (VARCHAR(50), NULL)
- **Timestamps:** `created_at`, `updated_at`, `resolved_at`

#### 8. `case_events`
- **Purpose:** Deterministic 9-stage sequence timeline and real-time audit log of case transitions.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `case_id` $\rightarrow$ `cases.id` (NOT NULL)
  - `actor_id` $\rightarrow$ `users.id` (NULL)
- **Important Fields:**
  - `step_number` (INTEGER, NOT NULL) — e.g., `1` through `9`
  - `title` (VARCHAR(150), NOT NULL)
  - `description` (TEXT, NOT NULL)
  - `event_type` (VARCHAR(50), NOT NULL) — e.g., `'stage_transition'`, `'agent_dispatched'`, `'evidence_added'`, `'status_change'`
  - `status` (VARCHAR(20), NOT NULL) — Values: `'completed'`, `'current'`, `'pending'`, `'failed'`
  - `payload` (JSONB, NULL)
- **Timestamps:** `created_at`

---

### 3.4 Multi-Agent Investigation Domain

#### 9. `investigations`
- **Purpose:** Specific investigation execution run associated with a case.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `case_id` $\rightarrow$ `cases.id` (NOT NULL)
- **Important Fields:**
  - `coordinator_version` (VARCHAR(20), NOT NULL, DEFAULT `'v5.0.0'`)
  - `status` (VARCHAR(50), NOT NULL, DEFAULT `'running'`) — Values: `'running'`, `'consensus_formed'`, `'inconclusive'`, `'escalated'`
  - `consensus_score` (FLOAT, NULL) — Percentage confidence (0.0 to 100.0)
  - `total_execution_ms` (INTEGER, NULL)
- **Timestamps:** `started_at`, `completed_at`

#### 10. `agent_runs`
- **Purpose:** Execution instance of a specific agent (Billing, Order, or Technical) within an investigation.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `investigation_id` $\rightarrow$ `investigations.id` (NOT NULL)
- **Important Fields:**
  - `agent_type` (VARCHAR(50), NOT NULL) — Values: `'billing'`, `'order'`, `'tech'`, `'coordinator'`
  - `agent_version` (VARCHAR(20), NOT NULL)
  - `task_assigned` (TEXT, NOT NULL)
  - `summary` (TEXT, NULL)
  - `confidence_score` (FLOAT, NULL)
  - `execution_time_ms` (INTEGER, NULL)
  - `status` (VARCHAR(30), NOT NULL) — Values: `'pending'`, `'investigating'`, `'completed'`, `'failed'`
  - `metrics` (JSONB, NULL) — Key-value pairs displayed in agent modal
- **Timestamps:** `created_at`, `updated_at`

#### 11. `evidence`
- **Purpose:** Cryptographically hashed evidentiary documents, logs, and sensor records.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'ev-1042-01'`)
- **Foreign Keys:**
  - `investigation_id` $\rightarrow$ `investigations.id` (NOT NULL)
  - `agent_run_id` $\rightarrow$ `agent_runs.id` (NULL)
- **Important Fields:**
  - `title` (VARCHAR(255), NOT NULL)
  - `evidence_type` (VARCHAR(50), NOT NULL) — Values: `'Carrier Telemetry'`, `'Database Entity'`, `'Customer Statement'`, `'System Log'`, `'WMS Scan'`
  - `source_system` (VARCHAR(100), NOT NULL) — e.g., `'Stripe API'`, `'FastTrack Logistics'`, `'PostgreSQL OMS'`
  - `sha256_hash` (VARCHAR(64), NOT NULL)
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'Verified'`) — Values: `'Verified'`, `'Unverified'`, `'Contradicted'`
  - `description` (TEXT, NOT NULL)
  - `raw_payload` (JSONB, NOT NULL)
- **Timestamps:** `ingested_at`

#### 12. `findings`
- **Purpose:** Discrete factual assertions produced by agents and validated against evidence.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `agent_run_id` $\rightarrow$ `agent_runs.id` (NOT NULL)
  - `evidence_id` $\rightarrow$ `evidence.id` (NULL)
- **Important Fields:**
  - `assertion` (TEXT, NOT NULL)
  - `is_verified` (BOOLEAN, NOT NULL, DEFAULT `TRUE`)
  - `confidence` (FLOAT, NOT NULL)
- **Timestamps:** `created_at`

#### 13. `contradictions`
- **Purpose:** Neutral discrepancy records comparing customer statements against physical telemetry.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `investigation_id` $\rightarrow$ `investigations.id` (NOT NULL)
  - `customer_claim_evidence_id` $\rightarrow$ `evidence.id` (NOT NULL)
  - `telemetry_evidence_id` $\rightarrow$ `evidence.id` (NOT NULL)
- **Important Fields:**
  - `title` (VARCHAR(255), NOT NULL)
  - `statement_claim` (TEXT, NOT NULL)
  - `physical_telemetry` (TEXT, NOT NULL)
  - `discrepancy_analysis` (TEXT, NOT NULL)
  - `ethical_safeguard_acknowledged` (BOOLEAN, NOT NULL, DEFAULT `TRUE`) — Enforces *Contradiction $\neq$ Proof of Fraud*
  - `severity` (VARCHAR(20), NOT NULL, DEFAULT `'Moderate'`) — Values: `'Minor'`, `'Moderate'`, `'High'`
- **Timestamps:** `created_at`

#### 14. `root_causes`
- **Purpose:** Synthesized causal chain explaining why the failure or dispute occurred.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `investigation_id` $\rightarrow$ `investigations.id` (NOT NULL)
- **Important Fields:**
  - `headline` (VARCHAR(255), NOT NULL)
  - `summary` (TEXT, NOT NULL)
  - `causal_chain` (JSONB, NOT NULL) — Array of `{ label: string, text: string }`
  - `technical_impact` (TEXT, NOT NULL)
  - `confidence_score` (FLOAT, NOT NULL)
- **Timestamps:** `created_at`

#### 15. `resolutions`
- **Purpose:** Formulated customer response and automated system remediations.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `investigation_id` $\rightarrow$ `investigations.id` (NOT NULL)
- **Important Fields:**
  - `action_type` (VARCHAR(100), NOT NULL) — e.g., `'Autonomous Order Clearance'`, `'Full Refund'`
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'Formulated'`) — Values: `'Formulated'`, `'Approved'`, `'Executed'`, `'Rejected'`
  - `confidence_score` (FLOAT, NOT NULL)
  - `headline` (VARCHAR(255), NOT NULL)
  - `reason` (TEXT, NOT NULL)
  - `customer_facing_message` (TEXT, NOT NULL)
  - `internal_actions` (JSONB, NOT NULL) — Array of automated tasks `{ id, title, status }`
- **Timestamps:** `created_at`, `executed_at`

#### 16. `escalations`
- **Purpose:** Case records routed to human specialists when confidence is low or dollar caps are exceeded.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `case_id` $\rightarrow$ `cases.id` (NOT NULL)
  - `assigned_specialist_id` $\rightarrow$ `users.id` (NULL)
- **Important Fields:**
  - `risk_level` (VARCHAR(20), NOT NULL) — Values: `'Low'`, `'Medium'`, `'High'`, `'Critical'`
  - `reason` (TEXT, NOT NULL)
  - `recommended_action` (TEXT, NOT NULL)
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'Pending Review'`) — Values: `'Pending Review'`, `'Resolved'`, `'Overridden'`
  - `override_notes` (TEXT, NULL)
- **Timestamps:** `created_at`, `resolved_at`

---

### 3.5 FAQ & Knowledge Retrieval Domain

#### 17. `knowledge_sources`
- **Purpose:** Approved official source documents, policy guides, and SOP manuals for RAG.
- **Primary Key:** `id` (UUIDv4)
- **Important Fields:**
  - `title` (VARCHAR(255), NOT NULL)
  - `document_url` (VARCHAR(500), NULL)
  - `version` (VARCHAR(50), NOT NULL)
  - `approved_by` (VARCHAR(100), NOT NULL)
  - `is_active` (BOOLEAN, NOT NULL, DEFAULT `TRUE`)
- **Timestamps:** `created_at`, `updated_at`

#### 18. `faq_categories`
- **Purpose:** Taxonomy groupings for direct support inquiries.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'cat-returns'`)
- **Important Fields:**
  - `name` (VARCHAR(100), NOT NULL)
  - `description` (TEXT, NULL)
  - `icon_name` (VARCHAR(50), NOT NULL, DEFAULT `'HelpCircle'`)
  - `display_order` (INTEGER, NOT NULL, DEFAULT `0`)
- **Timestamps:** `created_at`

#### 19. `faq_entries`
- **Purpose:** Individual policy Q&A items with approved citations and optional vector embeddings.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'faq-ret-01'`)
- **Foreign Keys:**
  - `category_id` $\rightarrow$ `faq_categories.id` (NOT NULL)
  - `knowledge_source_id` $\rightarrow$ `knowledge_sources.id` (NULL)
- **Important Fields:**
  - `question` (TEXT, NOT NULL)
  - `short_answer` (TEXT, NOT NULL)
  - `full_answer` (TEXT, NOT NULL)
  - `source_citation` (VARCHAR(255), NOT NULL)
  - `related_queries` (JSONB, NULL)
  - `embedding` (VECTOR(1536), NULL) — Optional semantic search vector
- **Timestamps:** `created_at`, `updated_at`

---

### 3.6 Case Intelligence & Prevention Domain

#### 20. `customer_case_history`
- **Purpose:** Materialized historical records summarizing past customer interactions and veracity.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `customer_id` $\rightarrow$ `customers.id` (NOT NULL)
  - `case_id` $\rightarrow$ `cases.id` (NOT NULL)
- **Important Fields:**
  - `case_summary` (TEXT, NOT NULL)
  - `verified_outcome` (VARCHAR(50), NOT NULL) — e.g., `'Carrier At Fault'`, `'Customer Conceded'`, `'System Bug'`
  - `evidence_consistency_score` (FLOAT, NOT NULL)
- **Timestamps:** `recorded_at`

#### 21. `detected_patterns`
- **Purpose:** Systemic multi-case clusters across vendors, couriers, or microservices.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'pat-01'`)
- **Important Fields:**
  - `dimension` (VARCHAR(50), NOT NULL) — Values: `'Carrier'`, `'Seller'`, `'Payment'`, `'Product'`, `'System'`
  - `title` (VARCHAR(255), NOT NULL)
  - `impact_count` (INTEGER, NOT NULL)
  - `confidence_score` (FLOAT, NOT NULL)
  - `identified_root_cause` (TEXT, NOT NULL)
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'Active'`) — Values: `'Active'`, `'Investigating'`, `'Mitigated'`
- **Timestamps:** `first_detected_at`, `last_detected_at`

#### 22. `reliability_assessments`
- **Purpose:** Objective, statistical reliability calculation records for customer claims.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `customer_id` $\rightarrow$ `customers.id` (NOT NULL)
  - `case_id` $\rightarrow$ `cases.id` (NOT NULL)
- **Important Fields:**
  - `calculated_score` (FLOAT, NOT NULL)
  - `assigned_band` (VARCHAR(50), NOT NULL)
  - `historical_weight` (FLOAT, NOT NULL)
  - `telemetry_match_weight` (FLOAT, NOT NULL)
  - `evaluation_rationale` (TEXT, NOT NULL)
- **Timestamps:** `created_at`

#### 23. `risk_signals`
- **Purpose:** Specific behavioral or telemetry anomaly flags linked to an investigation.
- **Primary Key:** `id` (UUIDv4)
- **Foreign Keys:**
  - `investigation_id` $\rightarrow$ `investigations.id` (NOT NULL)
- **Important Fields:**
  - `signal_type` (VARCHAR(100), NOT NULL) — e.g., `'Spatial Geofence Mismatch'`, `'Duplicate Claim'`
  - `weight` (FLOAT, NOT NULL)
  - `description` (TEXT, NOT NULL)
  - `is_conclusive_evidence` (BOOLEAN, NOT NULL, DEFAULT `FALSE`) — Strict guard: signal $\neq$ proof of fraud
- **Timestamps:** `detected_at`

#### 24. `prevention_recommendations`
- **Purpose:** Actionable operational policy rules derived from systemic case patterns.
- **Primary Key:** `id` (VARCHAR(64) e.g., `'rec-01'`)
- **Foreign Keys:**
  - `detected_pattern_id` $\rightarrow$ `detected_patterns.id` (NULL)
- **Important Fields:**
  - `title` (VARCHAR(255), NOT NULL)
  - `category` (VARCHAR(100), NOT NULL)
  - `proposed_action` (TEXT, NOT NULL)
  - `expected_savings` (VARCHAR(100), NOT NULL)
  - `status` (VARCHAR(30), NOT NULL, DEFAULT `'Proposed'`) — Values: `'Proposed'`, `'Active'`, `'Dismissed'`
- **Timestamps:** `created_at`, `updated_at`

---

## 4. Data Lifecycle, Archival & Retention

1. **Active Investigation Phase (0–30 Days):** All raw telemetry payloads, event logs, and agent execution steps are held in primary online storage.
2. **Post-Resolution Retention (30–365 Days):** Case summaries, verified findings, root causes, and resolutions remain indexed for instant lookup in Customer Case Memory.
3. **Audit Trail Archival (1–7 Years):** Evidence hashes and resolution sign-offs are archived to compliant immutable object storage for dispute and chargeback litigation defense.
