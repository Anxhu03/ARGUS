"""Base Agent contract and abstract definition for ARGUS specialized agents."""

from __future__ import annotations

import abc
import asyncio
from typing import Any, Dict, List, Optional
from backend.ai.models.case import (
    AgentFinding,
    AgentInvestigationResult,
    AgentStatus,
    Contradiction,
    CustomerCase,
    EvidenceItem,
    RiskSignal,
)


class BaseAgent(abc.ABC):
    """Abstract base class establishing the contract for all specialized ARGUS investigators.

    Every specialized agent (BillingAgent, OrderAgent, TechAgent, and future domain agents)
    implements this interface. Agents receive a normalized CustomerCase and return a
    structured AgentInvestigationResult.
    """

    def __init__(self, name: str, domain: str, description: Optional[str] = None) -> None:
        self.name = name
        self.domain = domain
        self.description = description or f"Specialized ARGUS investigator for {domain}."

    @abc.abstractmethod
    def investigate(self, case: CustomerCase) -> AgentInvestigationResult:
        """Perform domain-specific investigation on the normalized case.

        Args:
            case: The normalized customer case containing complaint, IDs, and collected evidence.

        Returns:
            Structured AgentInvestigationResult containing domain findings, evidence,
            confidence score, contradictions, fairness-compliant risk signals, and recommendations.
        """
        raise NotImplementedError("Specialized agents must implement investigate()")

    async def ainvestigate(self, case: CustomerCase) -> AgentInvestigationResult:
        """Asynchronous execution wrapper for agent investigation.

        Allows asynchronous orchestration engines or FastAPI background tasks to invoke
        the agent concurrently without blocking.
        """
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, self.investigate, case)

    def _create_finding(
        self,
        category: str,
        finding: str,
        severity: str = "info",
        details: Optional[Dict[str, Any]] = None,
    ) -> AgentFinding:
        """Helper to construct an AgentFinding within this agent's domain."""
        return AgentFinding(
            category=category,
            finding=finding,
            severity=severity,
            details=details or {},
        )

    def _create_contradiction(
        self,
        description: str,
        source_a: str,
        source_b: str,
        detail: str,
        severity: str = "medium",
    ) -> Contradiction:
        """Helper to construct a fairness-compliant Contradiction record."""
        return Contradiction(
            description=description,
            source_a=source_a,
            source_b=source_b,
            detail=detail,
            severity=severity,
        )

    def _create_risk_signal(
        self,
        signal_type: str,
        description: str,
        severity: str = "low",
        recommended_verification: Optional[str] = None,
    ) -> RiskSignal:
        """Helper to construct a fairness-compliant RiskSignal record."""
        return RiskSignal(
            signal_type=signal_type,
            description=description,
            severity=severity,
            recommended_verification=recommended_verification,
        )

    def _build_result(
        self,
        status: AgentStatus = AgentStatus.SUCCESS,
        findings: Optional[List[AgentFinding]] = None,
        evidence: Optional[List[EvidenceItem]] = None,
        confidence: float = 1.0,
        contradictions: Optional[List[Contradiction]] = None,
        risk_signals: Optional[List[RiskSignal]] = None,
        recommended_action: Optional[str] = None,
        errors: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AgentInvestigationResult:
        """Standardized helper to bundle agent outputs into AgentInvestigationResult."""
        return AgentInvestigationResult(
            agent_name=self.name,
            status=status,
            findings=findings or [],
            evidence=evidence or [],
            confidence=confidence,
            contradictions=contradictions or [],
            risk_signals=risk_signals or [],
            recommended_action=recommended_action,
            errors=errors or [],
            metadata=metadata or {"domain": self.domain},
        )
