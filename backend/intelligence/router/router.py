"""
Core Router implementation for ARGUS Intelligence Layer.

Triage inbound cases between FAQ/RAG retrieval and Complex specialist agent routing.
"""

import logging
from typing import Union
from backend.intelligence.models.case import CaseRequest
from backend.intelligence.models.routing import RouteType, RoutingResult
from backend.intelligence.router.rules import (
    detect_domain_signals,
    matches_faq_pattern,
)

logger = logging.getLogger(__name__)


class Router:
    """
    Deterministic intent router for ARGUS Phase 1.
    Evaluates customer requests and dispatches to either FAQ/RAG or Complex Agent pathways.
    """

    def route(self, request: Union[CaseRequest, str]) -> RoutingResult:
        """
        Evaluate an inbound case request and produce a structured routing result.
        
        Args:
            request: A CaseRequest instance or raw message string.
            
        Returns:
            RoutingResult with route_type, required_agents, reason, and confidence.
        """
        try:
            # Normalize input
            if isinstance(request, str):
                case_request = CaseRequest(message=request)
            else:
                case_request = request

            text = (case_request.message or "").strip()
            case_id = case_request.case_id

            # 1. Handle empty or whitespace-only message
            if not text:
                logger.warning("Empty case message received for case_id=%s", case_id)
                return RoutingResult(
                    case_id=case_id,
                    route_type=RouteType.COMPLEX.value,
                    required_agents=[],
                    reason="Empty or whitespace-only message provided. Routed to general triage.",
                    confidence=0.0,
                )

            # 2. Check for FAQ / General Informational Question
            if matches_faq_pattern(text):
                logger.info("Routed case_id=%s to FAQ", case_id)
                return RoutingResult(
                    case_id=case_id,
                    route_type=RouteType.FAQ.value,
                    required_agents=[],
                    reason="Identified general informational / policy inquiry suited for FAQ and RAG retrieval.",
                    confidence=0.95,
                )

            # 3. Detect domain signals (billing, order, tech)
            domain_signals = detect_domain_signals(text)
            required_agents = sorted(list(domain_signals))

            # 4. Multi-domain / Complex case
            if len(required_agents) > 1:
                agents_str = ", ".join(required_agents)
                logger.info("Routed case_id=%s to multi-agent complex flow: %s", case_id, agents_str)
                return RoutingResult(
                    case_id=case_id,
                    route_type=RouteType.COMPLEX.value,
                    required_agents=required_agents,
                    reason=f"Multi-domain issue detected requiring collaboration between: {agents_str}.",
                    confidence=0.90,
                )

            # 5. Single domain specialist case
            if len(required_agents) == 1:
                agent = required_agents[0]
                logger.info("Routed case_id=%s to single specialist agent: %s", case_id, agent)
                return RoutingResult(
                    case_id=case_id,
                    route_type=RouteType.COMPLEX.value,
                    required_agents=required_agents,
                    reason=f"Identified specific {agent} domain problem requiring specialist agent handling.",
                    confidence=0.88,
                )

            # 6. Fallback / Ambiguous / Unknown request
            logger.info("Ambiguous case_id=%s; no domain signals matched", case_id)
            return RoutingResult(
                case_id=case_id,
                route_type=RouteType.COMPLEX.value,
                required_agents=[],
                reason="Ambiguous request with no strong domain signals. Routed to general triage without specialist assignment.",
                confidence=0.25,
            )

        except Exception as exc:
            # Defensive fallback to ensure the Router never crashes the process
            logger.exception("Unexpected error during routing for request: %s", exc)
            fallback_id = getattr(request, "case_id", "unknown_case")
            return RoutingResult(
                case_id=fallback_id,
                route_type=RouteType.COMPLEX.value,
                required_agents=[],
                reason=f"Routing evaluation encountered an unexpected error: {str(exc)}. Safe fallback applied.",
                confidence=0.0,
            )
