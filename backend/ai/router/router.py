"""Router module for ARGUS.

Determines whether incoming customer requests are informational (FAQ)
or require complex multi-agent investigation.
"""

from __future__ import annotations

import abc
import asyncio
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set
from pydantic import BaseModel, Field

from backend.ai.config.settings import RouterConfig, get_ai_settings
from backend.ai.models.case import CustomerCase


class RouteType(str, Enum):
    """Destination pathway for a customer request."""
    FAQ = "FAQ"
    INVESTIGATION = "INVESTIGATION"


class RoutingDecision(BaseModel):
    """Structured decision produced by the router."""
    route: RouteType = Field(description="Selected route: FAQ or INVESTIGATION")
    agents: List[str] = Field(
        default_factory=list,
        description="Target specialized agents assigned for investigation (empty for FAQ)"
    )
    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence score of the routing decision (0.0 to 1.0)"
    )
    intent: str = Field(
        default="unknown",
        description="Detected intent category (e.g. policy_inquiry, missing_order, payment_dispute)"
    )
    reasoning: str = Field(
        default="",
        description="Explanation for why this route and agents were selected"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional classification metadata or debug signals"
    )


class BaseRouter(abc.ABC):
    """Abstract interface for all ARGUS request routers."""

    @abc.abstractmethod
    def route(self, case: CustomerCase) -> RoutingDecision:
        """Route a normalized customer case to either FAQ or complex investigation.

        Args:
            case: The normalized customer case.

        Returns:
            RoutingDecision specifying route, target agents, and confidence.
        """
        raise NotImplementedError("Routers must implement route()")

    async def aroute(self, case: CustomerCase) -> RoutingDecision:
        """Asynchronous routing wrapper."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.route, case)


class RuleBasedRouter(BaseRouter):
    """Default high-performance rule-based classifier router.

    Can be swapped or augmented with an LLM classifier without modifying downstream consumers.
    """

    FAQ_TRIGGERS: Set[str] = {
        "what is",
        "what are",
        "how do i",
        "how can i",
        "where can i",
        "return policy",
        "refund policy",
        "shipping policy",
        "delivery time",
        "how long does",
        "can i change",
        "do you ship",
        "payment methods",
        "international shipping",
    }

    BILLING_KEYWORDS: Set[str] = {
        "charge",
        "charged",
        "payment",
        "billing",
        "refund",
        "invoice",
        "double charge",
        "receipt",
        "credit card",
        "debit card",
        "bank",
        "deducted",
        "unauthorized",
        "overcharge",
    }

    ORDER_KEYWORDS: Set[str] = {
        "order",
        "package",
        "delivery",
        "shipment",
        "carrier",
        "tracking",
        "courier",
        "delivered",
        "not received",
        "missing",
        "lost",
        "damaged",
        "transit",
        "dispatch",
        "wrong item",
    }

    TECH_KEYWORDS: Set[str] = {
        "error",
        "crash",
        "bug",
        "glitch",
        "website",
        "app",
        "login",
        "timeout",
        "500",
        "failed to load",
        "screen",
        "frozen",
        "password",
        "server",
    }

    def __init__(self, config: Optional[RouterConfig] = None) -> None:
        self.config = config or get_ai_settings().router

    def route(self, case: CustomerCase) -> RoutingDecision:
        """Evaluate complaint text and case context to determine routing."""
        text = case.complaint.strip().lower()
        has_specific_ids = bool(case.order_id or case.payment_id or case.evidence)

        # 1. Check for clear FAQ informational patterns
        is_faq_style = any(trigger in text for trigger in self.FAQ_TRIGGERS)
        is_question_ending = text.endswith("?")

        # If it looks like an informational inquiry and has no specific transaction/order dispute
        if is_faq_style and not has_specific_ids and not any(k in text for k in ["charged twice", "damaged item", "stolen"]):
            return RoutingDecision(
                route=RouteType.FAQ,
                agents=[],
                confidence=0.92,
                intent="informational_inquiry",
                reasoning="Matched informational question pattern with no active incident IDs.",
            )

        # 2. Assign specialized agents based on domain signals
        selected_agents: List[str] = []

        has_billing = any(k in text for k in self.BILLING_KEYWORDS) or bool(case.payment_id)
        has_order = any(k in text for k in self.ORDER_KEYWORDS) or bool(case.order_id)
        has_tech = any(k in text for k in self.TECH_KEYWORDS)

        if has_billing:
            selected_agents.append("billing")
        if has_order:
            selected_agents.append("order")
        if has_tech:
            selected_agents.append("tech")

        # 3. Fallback to default investigation if no specific keywords matched
        if not selected_agents:
            if is_question_ending:
                # Soft question fallback
                return RoutingDecision(
                    route=RouteType.FAQ,
                    agents=[],
                    confidence=0.72,
                    intent="general_question",
                    reasoning="Question format detected without specific incident indicators.",
                )
            selected_agents = list(self.config.default_investigation_agents)

        confidence = 0.88 if len(selected_agents) > 0 else 0.65

        return RoutingDecision(
            route=RouteType.INVESTIGATION,
            agents=selected_agents,
            confidence=confidence,
            intent="incident_investigation",
            reasoning=f"Identified incident indicators requiring specialized agents: {selected_agents}.",
            metadata={"assigned_agents": selected_agents},
        )
