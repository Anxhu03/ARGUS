"""Coordinator for ARGUS multi-agent investigation.

Synthesizes results from specialized domain agents (Billing, Order, Tech) into
a consolidated case investigation with cross-domain contradiction analysis,
supporting evidence identification, and missing evidence detection.
"""

from __future__ import annotations

import abc
import asyncio
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field

from backend.ai.config.settings import CoordinatorConfig, get_ai_settings
from backend.ai.models.case import (
    AgentFinding,
    AgentInvestigationResult,
    AgentStatus,
    Contradiction,
    CustomerCase,
    EvidenceItem,
    RiskSignal,
)


class ConsolidatedInvestigation(BaseModel):
    """The structured output of multi-agent coordination."""
    case_id: str = Field(description="Associated customer case ID")
    agent_results: Dict[str, AgentInvestigationResult] = Field(
        default_factory=dict,
        description="Map of agent name to individual investigation result"
    )
    all_findings: List[AgentFinding] = Field(
        default_factory=list,
        description="Consolidated findings across all participating agents"
    )
    all_evidence: List[EvidenceItem] = Field(
        default_factory=list,
        description="Deduplicated evidence items examined across agents"
    )
    contradictions: List[Contradiction] = Field(
        default_factory=list,
        description="All within-agent and cross-domain contradictions detected"
    )
    risk_signals: List[RiskSignal] = Field(
        default_factory=list,
        description="Fairness-compliant risk signals observed across agents"
    )
    missing_evidence: List[str] = Field(
        default_factory=list,
        description="Items of evidence required to reach conclusive determination but currently absent"
    )
    summary: str = Field(
        default="",
        description="High-level synthesis of the multi-agent investigation"
    )
    overall_confidence: float = Field(
        default=1.0,
        ge=0.0,
        le=1.0,
        description="Synthesized multi-agent confidence score"
    )
    requires_escalation: bool = Field(
        default=False,
        description="Indicates if contradictory evidence or critical risk requires human intervention"
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Coordination metadata and timestamps"
    )


class BaseCoordinator(abc.ABC):
    """Abstract interface for multi-agent case coordinators."""

    @abc.abstractmethod
    def coordinate(
        self,
        case: CustomerCase,
        agent_results: List[AgentInvestigationResult],
    ) -> ConsolidatedInvestigation:
        """Synthesize multiple specialized agent results into a consolidated investigation.

        Args:
            case: The normalized customer case under investigation.
            agent_results: List of individual agent results.

        Returns:
            ConsolidatedInvestigation containing synthesized findings, cross-agent contradictions,
            evidence audit, and missing evidence lists.
        """
        raise NotImplementedError("Coordinators must implement coordinate()")

    async def acoordinate(
        self,
        case: CustomerCase,
        agent_results: List[AgentInvestigationResult],
    ) -> ConsolidatedInvestigation:
        """Asynchronous coordination wrapper."""
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.coordinate, case, agent_results)


class DefaultCoordinator(BaseCoordinator):
    """Production coordinator comparing findings, evidence, and cross-agent signals."""

    def __init__(self, config: Optional[CoordinatorConfig] = None) -> None:
        self.config = config or get_ai_settings().coordinator

    def coordinate(
        self,
        case: CustomerCase,
        agent_results: List[AgentInvestigationResult],
    ) -> ConsolidatedInvestigation:
        """Execute multi-agent synthesis."""
        agent_results_map: Dict[str, AgentInvestigationResult] = {}
        all_findings: List[AgentFinding] = []
        all_evidence: List[EvidenceItem] = []
        contradictions: List[Contradiction] = []
        risk_signals: List[RiskSignal] = []
        missing_evidence: List[str] = []

        seen_evidence_ids = set()

        for res in agent_results:
            agent_results_map[res.agent_name] = res
            all_findings.extend(res.findings)
            contradictions.extend(res.contradictions)
            risk_signals.extend(res.risk_signals)

            for ev in res.evidence:
                if ev.id not in seen_evidence_ids:
                    all_evidence.append(ev)
                    seen_evidence_ids.add(ev.id)

        # Include case-level evidence not already attached by agents
        for ev in case.evidence:
            if ev.id not in seen_evidence_ids:
                all_evidence.append(ev)
                seen_evidence_ids.add(ev.id)

        # 1. Cross-Domain Contradiction Detection
        self._detect_cross_domain_contradictions(agent_results_map, contradictions)

        # 2. Missing Evidence Audit
        self._audit_missing_evidence(case, all_evidence, missing_evidence)

        # 3. Compute Synthesized Overall Confidence
        if agent_results:
            base_conf = sum(res.confidence for res in agent_results) / len(agent_results)
        else:
            base_conf = 0.50

        # Confidence penalties for severe contradictions or missing evidence
        penalty = 0.0
        if contradictions:
            penalty += min(0.30, len(contradictions) * 0.10)
        if missing_evidence:
            penalty += min(0.20, len(missing_evidence) * 0.05)

        overall_confidence = max(0.10, round(base_conf - penalty, 2))

        # 4. Determine Escalation Requirement
        has_high_severity_contradiction = any(c.severity in {"high", "critical"} for c in contradictions)
        has_high_risk_signal = any(r.severity in {"high", "critical"} for r in risk_signals)
        requires_escalation = has_high_severity_contradiction or has_high_risk_signal or (overall_confidence < 0.50)

        # 5. Formulate Summary
        agent_names = list(agent_results_map.keys())
        summary = (
            f"Investigation synthesized across {len(agent_names)} specialized agent(s): {', '.join(agent_names)}. "
            f"Discovered {len(all_findings)} finding(s), {len(contradictions)} contradiction(s), "
            f"and {len(risk_signals)} risk signal(s). "
            f"{'Escalation recommended due to evidence conflict.' if requires_escalation else 'Automated resolution criteria met.'}"
        )

        return ConsolidatedInvestigation(
            case_id=case.case_id,
            agent_results=agent_results_map,
            all_findings=all_findings,
            all_evidence=all_evidence,
            contradictions=contradictions,
            risk_signals=risk_signals,
            missing_evidence=missing_evidence,
            summary=summary,
            overall_confidence=overall_confidence,
            requires_escalation=requires_escalation,
            metadata={
                "agents_involved": agent_names,
                "findings_count": len(all_findings),
                "contradictions_count": len(contradictions),
            },
        )

    def _detect_cross_domain_contradictions(
        self,
        agents_map: Dict[str, AgentInvestigationResult],
        contradictions: List[Contradiction],
    ) -> None:
        """Identify conflicts spanning multiple domains (e.g. billing vs order vs tech)."""
        billing = agents_map.get("BillingAgent")
        order = agents_map.get("OrderAgent")
        tech = agents_map.get("TechAgent")

        # Cross-domain 1: Billing reports captured payment, but Order reports no record in warehouse
        if billing and order:
            billing_has_captured = any(
                f.details.get("status") == "captured" for f in billing.findings
            )
            order_missing = any(
                f.details.get("status") == "no_order_id_specified" for f in order.findings
            )
            if billing_has_captured and order_missing:
                contradictions.append(
                    Contradiction(
                        description="Payment captured but order creation unverified",
                        source_a="BillingAgent:gateway_ledger",
                        source_b="OrderAgent:fulfillment_system",
                        detail="Financial authorization was settled, but no active fulfillment order was established.",
                        severity="high",
                    )
                )

        # Cross-domain 2: Customer reports transaction failure, TechAgent confirms 500 error, but Billing shows capture
        if billing and tech:
            tech_has_outage = tech.metadata.get("incident_confirmed", False)
            billing_has_captured = any(
                f.details.get("status") == "captured" for f in billing.findings
            )
            if tech_has_outage and billing_has_captured:
                contradictions.append(
                    Contradiction(
                        description="Transaction capture recorded during server 5xx crash",
                        source_a="TechAgent:gateway_5xx",
                        source_b="BillingAgent:captured_ledger",
                        detail="Payment was captured while user interface experienced verified 500 timeout.",
                        severity="high",
                    )
                )

    def _audit_missing_evidence(
        self,
        case: CustomerCase,
        evidence: List[EvidenceItem],
        missing: List[str],
    ) -> None:
        """Identify missing documentation required for fair, definitive adjudication."""
        text = case.complaint.lower()
        evidence_types = {e.evidence_type for e in evidence}

        if ("damaged" in text or "broken" in text) and "delivery_photo" not in evidence_types:
            missing.append("photograph_of_damaged_goods")

        if ("not received" in text or "missing" in text) and "carrier_scan" not in evidence_types:
            missing.append("carrier_geolocation_and_signature_record")

        if ("charged twice" in text or "double charge" in text) and "bank_statement" not in evidence_types:
            missing.append("cardholder_bank_settlement_statement")
