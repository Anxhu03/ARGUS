from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status

from backend.app.config import settings
from backend.app.models.case import CaseCreate, CaseUpdate
from backend.app.repositories.base import CaseRepository
from backend.app.repositories.sqlite_case_repository import SQLiteCaseRepository
from backend.app.services.case_service import CaseService, EntityNotFoundError

router = APIRouter(prefix="/api/cases", tags=["Cases"])

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
