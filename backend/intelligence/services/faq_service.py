"""
FAQ Service for the ARGUS Intelligence Layer.

Handles predictable, informational customer questions using grounded RAG retrieval.
Guarantees zero hallucination when approved knowledge is unavailable.
"""

import logging
from typing import Optional, Union
from backend.intelligence.models.case import CaseRequest
from backend.intelligence.models.faq import FAQResponse
from backend.intelligence.models.routing import RouteType, RoutingResult
from backend.intelligence.rag.retriever import BaseRetriever, InMemoryRetriever

logger = logging.getLogger(__name__)


class FAQService:
    """
    Service responsible for answering informational FAQ questions via grounded knowledge retrieval.
    Decoupled from underlying retrieval storage via the BaseRetriever interface.
    """

    def __init__(self, retriever: Optional[BaseRetriever] = None):
        """
        Initialize the FAQService with a retriever.
        Defaults to InMemoryRetriever with development knowledge base.
        """
        self.retriever: BaseRetriever = retriever or InMemoryRetriever()

    def answer(self, question: Union[str, CaseRequest], threshold: float = 0.25) -> FAQResponse:
        """
        Answer an informational inquiry strictly grounded in the approved knowledge base.

        Args:
            question: Inbound query as string or CaseRequest.
            threshold: Minimum relevance score to consider a document valid.

        Returns:
            Structured FAQResponse with answer, sources, and confidence.
        """
        # Extract text safely
        if isinstance(question, CaseRequest):
            query_text = (question.message or "").strip()
        else:
            query_text = (str(question) if question is not None else "").strip()

        # Handle empty/invalid input
        if not query_text:
            logger.warning("Empty question passed to FAQService.")
            return FAQResponse(
                answered=False,
                answer=None,
                sources=[],
                confidence=0.0,
                reason="Empty or invalid question provided."
            )

        # Retrieve relevant approved knowledge documents
        try:
            docs = self.retriever.retrieve(query_text, top_k=3, threshold=threshold)
        except Exception as exc:
            logger.exception("Error during knowledge retrieval: %s", exc)
            return FAQResponse(
                answered=False,
                answer=None,
                sources=[],
                confidence=0.0,
                reason=f"Retrieval failure: {str(exc)}"
            )

        # Guard against zero-result or insufficient information: NO HALLUCINATION
        if not docs:
            logger.info("No approved knowledge found for query: %s", query_text)
            return FAQResponse(
                answered=False,
                answer=None,
                sources=[],
                confidence=0.0,
                reason="No relevant approved information found in knowledge base."
            )

        # Best matching document
        best_doc = docs[0]
        confidence = float(best_doc.score if best_doc.score is not None else 0.85)

        logger.info(
            "Found approved answer from doc_id=%s ('%s') with confidence=%.2f",
            best_doc.doc_id, best_doc.title, confidence
        )

        return FAQResponse(
            answered=True,
            answer=best_doc.content,
            sources=docs,
            confidence=confidence,
            reason=f"Answer retrieved from approved knowledge document '{best_doc.title}'."
        )

    def answer_case(
        self,
        case: CaseRequest,
        routing: Optional[RoutingResult] = None
    ) -> FAQResponse:
        """
        Integrates Router decision with FAQ Service execution.
        """
        if routing and routing.route_type != RouteType.FAQ.value:
            logger.warning(
                "Case case_id=%s was not routed to FAQ (route_type=%s)",
                case.case_id, routing.route_type
            )
            return FAQResponse(
                answered=False,
                answer=None,
                sources=[],
                confidence=0.0,
                reason=f"Case was routed to '{routing.route_type}', not 'faq'. Requires specialist agents."
            )

        return self.answer(case)
