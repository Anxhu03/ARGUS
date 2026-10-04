# ARGUS — REST API Contract & Specification

**Document Version:** 1.0.0 (Phase 1 Baseline)  
**Author:** Principal Software Architect & Technical Lead  
**Base URL:** `http://localhost:8000/api/v1`  
**Data Format:** JSON (`application/json`)  
**Status:** Approved Implementation Blueprint  

---

## 1. Global Conventions & Standard Error Format

### 1.1 Authentication & Request Headers
- `Authorization: Bearer <JWT_TOKEN>` (Required for operator & specialist endpoints)
- `X-Trace-ID: <UUID>` (Optional; generated automatically if omitted for distributed tracing)
- `Content-Type: application/json`

### 1.2 Standard Error Response Payload
All 4xx and 5xx responses conform to RFC 7807 Problem Details:

```json
{
  "error": {
    "code": "ENTITY_NOT_FOUND",
    "message": "Case with ID ARG-9999 was not found in active cluster.",
    "trace_id": "tr-66a98-1029",
    "details": [
      { "field": "case_id", "issue": "No matching record" }
    ]
  }
}
```

---

## 2. API Endpoint Specifications

### 2.1 Dashboard & Operational Telemetry

#### `GET /api/v1/dashboard/metrics`
- **Purpose:** Ingests aggregate KPIs for the top executive overview bar.
- **Request:** No parameters.
- **Response `200 OK`:**
  ```json
  {
    "activeCases": 24,
    "investigationsRunning": 8,
    "casesResolved": 1429,
    "contradictionsDetected": 14,
    "autoResolutionRatePercent": 98.4,
    "protectedCapitalAmount": 128450.00,
    "currency": "USD",
    "updatedAt": "2026-10-04T18:00:00Z"
  }
  ```

#### `GET /api/v1/dashboard/velocity`
- **Purpose:** Retrieves 7-day ingestion, resolution, and contradiction volume for SVG charting.
- **Query Parameters:** `days` (integer, default: 7)
- **Response `200 OK`:**
  ```json
  {
    "timeframe": "7d",
    "days": [
      { "day": "Mon", "ingested": 42, "resolved": 38, "contradiction": 2, "protectedAmount": 14200.00 },
      { "day": "Tue", "ingested": 58, "resolved": 54, "contradiction": 3, "protectedAmount": 18900.00 },
      { "day": "Wed", "ingested": 74, "resolved": 70, "contradiction": 4, "protectedAmount": 26400.00 }
    ]
  }
  ```

---

### 2.2 Case Management

#### `GET /api/v1/cases`
- **Purpose:** Returns paginated, filtered list of dispute cases.
- **Query Parameters:**
  - `status` (string, optional) — e.g. `'Investigating'`, `'Contradiction Detected'`, `'Human Review'`, `'Resolved'`
  - `category` (string, optional) — e.g. `'Billing'`, `'Logistics'`, `'Technical'`
  - `priority` (string, optional) — e.g. `'Critical'`, `'High'`, `'Medium'`
  - `query` (string, optional) — search keyword for case ID, customer name, title
  - `limit` (integer, default: 20, max: 100)
  - `offset` (integer, default: 0)
- **Response `200 OK`:**
  ```json
  {
    "total": 34,
    "offset": 0,
    "limit": 20,
    "items": [
      {
        "id": "ARG-1042",
        "title": "Payment captured twice on webhook retry; duplicate order placed",
        "customer": {
          "id": "CUST-8821",
          "name": "Sarah Jenkins",
          "email": "sarah.j@enterprise.org",
          "tier": "Enterprise Tier",
          "reliabilityScore": 96.0,
          "reliabilityBand": "High Reliability"
        },
        "category": "Billing & Order Sync",
        "priority": "High",
        "status": "Investigating",
        "amount": "$199.00",
        "orderId": "ORD-99124",
        "createdAt": "2026-10-04T12:30:00Z",
        "updatedAt": "2026-10-04T12:34:10Z"
      }
    ]
  }
  ```

#### `GET /api/v1/cases/{case_id}`
- **Purpose:** Fetches complete investigation file for a specific case.
- **Path Parameter:** `case_id` (string, e.g. `'ARG-1042'`)
- **Response `200 OK`:** Complete case object including customer metadata, active agents, 9-stage timeline, evidence list, contradiction, root cause, and resolution.
- **Errors:**
  - `404 Not Found`: Case does not exist.

#### `PATCH /api/v1/cases/{case_id}/status`
- **Purpose:** Manually updates case status (e.g. `'Resolved'`, `'Evidence Required'`).
- **Request Body:**
  ```json
  {
    "status": "Resolved",
    "reason": "Specialist validated carrier waiver"
  }
  ```
- **Response `200 OK`:** Updated case summary.

---

### 2.3 Support Portal & Complaint Submission

#### `POST /api/v1/support/complaints`
- **Purpose:** Ingests customer complaint and auto-provisions a new investigation case.
- **Request Body:**
  ```json
  {
    "customerName": "Michael Scott",
    "customerEmail": "m.scott@dunder.com",
    "orderId": "ORD-77192",
    "category": "Billing & Order Sync",
    "priority": "High",
    "complaintText": "My credit card was charged $240, but order shows pending in my dashboard.",
    "attachments": [
      { "fileName": "bank_statement.pdf", "fileUrl": "https://storage.argus.internal/ev-1049.pdf" }
    ]
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "caseId": "ARG-1049",
    "status": "Investigating",
    "assignedAgents": ["billing", "order", "tech", "coordinator"],
    "createdAt": "2026-10-04T18:10:00Z",
    "message": "Multi-agent investigation pipeline deployed in parallel."
  }
  ```

#### `GET /api/v1/support/faq`
- **Purpose:** Direct information retrieval for static policy questions.
- **Query Parameters:**
  - `query` (string, optional)
  - `category` (string, optional)
- **Response `200 OK`:**
  ```json
  {
    "total": 6,
    "items": [
      {
        "id": "faq-ret-01",
        "category": "Returns & Refunds",
        "question": "What is the return window for hardware devices?",
        "shortAnswer": "30 days from verified delivery date.",
        "fullAnswer": "All hardware devices may be returned within 30 calendar days of confirmed carrier delivery...",
        "sourceCitation": "Global Hardware Policy Doc #401",
        "relatedQueries": ["Can I return opened box items?", "Who pays for return shipping?"]
      }
    ]
  }
  ```

---

### 2.4 Multi-Agent Investigation Execution

#### `POST /api/v1/investigations/{case_id}/run`
- **Purpose:** Triggers or re-runs the parallel multi-agent DAG for a case.
- **Response `202 Accepted`:**
  ```json
  {
    "investigationId": "inv-9921-bc",
    "caseId": "ARG-1042",
    "status": "running",
    "dispatchedAgents": ["billing", "order", "tech"],
    "pollUrl": "/api/v1/investigations/inv-9921-bc/status"
  }
  ```

#### `GET /api/v1/investigations/{investigation_id}/telemetry`
- **Purpose:** Ingests live telemetry, confidence scores, and findings from executing agents.
- **Response `200 OK`:**
  ```json
  {
    "investigationId": "inv-9921-bc",
    "consensusScore": 96.5,
    "status": "consensus_formed",
    "agents": {
      "billing": {
        "status": "Completed",
        "confidenceScore": 99.2,
        "executionTimeMs": 182,
        "findings": ["Stripe charge ch_3M4zZ8891 captured successfully", "Zero dispute flags"]
      },
      "order": {
        "status": "Completed",
        "confidenceScore": 97.8,
        "executionTimeMs": 310,
        "findings": ["OMS order locked in staging warehouse queue", "Carrier label generated"]
      },
      "tech": {
        "status": "Completed",
        "confidenceScore": 92.4,
        "executionTimeMs": 890,
        "findings": ["Kafka DLQ dropped confirmation event during pod bounce"]
      }
    }
  }
  ```

---

### 2.5 Evidence, Contradictions & Resolution

#### `GET /api/v1/cases/{case_id}/evidence`
- **Purpose:** Retrieves cryptographic evidence records with verification status.
- **Response `200 OK`:**
  ```json
  {
    "caseId": "ARG-1042",
    "evidenceCount": 4,
    "items": [
      {
        "id": "ev-1042-01",
        "title": "Carrier FastTrack e-POD Telemetry",
        "type": "Carrier Telemetry",
        "source": "FastTrack Logistics API",
        "timestamp": "2026-10-04T12:28:14Z",
        "status": "Verified",
        "sha256": "4a7d1ed414474e4033ac29ccb8653d9b002c62",
        "payload": {
          "tracking_number": "FT-889124",
          "geofence_verified": true,
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      }
    ]
  }
  ```

#### `POST /api/v1/cases/{case_id}/resolution/approve`
- **Purpose:** Approves and triggers automated internal system remediation.
- **Response `200 OK`:**
  ```json
  {
    "caseId": "ARG-1042",
    "status": "Resolved",
    "executedActions": [
      { "id": "act-1", "title": "Replay Kafka DLQ event", "status": "Executed" },
      { "id": "act-2", "title": "Issue $20 store credit voucher", "status": "Executed" }
    ],
    "resolvedAt": "2026-10-04T18:15:22Z"
  }
  ```

#### `POST /api/v1/cases/{case_id}/escalate`
- **Purpose:** Escalates case to human supervisor review.
- **Request Body:**
  ```json
  {
    "reason": "Disputed amount exceeds $150 auto-resolution threshold",
    "riskLevel": "High"
  }
  ```
- **Response `200 OK`:** Updated escalation status and assigned specialist.

---

### 2.6 Case Intelligence, Patterns & Prevention

#### `GET /api/v1/intelligence/patterns`
- **Purpose:** Retrieves systemic cross-case pattern detection clusters.
- **Response `200 OK`:**
  ```json
  {
    "totalPatterns": 5,
    "items": [
      {
        "id": "pat-01",
        "dimension": "Carrier",
        "title": "FastTrack Regional Delivery GPS Drift in Sector 9",
        "impactCount": 42,
        "confidenceScore": 94.2,
        "identifiedRootCause": "Driver handheld GPS calibration failure in high-density zip codes.",
        "status": "Active"
      }
    ]
  }
  ```

#### `PATCH /api/v1/intelligence/prevention/{recommendation_id}`
- **Purpose:** Toggles operational status of systemic prevention recommendations.
- **Request Body:**
  ```json
  {
    "status": "Active"
  }
  ```
- **Response `200 OK`:** Updated recommendation record.
