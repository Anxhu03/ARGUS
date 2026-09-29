"""Tests for ARGUS Root Cause Engine."""

import unittest
from backend.ai.agents import BillingAgent, OrderAgent, TechAgent
from backend.ai.coordinator import DefaultCoordinator
from backend.ai.models import (
    CustomerCase,
    EvidenceItem,
    EvidenceSource,
)
from backend.ai.root_cause import DefaultRootCauseEngine


class TestRootCauseEngine(unittest.TestCase):
    """Validate Root Cause Engine diagnostics, evidence grounding, and escalation rules."""

    def setUp(self):
        self.coordinator = DefaultCoordinator()
        self.root_cause_engine = DefaultRootCauseEngine()
        self.billing_agent = BillingAgent()
        self.order_agent = OrderAgent()
        self.tech_agent = TechAgent()

    def test_root_cause_escalates_on_carrier_contradiction(self):
        """Verify root cause engine flags escalation when delivery scan directly conflicts with customer report."""
        carrier_evidence = EvidenceItem(
            id="ev_fedex_deliv",
            source=EvidenceSource.DELIVERY_PARTNER,
            evidence_type="carrier_scan",
            data={"status": "delivered", "geo_verified": True},
        )
        case = CustomerCase(
            case_id="rc_case_01",
            customer_id="cust_rc1",
            complaint="My package was marked delivered but is missing and not received!",
            order_id="ord_rc1",
            evidence=[carrier_evidence],
        )

        o_res = self.order_agent.investigate(case)
        consolidated = self.coordinator.coordinate(case, [o_res])
        result = self.root_cause_engine.analyze(consolidated)

        self.assertEqual(result.case_id, "rc_case_01")
        self.assertEqual(result.root_cause_category, "EVIDENCE_CONFLICT")
        self.assertTrue(result.escalation_required)
        self.assertIn("Specialist", result.recommended_action)
        self.assertIsNotNone(result.prevention_tip)

    def test_root_cause_identifies_system_outage(self):
        """Verify root cause engine detects server 5xx crash as primary cause."""
        log_evidence = EvidenceItem(
            id="ev_500_log",
            source=EvidenceSource.SYSTEM_LOGS,
            evidence_type="error_log",
            data={"service": "payment_service", "http_status": 500, "error_message": "Internal Server Error"},
        )
        case = CustomerCase(
            case_id="rc_case_02",
            customer_id="cust_rc2",
            complaint="Checkout failed with website crash",
            payment_id="pay_rc2",
            evidence=[log_evidence],
        )

        t_res = self.tech_agent.investigate(case)
        consolidated = self.coordinator.coordinate(case, [t_res])
        result = self.root_cause_engine.analyze(consolidated)

        self.assertEqual(result.root_cause_category, "SYSTEM_OUTAGE")
        self.assertFalse(result.escalation_required)
        self.assertGreaterEqual(result.confidence, 0.85)
        self.assertIn("reconciliation", result.recommended_action.lower())

    def test_root_cause_handles_standard_refund_lifecycle(self):
        """Verify root cause handles eligible refund without unnecessary human escalation."""
        case = CustomerCase(
            case_id="rc_case_03",
            customer_id="cust_rc3",
            complaint="I want to return this dress and get a refund.",
            payment_id="pay_rc3",
        )
        b_res = self.billing_agent.investigate(case)
        consolidated = self.coordinator.coordinate(case, [b_res])
        result = self.root_cause_engine.analyze(consolidated)

        self.assertEqual(result.root_cause_category, "STANDARD_REFUND_LIFECYCLE")
        self.assertFalse(result.escalation_required)
        self.assertIn("label", result.recommended_action.lower())


if __name__ == "__main__":
    unittest.main()
