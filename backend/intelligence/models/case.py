"""
Data models for customer cases and inbound requests.
"""

from datetime import datetime, timezone
from typing import Any, Dict, Optional
import uuid
from pydantic import BaseModel, Field


class CaseRequest(BaseModel):
    """
    Inbound case or query payload submitted to the ARGUS Intelligence Layer.
    """
    case_id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        description="Unique identifier for the case. Generated if not supplied."
    )
    customer_id: Optional[str] = Field(
        default=None,
        description="Optional identifier of the customer submitting the inquiry."
    )
    message: str = Field(
        ...,
        description="The customer inquiry or problem description."
    )
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Additional context such as channel, device, or session data."
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp when the case request was created."
    )
