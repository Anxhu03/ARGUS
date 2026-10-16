import os
import tempfile
import pytest
from starlette.testclient import TestClient

from backend.app.config import settings
from backend.app.main import create_app
from backend.app.repositories.sqlite_case_repository import SQLiteCaseRepository
from backend.app.routes.cases import get_repository

@pytest.fixture
def temp_db_path():
    temp_dir = tempfile.mkdtemp()
    db_file = os.path.join(temp_dir, "test_argus.db")
    yield db_file
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
        except Exception:
            pass

@pytest.fixture
def client(temp_db_path):
    # Initialize repository with seed data
    test_repo = SQLiteCaseRepository(
        db_path=temp_db_path,
        seed_data_path=settings.SEED_DATA_PATH
    )

    app = create_app()
    app.dependency_overrides[get_repository] = lambda: test_repo

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
