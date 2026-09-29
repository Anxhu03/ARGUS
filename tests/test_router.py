"""Tests for ARGUS Router and routing decisions."""

import unittest
from backend.ai.models import CustomerCase
from backend.ai.router import RouteType, RuleBasedRouter


class TestRouter(unittest.TestCase):
    """Validate Router classification and agent delegation."""

    def setUp(self):
        self.router = RuleBasedRouter()

    def test_routes_informational_question_to_faq(self):
        """Verify policy questions route to FAQ."""
        case = CustomerCase(
            case_id="c_faq_01",
            customer_id="cust_01",
            complaint="What is your return policy for open electronics?",
        )
        decision = self.router.route(case)
        self.assertEqual(decision.route, RouteType.FAQ)
        self.assertGreaterEqual(decision.confidence, 0.75)
        self.assertEqual(len(decision.agents), 0)

    def test_routes_billing_dispute_to_investigation(self):
        """Verify billing complaints route to BillingAgent."""
        case = CustomerCase(
            case_id="c_bill_01",
            customer_id="cust_02",
            complaint="My credit card was charged twice for the same purchase!",
            payment_id="pay_12345",
        )
        decision = self.router.route(case)
        self.assertEqual(decision.route, RouteType.INVESTIGATION)
        self.assertIn("billing", decision.agents)
        self.assertGreaterEqual(decision.confidence, 0.80)

    def test_routes_missing_package_to_order_agent(self):
        """Verify delivery/carrier complaints route to OrderAgent."""
        case = CustomerCase(
            case_id="c_order_01",
            customer_id="cust_03",
            complaint="Tracking says delivered, but the package was not received and is missing.",
            order_id="ord_54321",
        )
        decision = self.router.route(case)
        self.assertEqual(decision.route, RouteType.INVESTIGATION)
        self.assertIn("order", decision.agents)

    def test_routes_technical_issues_to_tech_agent(self):
        """Verify website and server errors route to TechAgent."""
        case = CustomerCase(
            case_id="c_tech_01",
            customer_id="cust_04",
            complaint="The mobile app crashed with server error 500 while trying to check out.",
        )
        decision = self.router.route(case)
        self.assertEqual(decision.route, RouteType.INVESTIGATION)
        self.assertIn("tech", decision.agents)

    def test_routes_multi_domain_issue_to_multiple_agents(self):
        """Verify cross-domain complaints assign multiple specialized agents."""
        case = CustomerCase(
            case_id="c_multi_01",
            customer_id="cust_05",
            complaint="My order never arrived, and I was billed an unauthorized extra charge.",
            order_id="ord_111",
            payment_id="pay_222",
        )
        decision = self.router.route(case)
        self.assertEqual(decision.route, RouteType.INVESTIGATION)
        self.assertIn("billing", decision.agents)
        self.assertIn("order", decision.agents)


if __name__ == "__main__":
    unittest.main()
