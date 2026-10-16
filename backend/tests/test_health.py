def test_health_check_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ARGUS" in data["service"]
    assert data["version"] == "1.0.0"
    assert data["database"]["status"] == "connected"
    assert data["database"]["cases_count"] >= 0
    assert "timestamp" in data
