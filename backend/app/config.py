import os
from pathlib import Path
from typing import List
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseModel):
    APP_NAME: str = "ARGUS Investigation & Case Intelligence API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ARGUS_ENV", "development")
    DEBUG: bool = os.getenv("ARGUS_DEBUG", "true").lower() in ("true", "1")
    
    # SQLite Database File Location
    DB_PATH: str = os.getenv("ARGUS_DB_PATH", str(BASE_DIR / "argus.db"))
    SEED_DATA_PATH: str = os.getenv("ARGUS_SEED_PATH", str(BASE_DIR / "seed_data.json"))
    
    # Specific CORS Allowed Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

settings = Settings()
