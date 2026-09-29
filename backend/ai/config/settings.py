"""Configuration settings for ARGUS AI intelligence layer."""

from __future__ import annotations

import os
from typing import List, Optional
from pydantic import BaseModel, Field


class RouterConfig(BaseModel):
    """Router configuration."""
    faq_confidence_threshold: float = Field(
        default=0.75,
        description="Minimum confidence to route to FAQ rather than investigation"
    )
    default_investigation_agents: List[str] = Field(
        default_factory=lambda: ["order", "billing"],
        description="Default agents assigned when case is ambiguous investigation"
    )
    fallback_route: str = Field(
        default="INVESTIGATION",
        description="Route taken when classifier confidence is below threshold"
    )


class RAGConfig(BaseModel):
    """Retrieval-Augmented Generation configuration."""
    top_k: int = Field(
        default=3,
        description="Number of knowledge chunks to retrieve"
    )
    similarity_threshold: float = Field(
        default=0.60,
        description="Minimum relevance score for retrieved documents"
    )
    knowledge_base_path: Optional[str] = Field(
        default=None,
        description="Optional path to persistent knowledge documents"
    )


class AgentSettings(BaseModel):
    """Specialized agent runtime configuration."""
    enabled_agents: List[str] = Field(
        default_factory=lambda: ["billing", "order", "tech"],
        description="List of active specialized investigator agents"
    )
    timeout_seconds: float = Field(
        default=5.0,
        description="Execution timeout for each agent investigation"
    )
    strict_evidence_verification: bool = Field(
        default=False,
        description="If true, unverified evidence triggers verification warnings"
    )


class CoordinatorConfig(BaseModel):
    """Coordinator settings."""
    require_all_agents: bool = Field(
        default=False,
        description="Whether a failed agent should fail the entire coordination"
    )
    auto_flag_contradictions: bool = Field(
        default=True,
        description="Whether cross-agent evidence contradictions are automatically highlighted"
    )


class RootCauseConfig(BaseModel):
    """Root Cause Engine configuration."""
    min_confidence_for_automated_resolution: float = Field(
        default=0.80,
        description="Threshold required to recommend automated resolution without human escalation"
    )
    escalate_on_contradiction: bool = Field(
        default=True,
        description="Whether high-severity evidence contradictions trigger human escalation"
    )


class AISettings(BaseModel):
    """Master AI settings container with environment variable overrides."""
    environment: str = Field(
        default_factory=lambda: os.getenv("ARGUS_ENV", "development"),
        description="Runtime environment: development, staging, production"
    )
    router: RouterConfig = Field(default_factory=RouterConfig)
    rag: RAGConfig = Field(default_factory=RAGConfig)
    agents: AgentSettings = Field(default_factory=AgentSettings)
    coordinator: CoordinatorConfig = Field(default_factory=CoordinatorConfig)
    root_cause: RootCauseConfig = Field(default_factory=RootCauseConfig)


# Global default instance
_default_settings: Optional[AISettings] = None


def get_ai_settings() -> AISettings:
    """Retrieve the singleton AI configuration settings."""
    global _default_settings
    if _default_settings is None:
        _default_settings = AISettings()
    return _default_settings
