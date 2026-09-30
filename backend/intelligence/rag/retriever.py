"""
Retrieval interfaces and implementations for the ARGUS RAG layer.
"""

import re
from typing import List, Optional, Protocol, Set
from backend.intelligence.models.faq import KnowledgeDocument
from backend.intelligence.rag.knowledge_base import DEV_KNOWLEDGE_BASE


class BaseRetriever(Protocol):
    """
    Abstract retrieval interface for the ARGUS RAG layer.
    Allows seamlessly swapping in-memory retrieval with vector databases (ChromaDB, pgvector, etc.).
    """

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        threshold: float = 0.25
    ) -> List[KnowledgeDocument]:
        """
        Retrieve knowledge documents relevant to the given query.

        Args:
            query: The user query string.
            top_k: Maximum number of documents to return.
            threshold: Minimum score threshold (0.0 to 1.0) for relevance.

        Returns:
            List of matching KnowledgeDocument objects sorted by descending relevance.
        """
        ...


class InMemoryRetriever:
    """
    Deterministic in-memory retriever for development, testing, and rapid prototyping.
    Uses token-overlap and phrase-weighted scoring.
    """

    def __init__(self, documents: Optional[List[KnowledgeDocument]] = None):
        self._documents: List[KnowledgeDocument] = (
            list(documents) if documents is not None else list(DEV_KNOWLEDGE_BASE)
        )

    @staticmethod
    def _tokenize(text: str) -> Set[str]:
        """Tokenize text into lowercase alphanumeric tokens, filtering common stopwords."""
        stopwords = {
            "a", "an", "the", "is", "are", "was", "were", "in", "on", "at",
            "to", "for", "of", "with", "and", "or", "do", "does", "did",
            "can", "could", "would", "should", "you", "your", "my", "i",
            "we", "our", "it", "its", "this", "that", "these", "those"
        }
        tokens = re.findall(r"\b[a-zA-Z0-9]+\b", text.lower())
        return {t for t in tokens if t not in stopwords}

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        threshold: float = 0.25
    ) -> List[KnowledgeDocument]:
        """
        Retrieve top_k documents scoring above threshold using token overlap and title weighting.
        """
        if not query or not query.strip():
            return []

        query_clean = query.strip().lower()
        query_tokens = self._tokenize(query_clean)
        if not query_tokens:
            return []

        scored_docs: List[KnowledgeDocument] = []

        for doc in self._documents:
            title_tokens = self._tokenize(doc.title)
            content_tokens = self._tokenize(doc.content)

            # Title matches are weighted 2.5x higher
            title_overlap = len(query_tokens.intersection(title_tokens))
            content_overlap = len(query_tokens.intersection(content_tokens))

            # Phrase boost if title phrase is directly present in query
            doc_title_lower = doc.title.lower()
            phrase_boost = 0.3 if any(
                phrase in query_clean for phrase in doc_title_lower.split(" and ")
            ) or (doc_title_lower in query_clean) else 0.0

            # Base score normalized by query tokens length
            overlap_score = (
                (title_overlap * 2.5 + content_overlap) / (len(query_tokens) * 2.5)
            )

            final_score = min(1.0, round(overlap_score + phrase_boost, 4))

            if final_score >= threshold:
                doc_copy = doc.model_copy(update={"score": final_score})
                scored_docs.append(doc_copy)

        # Sort descending by score
        scored_docs.sort(key=lambda d: d.score or 0.0, reverse=True)
        return scored_docs[:top_k]
