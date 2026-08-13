"""
API-level tests for Module B routes. Requires fastapi/sqlalchemy/httpx —
see tests/conftest.py. The LLM provider is monkeypatched so these tests
never make a real network call.
"""
import io

import pytest

fastapi_test = pytest.importorskip("fastapi.testclient")

from tests.fixtures import make_pdf_bytes
from tests.test_extraction_service import VALID_JSON, FakeLLM


@pytest.fixture(autouse=True)
def _mock_llm(monkeypatch):
    import app.routers.resume as resume_router

    monkeypatch.setattr(resume_router, "get_llm_provider", lambda: FakeLLM([VALID_JSON]))


def test_upload_success(client):
    resp = client.post(
        "/extract/upload",
        files={"file": ("resume.pdf", make_pdf_bytes(), "application/pdf")},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["profile"]["skills"][0]["name"] == "Python"


def test_upload_rejects_bad_file_type(client):
    resp = client.post(
        "/extract/upload",
        files={"file": ("resume.exe", b"not a resume", "application/octet-stream")},
    )
    assert resp.status_code == 400
    assert resp.json()["error"]["code"] == "FILE_VALIDATION_ERROR"


def test_upload_rejects_empty_file(client):
    resp = client.post(
        "/extract/upload",
        files={"file": ("resume.pdf", b"", "application/pdf")},
    )
    assert resp.status_code == 400


def test_confirm_then_get_profile_roundtrip(client):
    upload = client.post(
        "/extract/upload", files={"file": ("resume.pdf", make_pdf_bytes(), "application/pdf")}
    ).json()
    confirm = client.post(
        "/extract/confirm",
        json={"profile": upload["profile"], "source_filename": "resume.pdf"},
    )
    assert confirm.status_code == 200

    fetched = client.get("/extract/profile")
    assert fetched.status_code == 200
    assert fetched.json()["skills"][0]["name"] == "Python"


def test_get_profile_404_when_none_saved(client):
    resp = client.get("/extract/profile")
    assert resp.status_code == 404
    assert resp.json()["error"]["code"] == "NOT_FOUND"


def test_user_isolation_between_dev_users(client):
    # user A confirms a profile
    upload = client.post(
        "/extract/upload",
        files={"file": ("resume.pdf", make_pdf_bytes(), "application/pdf")},
        headers={"X-Dev-User-Email": "alice@example.com"},
    ).json()
    client.post(
        "/extract/confirm",
        json={"profile": upload["profile"]},
        headers={"X-Dev-User-Email": "alice@example.com"},
    )

    # user B must not see it
    resp = client.get("/extract/profile", headers={"X-Dev-User-Email": "bob@example.com"})
    assert resp.status_code == 404
