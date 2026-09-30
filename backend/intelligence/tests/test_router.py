"""
Unit tests for ARGUS Backend 2 Foundation and Router.
"""

import unittest
from backend.intelligence.models.case import CaseRequest
from backend.intelligence.models.routing import RouteType, RoutingResult
from backend.intelligence.models.agent_result import AgentResult, AgentStatus
from backend.intelligence.router.router import Router


class TestRouter(unittest.TestCase):
    """
    Test suite verifying Router triage and domain agent identification.
    """

    def setUp(self):
        self.router = Router()

    def test_case_1_faq_question(self):
        """
        1. FAQ question:
        Input: "What is your refund policy?"
        Expected: route_type = "faq"
        """
        req = CaseRequest(message="What is your refund policy?")
        result = self.router.route(req)

        self.assertIsInstance(result, RoutingResult)
        self.assertEqual(result.route_type, RouteType.FAQ.value)
        self.assertEqual(result.required_agents, [])
        self.assertGreater(result.confidence, 0.8)
        self.assertIn("FAQ", result.reason)

    def test_case_2_billing_question(self):
        """
        2. Billing question:
        Input: "My payment failed."
        Expected: billing is identified as a required agent.
        """
        req = CaseRequest(message="My payment failed.")
        result = self.router.route(req)

        self.assertIsInstance(result, RoutingResult)
        self.assertEqual(result.route_type, RouteType.COMPLEX.value)
        self.assertIn("billing", result.required_agents)
        self.assertGreater(result.confidence, 0.7)

    def test_case_3_order_question(self):
        """
        3. Order question:
        Input: "Where is my order?"
        Expected: order is identified.
        """
        req = CaseRequest(message="Where is my order?")
        result = self.router.route(req)

        self.assertIsInstance(result, RoutingResult)
        self.assertEqual(result.route_type, RouteType.COMPLEX.value)
        self.assertIn("order", result.required_agents)
        self.assertGreater(result.confidence, 0.7)

    def test_case_4_technical_problem(self):
        """
        4. Technical problem:
        Input: "The application keeps showing an error when I try to pay."
        Expected: tech and/or billing should be identified appropriately.
        """
        req = CaseRequest(message="The application keeps showing an error when I try to pay.")
        result = self.router.route(req)

        self.assertIsInstance(result, RoutingResult)
        self.assertEqual(result.route_type, RouteType.COMPLEX.value)
        # Should identify tech and billing
        self.assertIn("tech", result.required_agents)
        self.assertIn("billing", result.required_agents)
        self.assertGreater(result.confidence, 0.8)

    def test_case_5_complex_multi_domain(self):
        """
        5. Complex multi-domain problem:
        Input: "My payment was successful but my order is still pending and my refund hasn't arrived."
        Expected: complex case with relevant specialist agents such as billing and order.
        """
        req = CaseRequest(
            message="My payment was successful but my order is still pending and my refund hasn't arrived."
        )
        result = self.router.route(req)

        self.assertIsInstance(result, RoutingResult)
        self.assertEqual(result.route_type, RouteType.COMPLEX.value)
        self.assertIn("billing", result.required_agents)
        self.assertIn("order", result.required_agents)
        self.assertGreater(result.confidence, 0.8)
        self.assertIn("Multi-domain", result.reason)

    def test_case_6_unknown_ambiguous_request(self):
        """
        6. Unknown/ambiguous request:
        The Router should handle it safely rather than crashing.
        """
        ambiguous_queries = [
            "hello",
            "asdfghjkl123456",
            "I need someone to assist me right now please.",
            "???",
        ]
        for query in ambiguous_queries:
            with self.subTest(query=query):
                req = CaseRequest(message=query)
                result = self.router.route(req)
                self.assertIsInstance(result, RoutingResult)
                self.assertIsNotNone(result.case_id)
                self.assertEqual(result.route_type, RouteType.COMPLEX.value)
                self.assertLessEqual(result.confidence, 0.5)

    def test_empty_and_whitespace_input(self):
        """Empty input should be handled gracefully without crashing."""
        for empty_text in ["", "   ", "\n\t"]:
            with self.subTest(empty_text=repr(empty_text)):
                result = self.router.route(empty_text)
                self.assertIsInstance(result, RoutingResult)
                self.assertEqual(result.route_type, RouteType.COMPLEX.value)
                self.assertEqual(result.required_agents, [])
                self.assertEqual(result.confidence, 0.0)

    def test_direct_string_input(self):
        """Router should accept raw string as well as CaseRequest object."""
        result = self.router.route("What is your refund policy?")
        self.assertEqual(result.route_type, RouteType.FAQ.value)
        self.assertTrue(result.case_id)

    def test_agent_result_model(self):
        """Ensure AgentResult model validates fields properly."""
        res = AgentResult(
            agent_name="billing",
            status=AgentStatus.SUCCESS,
            output={"transaction_status": "refund_approved"},
            confidence=0.92,
            notes="Refund verified against policy."
        )
        self.assertEqual(res.agent_name, "billing")
        self.assertEqual(res.status, AgentStatus.SUCCESS)
        self.assertEqual(res.output["transaction_status"], "refund_approved")


if __name__ == "__main__":
    unittest.main()
