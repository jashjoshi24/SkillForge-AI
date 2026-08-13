import pytest

pytest.importorskip("fastapi.testclient")

from tests.fixtures import make_pdf_bytes
from tests.test_extraction_service import VALID_JSON, FakeLLM
from tests.test_roadmap_service import FULL_VALID_ROADMAP, NOT_JSON_AT_ALL


def _confirm_profile(client, llm_response=VALID_JSON):
    import app.routers.resume as resume_router

    resume_router.get_llm_provider = lambda: FakeLLM([llm_response])
    upload = client.post(
        "/extract/upload", files={"file": ("resume.pdf", make_pdf_bytes(), "application/pdf")}
    ).json()
    client.post("/extract/confirm", json={"profile": upload["profile"]})


def test_generate_roadmap_success(client, monkeypatch):
    _confirm_profile(client)
    import app.routers.roadmap as roadmap_router

    monkeypatch.setattr(roadmap_router, "get_llm_provider", lambda: FakeLLM([FULL_VALID_ROADMAP]))

    resp = client.post("/roadmap/generate", json={"target_role": "backend_developer", "current_level": "beginner"})
    assert resp.status_code == 200
    body = resp.json()
    assert len(body["phases"]) == 4
    assert body["id"] is not None

    fetched = client.get("/roadmap")
    assert fetched.status_code == 200
    assert fetched.json()["id"] == body["id"]


def test_generate_roadmap_without_profile_404s(client, monkeypatch):
    import app.routers.roadmap as roadmap_router

    monkeypatch.setattr(roadmap_router, "get_llm_provider", lambda: FakeLLM([FULL_VALID_ROADMAP]))
    resp = client.post("/roadmap/generate", json={"target_role": "backend_developer", "current_level": "beginner"})
    assert resp.status_code == 404


def test_generate_roadmap_llm_failure_502s(client, monkeypatch):
    _confirm_profile(client)
    import app.routers.roadmap as roadmap_router

    monkeypatch.setattr(roadmap_router, "get_llm_provider", lambda: FakeLLM([NOT_JSON_AT_ALL]))
    resp = client.post("/roadmap/generate", json={"target_role": "backend_developer", "current_level": "beginner"})
    assert resp.status_code == 502
    assert resp.json()["error"]["code"] == "LLM_ERROR"


def test_get_roadmap_before_generation_404s(client):
    resp = client.get("/roadmap")
    assert resp.status_code == 404


def test_regenerating_archives_previous_roadmap(client, monkeypatch):
    _confirm_profile(client)
    import app.routers.roadmap as roadmap_router

    monkeypatch.setattr(roadmap_router, "get_llm_provider", lambda: FakeLLM([FULL_VALID_ROADMAP]))
    first = client.post(
        "/roadmap/generate", json={"target_role": "backend_developer", "current_level": "beginner"}
    ).json()

    monkeypatch.setattr(roadmap_router, "get_llm_provider", lambda: FakeLLM([FULL_VALID_ROADMAP]))
    second = client.post(
        "/roadmap/generate", json={"target_role": "backend_developer", "current_level": "intermediate"}
    ).json()

    assert first["id"] != second["id"]
    active = client.get("/roadmap").json()
    assert active["id"] == second["id"]
