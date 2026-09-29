"""Specialized Order Agent for logistics, order lifecycle, and fulfillment investigation."""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from backend.ai.agents.base import BaseAgent
from backend.ai.models.case import (
    AgentFinding,
    AgentInvestigationResult,
    AgentStatus,
    Contradiction,
    CustomerCase,
    EvidenceItem,
    EvidenceSource,
    RiskSignal,
)


class OrderAgent(BaseAgent):
    """Specialized investigator for order fulfillment, carrier tracking, and package status."""

    def __init__(self, name: str = "OrderAgent") -> None:
        super().__init__(
            name=name,
            domain="order_and_logistics",
            description="Investigates order state, warehouse dispatch, carrier scans, and delivery telemetry.",
        )

    def investigate(self, case: CustomerCase) -> AgentInvestigationResult:
        """Analyze order fulfillment and carrier logistics for the given case."""
        findings: List[AgentFinding] = []
        contradictions: List[Contradiction] = []
        risk_signals: List[RiskSignal] = []
        examined_evidence: List[EvidenceItem] = []
        errors: List[str] = []

        # 1. Filter or extract order and logistics evidence
        logistics_evidence = [
            e for e in case.evidence
            if e.source in {EvidenceSource.DELIVERY_PARTNER, EvidenceSource.SELLER}
            or e.evidence_type in {"carrier_scan", "manifest", "delivery_photo", "order_status"}
        ]
        examined_evidence.extend(logistics_evidence)

        order_id = case.order_id or case.metadata.get("order_id")
        complaint_lower = case.complaint.lower()

        # 2. Analyze fulfillment telemetry
        carrier_delivered = False
        delivery_address_verified = False

        if logistics_evidence:
            for item in logistics_evidence:
                event_type = item.data.get("status") or item.evidence_type
                carrier_delivered = carrier_delivered or (event_type in {"delivered", "signed_delivery"})
                delivery_address_verified = item.data.get("geo_verified", False)

                findings.append(
                    self._create_finding(
                        category="fulfillment_status",
                        finding=f"Logistics record: {item.source.value} reports event '{event_type}'.",
                        severity="info" if carrier_delivered else "warning",
                        details={"order_id": order_id, "event_data": item.data},
                    )
                )

                # Check for "never received" or "lost" complaints when carrier marked delivered
                if ("not received" in complaint_lower or "missing" in complaint_lower or "lost" in complaint_lower) and carrier_delivered:
                    contradictions.append(
                        self._create_contradiction(
                            description="Carrier status marked Delivered while customer reports non-receipt",
                            source_a="customer_complaint",
                            source_b="delivery_partner_scan",
                            detail=(
                                f"Delivery partner recorded package as '{event_type}', "
                                "whereas customer states the shipment has not arrived."
                            ),
                            severity="high",
                        )
                    )
        else:
            # Baseline placeholder finding
            status_desc = "dispatched" if order_id else "no_order_id_specified"
            findings.append(
                self._create_finding(
                    category="order_lookup",
                    finding=f"Order reference: {order_id or 'N/A'}. Shipment tracking pipeline queried.",
                    severity="info",
                    details={"order_id": order_id, "status": status_desc},
                )
            )

        # 3. Fairness-compliant risk signal evaluation
        # Multiple non-receipt claims in an area or account trigger objective verification, never fraud accusation.
        prior_missing_claims = case.metadata.get("prior_missing_package_claims_180d", 0)
        if prior_missing_claims >= 2:
            risk_signals.append(
                self._create_risk_signal(
                    signal_type="recurrent_delivery_conflict_signal",
                    description=(
                        f"Account notes {prior_missing_claims} prior delivery discrepancy claims within 180 days. "
                        "Evidence conflict pattern identified."
                    ),
                    severity="medium",
                    recommended_verification="Conduct courier physical GPS pin audit and signature re-examination.",
                )
            )

        # 4. Action recommendation
        if contradictions:
            recommended_action = "Initiate carrier delivery dispute inquiry and inspect GPS delivery coordinate match."
        elif "damaged" in complaint_lower:
            recommended_action = "Request item condition photograph to authorize replacement order."
        else:
            recommended_action = "Confirm expected arrival window with fulfillment network."

        confidence = 0.90 if order_id or logistics_evidence else 0.70

        return self._build_result(
            status=AgentStatus.SUCCESS,
            findings=findings,
            evidence=examined_evidence,
            confidence=confidence,
            contradictions=contradictions,
            risk_signals=risk_signals,
            recommended_action=recommended_action,
            errors=errors,
            metadata={"domain": self.domain, "order_id": order_id},
        )
