from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.config import settings
from backend.app.models.case import CaseCreate, CaseUpdate
from backend.app.models.evidence import EvidenceCreate
from backend.app.repositories.base import CaseRepository
from backend.app.repositories.sqlite_case_repository import SQLiteCaseRepository
from backend.app.services.case_service import (
    CaseService,
    DuplicateEvidenceError,
    EntityNotFoundError,
)

router = APIRouter(prefix="/cases", tags=["Cases & Evidence Intelligence"])

# Dependency Injection for repository and service
_shared_repo: Optional[CaseRepository] = None

def get_repository() -> CaseRepository:
    global _shared_repo
    if _shared_repo is None:
        _shared_repo = SQLiteCaseRepository(
            db_path=settings.DB_PATH,
            seed_data_path=settings.SEED_DATA_PATH
        )
    return _shared_repo

def get_case_service(repo: CaseRepository = Depends(get_repository)) -> CaseService:
    return CaseService(repository=repo)

@router.get("", response_model=List[Dict[str, Any]])
def list_cases(
    status: Optional[str] = Query(None, description="Status filter"),
    category: Optional[str] = Query(None, description="Category filter"),
    priority: Optional[str] = Query(None, description="Priority filter"),
    date_range: Optional[str] = Query(None, alias="dateRange", description="Date range filter: today, 7d, 30d"),
    query: Optional[str] = Query(None, alias="q", description="Search query string"),
    sort_by: Optional[str] = Query("date_desc", alias="sortBy", description="Sorting criteria"),
    service: CaseService = Depends(get_case_service),
):
    """
    List dispute cases with multi-factor search and filtering support.
    """
    return service.list_cases(
        status=status,
        category=category,
        priority=priority,
        date_range=date_range,
        query=query,
        sort_by=sort_by,
    )

@router.get("/{case_id}", response_model=Dict[str, Any])
def get_case(
    case_id: str,
    service: CaseService = Depends(get_case_service),
):
    """
    Retrieve one specific investigation case by its Case ID.
    """
    try:
        return service.get_case(case_id)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )

@router.post("", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
def create_case(
    payload: CaseCreate,
    service: CaseService = Depends(get_case_service),
):
    """
    Create a new investigation case from customer complaint intake.
    """
    return service.create_case(payload)

@router.patch("/{case_id}", response_model=Dict[str, Any])
def update_case(
    case_id: str,
    update_in: CaseUpdate,
    service: CaseService = Depends(get_case_service),
):
    """
    Partially update supported investigation case fields (status, priority, team, notes, resolution).
    """
    try:
        return service.update_case(case_id, update_in)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )

# =========================================================================
# PHASE 8: Evidence Intelligence & Root-Cause Analysis Endpoints
# =========================================================================

@router.get("/{case_id}/evidence", response_model=List[Dict[str, Any]])
def get_case_evidence(
    case_id: str,
    verification_status: Optional[str] = Query(None, alias="status", description="Filter by verification status (Verified, Pending, Conflicting, etc.)"),
    type_: Optional[str] = Query(None, alias="category", description="Filter by evidence type/category"),
    source_label: Optional[str] = Query(None, alias="sourceLabel", description="Filter by source label (verified, simulated, mock)"),
    service: CaseService = Depends(get_case_service),
):
    """
    Retrieve all evidence artifacts ingested for an investigation case,
    including deterministic verification audits and confidence scores.
    """
    try:
        return service.get_case_evidence(
            case_id=case_id,
            status=verification_status,
            type_=type_,
            source_label=source_label,
        )
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )

@router.post("/{case_id}/evidence", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
def add_case_evidence(
    case_id: str,
    payload: EvidenceCreate,
    service: CaseService = Depends(get_case_service),
):
    """
    Ingest a new evidence artifact for an investigation case.
    Performs duplicate detection, runs deterministic verification,
    and automatically re-evaluates contradictions and root cause.
    """
    try:
        return service.add_case_evidence(case_id, payload)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )
    except DuplicateEvidenceError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "DUPLICATE_EVIDENCE",
                "message": str(e),
                "case_id": case_id
            }
        )

@router.get("/{case_id}/verification", response_model=Dict[str, Any])
def get_case_verification(
    case_id: str,
    service: CaseService = Depends(get_case_service),
):
    """
    Retrieve comprehensive verification outcomes, cross-source audits,
    and missing-information checklists for an investigation case.
    """
    try:
        return service.get_case_verification(case_id)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )

@router.get("/{case_id}/contradictions", response_model=Optional[Dict[str, Any]])
def get_case_contradictions(
    case_id: str,
    service: CaseService = Depends(get_case_service),
):
    """
    Retrieve detected empirical contradictions between evidence artifacts,
    customer statements, and system telemetry for an investigation case.
    """
    try:
        return service.get_case_contradictions(case_id)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )

@router.get("/{case_id}/root-cause", response_model=Dict[str, Any])
def get_case_root_cause(
    case_id: str,
    service: CaseService = Depends(get_case_service),
):
    """
    Retrieve synthesized root-cause diagnosis, deterministic 3-step chain,
    verified facts, suspected causes, and uncertainty indicators.
    """
    try:
        return service.get_case_root_cause(case_id)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )

@router.post("/{case_id}/analyze", response_model=Dict[str, Any])
def analyze_case(
    case_id: str,
    service: CaseService = Depends(get_case_service),
):
    """
    Trigger live re-verification, contradiction detection, and root-cause synthesis,
    updating the case findings and persisting results in the database.
    """
    try:
        return service.analyze_case(case_id)
    except EntityNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "code": "ENTITY_NOT_FOUND",
                "message": str(e),
                "entity_id": case_id
            }
        )
