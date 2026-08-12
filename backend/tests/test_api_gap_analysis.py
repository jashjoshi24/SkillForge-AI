import pytest

pytest.importorskip("fastapi.testclient")

from tests.fixtures import make_pdf_bytes
from tests.test_extraction_service import VALID_JSON, FakeLLM


@pytest.fixture(autouse=True)
def _mock_llm(monkeypatch):
    import app.routers.resume as resume_router

    monkeypatch.setattr(resume_router, "get_llm_provider", lambda: FakeLLM([VALID_JSON]))


def _confirm_profile(client):
    upload = client.post(
        "/extract/upload", files={"file": ("resume.pdf", make_pdf_bytes(), "application/pdf")}
    ).json()
    client.post("/extract/confirm", json={"profile": upload["profile"]})


def test_gap_analysis_success(client):
    _confirm_profile(client)
    resp = client.get("/gap-analysis", params={"target_role": "backend_developer"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["target_role"] == "backend_developer"
    assert "python" in {m["skill"] for m in body["matched_skills"]}


def test_gap_analysis_without_profile_404s(client):
    resp = client.get("/gap-analysis", params={"target_role": "backend_developer"})
    assert resp.status_code == 404


def test_gap_analysis_invalid_role_422s(client):
    _confirm_profile(client)
    resp = client.get("/gap-analysis", params={"target_role": "astronaut"})
    assert resp.status_code == 422  # FastAPI enum validation on the query param
