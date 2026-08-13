import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.exceptions import LLMError
from app.schemas.common import TargetRole
from app.schemas.resume import ExtractedProfile, SkillItem
from app.schemas.roadmap import RoadmapPhaseName
from app.services.gap_analysis_service import analyze_gap
from app.services.llm_client import LLMProvider
from app.services.roadmap_service import generate_roadmap

FULL_VALID_ROADMAP = """{
  "phases": [
    {"phase": "Foundations", "items": [{"title": "REST fundamentals", "description": "Understand HTTP verbs and status codes.", "skills": ["rest api design"], "resources": [{"title": "MDN HTTP overview", "url": null, "type": "docs"}], "estimated_time": "3 days"}]},
    {"phase": "Core Skills", "items": [{"title": "Build APIs with FastAPI", "description": "Learn routing, dependency injection, and validation.", "skills": ["python"], "resources": [], "estimated_time": "1 week"}]},
    {"phase": "Projects", "items": [{"title": "Build a task-tracker API", "description": "A CRUD API with auth and Postgres.", "skills": ["postgresql"], "resources": [], "estimated_time": "2 weeks"}]},
    {"phase": "Interview Preparation", "items": [{"title": "System design basics for backend roles", "description": "Practice explaining API design tradeoffs.", "skills": ["system design"], "resources": [], "estimated_time": "1 week"}]}
  ]
}"""

MISSING_PHASE_ROADMAP = """{
  "phases": [
    {"phase": "Core Skills", "items": [{"title": "Build APIs with FastAPI", "description": "Learn routing.", "skills": ["python"], "resources": [], "estimated_time": "1 week"}]}
  ]
}"""

NOT_JSON_AT_ALL = "Sorry, I can't help with that."


class FakeLLM(LLMProvider):
    def __init__(self, response: str):
        self.response = response
        self.calls = 0

    def generate_json(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        self.calls += 1
        return self.response


def sample_profile():
    return ExtractedProfile(skills=[SkillItem(name="Python"), SkillItem(name="Git")])


class TestRoadmapService(unittest.TestCase):
    def test_valid_gaps_produce_full_four_phase_roadmap(self):
        profile = sample_profile()
        gap_result = analyze_gap(profile.skills, TargetRole.BACKEND_DEVELOPER)
        llm = FakeLLM(FULL_VALID_ROADMAP)
        roadmap = generate_roadmap(profile, gap_result, TargetRole.BACKEND_DEVELOPER, "beginner", llm)
        phases = {p.phase for p in roadmap.phases}
        self.assertEqual(
            phases,
            {
                RoadmapPhaseName.FOUNDATIONS,
                RoadmapPhaseName.CORE_SKILLS,
                RoadmapPhaseName.PROJECTS,
                RoadmapPhaseName.INTERVIEW_PREP,
            },
        )
        for phase in roadmap.phases:
            self.assertGreater(len(phase.items), 0)

    def test_empty_gap_skills_still_generates_roadmap(self):
        # A user who already matches every skill for the role.
        from app.data import skill_maps

        role_skills = list(skill_maps.SKILL_MAPS[TargetRole.DATA_ANALYST.value].keys())
        profile = ExtractedProfile(skills=[SkillItem(name=s) for s in role_skills])
        gap_result = analyze_gap(profile.skills, TargetRole.DATA_ANALYST)
        self.assertEqual(gap_result.gap_skills, [])
        llm = FakeLLM(FULL_VALID_ROADMAP)
        roadmap = generate_roadmap(profile, gap_result, TargetRole.DATA_ANALYST, "advanced", llm)
        self.assertEqual(len(roadmap.phases), 4)

    def test_llm_failure_raises_llm_error(self):
        profile = sample_profile()
        gap_result = analyze_gap(profile.skills, TargetRole.BACKEND_DEVELOPER)
        llm = FakeLLM(NOT_JSON_AT_ALL)
        with self.assertRaises(LLMError):
            generate_roadmap(profile, gap_result, TargetRole.BACKEND_DEVELOPER, "beginner", llm)

    def test_missing_phases_get_grounded_fallback_items(self):
        profile = sample_profile()
        gap_result = analyze_gap(profile.skills, TargetRole.BACKEND_DEVELOPER)
        llm = FakeLLM(MISSING_PHASE_ROADMAP)
        roadmap = generate_roadmap(profile, gap_result, TargetRole.BACKEND_DEVELOPER, "beginner", llm)
        phases = {p.phase for p in roadmap.phases}
        self.assertEqual(len(phases), 4)
        foundations = next(p for p in roadmap.phases if p.phase == RoadmapPhaseName.FOUNDATIONS)
        # Fallback item must be grounded in the user's actual top gap skills, not a vague placeholder.
        self.assertTrue(any(g.skill in foundations.items[0].title.lower() for g in gap_result.prioritized_gaps[:3]))

    def test_phases_are_returned_in_canonical_order(self):
        profile = sample_profile()
        gap_result = analyze_gap(profile.skills, TargetRole.BACKEND_DEVELOPER)
        llm = FakeLLM(FULL_VALID_ROADMAP)
        roadmap = generate_roadmap(profile, gap_result, TargetRole.BACKEND_DEVELOPER, "beginner", llm)
        expected_order = [
            RoadmapPhaseName.FOUNDATIONS,
            RoadmapPhaseName.CORE_SKILLS,
            RoadmapPhaseName.PROJECTS,
            RoadmapPhaseName.INTERVIEW_PREP,
        ]
        self.assertEqual([p.phase for p in roadmap.phases], expected_order)


if __name__ == "__main__":
    unittest.main()
