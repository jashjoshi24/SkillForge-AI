import sys
import unittest
from pathlib import Path

import pydantic

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.schemas.resume import ExtractedProfile, SkillItem
from app.schemas.roadmap import RoadmapItemSchema


class TestSchemas(unittest.TestCase):
    def test_blank_skill_name_rejected(self):
        with self.assertRaises(pydantic.ValidationError):
            SkillItem(name="   ")

    def test_extracted_profile_defaults_are_empty(self):
        profile = ExtractedProfile()
        self.assertEqual(profile.skills, [])
        self.assertEqual(profile.projects, [])
        self.assertEqual(profile.experience, [])
        self.assertEqual(profile.education, [])

    def test_invalid_proficiency_rejected(self):
        with self.assertRaises(pydantic.ValidationError):
            SkillItem(name="Python", proficiency="wizard")

    def test_roadmap_item_default_status_not_started(self):
        item = RoadmapItemSchema(title="X", description="Y")
        self.assertEqual(item.status.value, "not_started")


if __name__ == "__main__":
    unittest.main()
