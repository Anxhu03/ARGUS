import pytest
from starlette.testclient import TestClient

def test_get_case_evidence_success(client: TestClient):
    resp = client.get("/api/cases/ARG-1042/evidence")
    assert resp.status_code == 200
    evidence = resp.json()
    assert isinstance(evidence, list)
    assert len(evidence) >= 4
    
    first = evidence[0]
    assert "id" in first
    assert "title" in first
    assert "sourceLabel" in first
    assert first["sourceLabel"] in ("verified", "simulated", "mock")
    assert "verificationAudit" in first
    assert "checks" in first["verificationAudit"]
    assert "confidenceScore" in first

def test_get_case_evidence_filter_by_status(client: TestClient):
    resp = client.get("/api/cases/ARG-1043/evidence?status=Conflicting")
    assert resp.status_code == 200
    evidence = resp.json()
    assert len(evidence) >= 1
    for ev in evidence:
        assert ev["status"].lower() == "conflicting"

def test_get_case_evidence_not_found(client: TestClient):
    resp = client.get("/api/cases/ARG-9999/evidence")
    assert resp.status_code == 404
    err = resp.json()
    assert err["error"]["code"] == "ENTITY_NOT_FOUND"

def test_add_evidence_success(client: TestClient):
    payload = {
        "title": "Stripe Gateway Webhook Ingress Telemetry",
        "type": "Network Signal",
        "source": "Stripe Webhook Forwarder",
        "sourceLabel": "verified",
        "description": "200 OK webhook dispatched with HMAC signature v1,t=1727687662.",
        "payload": {
            "charge_id": "ch_TEST_NEW_9921",
            "event_type": "charge.captured",
            "order_id": "ORD-88219",
            "amount": 389.00
        }
    }
    resp = client.post("/api/cases/ARG-1042/evidence", json=payload)
    assert resp.status_code == 201
    created = resp.json()
    assert created["id"].startswith("ev-")
    assert created["title"] == payload["title"]
    assert created["status"] in ("Verified", "Pending", "Requires Clarification")
    assert created["sha256"] is not None
    assert "verificationAudit" in created
    assert created["verificationAudit"]["passed"] is True

def test_add_duplicate_evidence_detected(client: TestClient):
    payload = {
        "title": "Duplicate Stripe Gateway Capture Record",
        "type": "Financial Record",
        "source": "Stripe API (Live Endpoint)",
        "sourceLabel": "verified",
        "description": "Attempting to re-ingest duplicate charge capture.",
        "payload": {
            "charge_id": "ch_3M4zZ8891",
            "amount": 389,
            "status": "succeeded"
        }
    }
    resp = client.post("/api/cases/ARG-1042/evidence", json=payload)
    assert resp.status_code == 409
    err = resp.json()
    assert err["error"]["code"] == "DUPLICATE_EVIDENCE"
    assert "Duplicate transaction reference" in err["error"]["message"]

def test_add_evidence_validation_error(client: TestClient):
    # Missing required title and type
    payload = {
        "description": "Malformed artifact"
    }
    resp = client.post("/api/cases/ARG-1042/evidence", json=payload)
    assert resp.status_code == 422
    err = resp.json()
    assert err["error"]["code"] == "VALIDATION_ERROR"

def test_contradiction_detection_spatial_mismatch(client: TestClient):
    resp = client.get("/api/cases/ARG-1043/contradictions")
    assert resp.status_code == 200
    contra = resp.json()
    assert contra is not None
    assert "Contradiction Detected" in contra["headline"]
    assert "GPS Geolocation" in " ".join(contra["conflictFields"])
    assert len(contra["conflictingEvidenceIds"]) >= 1
    assert "disclaimer" in contra
    assert "fraud" in contra["disclaimer"].lower()

def test_contradiction_detection_weight_anomaly(client: TestClient):
    resp = client.get("/api/cases/ARG-1047/contradictions")
    assert resp.status_code == 200
    contra = resp.json()
    assert contra is not None
    assert "Physical Mass" in " ".join(contra["conflictFields"]) or "Weight" in contra["headline"]
    assert "laser scale" in contra["systemEvidence"].lower() or "weight" in contra["systemEvidence"].lower()

def test_verification_report_endpoint(client: TestClient):
    resp = client.get("/api/cases/ARG-1042/verification")
    assert resp.status_code == 200
    report = resp.json()
    assert report["caseId"] == "ARG-1042"
    assert report["totalEvidence"] >= 4
    assert report["verifiedCount"] >= 3
    assert "evidence" in report
    assert "rootCause" in report

def test_root_cause_analysis_sufficient_evidence(client: TestClient):
    resp = client.get("/api/cases/ARG-1042/root-cause")
    assert resp.status_code == 200
    rc = resp.json()
    assert "headline" in rc
    assert "summary" in rc
    assert len(rc["chain"]) >= 2
    assert rc["isSufficient"] is True
    assert rc["uncertaintyLevel"] in ("Low", "Moderate")
    assert len(rc["verifiedFacts"]) >= 1

def test_root_cause_analysis_insufficient_evidence(client: TestClient):
    # Case ARG-1041 has 0 evidence
    resp = client.get("/api/cases/ARG-1041/root-cause")
    assert resp.status_code == 200
    rc = resp.json()
    assert rc["isSufficient"] is False
    assert rc["uncertaintyLevel"] == "High"
    assert "Zero Evidence" in rc["headline"] or "Undetermined" in rc["headline"]
    assert rc["nextAction"] is not None

def test_analyze_case_endpoint(client: TestClient):
    resp = client.post("/api/cases/ARG-1042/analyze")
    assert resp.status_code == 200
    analysis = resp.json()
    assert analysis["caseId"] == "ARG-1042"
    assert "rootCause" in analysis
    assert "findings" in analysis
    assert "verifiedFacts" in analysis["findings"]
