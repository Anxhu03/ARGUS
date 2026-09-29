"""Tests for normalized case and evidence data models."""

import unittest
from datetime import datetime, timezone
from backend.ai.models import (
    AgentFinding,
    AgentInvestigationResult,
    AgentStatus,
    CasePriority,
    CaseStatus,
    Contradiction,
    ConversationMessage,
    CustomerCase,
    EvidenceItem,
    EvidenceSource,
    RiskSignal,
)


class TestCaseModels(unittest.TestCase):
    """Validate CustomerCase and related models contracts."""

    def test_customer_case_minimal_creation(self):
        """Verify CustomerCase can be instantiated with only required fields."""
        case = CustomerCase(
            case_id="case_101",
            customer_id="cust_abc",
            complaint="Where is my shipment?",
        )
        self.assertEqual(case.case_id, "case_101")
        self.assertEqual(case.customer_id, "cust_abc")
        self.assertEqual(case.complaint, "Where is my shipment?")
        self.assertIsNone(case.order_id)
        self.assertIsNone(case.payment_id)
        self.assertEqual(case.priority, CasePriority.MEDIUM)
        self.assertEqual(case.status, CaseStatus.OPEN)
        self.assertEqual(len(case.evidence), 0)
        self.assertEqual(len(case.conversation_history), 0)

    def test_customer_case_extensibility_and_evidence(self):
        """Verify CustomerCase supports full evidence items and optional metadata."""
        now = datetime.now(timezone.utc)
        evidence = EvidenceItem(
            id="ev_01",
            source=EvidenceSource.DELIVERY_PARTNER,
            evidence_type="carrier_scan",
            data={"status": "delivered", "geo_lat": 37.77, "geo_lon": -122.41},
            timestamp=now,
            verified=True,
        )
        case = CustomerCase(
            case_id="case_102",
            customer_id="cust_xyz",
            complaint="Item arrived broken",
            order_id="ord_999",
            payment_id="pay_888",
            priority=CasePriority.HIGH,
            status=CaseStatus.INVESTIGATING,
            metadata={"loyalty_tier": "gold", "channel": "mobile_app"},
            conversation_history=[
                ConversationMessage(sender="customer", message="Package was crushed", timestamp=now)
            ],
            evidence=[evidence],
        )

        self.assertEqual(case.order_id, "ord_999")
        self.assertEqual(case.payment_id, "pay_888")
        self.assertEqual(case.priority, CasePriority.HIGH)
        self.assertEqual(len(case.evidence), 1)
        self.assertEqual(case.evidence[0].source, EvidenceSource.DELIVERY_PARTNER)
        self.assertTrue(case.evidence[0].verified)

    def test_fairness_risk_signal_model(self):
        """Verify RiskSignal uses objective, non-accusatory terminology."""
        signal = RiskSignal(
            signal_type="recurrent_delivery_conflict_signal",
            description="Repeated claims of missing delivery in same postal code.",
            severity="medium",
            recommended_verification="Carrier supervisor photo verification audit",
        )
        self.assertEqual(signal.signal_type, "recurrent_delivery_conflict_signal")
        self.assertIn("verification", signal.recommended_verification)

    def test_agent_investigation_result_serialization(self):
        """Verify AgentInvestigationResult serializes to dict and JSON."""
        res = AgentInvestigationResult(
            agent_name="TestAgent",
            status=AgentStatus.SUCCESS,
            findings=[
                AgentFinding(category="test", finding="Sample finding", severity="info")
            ],
            confidence=0.95,
        )
        data = res.model_dump()
        self.assertEqual(data["agent_name"], "TestAgent")
        self.assertEqual(data["confidence"], 0.95)
        self.assertEqual(len(data["findings"]), 1)


if __name__ == "__main__":
    unittest.main()
