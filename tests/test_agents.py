"""Tests for ARGUS specialized investigator agents."""

import unittest
from backend.ai.agents import BillingAgent, OrderAgent, TechAgent
from backend.ai.models import (
    AgentStatus,
    CustomerCase,
    EvidenceItem,
    EvidenceSource,
)


class TestSpecializedAgents(unittest.TestCase):
    """Validate specialized agent investigation contracts and fairness guarantees."""

    def test_billing_agent_duplicate_charge_contradiction(self):
        """Verify BillingAgent flags contradiction when customer reports double charge but ledger shows single capture."""
        agent = BillingAgent()
        evidence = EvidenceItem(
            id="ev_bill_01",
            source=EvidenceSource.PAYMENT_GATEWAY,
            evidence_type="payment_record",
            data={"status": "captured", "amount": 89.99, "currency": "USD", "transaction_count": 1},
        )
        case = CustomerCase(
            case_id="case_b1",
            customer_id="cust_b1",
            complaint="I was charged twice on my statement for this purchase!",
            payment_id="pay_999",
            evidence=[evidence],
        )

        res = agent.investigate(case)
        self.assertEqual(res.agent_name, "BillingAgent")
        self.assertEqual(res.status, AgentStatus.SUCCESS)
        self.assertGreater(len(res.findings), 0)
        self.assertEqual(len(res.contradictions), 1)
        self.assertIn("Single capture recorded", res.contradictions[0].description)
        self.assertIn("bank statement", res.recommended_action.lower())

    def test_billing_agent_fairness_risk_signal(self):
        """Verify BillingAgent creates objective risk signals without fraud accusations."""
        agent = BillingAgent()
        case = CustomerCase(
            case_id="case_b2",
            customer_id="cust_b2",
            complaint="Please refund my order immediately.",
            metadata={"prior_refund_requests_90d": 5},
        )
        res = agent.investigate(case)
        self.assertEqual(len(res.risk_signals), 1)
        signal = res.risk_signals[0]
        self.assertEqual(signal.signal_type, "elevated_refund_frequency_signal")
        self.assertNotIn("fraud", signal.description.lower())
        self.assertIn("verification", signal.description.lower())

    def test_order_agent_delivery_scan_contradiction(self):
        """Verify OrderAgent flags contradiction when carrier reports delivered but customer reports non-receipt."""
        agent = OrderAgent()
        evidence = EvidenceItem(
            id="ev_ord_01",
            source=EvidenceSource.DELIVERY_PARTNER,
            evidence_type="carrier_scan",
            data={"status": "delivered", "carrier": "FedEx", "geo_verified": True},
        )
        case = CustomerCase(
            case_id="case_o1",
            customer_id="cust_o1",
            complaint="Package was not received, it is lost!",
            order_id="ord_123",
            evidence=[evidence],
        )
        res = agent.investigate(case)
        self.assertEqual(res.agent_name, "OrderAgent")
        self.assertEqual(len(res.contradictions), 1)
        self.assertIn("Delivered", res.contradictions[0].description)
        self.assertEqual(res.contradictions[0].severity, "high")

    def test_order_agent_fairness_risk_signal(self):
        """Verify OrderAgent handles recurrent missing package claims with fairness."""
        agent = OrderAgent()
        case = CustomerCase(
            case_id="case_o2",
            customer_id="cust_o2",
            complaint="Package missing",
            metadata={"prior_missing_package_claims_180d": 3},
        )
        res = agent.investigate(case)
        self.assertEqual(len(res.risk_signals), 1)
        self.assertEqual(res.risk_signals[0].signal_type, "recurrent_delivery_conflict_signal")
        self.assertNotIn("fraud", res.risk_signals[0].description.lower())

    def test_tech_agent_confirms_system_outage(self):
        """Verify TechAgent corroborates checkout crashes with 5xx server logs."""
        agent = TechAgent()
        evidence = EvidenceItem(
            id="ev_tech_01",
            source=EvidenceSource.SYSTEM_LOGS,
            evidence_type="error_log",
            data={"service": "checkout_api", "http_status": 504, "error_message": "Gateway Timeout"},
        )
        case = CustomerCase(
            case_id="case_t1",
            customer_id="cust_t1",
            complaint="Checkout failed with website error during payment",
            evidence=[evidence],
        )
        res = agent.investigate(case)
        self.assertEqual(res.agent_name, "TechAgent")
        self.assertTrue(res.metadata.get("incident_confirmed"))
        self.assertIn("reconcil", res.recommended_action.lower())


if __name__ == "__main__":
    unittest.main()
