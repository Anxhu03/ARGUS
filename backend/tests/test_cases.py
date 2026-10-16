import pytest

def test_list_cases(client):
    response = client.get("/api/cases")
    assert response.status_code == 200
    cases = response.json()
    assert isinstance(cases, list)
    assert len(cases) > 0
    # First case check
    first = cases[0]
    assert "id" in first
    assert "title" in first
    assert "status" in first
    assert "priority" in first

def test_list_cases_filter_status(client):
    response = client.get("/api/cases?status=resolved")
    assert response.status_code == 200
    cases = response.json()
    for c in cases:
        assert "resolv" in c["status"].lower()

def test_list_cases_filter_category(client):
    response = client.get("/api/cases?category=payment")
    assert response.status_code == 200
    cases = response.json()
    for c in cases:
        assert "payment" in c["category"].lower()

def test_list_cases_filter_priority(client):
    response = client.get("/api/cases?priority=critical")
    assert response.status_code == 200
    cases = response.json()
    for c in cases:
        assert c["priority"].lower() in ("critical", "urgent")

def test_list_cases_search_query(client):
    response = client.get("/api/cases?q=ARG-1042")
    assert response.status_code == 200
    cases = response.json()
    assert len(cases) == 1
    assert cases[0]["id"] == "ARG-1042"

def test_get_case_by_id_success(client):
    response = client.get("/api/cases/ARG-1042")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "ARG-1042"
    assert "customer" in data
    assert "activeAgents" in data
    assert "agentsData" in data
    assert "timeline" in data

def test_get_case_by_id_not_found(client):
    response = client.get("/api/cases/ARG-9999")
    assert response.status_code == 404
    error_body = response.json()
    assert "error" in error_body
    assert error_body["error"]["code"] == "ENTITY_NOT_FOUND"

def test_create_case_success(client):
    payload = {
        "title": "Webhook delay causing duplicate charges",
        "complaintText": "I was charged twice on my American Express card because the checkout page timed out.",
        "customerName": "Alice Walker",
        "customerEmail": "alice.w@example.com",
        "category": "Payment Discrepancy",
        "priority": "High",
        "orderId": "ORD-TEST-99",
        "amount": "$280.00",
        "resolutionPreference": "Full Refund to Original Card"
    }
    response = client.post("/api/cases", json=payload)
    assert response.status_code == 201
    created = response.json()
    assert created["id"].startswith("ARG-")
    assert created["customer"]["name"] == "Alice Walker"
    assert created["status"] == "Investigating"
    assert created["amount"] == "$280.00"
    assert len(created["timeline"]) == 9
    assert len(created["activeAgents"]) == 5

    # Verify retrieval
    get_res = client.get(f"/api/cases/{created['id']}")
    assert get_res.status_code == 200
    assert get_res.json()["title"] == "Webhook delay causing duplicate charges"

def test_create_case_validation_error(client):
    # complaintText too short (< 5 chars)
    payload = {
        "complaintText": "hi"
    }
    response = client.post("/api/cases", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "error" in data
    assert data["error"]["code"] == "VALIDATION_ERROR"

def test_patch_case_status(client):
    update_payload = {
        "status": "Resolved",
        "reason": "Supervisor confirmed gateway charge reversal."
    }
    response = client.patch("/api/cases/ARG-1042", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert updated["status"] == "Resolved"
    assert any("Status updated" in note["text"] for note in updated["internalNotes"])

def test_patch_case_priority(client):
    update_payload = {
        "priority": "Critical"
    }
    response = client.patch("/api/cases/ARG-1043", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert updated["priority"] == "Critical"

def test_patch_case_assignment(client):
    update_payload = {
        "assignedTeam": "Fraud & Risk",
        "assignedAgent": "Marcus Vance"
    }
    response = client.patch("/api/cases/ARG-1044", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert updated["assignedTeam"] == "Fraud & Risk"
    assert updated["assignedAgent"] == "Marcus Vance"

def test_patch_case_add_note(client):
    update_payload = {
        "note": {
            "author": "Elena Rostova",
            "role": "Payments Lead",
            "text": "Cardholder transaction traces verified with acquirer."
        }
    }
    response = client.patch("/api/cases/ARG-1045", json=update_payload)
    assert response.status_code == 200
    updated = response.json()
    assert any("Cardholder transaction traces" in note["text"] for note in updated["internalNotes"])

def test_patch_case_not_found(client):
    response = client.patch("/api/cases/ARG-NONEXISTENT", json={"status": "Resolved"})
    assert response.status_code == 404
    error_body = response.json()
    assert "error" in error_body
