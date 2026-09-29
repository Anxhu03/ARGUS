"""RAG retrieval interface and in-memory reference retriever for ARGUS."""

from __future__ import annotations

import abc
import asyncio
from typing import Any, Dict, List, Optional, Set
from pydantic import BaseModel, Field

from backend.ai.config.settings import RAGConfig, get_ai_settings


class KnowledgeDocument(BaseModel):
    """Normalized representation of an approved organizational knowledge document."""
    id: str = Field(description="Unique document ID")
    title: str = Field(description="Document title or FAQ heading")
    content: str = Field(description="Full text or approved policy chunk")
    category: str = Field(
        default="general",
        description="Domain category, e.g. refunds, shipping, account, returns"
    )
    score: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Relevance or semantic similarity score"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional attributes (source URL, author, approved date, version)"
    )


class BaseRetriever(abc.ABC):
    """Abstract contract for knowledge retrieval.

    Decouples organizational knowledge retrieval from specific vector database engines
    (e.g. FAISS, Chroma, Pinecone, pgvector).
    """

    @abc.abstractmethod
    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[KnowledgeDocument]:
        """Retrieve the top-k most relevant approved knowledge documents.

        Args:
            query: The user's search query or question text.
            top_k: Maximum number of relevant chunks to return.
            filters: Optional metadata filters (e.g. category="refunds").

        Returns:
            List of KnowledgeDocument ordered by relevance score descending.
        """
        raise NotImplementedError("Retrievers must implement retrieve()")

    @abc.abstractmethod
    def add_documents(self, documents: List[KnowledgeDocument]) -> None:
        """Index or register new approved knowledge documents into the retriever."""
        raise NotImplementedError("Retrievers must implement add_documents()")

    async def aretrieve(
        self,
        query: str,
        top_k: int = 3,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[KnowledgeDocument]:
        """Asynchronous retrieval wrapper."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.retrieve, query, top_k, filters)


class InMemoryRetriever(BaseRetriever):
    """Reference in-memory retriever utilizing token-overlap relevance scoring.

    Pre-loaded with foundational ARGUS standard operating policies.
    """

    DEFAULT_KNOWLEDGE_DOCS = [
        KnowledgeDocument(
            id="doc_return_policy_01",
            title="Standard Return Policy",
            content=(
                "Customers can return eligible items within 30 days of confirmed delivery for a full refund. "
                "Items must be in original condition with packaging intact. Perishable and customized goods are non-refundable."
            ),
            category="returns",
            metadata={"version": "1.2", "approved": True},
        ),
        KnowledgeDocument(
            id="doc_refund_timeline_02",
            title="Refund Processing Timelines",
            content=(
                "Once an authorized return or approved refund is confirmed, funds will appear on the original payment method "
                "within 5 to 7 business days depending on the customer's financial institution."
            ),
            category="billing",
            metadata={"version": "1.1", "approved": True},
        ),
        KnowledgeDocument(
            id="doc_shipping_standards_03",
            title="Shipping and Transit Windows",
            content=(
                "Standard domestic shipping takes 3 to 5 business days. Express shipping delivers within 1 to 2 business days. "
                "Tracking numbers update within 24 hours of warehouse dispatch."
            ),
            category="shipping",
            metadata={"version": "2.0", "approved": True},
        ),
        KnowledgeDocument(
            id="doc_damaged_package_04",
            title="Reporting Damaged or Missing Shipments",
            content=(
                "If a package arrives damaged or tracking shows delivered but is missing, customers should report the issue "
                "within 48 hours. Providing clear package photographs speeds up resolution."
            ),
            category="shipping",
            metadata={"version": "1.4", "approved": True},
        ),
        KnowledgeDocument(
            id="doc_account_security_05",
            title="Account Password and Authentication Support",
            content=(
                "Customers experiencing login issues can reset their credentials using the 'Forgot Password' link. "
                "Two-factor authentication codes expire after 10 minutes."
            ),
            category="technical",
            metadata={"version": "1.0", "approved": True},
        ),
    ]

    def __init__(
        self,
        config: Optional[RAGConfig] = None,
        initial_documents: Optional[List[KnowledgeDocument]] = None,
    ) -> None:
        self.config = config or get_ai_settings().rag
        self._documents: List[KnowledgeDocument] = []
        docs = initial_documents if initial_documents is not None else self.DEFAULT_KNOWLEDGE_DOCS
        self.add_documents(docs)

    def add_documents(self, documents: List[KnowledgeDocument]) -> None:
        """Add documents to memory store."""
        for doc in documents:
            # Overwrite or append
            existing = [d for d in self._documents if d.id == doc.id]
            if existing:
                self._documents.remove(existing[0])
            self._documents.append(doc)

    STOPWORDS: Set[str] = {
        "a", "an", "the", "is", "are", "was", "were", "what", "how", "where",
        "can", "do", "does", "did", "for", "in", "of", "on", "to", "with", "your",
        "our", "my", "and", "or", "it", "at", "by", "from",
    }

    def _tokenize(self, text: str) -> List[str]:
        """Strip punctuation and extract lowercase alphanumeric words."""
        import re
        return re.findall(r"\b\w+\b", text.lower())

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        filters: Optional[Dict[str, Any]] = None,
    ) -> List[KnowledgeDocument]:
        """Perform weighted keyword scoring with optional category filtering."""
        raw_tokens = self._tokenize(query)
        # Filter out stopwords if meaningful tokens exist
        meaningful_tokens = [t for t in raw_tokens if t not in self.STOPWORDS]
        query_tokens = set(meaningful_tokens if meaningful_tokens else raw_tokens)

        if not query_tokens:
            return self._documents[:top_k]

        scored_docs: List[KnowledgeDocument] = []

        for doc in self._documents:
            # Apply metadata filters if provided
            if filters:
                match = all(doc.metadata.get(k) == v or getattr(doc, k, None) == v for k, v in filters.items())
                if not match:
                    continue

            title_tokens = set(self._tokenize(doc.title))
            content_tokens = set(self._tokenize(doc.content))
            category_tokens = set(self._tokenize(doc.category))

            # Weight title and category matches more heavily
            title_hits = len(query_tokens.intersection(title_tokens))
            category_hits = len(query_tokens.intersection(category_tokens))
            content_hits = len(query_tokens.intersection(content_tokens))

            # Composite scoring normalized to 0.0 - 1.0
            total_possible = len(query_tokens)
            score = (title_hits * 1.5 + category_hits * 1.0 + content_hits * 0.8) / (total_possible * 1.5)
            normalized_score = min(1.0, round(score, 3))

            scored_doc = doc.model_copy(update={"score": normalized_score})
            scored_docs.append(scored_doc)

        # Sort by score descending
        scored_docs.sort(key=lambda d: d.score, reverse=True)
        return scored_docs[:top_k]
