import sys
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def run_tests():
    print("=" * 60)
    print("RUNNING MEMBER 2 END-TO-END BACKEND API VERIFICATION SUITE")
    print("=" * 60)

    # 1. Root Check
    r = client.get("/")
    assert r.status_code == 200, f"Root check failed: {r.text}"
    print("[PASS] Root API health check")

    # 2. Login with Seeded User
    login_payload = {
        "email": "alex@skillforge.ai",
        "password": "password123"
    }
    r = client.post("/api/auth/login", json=login_payload)
    assert r.status_code == 200, f"Login failed: {r.text}"
    token_data = r.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] Module A: User Login & JWT Token generation")

    # 3. Get Me
    r = client.get("/api/auth/me", headers=headers)
    assert r.status_code == 200, f"Get me failed: {r.text}"
    user_info = r.json()
    assert user_info["email"] == "alex@skillforge.ai"
    print(f"[PASS] Module A: Profile retrieval for user '{user_info['name']}' ({user_info['target_role']})")

    # 4. Update Profile
    update_payload = {
        "target_role": "Backend Architect",
        "goals": ["Master High Scalability & System Architecture"]
    }
    r = client.put("/api/auth/profile", json=update_payload, headers=headers)
    assert r.status_code == 200, f"Profile update failed: {r.text}"
    assert r.json()["target_role"] == "Backend Architect"
    print("[PASS] Module A: User Profile update")

    # 5. Recommendations List
    r = client.get("/api/recommendations", headers=headers)
    assert r.status_code == 200, f"List recommendations failed: {r.text}"
    recs = r.json()
    assert len(recs) > 0, "No recommendations returned"
    rec_id = recs[0]["id"]
    print(f"[PASS] Module E: Listed {len(recs)} personalized recommendations (projects, interview questions, certs)")

    # 6. Recommendation Status Update
    r = client.put(f"/api/recommendations/{rec_id}/status", json={"status": "in_progress"}, headers=headers)
    assert r.status_code == 200, f"Recommendation status update failed: {r.text}"
    assert r.json()["status"] == "in_progress"
    print(f"[PASS] Module E: Updated recommendation #{rec_id} status to 'in_progress'")

    # 7. Domain Certifications
    r = client.get("/api/recommendations/certifications?domain=Backend", headers=headers)
    assert r.status_code == 200, f"Certifications list failed: {r.text}"
    certs = r.json()
    assert len(certs) > 0
    print(f"[PASS] Module E: Retrieved {len(certs)} domain certifications")

    # 8. Progress Summary
    r = client.get("/api/progress/summary", headers=headers)
    assert r.status_code == 200, f"Progress summary failed: {r.text}"
    summary = r.json()
    print(f"[PASS] Module F: Progress Summary retrieved (Overall: {summary['overall_completion_pct']}%, Gap Closure: {summary['gap_closure_pct']}%)")

    # 9. Update Roadmap Item Status
    r = client.put("/api/progress/roadmap-items/1/status", json={"status": "completed"}, headers=headers)
    assert r.status_code in (200, 404)
    print("[PASS] Module F: Roadmap item status update")

    # 10. Skills Timeline for Chart.js
    r = client.get("/api/progress/skills-timeline", headers=headers)
    assert r.status_code == 200, f"Skills timeline failed: {r.text}"
    timeline = r.json()
    assert "labels" in timeline and "datasets" in timeline
    print("[PASS] Module F: Skills timeline data formatted for Chart.js")

    # 11. Skill Terrain Map State
    r = client.get("/api/progress/terrain-state", headers=headers)
    assert r.status_code == 200, f"Terrain state failed: {r.text}"
    terrain = r.json()
    assert "overall_elevation_pct" in terrain and "peaks" in terrain and "gaps" in terrain
    print(f"[PASS] Module F: Skill Terrain Map Cartography State generated (Elevation: {terrain['overall_elevation_pct']}%, Peaks: {len(terrain['peaks'])}, Gaps: {len(terrain['gaps'])})")

    print("=" * 60)
    print("ALL MEMBER 2 VERIFICATION TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"[FAIL] Verification error: {e}")
        sys.exit(1)
