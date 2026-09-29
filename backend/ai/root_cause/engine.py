"""Root Cause Engine for ARGUS.

Analyzes consolidated multi-agent investigations to identify the underlying
root cause, assemble supporting evidence, detect contradictions, and determine
whether automated resolution or human escalation is required.
"""

from __future__ import annotations

import abc
import asyncio
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.ai.config.settings import RootCauseConfig, get_ai_settings
from backend.ai.coordinator.coordinator import ConsolidatedInvestigation
from backend.ai.models.case import Contradiction, EvidenceItem, RiskSignal


class RootCauseResult(BaseModel):
    """Structured conclusion produced by the Root Cause Engine."""
    case_id: str = Field(description="Associated customer case identifier")
    root_cause: str = Field(description="Explanatory root cause statement")
    root_cause_category: str = Field(
        default="UNDETERMINED",
        description="High-level category (e.g. LOGISTICS_FAILURE, PAYMENT_ANOMALY, SYSTEM_OUTAGE)"
    )
    supporting_evidence: List[EvidenceItem] = Field(
        default_factory=list,
        description="Evidence items directly corroborating the determined root cause"
    )
    confidence: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence in the identified root cause determination"
    )
    contradictions: List[Contradiction] = Field(
        default_factory=list,
        description="Unresolved or relevant evidence contradictions"
    )
    recommended_action: str = Field(
        description="Specific resolution or remediation recommendation"
    )
    escalation_required: bool = Field(
        default=False,
        description="Whether this case requires human supervisor escalation"
    )
    escalation_reason: Optional[str] = Field(
        default=None,
        description="Detailed reason for human escalation if triggered"
    )
    risk_signals: List[RiskSignal] = Field(
        default_factory=list,
        description="Fairness-compliant risk signals considered during analysis"
    )
    prevention_tip: Optional[str] = Field(
        default=None,
        description="Forward-looking operational recommendation to prevent recurrence"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Root cause diagnostic telemetry"
    )


class BaseRootCauseEngine(abc.ABC):
    """Abstract interface for all Root Cause analysis engines."""

    @abc.abstractmethod
    def analyze(self, investigation: ConsolidatedInvestigation) -> RootCauseResult:
        """Analyze a consolidated investigation to deduce the primary root cause.

        Args:
            investigation: The consolidated multi-agent investigation result.

        Returns:
            Structured RootCauseResult with root cause, supporting evidence,
            confidence score, and escalation status.
        """
        raise NotImplementedError("Root cause engines must implement analyze()")

    async def aanalyze(self, investigation: ConsolidatedInvestigation) -> RootCauseResult:
        """Asynchronous root cause analysis wrapper."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.analyze, investigation)


class DefaultRootCauseEngine(BaseRootCauseEngine):
    """Default modular root cause diagnostic engine."""

    def __init__(self, config: Optional[RootCauseConfig] = None) -> None:
        self.config = config or get_ai_settings().root_cause

    def analyze(self, investigation: ConsolidatedInvestigation) -> RootCauseResult:
        """Perform deterministic and evidence-grounded root cause determination."""
        contradictions = investigation.contradictions
        risk_signals = investigation.risk_signals
        evidence = investigation.all_evidence
        confidence = investigation.overall_confidence

        # 1. Condition: High severity cross-domain or evidence contradiction
        has_critical_conflict = any(c.severity in {"high", "critical"} for c in contradictions)
        if has_critical_conflict and self.config.escalate_on_contradiction:
            lead_conflict = next(c for c in contradictions if c.severity in {"high", "critical"})
            return RootCauseResult(
                case_id=investigation.case_id,
                root_cause=f"Evidence Conflict: {lead_conflict.description}",
                root_cause_category="EVIDENCE_CONFLICT",
                supporting_evidence=evidence,
                confidence=confidence,
                contradictions=contradictions,
                recommended_action="Route to Senior Specialist for manual document reconciliation.",
                escalation_required=True,
                escalation_reason=f"Unresolved critical contradiction: {lead_conflict.detail}",
                risk_signals=risk_signals,
                prevention_tip="Ensure courier GPS telemetry is synchronized with order management webhooks in real-time.",
                metadata={"conflict_count": len(contradictions)},
            )

        # 2. Condition: Technical outage corroborated
        tech_result = investigation.agent_results.get("TechAgent")
        if tech_result and tech_result.metadata.get("incident_confirmed"):
            return RootCauseResult(
                case_id=investigation.case_id,
                root_cause="Platform Outage: Server 5xx exception interrupted checkout transaction pipeline.",
                root_cause_category="SYSTEM_OUTAGE",
                supporting_evidence=tech_result.evidence,
                confidence=0.92,
                contradictions=contradictions,
                recommended_action="Execute automated payment reconciliation and trigger customer notification.",
                escalation_required=False,
                risk_signals=risk_signals,
                prevention_tip="Increase gateway timeout buffer during peak traffic periods.",
                metadata={"service_incident": True},
            )

        # 3. Condition: Billing Agent identified refund eligibility
        billing_result = investigation.agent_results.get("BillingAgent")
        if billing_result and any(f.category == "refund_eligibility" for f in billing_result.findings):
            return RootCauseResult(
                case_id=investigation.case_id,
                root_cause="Standard Return/Refund Request: Customer initiated eligible return process.",
                root_cause_category="STANDARD_REFUND_LIFECYCLE",
                supporting_evidence=billing_result.evidence,
                confidence=0.88,
                contradictions=contradictions,
                recommended_action="Issue return shipping label and initialize pending refund credit.",
                escalation_required=False,
                risk_signals=risk_signals,
                prevention_tip="Provide self-service return label generation in mobile application.",
                metadata={"refund_eligible": True},
            )

        # 4. Condition: General Logistics/Fulfillment Delay
        order_result = investigation.agent_results.get("OrderAgent")
        if order_result and order_result.findings:
            return RootCauseResult(
                case_id=investigation.case_id,
                root_cause="Fulfillment In-Transit Status: Order lifecycle active within normal logistics parameters.",
                root_cause_category="LOGISTICS_IN_PROGRESS",
                supporting_evidence=order_result.evidence,
                confidence=max(0.70, confidence),
                contradictions=contradictions,
                recommended_action="Transmit updated carrier tracking ETA to customer.",
                escalation_required=investigation.requires_escalation,
                escalation_reason="Escalated due to customer risk signal threshold" if investigation.requires_escalation else None,
                risk_signals=risk_signals,
                prevention_tip="Automate proactive SMS alerts when carrier transit experiences route delays.",
                metadata={"order_active": True},
            )

        # 5. Baseline Fallback
        return RootCauseResult(
            case_id=investigation.case_id,
            root_cause="General Inquiry / Unclassified Case Pattern: Multi-agent telemetry yielded inconclusive indicators.",
            root_cause_category="INCONCLUSIVE",
            supporting_evidence=evidence,
            confidence=0.60,
            contradictions=contradictions,
            recommended_action="Assign to customer service representative for manual inquiry review.",
            escalation_required=True,
            escalation_reason="Case data insufficient for automated root-cause resolution.",
            risk_signals=risk_signals,
            prevention_tip="Collect explicit intake fields (order ID, transaction ID) at complaint submission.",
            metadata={"insufficient_data": True},
        )
