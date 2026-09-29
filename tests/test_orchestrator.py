"""Tests for end-to-end ARGUS AI Orchestration."""

import unittest
from backend.ai.models import CustomerCase, EvidenceItem, EvidenceSource
from backend.ai.orchestration import AIOrchestrator
from backend.ai.router import RouteType


class TestAIOrchestrator(unittest.TestCase):
    """Validate full end-to-end pipeline execution for both FAQ and Investigation pathways."""

    def setUp(self):
        self.orchestrator = AIOrchestrator()

    def test_end_to_end_faq_pipeline(self):
        """Verify informational customer question traverses FAQ/RAG branch."""
        case = CustomerCase(
            case_id="e2e_faq_01",
            customer_id="cust_e2e_1",
            complaint="What are the standard shipping timelines for domestic orders?",
        )
        result = self.orchestrator.process_case(case)

        self.assertEqual(result.case_id, "e2e_faq_01")
        self.assertEqual(result.route, RouteType.FAQ)
        self.assertIsNotNone(result.faq_response)
        self.assertIn("3 to 5 business days", result.faq_response.answer)
        self.assertIsNone(result.consolidated_investigation)
        self.assertIsNone(result.root_cause_result)

    def test_end_to_end_investigation_pipeline(self):
        """Verify complex incident traverses Specialized Agents -> Coordinator -> Root Cause."""
        carrier_ev = EvidenceItem(
            id="ev_carrier_e2e",
            source=EvidenceSource.DELIVERY_PARTNER,
            evidence_type="carrier_scan",
            data={"status": "delivered", "geo_verified": True},
        )
        case = CustomerCase(
            case_id="e2e_inv_01",
            customer_id="cust_e2e_2",
            complaint="Tracking says package delivered, but it is missing and not received!",
            order_id="ord_e2e_99",
            evidence=[carrier_ev],
        )
        result = self.orchestrator.process_case(case)

        self.assertEqual(result.case_id, "e2e_inv_01")
        self.assertEqual(result.route, RouteType.INVESTIGATION)
        self.assertIsNone(result.faq_response)
        self.assertIsNotNone(result.consolidated_investigation)
        self.assertIsNotNone(result.root_cause_result)
        self.assertIn("OrderAgent", result.agent_results)
        self.assertTrue(result.root_cause_result.escalation_required)


if __name__ == "__main__":
    unittest.main()
