"""AI Orchestrator for ARGUS.

Glues together Router, FAQ/RAG, Specialized Agents (Billing, Order, Tech),
Coordinator, and Root Cause Engine into a cohesive end-to-end processing pipeline.
"""

from __future__ import annotations

import asyncio
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.ai.agents.base import BaseAgent
from backend.ai.agents.billing import BillingAgent
from backend.ai.agents.order import OrderAgent
from backend.ai.agents.tech import TechAgent
from backend.ai.coordinator.coordinator import (
    BaseCoordinator,
    ConsolidatedInvestigation,
    DefaultCoordinator,
)
from backend.ai.faq.faq_agent import BaseFAQAgent, DefaultFAQAgent, FAQResponse
from backend.ai.models.case import AgentInvestigationResult, CustomerCase
from backend.ai.root_cause.engine import (
    BaseRootCauseEngine,
    DefaultRootCauseEngine,
    RootCauseResult,
)
from backend.ai.router.router import (
    BaseRouter,
    RouteType,
    RoutingDecision,
    RuleBasedRouter,
)


class AIProcessingResult(BaseModel):
    """Complete result of ARGUS AI processing for a case or inquiry."""
    case_id: str = Field(description="Customer case ID")
    route: RouteType = Field(description="Path taken: FAQ or INVESTIGATION")
    routing_decision: RoutingDecision = Field(description="Full routing diagnostic output")

    # FAQ Pathway outputs (populated if route == FAQ)
    faq_response: Optional[FAQResponse] = Field(
        default=None,
        description="FAQ answer and RAG citations if routed to FAQ"
    )

    # Investigation Pathway outputs (populated if route == INVESTIGATION)
    agent_results: Dict[str, AgentInvestigationResult] = Field(
        default_factory=dict,
        description="Individual outputs from each invoked specialized agent"
    )
    consolidated_investigation: Optional[ConsolidatedInvestigation] = Field(
        default=None,
        description="Coordinator synthesized investigation"
    )
    root_cause_result: Optional[RootCauseResult] = Field(
        default=None,
        description="Root Cause Engine diagnostic and recommendation"
    )

    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Overall execution metadata"
    )


class AIOrchestrator:
    """Master orchestrator for the ARGUS AI Intelligence Layer.

    Uses dependency injection to allow custom routers, retrievers, agents,
    coordinators, or root cause engines without rewriting pipeline code.
    """

    def __init__(
        self,
        router: Optional[BaseRouter] = None,
        faq_agent: Optional[BaseFAQAgent] = None,
        agents: Optional[Dict[str, BaseAgent]] = None,
        coordinator: Optional[BaseCoordinator] = None,
        root_cause_engine: Optional[BaseRootCauseEngine] = None,
    ) -> None:
        self.router: BaseRouter = router or RuleBasedRouter()
        self.faq_agent: BaseFAQAgent = faq_agent or DefaultFAQAgent()

        # Agent registry mapping identifier to instance
        self.agents: Dict[str, BaseAgent] = agents or {
            "billing": BillingAgent(),
            "order": OrderAgent(),
            "tech": TechAgent(),
        }

        self.coordinator: BaseCoordinator = coordinator or DefaultCoordinator()
        self.root_cause_engine: BaseRootCauseEngine = root_cause_engine or DefaultRootCauseEngine()

    def register_agent(self, agent_id: str, agent: BaseAgent) -> None:
        """Register a new specialized agent into the orchestrator."""
        self.agents[agent_id.lower()] = agent

    def process_case(self, case: CustomerCase) -> AIProcessingResult:
        """Execute the end-to-end ARGUS intelligence pipeline for a case.

        Workflow:
        1. Router determines FAQ vs INVESTIGATION.
        2. If FAQ: invoke FAQ Agent with RAG retriever -> return FAQResponse.
        3. If INVESTIGATION: invoke targeted specialized agents -> Coordinator -> Root Cause Engine.
        """
        # Step 1: Routing
        routing_decision = self.router.route(case)

        # Step 2: FAQ Pathway
        if routing_decision.route == RouteType.FAQ:
            faq_res = self.faq_agent.answer(case.complaint, case=case)
            return AIProcessingResult(
                case_id=case.case_id,
                route=RouteType.FAQ,
                routing_decision=routing_decision,
                faq_response=faq_res,
                metadata={"pipeline": "faq_rag"},
            )

        # Step 3: Complex Investigation Pathway
        target_agent_names = routing_decision.agents or ["billing", "order"]
        agent_results_map: Dict[str, AgentInvestigationResult] = {}
        agent_results_list: List[AgentInvestigationResult] = []

        for agent_key in target_agent_names:
            agent = self.agents.get(agent_key.lower())
            if agent:
                res = agent.investigate(case)
                agent_results_map[agent.name] = res
                agent_results_list.append(res)

        # Fallback if no matching agents found in registry
        if not agent_results_list:
            for agent in self.agents.values():
                res = agent.investigate(case)
                agent_results_map[agent.name] = res
                agent_results_list.append(res)

        # Step 4: Multi-Agent Coordination
        consolidated = self.coordinator.coordinate(case, agent_results_list)

        # Step 5: Root Cause Diagnosis
        root_cause = self.root_cause_engine.analyze(consolidated)

        return AIProcessingResult(
            case_id=case.case_id,
            route=RouteType.INVESTIGATION,
            routing_decision=routing_decision,
            agent_results=agent_results_map,
            consolidated_investigation=consolidated,
            root_cause_result=root_cause,
            metadata={"pipeline": "complex_investigation"},
        )

    async def aprocess_case(self, case: CustomerCase) -> AIProcessingResult:
        """Asynchronous execution of the end-to-end intelligence pipeline."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.process_case, case)


_default_orchestrator: Optional[AIOrchestrator] = None


def get_orchestrator() -> AIOrchestrator:
    """Retrieve singleton instance of AIOrchestrator."""
    global _default_orchestrator
    if _default_orchestrator is None:
        _default_orchestrator = AIOrchestrator()
    return _default_orchestrator
