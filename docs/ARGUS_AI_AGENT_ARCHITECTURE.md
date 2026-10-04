# ARGUS — Multi-Agent AI Architecture & Investigation Framework

**Document Version:** 1.0.0 (Phase 1 Baseline)  
**Author:** Principal Software Architect & Technical Lead  
**Repository:** [ARGUS (github.com/Anxhu03/ARGUS)](https://github.com/Anxhu03/ARGUS)  
**Status:** Approved Technical Blueprint  

---

## 1. Multi-Agent Philosophy: Deterministic DAG vs. Conversational Chatbot

Traditional customer support bots fail because they operate as conversational text generators with unbounded prompt loops. They hallucinate non-existent tracking numbers, offer unauthorized refunds, and cannot cross-reference physical telemetry.

**ARGUS fundamentally departs from conversational chatbots:**
- **Directed Acyclic Graph (DAG) Execution:** Agents execute structured diagnostic code and deterministic queries in parallel.
- **Strict Evidence Anchoring:** Agents are forbidden from asserting facts that do not link to an empirical database entity, API response, or cryptographic hash.
- **Traceable Attribution:** Every finding specifies the exact agent, query, timestamp, and confidence rating.
- **Ethical Safeguard (*Contradiction ≠ Proof of Fraud*):** A discrepancy between customer statements and physical telemetry is labeled as a factual conflict, not moral deception.

---

## 2. Multi-Agent Swarm Topology

```
                       [ Customer Complaint / Dispute Intake ]
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │       INVESTIGATION COORDINATOR       │
                     │  - Complaint Classification          │
                     │  - Investigation Plan Formulation     │
                     │  - Parallel Task Dispatch             │
                     └───────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
      ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
      │    BILLING AGENT    │ │     ORDER AGENT     │ │   TECHNICAL AGENT   │
      │ - Gateway Ledgers   │ │ - OMS State Machine │ │ - Ingress Telemetry │
      │ - Authorization Auth│ │ - WMS Queue Holds   │ │ - Kafka Message Bus │
      │ - Escrow Status     │ │ - Carrier GPS / POD │ │ - Dead-Letter Queues│
      └──────────┬──────────┘ └──────────┬──────────┘ └──────────┬──────────┘
                 │                       │                       │
                 └───────────────────────┼───────────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          EVIDENCE MATRIX &            │
                     │       CONTRADICTION DETECTOR          │
                     │  - Cryptographic Hash Validation      │
                     │  - Statement vs. Telemetry Audit      │
                     │  - Ethical Conflict Flagging          │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │          ROOT CAUSE SYNTHESIS         │
                     │  - Causal Chain Reasoning             │
                     │  - Bayesian Consensus Calculation     │
                     └───────────────────┬───────────────────┘
                                         │
                                         ▼
                         Is Consensus >= 90% AND Risk < $150?
                                  /              \
                                YES               NO
                                /                  \
                               ▼                    ▼
                    ┌─────────────────────┐ ┌─────────────────────┐
                    │  ACTION RESOLUTION  │ │   HUMAN SPECIALIST  │
                    │ - Customer Response │ │      ESCALATION     │
                    │ - Internal Actions  │ │ - Override Review   │
                    │ - Auto-Remediation  │ │ - Evidence Request  │
                    └─────────────────────┘ └─────────────────────┘
```

---

## 3. Agent Responsibilities & Boundaries

### 3.1 Investigation Coordinator
- **Role:** Master DAG orchestrator.
- **Boundaries:** Does not query third-party gateways directly. Manages task state, classifies customer complaints, deploys specialized agents, aggregates findings, and validates consensus.
- **Outputs:** Investigation Plan, Status Transitions, Consolidated Resolution Plan.

### 3.2 Billing Agent
- **Role:** Payment & financial transaction auditor.
- **Capabilities:**
  - Queries Stripe, PayPal, and banking ledgers for transaction authorization, capture, and settlement.
  - Validates chargeback dispute statuses and escrow hold conditions.
  - Detects duplicate charges caused by client-side retries or idempotency key collisions.
- **Hard Guardrail:** Must return `UNVERIFIED` if the payment gateway returns an ambiguous status or network timeout. Never assumes a charge succeeded without a verified capture ID.

### 3.3 Order Agent
- **Role:** Fulfillment, warehouse, and logistics investigator.
- **Capabilities:**
  - Audits Order Management System (OMS) state machines for stuck transitions.
  - Queries Warehouse Management System (WMS) pick/pack queues and inventory hold tags.
  - Inspects carrier electronic Proof of Delivery (e-POD), carrier GPS coordinates, and delivery geofences.
- **Hard Guardrail:** Rejects delivery claims as conclusive unless geofence coordinates match customer shipping coordinates within configured tolerance (e.g. 50 meters).

### 3.4 Technical Agent
- **Role:** Infrastructure, message bus, and system telemetry investigator.
- **Capabilities:**
  - Ingests distributed tracing logs (OpenTelemetry, Datadog) for the relevant order timeframe.
  - Scans Kafka / RabbitMQ consumer group lags for stuck partitions.
  - Queries Dead Letter Queues (DLQ) for dropped order creation or inventory release events.
- **Hard Guardrail:** Confines log queries to specific correlation IDs and time windows to avoid noisy alert fatigue.

---

## 4. Evidence Verification & Contradiction Detection

### 4.1 Neutral Discrepancy Matrix
Discrepancies are computed objectively by comparing customer claims against physical telemetry:

$$\text{Discrepancy} = \text{Customer Statement Claim} \iff \text{Empirical Physical Record}$$

**Example Case (`ARG-1043`):**
- **Customer Statement:** *"Driver never came to my house. Package was never delivered."*
- **Carrier Telemetry:** FastTrack GPS geofence recorded at front doorstep at 14:12 UTC with signed delivery receipt photo.
- **Neutral Output:** Acknowledges discrepancy without accusing the customer of fraud (e.g., driver may have delivered to an adjacent unit, or package was stolen post-delivery).

### 4.2 Ethical Safeguard Protocol
1. Contradictions trigger **Neutral Inquiries** or **Dynamic Evidence Protocols**, never immediate account bans.
2. The UI explicitly renders the warning banner:
   > *"Contradiction ≠ Proof of Fraud: System records discrepancies factually to assist human investigators and prevent biased automation."*

---

## 5. Root Cause Analysis & Autonomous Resolution

### 5.1 Deterministic Root Cause Chain
The Root Cause Synthesizer connects discrete findings into a 3-stage chain:
1. **Evidence:** Payment gateway ledger confirms transaction `ch_3M4zZ8891` captured $199.00.
2. **Finding:** OMS order `ORD-99124` remained in `'Payment Pending'` state due to Kafka DLQ event drop on ingress pod restart.
3. **Root Cause:** Transient message bus partition rebalance dropped the order confirmation webhook.

### 5.2 Resolution vs. Escalation Gate
A case qualifies for **Autonomous Resolution** only when:
1. Multi-agent consensus score $\ge 90.0\%$.
2. Zero unresolved high-severity contradictions.
3. Disputed monetary value $\le$ configured threshold (`ARGUS_AUTO_RESOLVE_LIMIT`, default `$150.00`).

If any condition fails, the case is routed to **Human Escalation Review** with recommended actions and risk badges.

---

## 6. The Closed-Loop Case Intelligence Engine

ARGUS operationalizes a continuous feedback loop that improves future investigations:

```
[Complaint Ingestion]
        │
        ▼
[Investigation DAG]
        │
        ▼
[Root Cause Diagnosis]
        │
        ▼
[Verified Resolution]
        │
        ▼
[Institutional Memory] ──► [Cross-Case Pattern Detection] ──► [Systemic Prevention Rules]
        │                                                               │
        └───────────────────────────────◄───────────────────────────────┘
                     (Refines Dynamic Evidence Protocols)
```

### 6.1 The 5 Pattern Detection Dimensions
1. **Carrier Anomaly:** Courier routes experiencing recurring GPS drift or high dispute rates in specific zip codes.
2. **Seller / Vendor Anomaly:** Merchant partners with recurring SKU mislabeling or packaging defects.
3. **Payment Gateway Anomaly:** Recurring 504 gateway timeouts on specific card issuers.
4. **Product Quality Anomaly:** Batch defect rates on specific manufactured hardware SKUs.
5. **System / Infrastructure Anomaly:** Recurring webhook drops following deployment rollouts.

### 6.2 Complaint Reliability Indexing
- Customer Reliability is scored from 0 to 100 based strictly on verified historical dispute outcomes:
  - **High Reliability (85–100):** Consistently verified claims; eligible for low-touch autonomous resolution.
  - **Moderate Reliability (60–84):** Standard evidence review protocol.
  - **Review Required (<60):** Mandatory human specialist sign-off before financial remedies.
- **Rule:** High complaint volume alone does not degrade reliability if past complaints were verified as carrier or system errors.

### 6.3 Dynamic Evidence Protocol
Evidence requirements adapt dynamically to case context:
- **Tier 1 (Low-Touch):** Digital receipt or order ID sufficient (low value, high customer reliability).
- **Tier 2 (Standard):** System log verification and payment ledger cross-check.
- **Tier 3 (Quality Inspection):** Photo upload of unboxed item required (product damage claims).
- **Tier 4 (High-Value / Strict):** Signed carrier affidavit and specialist human sign-off required.
