"""
Unit tests for ARGUS Backend 2 Phase 2: FAQ + RAG Foundation.
"""

import unittest
from backend.intelligence.models.case import CaseRequest
from backend.intelligence.models.faq import FAQResponse, KnowledgeDocument
from backend.intelligence.models.routing import RouteType
from backend.intelligence.rag.knowledge_base import DEV_KNOWLEDGE_BASE
from backend.intelligence.rag.retriever import InMemoryRetriever
from backend.intelligence.router.router import Router
from backend.intelligence.services.faq_service import FAQService


class TestFAQRAG(unittest.TestCase):
    """
    Test suite verifying the RAG retrieval layer, FAQ service,
    and Router -> FAQ integration.
    """

    def setUp(self):
        self.retriever = InMemoryRetriever(DEV_KNOWLEDGE_BASE)
        self.faq_service = FAQService(retriever=self.retriever)
        self.router = Router()

    def test_1_known_faq_question_returns_answer(self):
        """1. Known FAQ question returns an answer."""
        res = self.faq_service.answer("What is your return policy?")
        self.assertIsInstance(res, FAQResponse)
        self.assertTrue(res.answered)
        self.assertIsNotNone(res.answer)
        self.assertIn("return", res.answer.lower())
        self.assertGreater(res.confidence, 0.5)

    def test_2_refund_question_retrieves_refund_info(self):
        """2. Refund question retrieves refund information."""
        res = self.faq_service.answer("What is your refund policy?")
        self.assertTrue(res.answered)
        self.assertIsNotNone(res.answer)
        self.assertIn("30 days", res.answer)
        self.assertIn("5 to 7 business days", res.answer)
        self.assertEqual(res.sources[0].doc_id, "KB-DOC-001")

    def test_3_delivery_question_retrieves_delivery_info(self):
        """3. Delivery question retrieves delivery information."""
        res = self.faq_service.answer("How many days does delivery take?")
        self.assertTrue(res.answered)
        self.assertIsNotNone(res.answer)
        self.assertIn("3 to 5 business days", res.answer)
        self.assertEqual(res.sources[0].doc_id, "KB-DOC-003")

    def test_4_password_question_retrieves_password_info(self):
        """4. Password question retrieves password information."""
        res = self.faq_service.answer("How can I change my password?")
        self.assertTrue(res.answered)
        self.assertIsNotNone(res.answer)
        self.assertIn("Settings > Security", res.answer)
        self.assertEqual(res.sources[0].doc_id, "KB-DOC-004")

    def test_5_payment_method_question_retrieves_payment_info(self):
        """5. Payment-method question retrieves payment information."""
        res = self.faq_service.answer("What payment methods do you accept?")
        self.assertTrue(res.answered)
        self.assertIsNotNone(res.answer)
        self.assertIn("Visa, MasterCard, American Express", res.answer)
        self.assertEqual(res.sources[0].doc_id, "KB-DOC-005")

    def test_6_unknown_question_returns_answered_false(self):
        """6. Unknown question returns answered=false."""
        res = self.faq_service.answer("What is the average flight speed of an unladen swallow?")
        self.assertFalse(res.answered)
        self.assertIsNone(res.answer)
        self.assertEqual(len(res.sources), 0)
        self.assertEqual(res.confidence, 0.0)

    def test_7_no_hallucinated_answer_when_retrieval_fails(self):
        """7. No hallucinated answer is generated when retrieval fails."""
        res = self.faq_service.answer("Do you sell quantum teleportation devices?")
        self.assertFalse(res.answered)
        self.assertIsNone(res.answer)
        self.assertIn("No relevant approved information found", res.reason)

    def test_8_faq_response_contains_source_information(self):
        """8. FAQ response contains source information."""
        res = self.faq_service.answer("What is your refund policy?")
        self.assertTrue(len(res.sources) >= 1)
        source = res.sources[0]
        self.assertIsInstance(source, KnowledgeDocument)
        self.assertEqual(source.doc_id, "KB-DOC-001")
        self.assertEqual(source.title, "Refund Policy")
        self.assertEqual(source.category, "billing")
        self.assertIsNotNone(source.score)

    def test_9_router_to_faq_integration(self):
        """9. Router -> FAQ integration works."""
        case = CaseRequest(message="What is your return policy?")
        routing = self.router.route(case)

        self.assertEqual(routing.route_type, RouteType.FAQ.value)
        self.assertEqual(routing.required_agents, [])

        # Pass to FAQ Service
        faq_res = self.faq_service.answer_case(case, routing)
        self.assertTrue(faq_res.answered)
        self.assertIsNotNone(faq_res.answer)
        self.assertEqual(faq_res.sources[0].doc_id, "KB-DOC-002")

    def test_10_empty_invalid_questions_handled_safely(self):
        """10. Empty/invalid questions are handled safely."""
        invalid_inputs = ["", "   ", None]
        for invalid in invalid_inputs:
            with self.subTest(invalid=invalid):
                res = self.faq_service.answer(invalid)
                self.assertFalse(res.answered)
                self.assertIsNone(res.answer)
                self.assertEqual(len(res.sources), 0)
                self.assertEqual(res.confidence, 0.0)

    def test_custom_mock_retriever_injection(self):
        """Verifies that custom/mock retrievers conforming to BaseRetriever can be injected."""
        class MockCustomRetriever:
            def retrieve(self, query: str, top_k: int = 3, threshold: float = 0.25):
                return [
                    KnowledgeDocument(
                        doc_id="CUSTOM-01",
                        title="Custom Policy",
                        content="Custom answer from mocked vector store.",
                        category="custom",
                        score=0.99
                    )
                ]

        custom_service = FAQService(retriever=MockCustomRetriever())
        res = custom_service.answer("Any query")
        self.assertTrue(res.answered)
        self.assertEqual(res.answer, "Custom answer from mocked vector store.")
        self.assertEqual(res.sources[0].doc_id, "CUSTOM-01")


if __name__ == "__main__":
    unittest.main()
