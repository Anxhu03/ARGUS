"""Tests for ARGUS Coordinator and multi-agent synthesis."""

import unittest
from backend.ai.agents import BillingAgent, OrderAgent, TechAgent
from backend.ai.coordinator import DefaultCoordinator
from backend.ai.models import (
    CustomerCase,
    EvidenceItem,
    EvidenceSource,
)


class TestCoordinator(unittest.TestCase):
    """Validate Coordinator multi-agent aggregation and cross-domain contradiction detection."""

    def setUp(self):
        self.coordinator = DefaultCoordinator()
        self.billing_agent = BillingAgent()
        self.order_agent = OrderAgent()
        self.tech_agent = TechAgent()

    def test_synthesizes_multiple_agent_findings(self):
        """Verify Coordinator aggregates findings, evidence, and computes confidence."""
        case = CustomerCase(
            case_id="case_coord_01",
            customer_id="cust_c1",
            complaint="I want to know where my order is and confirm my payment status.",
            order_id="ord_100",
            payment_id="pay_100",
        )
        b_res = self.billing_agent.investigate(case)
        o_res = self.order_agent.investigate(case)

        consolidated = self.coordinator.coordinate(case, [b_res, o_res])
        self.assertEqual(consolidated.case_id, "case_coord_01")
        self.assertIn("BillingAgent", consolidated.agent_results)
        self.assertIn("OrderAgent", consolidated.agent_results)
        self.assertGreater(len(consolidated.all_findings), 1)
        self.assertGreaterEqual(consolidated.overall_confidence, 0.70)
        self.assertFalse(consolidated.requires_escalation)

    def test_detects_cross_domain_payment_without_order_contradiction(self):
        """Verify Coordinator flags contradiction when payment is captured but order never reached warehouse."""
        pay_evidence = EvidenceItem(
            id="ev_pay_cap",
            source=EvidenceSource.PAYMENT_GATEWAY,
            evidence_type="payment_record",
            data={"status": "captured", "amount": 149.00},
        )
        case = CustomerCase(
            case_id="case_coord_02",
            customer_id="cust_c2",
            complaint="You took my money but I received no order confirmation or shipment!",
            payment_id="pay_captured_1",
            # No order_id provided
            evidence=[pay_evidence],
        )

        b_res = self.billing_agent.investigate(case)
        o_res = self.order_agent.investigate(case)

        consolidated = self.coordinator.coordinate(case, [b_res, o_res])
        self.assertTrue(consolidated.requires_escalation)
        self.assertTrue(
            any("Payment captured but order creation unverified" in c.description for c in consolidated.contradictions)
        )

    def test_detects_missing_evidence_for_damaged_goods(self):
        """Verify Coordinator audits for missing photo evidence when damage is reported."""
        case = CustomerCase(
            case_id="case_coord_03",
            customer_id="cust_c3",
            complaint="The ceramic vase in my shipment arrived broken and completely damaged.",
            order_id="ord_vase",
        )
        o_res = self.order_agent.investigate(case)
        consolidated = self.coordinator.coordinate(case, [o_res])

        self.assertIn("photograph_of_damaged_goods", consolidated.missing_evidence)


if __name__ == "__main__":
    unittest.main()
