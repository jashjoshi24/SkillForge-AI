import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.exceptions import ExtractionError
from app.services.extraction_service import parse_and_extract
from app.services.llm_client import LLMProvider
from tests.fixtures import make_pdf_bytes

VALID_JSON = """{
  "skills": [{"name": "Python", "category": "language", "proficiency": "intermediate", "evidence": "listed under SKILLS"}],
  "projects": [{"name": "Task Tracker API", "description": "A REST API", "technologies": ["FastAPI"], "role": null, "url": null}],
  "experience": [{"title": "Software Engineer Intern", "company": "Acme Corp", "duration": "Jun 2024 - Aug 2024", "description": null, "technologies": ["FastAPI", "Docker"]}],
  "education": [{"degree": "B.Tech in Computer Science", "institution": "State University", "field": null, "duration": "2021 - 2025"}],
  "extraction_notes": []
}"""

MALFORMED_ONCE_JSON = "```json\n" + VALID_JSON + "\n```"  # wrapped in markdown fence — handled without repair call

TRULY_BROKEN_JSON = "{skills: [Python missing quotes,,,"

MISSING_FIELDS_JSON = '{"skills": [{"name": "Python"}]}'  # projects/experience/education missing entirely


class FakeLLM(LLMProvider):
    """Scripted LLM stand-in: returns queued responses in order."""

    def __init__(self, responses: list[str]):
        self.responses = list(responses)
        self.calls = 0

    def generate_json(self, system_prompt: str, user_prompt: str, max_tokens: int = 4096) -> str:
        self.calls += 1
        if not self.responses:
            raise AssertionError("FakeLLM ran out of scripted responses")
        return self.responses.pop(0)


class TestExtractionService(unittest.TestCase):
    def test_valid_llm_response_produces_valid_profile(self):
        llm = FakeLLM([VALID_JSON])
        profile, warnings = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(len(profile.skills), 1)
        self.assertEqual(profile.skills[0].name, "Python")
        self.assertEqual(profile.projects[0].name, "Task Tracker API")
        self.assertEqual(profile.education[0].institution, "State University")
        self.assertEqual(warnings, [])

    def test_markdown_fenced_json_is_handled_without_repair_call(self):
        llm = FakeLLM([MALFORMED_ONCE_JSON])
        profile, _ = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(len(profile.skills), 1)
        self.assertEqual(llm.calls, 1)  # no repair call needed

    def test_truly_broken_json_triggers_repair_then_succeeds(self):
        llm = FakeLLM([TRULY_BROKEN_JSON, VALID_JSON])  # first call broken, repair call returns valid JSON
        profile, _ = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(len(profile.skills), 1)
        self.assertEqual(llm.calls, 2)

    def test_json_broken_even_after_repair_raises_extraction_error(self):
        llm = FakeLLM([TRULY_BROKEN_JSON, TRULY_BROKEN_JSON])
        with self.assertRaises(ExtractionError):
            parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)

    def test_missing_fields_default_to_empty(self):
        # projects/experience/education keys are entirely absent from the LLM's JSON.
        llm = FakeLLM([MISSING_FIELDS_JSON])
        profile, warnings = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(len(profile.skills), 1)
        self.assertEqual(profile.projects, [])
        self.assertEqual(profile.experience, [])
        self.assertEqual(profile.education, [])

    def test_wrong_type_field_defaults_with_warning(self):
        # "projects" present but not a list at all -> defaulted with an explicit warning,
        # distinguishing "LLM sent garbage" from "LLM legitimately found nothing".
        payload = '{"skills": [], "projects": "not-a-list", "experience": [], "education": [], "extraction_notes": []}'
        llm = FakeLLM([payload])
        profile, warnings = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(profile.projects, [])
        self.assertTrue(any("projects" in w for w in warnings))

    def test_empty_skills_array_is_valid(self):
        llm = FakeLLM(['{"skills": [], "projects": [], "experience": [], "education": [], "extraction_notes": ["Resume had no explicit skills section."]}'])
        profile, _ = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(profile.skills, [])
        self.assertEqual(len(profile.extraction_notes), 1)

    def test_malformed_skill_item_is_dropped_not_fatal(self):
        # 'name' missing on the second skill -> should be dropped, first kept.
        payload = (
            '{"skills": [{"name": "Python"}, {"category": "no-name-here"}], '
            '"projects": [], "experience": [], "education": [], "extraction_notes": []}'
        )
        llm = FakeLLM([payload])
        profile, warnings = parse_and_extract("resume.pdf", "application/pdf", make_pdf_bytes(), llm)
        self.assertEqual(len(profile.skills), 1)
        self.assertTrue(any("skills" in w for w in warnings))

    def test_invalid_file_type_never_calls_llm(self):
        llm = FakeLLM([])
        from app.core.exceptions import FileValidationError

        with self.assertRaises(FileValidationError):
            parse_and_extract("resume.txt", "text/plain", b"hello", llm)
        self.assertEqual(llm.calls, 0)


if __name__ == "__main__":
    unittest.main()
