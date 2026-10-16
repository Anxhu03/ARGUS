from typing import Any, List, Optional
from pydantic import BaseModel, Field

class ErrorDetail(BaseModel):
    field: Optional[str] = None
    issue: str

class ErrorContent(BaseModel):
    code: str
    message: str
    trace_id: Optional[str] = None
    details: Optional[List[ErrorDetail]] = None

class ErrorResponse(BaseModel):
    error: ErrorContent
