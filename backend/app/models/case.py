from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field

class CustomerModel(BaseModel):
    name: str = "Customer"
    email: str = "customer@enterprise.org"
    avatar: Optional[str] = "CU"
    tier: str = "Standard Tier"
    joinedDate: Optional[str] = "2024"
    reliabilityScore: Optional[float] = 92.0
    reliabilityBand: Optional[str] = "High Reliability"
    totalCases: Optional[int] = 3
    resolvedCases: Optional[int] = 3
    disputedCases: Optional[int] = 0
    isUserSubmitted: Optional[bool] = False

class InternalNoteModel(BaseModel):
    id: Optional[str] = None
    author: str = "Operations Lead"
    role: str = "Specialist"
    text: str
    timestamp: Optional[str] = None

class TimelineStepModel(BaseModel):
    step: int
    title: str
    description: Optional[str] = None
    desc: Optional[str] = None
    time: Optional[str] = None
    status: str = "pending"

class ActiveAgentModel(BaseModel):
    id: str
    name: str
    status: str
    progress: Optional[int] = 100
    role: Optional[str] = None

class EvidenceItemModel(BaseModel):
    id: str
    title: str
    type: str
    source: str
    timestamp: str
    status: str
    description: Optional[str] = None
    sha256: Optional[str] = None
    filePreviewUrl: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None

class CaseCreate(BaseModel):
    title: Optional[str] = None
    complaintText: str = Field(..., min_length=5, description="Verbatim customer statement")
    customerName: Optional[str] = "Customer"
    customerEmail: Optional[str] = "customer@enterprise.org"
    category: Optional[str] = "General Support & Investigation"
    priority: Optional[str] = "High"
    orderId: Optional[str] = "ORD-RECENT-01"
    amount: Optional[str] = "$199.00"
    tier: Optional[str] = "Standard Tier"
    resolutionPreference: Optional[str] = "Full Refund to Original Payment Method"
    attachments: Optional[List[Dict[str, Any]]] = None

class CaseUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assignedTeam: Optional[str] = None
    assignedAgent: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    internalNotes: Optional[List[Dict[str, Any]]] = None
    note: Optional[Dict[str, Any]] = None
    resolution: Optional[Dict[str, Any]] = None
    findings: Optional[Dict[str, Any]] = None
    escalation: Optional[Dict[str, Any]] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    reason: Optional[str] = None

class CaseListResponse(BaseModel):
    total: int
    items: List[Dict[str, Any]]
