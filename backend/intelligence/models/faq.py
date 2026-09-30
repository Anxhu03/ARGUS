"""
Data models for FAQ queries, knowledge documents, and retrieval responses.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class KnowledgeDocument(BaseModel):
    """
    Represents an approved knowledge base article or text chunk.
    """
    doc_id: str = Field(
        ...,
        description="Unique identifier for the knowledge document."
    )
    title: str = Field(
        ...,
        description="Title or topic of the document."
    )
    content: str = Field(
        ...,
        description="Approved factual content."
    )
    category: str = Field(
        ...,
        description="Domain category (e.g., 'billing', 'order', 'account', 'policy')."
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Optional metadata such as version, author, or tags."
    )
    score: Optional[float] = Field(
        default=None,
        description="Relevance or similarity score assigned during retrieval."
    )


class FAQQuery(BaseModel):
    """
    Structured query for the FAQ / RAG retrieval pipeline.
    """
    query: str = Field(
        ...,
        description="The customer inquiry text."
    )
    top_k: int = Field(
        default=3,
        ge=1,
        description="Maximum number of knowledge chunks to retrieve."
    )
    threshold: float = Field(
        default=0.25,
        ge=0.0,
        le=1.0,
        description="Minimum similarity/relevance threshold for accepted results."
    )


class FAQResponse(BaseModel):
    """
    Structured response returned by the FAQ Service.
    Guarantees no hallucinated answers when no approved information exists.
    """
    answered: bool = Field(
        ...,
        description="True if an approved answer was found in the knowledge base; False otherwise."
    )
    answer: Optional[str] = Field(
        default=None,
        description="The approved factual answer, or None if unanswerable."
    )
    sources: List[KnowledgeDocument] = Field(
        default_factory=list,
        description="List of knowledge base documents supporting the answer."
    )
    confidence: float = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Confidence score based on retrieval similarity."
    )
    reason: Optional[str] = Field(
        default=None,
        description="Explanation when an answer cannot be provided."
    )
