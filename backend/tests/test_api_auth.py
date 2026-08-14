"""
API-level tests for Module A (real auth) routes: /auth/signup, /auth/login,
/auth/me. Requires fastapi/sqlalchemy/httpx — see tests/conftest.py.
"""
import pytest

fastapi_test = pytest.importorskip("fastapi.testclient")


def test_signup_creates_user_and_returns_token(client):
    resp = client.post(
        "/auth/signup",
        json={"email": "new.user@example.com", "password": "correct-horse", "name": "New User"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert body["access_token"]
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "new.user@example.com"
    assert body["user"]["name"] == "New User"


def test_signup_rejects_duplicate_email(client):
    payload = {"email": "dupe@example.com", "password": "correct-horse"}
    first = client.post("/auth/signup", json=payload)
    assert first.status_code == 200

    second = client.post("/auth/signup", json=payload)
    assert second.status_code == 409
    assert second.json()["error"]["code"] == "CONFLICT"


def test_login_with_correct_credentials(client):
    client.post("/auth/signup", json={"email": "login@example.com", "password": "correct-horse"})

    resp = client.post("/auth/login", json={"email": "login@example.com", "password": "correct-horse"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["access_token"]
    assert body["user"]["email"] == "login@example.com"


def test_login_with_wrong_password_is_rejected(client):
    client.post("/auth/signup", json={"email": "wrongpw@example.com", "password": "correct-horse"})

    resp = client.post("/auth/login", json={"email": "wrongpw@example.com", "password": "not-it"})
    assert resp.status_code == 401
    assert resp.json()["error"]["code"] == "AUTH_ERROR"


def test_login_with_unknown_email_is_rejected(client):
    resp = client.post("/auth/login", json={"email": "nobody@example.com", "password": "whatever"})
    assert resp.status_code == 401


def test_me_with_valid_bearer_token(client):
    signup = client.post(
        "/auth/signup", json={"email": "me@example.com", "password": "correct-horse", "name": "Me"}
    ).json()
    token = signup["access_token"]

    resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["email"] == "me@example.com"


def test_me_with_invalid_bearer_token_is_rejected(client):
    resp = client.get("/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert resp.status_code == 401
    assert resp.json()["error"]["code"] == "AUTH_ERROR"


def test_me_falls_back_to_dev_mode_without_a_token(client):
    # No Authorization header -> AUTH_DEV_MODE stub resolves/creates
    # settings.DEV_USER_EMAIL, same as every other route's existing tests.
    resp = client.get("/auth/me")
    assert resp.status_code == 200
    assert resp.json()["email"] == "dev@skillforge.local"


def test_bearer_token_takes_priority_over_dev_header(client):
    signup = client.post(
        "/auth/signup", json={"email": "priority@example.com", "password": "correct-horse"}
    ).json()
    token = signup["access_token"]

    resp = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}", "X-Dev-User-Email": "someone-else@example.com"},
    )
    assert resp.status_code == 200
    assert resp.json()["email"] == "priority@example.com"
