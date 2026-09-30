"""
Data models for routing results and triage classification.
"""

from enum import Enum
from typing import List, Literal
from pydantic import BaseModel, Field


class RouteType(str, Enum):
    """
    Primary routing branch for inbound customer inquiries.
    """
    FAQ = "faq"
    COMPLEX = "complex"


class DomainAgent(str, Enum):
    """
    Specialist agent domains available in ARGUS.
    """
    BILLING = "billing"
    ORDER = "order"
    TECH = "tech"


class RoutingResult(BaseModel):
    """
    Structured outcome of the Router triage process.
    Matches the ARGUS routing contract.
    """
    case_id: str = Field(
        ...,
        description="The ID of the case evaluated."
    )
    route_type: Literal["faq", "complex"] = Field(
        ...,
        description="Primary branch: 'faq' for informational retrieval, 'complex' for agent-driven cases."
    )
    required_agents: List[str] = Field(
        default_factory=list,
        description="List of domain specialist agents required to resolve this case."
    )
    reason: str = Field(
        ...,
        description="Explanation of why this routing decision was made."
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score for this routing decision (0.0 to 1.0)."
    )
