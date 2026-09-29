"""Normalized case and investigation data models for ARGUS.

These models define the common contracts shared across all AI components:
Router, Agents, Coordinator, and Root Cause Engine.
"""

from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class CasePriority(str, Enum):
    """Priority level assigned to a customer case."""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class CaseStatus(str, Enum):
    """Lifecycle status of a customer case."""
    OPEN = "open"
    IN_TRIAGE = "in_triage"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    ESCALATED = "escalated"
    CLOSED = "closed"


class EvidenceSource(str, Enum):
    """Source of truth for an evidence item.

    Fairness guarantee: All parties' evidence can be evaluated without bias.
    """
    CUSTOMER = "customer"
    SELLER = "seller"
    DELIVERY_PARTNER = "delivery_partner"
    PAYMENT_GATEWAY = "payment_gateway"
    SYSTEM_LOGS = "system_logs"
    PRODUCT_CATALOG = "product_catalog"


class EvidenceItem(BaseModel):
    """A single piece of documentary or telemetry evidence."""
    id: str = Field(description="Unique identifier for the evidence item")
    source: EvidenceSource = Field(description="Entity providing the evidence")
    evidence_type: str = Field(
        description="Type of evidence e.g. delivery_scan, gateway_webhook, error_log, photo"
    )
    data: Dict[str, Any] = Field(
        default_factory=dict,
        description="Structured payload containing raw evidence attributes"
    )
    timestamp: Optional[datetime] = Field(
        default=None,
        description="When the evidence event occurred"
    )
    verified: bool = Field(
        default=False,
        description="Whether this evidence has been cryptographically or system-verified"
    )
    notes: Optional[str] = Field(
        default=None,
        description="Optional analyst or system annotation"
    )


class ConversationMessage(BaseModel):
    """Single turn in a customer conversation."""
    sender: str = Field(description="Sender type, e.g. customer, agent, system")
    message: str = Field(description="Message body text")
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp of the message"
    )


class CustomerCase(BaseModel):
    """Normalized customer case model accepted across all ARGUS AI services.

    Designed to be extensible. Fields that might not be available at intake
    (e.g., order_id, payment_id) are optional.
    """
    case_id: str = Field(description="Unique case identifier")
    customer_id: str = Field(description="Unique customer identifier")
    complaint: str = Field(description="Primary complaint text or question from the customer")
    order_id: Optional[str] = Field(
        default=None,
        description="Associated order ID if applicable"
    )
    payment_id: Optional[str] = Field(
        default=None,
        description="Associated payment or transaction ID if applicable"
    )
    priority: CasePriority = Field(
        default=CasePriority.MEDIUM,
        description="Initial case priority"
    )
    status: CaseStatus = Field(
        default=CaseStatus.OPEN,
        description="Current state of the case"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Arbitrary context (user tier, channel, locale, previous tickets)"
    )
    conversation_history: List[ConversationMessage] = Field(
        default_factory=list,
        description="Prior dialog turns related to this ticket"
    )
    evidence: List[EvidenceItem] = Field(
        default_factory=list,
        description="All collected evidence items across all parties"
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="When the case was created"
    )
    updated_at: Optional[datetime] = Field(
        default=None,
        description="When the case was last updated"
    )


class AgentStatus(str, Enum):
    """Execution status for an individual agent investigation."""
    SUCCESS = "success"
    PARTIAL = "partial"
    FAILED = "failed"
    SKIPPED = "skipped"


class AgentFinding(BaseModel):
    """A concrete finding uncovered during an agent's domain investigation."""
    category: str = Field(description="Domain category, e.g. payment_status, transit_delay")
    finding: str = Field(description="Human and machine-readable finding statement")
    severity: str = Field(
        default="info",
        description="Finding severity: info, warning, critical"
    )
    details: Dict[str, Any] = Field(
        default_factory=dict,
        description="Supporting data backing this finding"
    )


class Contradiction(BaseModel):
    """Represents a conflict between two or more evidence sources or findings.

    Fairness rule: Contradictions are labeled objectively as evidence conflicts,
    never as customer deception or bad faith.
    """
    description: str = Field(description="Summary of the contradiction")
    source_a: str = Field(description="First source of information")
    source_b: str = Field(description="Conflicting source of information")
    detail: str = Field(description="Detailed explanation of the discrepancy")
    severity: str = Field(
        default="medium",
        description="Conflict severity: low, medium, high"
    )


class RiskSignal(BaseModel):
    """Fairness-compliant risk indicator.

    ARGUS Fairness Principle:
    Repeated complaints or mismatches generate a 'risk signal' requiring
    'additional verification', but NEVER automatically conclude customer fraud.
    """
    signal_type: str = Field(description="Type of signal, e.g. frequent_missing_package_signal")
    description: str = Field(description="Neutral description of the signal pattern")
    severity: str = Field(
        default="low",
        description="Signal severity: low, medium, high"
    )
    recommended_verification: Optional[str] = Field(
        default=None,
        description="Objective verification step needed (e.g. signature proof, photo request)"
    )


class AgentInvestigationResult(BaseModel):
    """Standardized output returned by every specialized ARGUS investigator agent."""
    agent_name: str = Field(description="Identifier of the investigating agent")
    status: AgentStatus = Field(description="Status of the agent investigation")
    findings: List[AgentFinding] = Field(
        default_factory=list,
        description="Domain findings discovered by the agent"
    )
    evidence: List[EvidenceItem] = Field(
        default_factory=list,
        description="Specific evidence examined or retrieved by this agent"
    )
    confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Agent confidence in its findings (0.0 to 1.0)"
    )
    contradictions: List[Contradiction] = Field(
        default_factory=list,
        description="Contradictions observed within this agent's domain"
    )
    risk_signals: List[RiskSignal] = Field(
        default_factory=list,
        description="Fairness-compliant risk signals observed"
    )
    recommended_action: Optional[str] = Field(
        default=None,
        description="Action recommended from this agent's perspective"
    )
    errors: List[str] = Field(
        default_factory=list,
        description="Any error messages encountered during investigation"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Agent-specific execution metadata"
    )
