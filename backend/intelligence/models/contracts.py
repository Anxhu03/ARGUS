"""
Service contracts and interfaces for Backend 1 (AmanSR) integration.

Keeps Backend 2 completely decoupled from database schemas and persistence layers.
"""

from typing import Any, Dict, List, Optional, Protocol
from pydantic import BaseModel, Field


class CustomerContextPayload(BaseModel):
    """
    Customer profile and history contract provided by Backend 1.
    """
    customer_id: str
    account_status: str = "active"
    tier: str = "standard"
    past_ticket_count: int = 0
    recent_transactions: List[Dict[str, Any]] = Field(default_factory=list)
    recent_orders: List[Dict[str, Any]] = Field(default_factory=list)


class CaseDataPayload(BaseModel):
    """
    Full case context payload provided by Backend 1.
    """
    case_id: str
    customer_id: Optional[str] = None
    messages: List[Dict[str, Any]] = Field(default_factory=list)
    system_logs: List[Dict[str, Any]] = Field(default_factory=list)
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Backend1DataProvider(Protocol):
    """
    Protocol defining the contract for data retrieval from Backend 1.
    Backend 2 depends on this interface, never on direct database queries.
    """
    def get_case_data(self, case_id: str) -> Optional[CaseDataPayload]:
        """Fetch complete case data and system logs by case_id."""
        ...

    def get_customer_context(self, customer_id: str) -> Optional[CustomerContextPayload]:
        """Fetch customer profile, transaction history, and recent orders."""
        ...
