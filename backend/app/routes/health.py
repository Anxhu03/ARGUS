from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from backend.app.config import settings
from backend.app.repositories.sqlite_case_repository import SQLiteCaseRepository

router = APIRouter(tags=["Health"])

def get_repository() -> SQLiteCaseRepository:
    return SQLiteCaseRepository(db_path=settings.DB_PATH, seed_data_path=settings.SEED_DATA_PATH)

@router.get("/health")
def health_check(repo: SQLiteCaseRepository = Depends(get_repository)):
    total_cases = repo.count()
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "database": {
            "status": "connected",
            "driver": "sqlite3",
            "cases_count": total_cases
        },
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
