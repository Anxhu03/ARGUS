"""Tests for RAG retrieval and FAQ Agent."""

import unittest
from backend.ai.faq import DefaultFAQAgent
from backend.ai.rag import InMemoryRetriever, KnowledgeDocument


class TestRAGAndFAQ(unittest.TestCase):
    """Validate knowledge retrieval and FAQ answering."""

    def setUp(self):
        self.retriever = InMemoryRetriever()
        self.faq_agent = DefaultFAQAgent(retriever=self.retriever)

    def test_retriever_returns_relevant_documents(self):
        """Verify retriever finds top documents matching query keywords."""
        results = self.retriever.retrieve("return policy timeline", top_k=2)
        self.assertGreater(len(results), 0)
        self.assertIn("return", results[0].title.lower())
        self.assertGreater(results[0].score, 0.0)

    def test_retriever_allows_dynamic_document_indexing(self):
        """Verify custom knowledge documents can be indexed."""
        custom_doc = KnowledgeDocument(
            id="doc_holiday_promo",
            title="Holiday Promotion Rules",
            content="Holiday promo codes cannot be combined with clearance items.",
            category="promotions",
        )
        self.retriever.add_documents([custom_doc])
        results = self.retriever.retrieve("holiday promo codes", top_k=1)
        self.assertEqual(results[0].id, "doc_holiday_promo")

    def test_faq_agent_answers_grounded_question(self):
        """Verify FAQ Agent returns policy-grounded answers with citations."""
        res = self.faq_agent.answer("What is your standard return policy?")
        self.assertTrue(res.is_direct_match)
        self.assertGreaterEqual(res.confidence, 0.70)
        self.assertIn("30 days", res.answer)
        self.assertGreater(len(res.retrieved_documents), 0)
        self.assertGreater(len(res.suggested_followups), 0)

    def test_faq_agent_gracefully_handles_unknown_queries(self):
        """Verify FAQ Agent falls back gracefully on out-of-domain questions."""
        res = self.faq_agent.answer("Can you tell me how to bake chocolate sourdough bread?")
        self.assertFalse(res.is_direct_match)
        self.assertLess(res.confidence, 0.50)
        self.assertIn("support specialist", res.answer.lower())


if __name__ == "__main__":
    unittest.main()
