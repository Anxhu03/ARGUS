"""FAQ handling agent for ARGUS.

Distinction:
FAQ answers: "What is the information?"
Agents investigate: "What happened and why?"

Uses RAG to retrieve approved organizational knowledge and return verified answers.
"""

from __future__ import annotations

import abc
import asyncio
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.ai.models.case import CustomerCase
from backend.ai.rag.retriever import BaseRetriever, InMemoryRetriever, KnowledgeDocument


class FAQResponse(BaseModel):
    """Structured response returned by the FAQ system."""
    question: str = Field(description="The original customer question")
    answer: str = Field(description="Approved, synthesized policy answer")
    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence in the relevance and accuracy of the answer"
    )
    retrieved_documents: List[KnowledgeDocument] = Field(
        default_factory=list,
        description="Approved source knowledge documents used to formulate the answer"
    )
    is_direct_match: bool = Field(
        default=False,
        description="Whether a high-confidence direct match was identified"
    )
    suggested_followups: List[str] = Field(
        default_factory=list,
        description="Helpful related questions or next steps for the customer"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Execution metadata and source citations"
    )


class BaseFAQAgent(abc.ABC):
    """Abstract interface for FAQ handling systems."""

    @abc.abstractmethod
    def answer(self, question: str, case: Optional[CustomerCase] = None) -> FAQResponse:
        """Answer a customer question using organizational knowledge.

        Args:
            question: The informational query asked by the customer.
            case: Optional customer case context.

        Returns:
            Structured FAQResponse with answer text and citations.
        """
        raise NotImplementedError("FAQ agents must implement answer()")

    async def aanswer(self, question: str, case: Optional[CustomerCase] = None) -> FAQResponse:
        """Asynchronous FAQ answering wrapper."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.answer, question, case)


class DefaultFAQAgent(BaseFAQAgent):
    """Production-ready FAQ Agent powered by modular RAG retrieval."""

    def __init__(self, retriever: Optional[BaseRetriever] = None) -> None:
        self.retriever: BaseRetriever = retriever or InMemoryRetriever()

    def answer(self, question: str, case: Optional[CustomerCase] = None) -> FAQResponse:
        """Query RAG retriever and formulate a grounded answer."""
        query_text = question.strip()
        retrieved_docs = self.retriever.retrieve(query_text, top_k=3)

        # Filter documents with meaningful relevance
        relevant_docs = [doc for doc in retrieved_docs if doc.score > 0.20]

        if not relevant_docs:
            return FAQResponse(
                question=query_text,
                answer=(
                    "I could not locate an approved policy directly matching your question. "
                    "A support specialist can provide specific assistance, or you can rephrase your question."
                ),
                confidence=0.35,
                retrieved_documents=retrieved_docs,
                is_direct_match=False,
                suggested_followups=[
                    "What is your return policy?",
                    "How long does refund processing take?",
                    "What are the standard shipping timelines?",
                ],
                metadata={"source_count": 0},
            )

        top_doc = relevant_docs[0]
        is_direct = top_doc.score >= 0.50

        # Grounded answer synthesis from approved knowledge
        answer_text = f"According to our {top_doc.title}:\n{top_doc.content}"
        confidence = min(0.95, round(top_doc.score + 0.25, 2))

        followups: List[str] = []
        if top_doc.category == "returns":
            followups.append("How do I initiate a return label?")
            followups.append("How long until my refund is issued?")
        elif top_doc.category == "billing":
            followups.append("Can I get an updated invoice?")
        elif top_doc.category == "shipping":
            followups.append("How do I track my active package?")

        return FAQResponse(
            question=query_text,
            answer=answer_text,
            confidence=confidence,
            retrieved_documents=relevant_docs,
            is_direct_match=is_direct,
            suggested_followups=followups,
            metadata={
                "primary_source_id": top_doc.id,
                "primary_source_title": top_doc.title,
                "category": top_doc.category,
            },
        )
