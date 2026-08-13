import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.exceptions import InvalidTargetRoleError
from app.data import skill_maps
from app.schemas.common import ImportanceLevel, ProficiencyLevel, TargetRole
from app.schemas.resume import SkillItem
from app.services.gap_analysis_service import analyze_gap


def skill(name, proficiency=None):
    return SkillItem(name=name, proficiency=proficiency)


class TestGapAnalysis(unittest.TestCase):
    def test_known_role_partial_match(self):
        user_skills = [skill("Python"), skill("SQL"), skill("Git")]
        result = analyze_gap(user_skills, TargetRole.BACKEND_DEVELOPER)
        matched_names = {m.skill for m in result.matched_skills}
        self.assertIn("python", matched_names)
        self.assertIn("sql", matched_names)
        self.assertIn("git", matched_names)
        self.assertGreater(len(result.gap_skills), 0)
        self.assertLess(result.match_percentage, 100)

    def test_alias_normalization_matches(self):
        # "JS" and "Postgres" should resolve via the alias table.
        user_skills = [skill("JS"), skill("Postgres")]
        result = analyze_gap(user_skills, TargetRole.BACKEND_DEVELOPER)
        matched_names = {m.skill for m in result.matched_skills}
        self.assertIn("postgresql", matched_names)

    def test_no_skills_all_gaps(self):
        result = analyze_gap([], TargetRole.FRONTEND_DEVELOPER)
        self.assertEqual(len(result.matched_skills), 0)
        self.assertEqual(result.match_percentage, 0.0)
        total_role_skills = len(skill_maps.SKILL_MAPS[TargetRole.FRONTEND_DEVELOPER.value])
        self.assertEqual(len(result.gap_skills), total_role_skills)

    def test_complete_skill_profile_full_match(self):
        role_skills = list(skill_maps.SKILL_MAPS[TargetRole.DATA_ANALYST.value].keys())
        user_skills = [skill(name) for name in role_skills]
        result = analyze_gap(user_skills, TargetRole.DATA_ANALYST)
        self.assertEqual(result.match_percentage, 100.0)
        self.assertEqual(len(result.gap_skills), 0)

    def test_prioritized_gaps_sorted_descending(self):
        result = analyze_gap([], TargetRole.DEVOPS)
        scores = [g.priority_score for g in result.prioritized_gaps]
        self.assertEqual(scores, sorted(scores, reverse=True))
        # Critical-importance gaps must outrank nice-to-have ones.
        critical = [g for g in result.prioritized_gaps if g.importance == ImportanceLevel.CRITICAL]
        nice = [g for g in result.prioritized_gaps if g.importance == ImportanceLevel.NICE_TO_HAVE]
        if critical and nice:
            self.assertGreater(critical[0].priority_score, nice[0].priority_score)

    def test_unmapped_user_skill_is_reported_not_dropped_silently(self):
        result = analyze_gap([skill("underwater basket weaving")], TargetRole.ML_ENGINEER)
        self.assertIn("underwater basket weaving", result.unmapped_user_skills)

    def test_invalid_target_role_raises(self):
        # Simulate a role that slipped past the enum but isn't in the map.
        original = dict(skill_maps.SKILL_MAPS)
        try:
            del skill_maps.SKILL_MAPS[TargetRole.CYBERSECURITY.value]
            with self.assertRaises(InvalidTargetRoleError):
                skill_maps.get_skill_map(TargetRole.CYBERSECURITY)
        finally:
            skill_maps.SKILL_MAPS.clear()
            skill_maps.SKILL_MAPS.update(original)

    def test_all_six_documented_roles_are_supported(self):
        expected = {"backend_developer", "frontend_developer", "data_analyst", "ml_engineer", "devops", "cybersecurity"}
        self.assertEqual(set(skill_maps.SKILL_MAPS.keys()), expected)


if __name__ == "__main__":
    unittest.main()
