import random
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from backend.app.models.case import CaseCreate, CaseUpdate
from backend.app.repositories.base import CaseRepository

class EntityNotFoundError(Exception):
    def __init__(self, message: str, entity_id: str):
        super().__init__(message)
        self.entity_id = entity_id

class CaseService:
    def __init__(self, repository: CaseRepository):
        self.repository = repository

    def list_cases(
        self,
        status: Optional[str] = None,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        date_range: Optional[str] = None,
        query: Optional[str] = None,
        sort_by: Optional[str] = "date_desc",
    ) -> List[Dict[str, Any]]:
        return self.repository.list(
            status=status,
            category=category,
            priority=priority,
            date_range=date_range,
            query=query,
            sort_by=sort_by,
        )

    def get_case(self, case_id: str) -> Dict[str, Any]:
        case = self.repository.get_by_id(case_id)
        if not case:
            raise EntityNotFoundError(
                f"Case with ID {case_id} was not found in active cluster.",
                entity_id=case_id
            )
        return case

    def create_case(self, payload: CaseCreate) -> Dict[str, Any]:
        now_dt = datetime.now(timezone.utc)
        now_str = now_dt.strftime("%Y-%m-%d %H:%M:%S")
        time_str = now_dt.strftime("%H:%M:%S")
        
        # Generate next ID that doesn't conflict
        existing_cases = self.repository.list()
        existing_ids = {c.get("id") for c in existing_cases}
        while True:
            new_id = f"ARG-{random.randint(1050, 1999)}"
            if new_id not in existing_ids:
                break

        title = payload.title or (
            payload.complaintText[:65] + "..." if len(payload.complaintText) > 65 else payload.complaintText
        )
        name = payload.customerName or "Customer"
        avatar = "".join([part[0].upper() for part in name.split() if part])[:2] or "CU"

        new_case: Dict[str, Any] = {
            "id": new_id,
            "title": title,
            "customer": {
                "name": name,
                "email": payload.customerEmail or "customer@enterprise.org",
                "avatar": avatar,
                "tier": payload.tier or "Standard Tier",
                "joinedDate": "Active Session",
                "reliabilityScore": 94.0,
                "reliabilityBand": "High Reliability",
                "totalCases": 2,
                "resolvedCases": 1,
                "disputedCases": 0,
                "isUserSubmitted": True,
            },
            "complaintText": payload.complaintText,
            "category": payload.category or "General Support & Investigation",
            "priority": payload.priority or "High",
            "status": "Investigating",
            "createdAt": now_str,
            "updatedAt": now_str,
            "orderId": payload.orderId or "ORD-RECENT-01",
            "amount": payload.amount or "$199.00",
            "assignedTeam": "Tier 1 Support & Autonomous Investigation",
            "assignedAgent": "Investigation Coordinator",
            "activeAgents": [
                {"id": "coordinator", "name": "Coordinator", "status": "investigating", "progress": 60, "role": "Consensus & Root Cause Engine"},
                {"id": "billing", "name": "Billing Agent", "status": "completed", "progress": 100, "role": "Ledger & Gateway Audit"},
                {"id": "order", "name": "Order Agent", "status": "completed", "progress": 100, "role": "Fulfillment & Inventory State"},
                {"id": "tech", "name": "Technical Agent", "status": "investigating", "progress": 75, "role": "Telemetry & Signal Diagnostics"},
                {"id": "evidence_verifier", "name": "Evidence Verification", "status": "completed", "progress": 100, "role": "Cryptographic Digest & Hash Audit"},
            ],
            "agentsData": {
                "coordinator": {
                    "agentName": "Investigation Coordinator",
                    "version": "v5.0.0",
                    "status": "Synthesizing",
                    "confidenceScore": 95.0,
                    "task": "Synthesize findings across parallel agents and formulate verified root cause",
                    "summary": "Autonomous consensus forming across Billing, Order, and Technical pipelines.",
                    "executionTime": "160ms",
                    "metrics": [
                        {"label": "Synthesis Status", "value": "Forming Consensus"},
                        {"label": "Discrepancy Score", "value": "Zero Discrepancy"}
                    ],
                    "findings": ["Autonomous investigation pipeline deployed and auditing telemetry."]
                },
                "billing": {
                    "agentName": "Billing Agent",
                    "version": "v3.4.1",
                    "status": "Completed",
                    "confidenceScore": 97.2,
                    "task": "Query payment gateway ledger for matching order references and verify escrow",
                    "summary": "Identified captured transaction for order. Gateway authorization cleared without chargeback dispute.",
                    "executionTime": "340ms",
                    "metrics": [
                        {"label": "Gateway Record", "value": "Verified Active"},
                        {"label": "Dispute Flag", "value": "Clean"}
                    ],
                    "findings": ["Payment cleared through processor.", "Escrow reserve verified intact."]
                },
                "order": {
                    "agentName": "Order Agent",
                    "version": "v2.8.0",
                    "status": "Completed",
                    "confidenceScore": 96.5,
                    "task": "Check fulfillment status and warehouse routing pipeline",
                    "summary": "OMS entity located. Status shows processing delay in regional fulfillment dispatch.",
                    "executionTime": "290ms",
                    "metrics": [
                        {"label": "Warehouse State", "value": "Queue Paused"},
                        {"label": "Inventory Lock", "value": "Reserved"}
                    ],
                    "findings": ["Item remains safely allocated in warehouse inventory.", "Awaiting pipeline trigger."]
                },
                "tech": {
                    "agentName": "Technical Agent",
                    "version": "v4.1.2",
                    "status": "Investigating",
                    "confidenceScore": 93.0,
                    "task": "Audit message queue and system events for trace drops",
                    "summary": "Transient sync pause detected between payment confirmation and order release worker.",
                    "executionTime": "520ms",
                    "metrics": [{"label": "System Anomaly", "value": "Minor Worker Lag"}],
                    "findings": ["Event payload received.", "Processing queue backlog clearing."]
                },
                "evidence_verifier": {
                    "agentName": "Evidence Verification Agent",
                    "version": "v2.1.0",
                    "status": "Completed",
                    "confidenceScore": 99.0,
                    "task": "Verify cryptographic SHA-256 digests and customer proof artifacts",
                    "summary": "Cryptographic hash generation and attestation completed for uploaded statements and order records.",
                    "executionTime": "95ms",
                    "metrics": [
                        {"label": "Digests Generated", "value": "SHA-256 Validated"},
                        {"label": "Tampering Flags", "value": "None"}
                    ],
                    "findings": ["All ingested documents hashed with SHA-256 digests.", "Immutable timestamp recorded."]
                }
            },
            "timeline": [
                {"step": 1, "title": "Complaint Ingested", "description": "Submitted through ARGUS Customer Support Portal", "desc": "Submitted through ARGUS Customer Support Portal", "time": time_str, "status": "completed"},
                {"step": 2, "title": "Case Classified", "description": f"Categorized as {payload.category or 'General Support'} (Priority: {payload.priority or 'High'})", "desc": f"Categorized as {payload.category or 'General Support'}", "time": time_str, "status": "completed"},
                {"step": 3, "title": "Agents Assigned", "description": "Billing, Order, Tech, Evidence Verifier & Coordinator mobilized", "desc": "Agents mobilized", "time": time_str, "status": "completed"},
                {"step": 4, "title": "Evidence Retrieved", "description": "Automated ingestion of system logs and order records", "desc": "Logs retrieved", "time": time_str, "status": "completed"},
                {"step": 5, "title": "Investigation In Progress", "description": "Parallel agents analyzing ledger, OMS, and system telemetry", "desc": "Analyzing telemetry", "time": time_str, "status": "current"},
                {"step": 6, "title": "Contradictions Checked", "description": "Running statement vs telemetry matrix", "desc": "Checking matrix", "time": "Pending", "status": "pending"},
                {"step": 7, "title": "Root Cause Diagnosis", "description": "Coordinator identifying root cause", "desc": "Identifying cause", "time": "Pending", "status": "pending"},
                {"step": 8, "title": "Resolution Generation", "description": "Automated customer-facing resolution", "desc": "Generating draft", "time": "Pending", "status": "pending"},
                {"step": 9, "title": "Resolution Finalized", "description": "Execution or Human Review sign-off", "desc": "Finalizing", "time": "Pending", "status": "pending"}
            ],
            "investigationOverview": {
                "status": "Active Investigation",
                "objective": f"Investigate customer complaint for order {payload.orderId or 'ORD-RECENT-01'} regarding {payload.category or 'General Support'}.",
                "currentStage": "Stage 05 — Investigation In Progress",
                "openQuestions": [
                    "Are there conflicting records between the customer statement and gateway transactions?",
                    "Does inventory hold remain secure in fulfillment OMS?"
                ],
                "pendingEvidence": [
                    "Gateway transaction settlement digest",
                    "Warehouse fulfillment dispatch confirmation"
                ],
                "nextSuggestedStep": "Await parallel agent consensus formation and review proposed root cause."
            },
            "findings": {
                "verifiedFacts": [
                    f"Customer complaint ingested: \"{payload.complaintText[:100]}...\"",
                    f"Associated order reference: {payload.orderId or 'ORD-RECENT-01'}"
                ],
                "unverifiedClaims": [
                    "Customer report of pending resolution or missing funds."
                ],
                "supportingEvidence": [
                    "Customer Statement Verbatim Intake",
                    *([f"Uploaded attachment: {a.get('name')}" for a in (payload.attachments or []) if a.get("name")])
                ],
                "contradictoryEvidence": [],
                "missingInfo": [
                    "Live payment gateway reconciliation signature"
                ],
                "confidenceStatus": "95.0% Initial Classifier Assessment"
            },
            "internalNotes": [
                {
                    "id": f"note-{int(now_dt.timestamp() * 1000)}-1",
                    "author": "Intake Pipeline",
                    "role": "System Agent",
                    "text": f"Case registered via Customer Support intake. Category: {payload.category or 'General Support'}. Mobilized 5 diagnostic agents.",
                    "timestamp": now_str
                }
            ],
            "evidence": [
                {
                    "id": f"ev-new-{int(now_dt.timestamp() * 1000)}-1",
                    "title": "Order Record Ingestion",
                    "type": "Database Entity",
                    "source": "OMS Core Database",
                    "timestamp": now_str,
                    "status": "Verified",
                    "description": f"Ingested order details for {payload.orderId or 'ORD-RECENT-01'}.",
                    "payload": {"order_id": payload.orderId or "ORD-RECENT-01", "complaint": payload.complaintText}
                },
                {
                    "id": f"ev-new-{int(now_dt.timestamp() * 1000)}-2",
                    "title": "Customer Complaint Verbatim Transcript",
                    "type": "Customer Statement",
                    "source": "ARGUS Support Intake Form",
                    "timestamp": now_str,
                    "status": "Verified",
                    "payload": {"text": payload.complaintText}
                }
            ],
            "preferredResolution": payload.resolutionPreference or "Full Refund to Original Payment Method",
            "contradiction": None,
            "rootCause": {
                "headline": "Transient event processing latency between payment capture and fulfillment release.",
                "summary": "The payment succeeded normally; the fulfillment workflow was delayed by an automated security throttle. Investigation is verifying release authorization.",
                "chain": [
                    {"label": "Complaint", "text": "Customer reported order in pending state"},
                    {"label": "Telemetry", "text": "Payment confirmed, inventory lock verified"},
                    {"label": "Diagnosis", "text": "Security throttle queued order for autonomous clearance"}
                ],
                "impact": "Customer awaiting confirmation."
            },
            "resolution": {
                "actionType": "Autonomous Order Clearance",
                "status": "Formulated",
                "confidenceScore": 96.5,
                "headline": "Clear Security Throttle & Dispatch Priority Confirmation",
                "reason": "Zero fraudulent indicators. Validated payment and inventory holds.",
                "customerFacingMessage": "Thank you for reaching out. ARGUS investigated your case across our Billing, Order, and Technical systems. We verified that your payment cleared successfully, and your order has now been released to our fulfillment center with Priority Express tracking assigned.",
                "automatedActions": [
                    "Release inventory hold to priority pick queue",
                    "Send confirmation SMS and courier link to customer"
                ],
                "resolutionNotes": "Automated clearance generated by prototype coordinator.",
                "humanEscalationStatus": "None",
                "nextAction": "Execute approved resolution"
            },
            "escalation": None
        }

        return self.repository.create(new_case)

    def update_case(self, case_id: str, update_in: CaseUpdate) -> Dict[str, Any]:
        case = self.get_case(case_id)
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

        notes = list(case.get("internalNotes") or [])

        # 1. Status Update
        if update_in.status is not None:
            old_status = case.get("status")
            case["status"] = update_in.status
            reason_text = f": {update_in.reason}" if update_in.reason else ""
            notes.append({
                "id": f"note-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
                "author": "Operations Lead",
                "role": "Specialist",
                "text": f"Status updated from '{old_status}' to '{update_in.status}'{reason_text}.",
                "timestamp": now_str
            })

            # If resolved, update timeline stages and resolution status
            if update_in.status == "Resolved":
                case["timeline"] = [
                    {**t, "status": "completed"} for t in (case.get("timeline") or [])
                ]
                if case.get("resolution"):
                    case["resolution"]["status"] = "Resolved"

        # 2. Priority Update
        if update_in.priority is not None:
            old_priority = case.get("priority")
            case["priority"] = update_in.priority
            notes.append({
                "id": f"note-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
                "author": "Operations Lead",
                "role": "Specialist",
                "text": f"Priority adjusted from '{old_priority}' to '{update_in.priority}'.",
                "timestamp": now_str
            })

        # 3. Assignment Update
        if update_in.assignedTeam is not None or update_in.assignedAgent is not None:
            if update_in.assignedTeam is not None:
                case["assignedTeam"] = update_in.assignedTeam
            if update_in.assignedAgent is not None:
                case["assignedAgent"] = update_in.assignedAgent
            notes.append({
                "id": f"note-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
                "author": "Operations Lead",
                "role": "Specialist",
                "text": f"Assigned to team '{case.get('assignedTeam')}' (Lead: {case.get('assignedAgent')}).",
                "timestamp": now_str
            })

        # 4. Single Note Append
        if update_in.note is not None:
            single_note = {
                "id": update_in.note.get("id") or f"note-{int(datetime.now(timezone.utc).timestamp() * 1000)}",
                "author": update_in.note.get("author") or "Operations Lead",
                "role": update_in.note.get("role") or "Support Specialist",
                "text": update_in.note.get("text") or update_in.note.get("content") or "",
                "timestamp": update_in.note.get("timestamp") or now_str
            }
            notes.append(single_note)

        # 5. Full Internal Notes list replacement
        if update_in.internalNotes is not None:
            notes = update_in.internalNotes

        case["internalNotes"] = notes

        # 6. Title and Category
        if update_in.title is not None:
            case["title"] = update_in.title
        if update_in.category is not None:
            case["category"] = update_in.category

        # 7. Resolution update
        if update_in.resolution is not None:
            case["resolution"] = {
                **(case.get("resolution") or {}),
                **update_in.resolution
            }

        # 8. Findings update
        if update_in.findings is not None:
            case["findings"] = {
                **(case.get("findings") or {}),
                **update_in.findings
            }

        # 9. Escalation update
        if update_in.escalation is not None:
            case["escalation"] = {
                **(case.get("escalation") or {}),
                **update_in.escalation
            }
            if update_in.escalation.get("required"):
                case["status"] = "Human Review"

        # 10. Timeline update
        if update_in.timeline is not None:
            case["timeline"] = update_in.timeline

        case["updatedAt"] = now_str

        updated = self.repository.update(case_id, case)
        if not updated:
            raise EntityNotFoundError(f"Case with ID {case_id} not found.", entity_id=case_id)
        return updated
