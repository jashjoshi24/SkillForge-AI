"""
Pytest fixtures for the API-level test suite (tests/test_api_*.py).

These tests require `fastapi`, `sqlalchemy`, and `httpx` to be installed
(`pip install -r requirements.txt`) and a reachable PostgreSQL instance —
by default a local one for CI/dev, never the Neon `main` branch. Set
TEST_DATABASE_URL to override (e.g. to your own Neon dev branch).

The pure-logic suite (test_resume_parser.py, test_extraction_service.py,
test_gap_analysis_service.py, test_roadmap_service.py, test_schemas.py)
has no such dependency and runs anywhere with just the packages already
used by those modules.
"""
import os
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL",
    "postgresql+psycopg2://skillforge:skillforge_dev@localhost:5432/skillforge_dev",
)
os.environ.setdefault("DATABASE_URL", TEST_DATABASE_URL)
os.environ.setdefault("AI_API_KEY", "test-key-not-used-because-llm-is-mocked")
os.environ.setdefault("AUTH_DEV_MODE", "true")


@pytest.fixture(scope="session")
def engine():
    from sqlalchemy import create_engine

    return create_engine(TEST_DATABASE_URL)


@pytest.fixture()
def db_session(engine):
    from app.database import Base

    Base.metadata.create_all(engine)
    connection = engine.connect()
    transaction = connection.begin()
    from sqlalchemy.orm import sessionmaker

    SessionLocal = sessionmaker(bind=connection)
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session, monkeypatch):
    from fastapi.testclient import TestClient

    from app.database import get_db
    from app.main import app

    def _get_test_db():
        yield db_session

    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
