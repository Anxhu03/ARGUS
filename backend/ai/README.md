# ARGUS — AI Intelligence Layer (Backend 2)

**Developer**: Aman Rawat  
**Git Branch**: `aman/backend-2`  
**Responsibility**: AI / Agent Intelligence Layer

---

## 1. Overview & Architecture

ARGUS AI Intelligence provides a modular, contract-driven architecture for autonomous customer support triage, informational answering, multi-agent investigation, contradiction detection, and root-cause analysis.

### System Flow

```
                      +-------------------+
                      |   Customer Case   |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |   ARGUS Router    |
                      +----+---------+----+
                           |         |
              Route == FAQ |         | Route == INVESTIGATION
                           |         |
                           v         v
                +--------------+   +-------------------------------------+
                |  FAQ Agent   |   |        Specialized Agents           |
                +-------+------+   | +--------------+ +----------------+ |
                        |          | | BillingAgent | |   OrderAgent   | |
                        v          | +--------------+ +----------------+ |
                +--------------+   | +--------------+                    |
                | RAG Retriever|   | |  TechAgent   |                    |
                +-------+------+   | +--------------+                    |
                        |          +------------------+------------------+
                        v                             |
                +--------------+                      v
                | Policy Answer|             +------------------+
                +--------------+             |   Coordinator    |
                                             +--------+---------+
                                                      |
                                                      v
                                             +------------------+
                                             | Root Cause Engine|
                                             +--------+---------+
                                                      |
                                                      v
                                             +------------------+
                                             |  Resolution /    |
                                             | Human Escalation |
                                             +------------------+
```

---

## 2. Core Architectural Distinction

| Component | Question Answered | Operational Method | Data Sources |
|---|---|---|---|
| **FAQ / RAG** | *"What is the information?"* | Semantic search & knowledge retrieval | Approved organizational policies, knowledge base chunks |
| **Specialized Agents** | *"What happened and why?"* | Multi-party telemetry & evidence investigation | Payment gateways, warehouse feeds, carrier scans, server logs |

---

## 3. Fairness Principles

ARGUS enforces strict fairness and non-bias constraints:
- **No Deceptive Labeling**: Repeated complaints or mismatched documentation are categorized as **`RiskSignal`** ("risk signal", "evidence conflict", "additional verification required").
- **Multi-Party Grounding**: Evidence from all entities (**Customer**, **Seller**, **Delivery Partner**, **Payment Gateway**, **System Logs**) is evaluated symmetrically without bias.
- **No Automatic Fraud Concurrence**: System never marks a customer as "fraudulent". Contradictions trigger **objective verification steps** (e.g. carrier GPS audit, bank statement verification) or human supervisor review.

---

## 4. Module Directory Structure

```
backend/
└── ai/
    ├── __init__.py               # Top-level exports and facade
    ├── models/
    │   ├── __init__.py
    │   └── case.py               # Normalized CustomerCase, EvidenceItem, Findings, RiskSignal
    ├── config/
    │   ├── __init__.py
    │   └── settings.py           # AISettings, thresholds, environment overrides
    ├── router/
    │   ├── __init__.py
    │   └── router.py             # BaseRouter, RuleBasedRouter (swappable with LLM classifier)
    ├── rag/
    │   ├── __init__.py
    │   └── retriever.py          # BaseRetriever, InMemoryRetriever (swappable with FAISS/Chroma/pgvector)
    ├── faq/
    │   ├── __init__.py
    │   └── faq_agent.py          # BaseFAQAgent, DefaultFAQAgent (grounded policy answers)
    ├── agents/
    │   ├── __init__.py
    │   ├── base.py               # BaseAgent contract and helpers
    │   ├── billing.py            # BillingAgent (charges, refunds, duplicate auths)
    │   ├── order.py              # OrderAgent (shipments, tracking scans, missing items)
    │   └── tech.py               # TechAgent (outages, checkout 5xx logs, app errors)
    ├── coordinator/
    │   ├── __init__.py
    │   └── coordinator.py        # BaseCoordinator, DefaultCoordinator (cross-domain contradictions)
    ├── root_cause/
    │   ├── __init__.py
    │   └── engine.py             # BaseRootCauseEngine, DefaultRootCauseEngine (resolution vs escalation)
    └── orchestration/
        ├── __init__.py
        └── orchestrator.py       # AIOrchestrator pipeline service
```

---

## 5. Integration Contracts for Other Developers

### A. Backend 1 (AmanSR - Data & API Infrastructure)

Backend 1 owns database models, FastAPI routing endpoints, and persistence. Backend 2 (AI Intelligence) is consumed via a clean service facade:

```python
from backend.ai import get_orchestrator, CustomerCase, EvidenceItem, EvidenceSource

# 1. Instantiate the orchestrator (singleton or dependency injected)
orchestrator = get_orchestrator()

# 2. Construct the normalized case from incoming HTTP request / DB records
case = CustomerCase(
    case_id="case_12345",
    customer_id="cust_987",
    complaint="My package was marked delivered, but it never arrived!",
    order_id="ord_555",
    evidence=[
        EvidenceItem(
            id="ev_scan_1",
            source=EvidenceSource.DELIVERY_PARTNER,
            evidence_type="carrier_scan",
            data={"status": "delivered", "geo_verified": True},
        )
    ],
)

# 3. Process the case synchronously or asynchronously
result = orchestrator.process_case(case)
# Or asynchronously:
# result = await orchestrator.aprocess_case(case)

# 4. Check route output
if result.route == "FAQ":
    print("FAQ Answer:", result.faq_response.answer)
else:
    print("Root Cause:", result.root_cause_result.root_cause)
    print("Action:", result.root_cause_result.recommended_action)
    print("Escalation Required:", result.root_cause_result.escalation_required)
```

### B. Frontend Developers (Alok & Anxhu)

The API response contract returned by the AI layer is serialized cleanly using Pydantic:

#### 1. FAQ Response Schema
```json
{
  "case_id": "case_101",
  "route": "FAQ",
  "routing_decision": {
    "route": "FAQ",
    "agents": [],
    "confidence": 0.92,
    "intent": "informational_inquiry"
  },
  "faq_response": {
    "question": "What is your return policy?",
    "answer": "According to our Standard Return Policy:\nCustomers can return eligible items within 30 days...",
    "confidence": 0.95,
    "is_direct_match": true,
    "suggested_followups": [
      "How do I initiate a return label?",
      "How long until my refund is issued?"
    ]
  }
}
```

#### 2. Complex Investigation Response Schema
```json
{
  "case_id": "case_102",
  "route": "INVESTIGATION",
  "routing_decision": {
    "route": "INVESTIGATION",
    "agents": ["order", "billing"],
    "confidence": 0.88,
    "intent": "incident_investigation"
  },
  "consolidated_investigation": {
    "case_id": "case_102",
    "summary": "Investigation synthesized across 2 specialized agent(s)...",
    "overall_confidence": 0.72,
    "requires_escalation": true,
    "contradictions": [
      {
        "description": "Carrier status marked Delivered while customer reports non-receipt",
        "source_a": "customer_complaint",
        "source_b": "delivery_partner_scan",
        "detail": "Delivery partner recorded package as delivered...",
        "severity": "high"
      }
    ],
    "risk_signals": [
      {
        "signal_type": "recurrent_delivery_conflict_signal",
        "description": "Account notes prior delivery discrepancy claims...",
        "severity": "medium",
        "recommended_verification": "Conduct courier physical GPS pin audit..."
      }
    ],
    "missing_evidence": ["carrier_geolocation_and_signature_record"]
  },
  "root_cause_result": {
    "case_id": "case_102",
    "root_cause": "Evidence Conflict: Carrier status marked Delivered while customer reports non-receipt",
    "root_cause_category": "EVIDENCE_CONFLICT",
    "confidence": 0.72,
    "recommended_action": "Route to Senior Specialist for manual document reconciliation.",
    "escalation_required": true,
    "escalation_reason": "Unresolved critical contradiction...",
    "prevention_tip": "Ensure courier GPS telemetry is synchronized in real-time."
  }
}
```

---

## 6. How to Run Tests

Run the complete test suite from the repository root:

```bash
python -m unittest discover -s tests -v
```
