import sys
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def run_full_suite():
    print("=" * 70)
    print("RUNNING COMPLETE SKILLFORGE AI UNIFIED BACKEND SUITE (NEON DB)")
    print("=" * 70)

    # 1. Health Check
    r = client.get("/")
    assert r.status_code == 200
    print("[PASS] Root Health Check & Neon Postgres connectivity")

    # 2. Login User
    r = client.post("/api/auth/login", json={"email": "alex@skillforge.ai", "password": "password123"})
    assert r.status_code == 200
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("[PASS] Module A: User Login & JWT Token generation")

    # 3. Module B: Resume Extract
    r = client.post("/api/extract", data={"raw_text": "Python FastAPI PostgreSQL Redis Docker Git REST API Kafka"}, headers=headers)
    assert r.status_code == 200
    print("[PASS] Module B: Resume Skill Extraction")

    # 4. Module C: Gap Analysis
    r = client.post("/api/gap-analysis", headers=headers)
    assert r.status_code == 200
    gaps = r.json()
    assert len(gaps) > 0
    print(f"[PASS] Module C: Skill Gap Analysis ({len(gaps)} gap skills evaluated)")

    # 5. Module D: Roadmap Generation
    r = client.post("/api/roadmap/generate", headers=headers)
    assert r.status_code == 200
    roadmap = r.json()
    assert "items" in roadmap and len(roadmap["items"]) > 0
    print(f"[PASS] Module D: AI Multi-Phase Roadmap Generated ({len(roadmap['items'])} items across phases)")

    # 6. Module E: Recommendations Engine
    r = client.get("/api/recommendations", headers=headers)
    assert r.status_code == 200
    recs = r.json()
    assert len(recs) > 0
    print(f"[PASS] Module E: Recommendations Engine ({len(recs)} projects/interview questions/certs)")

    # 7. Module F: Progress Summary & Terrain Cartography State
    r = client.get("/api/progress/summary", headers=headers)
    assert r.status_code == 200
    summary = r.json()
    
    r2 = client.get("/api/progress/terrain-state", headers=headers)
    assert r2.status_code == 200
    terrain = r2.json()
    print(f"[PASS] Module F: Progress Summary & Terrain Map State (Elevation: {terrain['overall_elevation_pct']}%)")

    print("=" * 70)
    print("ALL MODULES (A, B, C, D, E, F) PASSED SUCCESSFULLY ON NEON DB!")
    print("=" * 70)

if __name__ == "__main__":
    try:
        run_full_suite()
    except Exception as e:
        print(f"[FAIL] Full project verification error: {e}")
        sys.exit(1)
