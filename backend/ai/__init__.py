"""ARGUS AI Intelligence Layer (Backend 2).

Provides modular, contract-driven components for autonomous support intelligence:
- Base Agent Contract & Specialized Domain Investigators (Billing, Order, Tech)
- Intent & Routing System (FAQ vs Complex Investigation)
- FAQ & RAG Knowledge Retrieval Layer
- Multi-Agent Coordinator with Cross-Domain Contradiction Detection
- Root Cause Engine with Objective Evidence Grounding and Escalation Evaluation
- End-to-End Orchestrator Service
"""

from backend.ai.agents import (
    BaseAgent,
    BillingAgent,
    OrderAgent,
    TechAgent,
)
from backend.ai.config import (
    AISettings,
    get_ai_settings,
)
from backend.ai.coordinator import (
    BaseCoordinator,
    ConsolidatedInvestigation,
    DefaultCoordinator,
)
from backend.ai.faq import (
    BaseFAQAgent,
    DefaultFAQAgent,
    FAQResponse,
)
from backend.ai.models import (
    AgentFinding,
    AgentInvestigationResult,
    AgentStatus,
    CasePriority,
    CaseStatus,
    Contradiction,
    ConversationMessage,
    CustomerCase,
    EvidenceItem,
    EvidenceSource,
    RiskSignal,
)
from backend.ai.orchestration import (
    AIOrchestrator,
    AIProcessingResult,
    get_orchestrator,
)
from backend.ai.rag import (
    BaseRetriever,
    InMemoryRetriever,
    KnowledgeDocument,
)
from backend.ai.root_cause import (
    BaseRootCauseEngine,
    DefaultRootCauseEngine,
    RootCauseResult,
)
from backend.ai.router import (
    BaseRouter,
    RouteType,
    RoutingDecision,
    RuleBasedRouter,
)

__all__ = [
    # Agents
    "BaseAgent",
    "BillingAgent",
    "OrderAgent",
    "TechAgent",
    # Config
    "AISettings",
    "get_ai_settings",
    # Coordinator
    "BaseCoordinator",
    "ConsolidatedInvestigation",
    "DefaultCoordinator",
    # FAQ
    "BaseFAQAgent",
    "DefaultFAQAgent",
    "FAQResponse",
    # Models
    "AgentFinding",
    "AgentInvestigationResult",
    "AgentStatus",
    "CasePriority",
    "CaseStatus",
    "Contradiction",
    "ConversationMessage",
    "CustomerCase",
    "EvidenceItem",
    "EvidenceSource",
    "RiskSignal",
    # Orchestration
    "AIOrchestrator",
    "AIProcessingResult",
    "get_orchestrator",
    # RAG
    "BaseRetriever",
    "InMemoryRetriever",
    "KnowledgeDocument",
    # Root Cause
    "BaseRootCauseEngine",
    "DefaultRootCauseEngine",
    "RootCauseResult",
    # Router
    "BaseRouter",
    "RouteType",
    "RoutingDecision",
    "RuleBasedRouter",
]
