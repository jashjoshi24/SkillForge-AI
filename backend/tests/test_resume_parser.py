import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.exceptions import ExtractionError, FileValidationError
from app.services import resume_parser
from tests.fixtures import SAMPLE_RESUME_TEXT, make_docx_bytes, make_pdf_bytes


class TestFileValidation(unittest.TestCase):
    def test_valid_pdf_passes(self):
        resume_parser.validate_upload("resume.pdf", "application/pdf", make_pdf_bytes())

    def test_valid_docx_passes(self):
        resume_parser.validate_upload(
            "resume.docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            make_docx_bytes(),
        )

    def test_unsupported_extension_rejected(self):
        with self.assertRaises(FileValidationError):
            resume_parser.validate_upload("resume.txt", "text/plain", b"hello")

    def test_empty_file_rejected(self):
        with self.assertRaises(FileValidationError):
            resume_parser.validate_upload("resume.pdf", "application/pdf", b"")

    def test_no_filename_rejected(self):
        with self.assertRaises(FileValidationError):
            resume_parser.validate_upload(None, "application/pdf", b"data")

    def test_oversized_file_rejected(self):
        big = b"%PDF-1.4" + (b"0" * (9 * 1024 * 1024))
        with self.assertRaises(FileValidationError):
            resume_parser.validate_upload("resume.pdf", "application/pdf", big)

    def test_fake_pdf_content_rejected(self):
        with self.assertRaises(FileValidationError):
            resume_parser.validate_upload("resume.pdf", "text/plain", b"not really a pdf")


class TestTextExtraction(unittest.TestCase):
    def test_extract_pdf_text(self):
        text = resume_parser.extract_text("resume.pdf", make_pdf_bytes())
        self.assertIn("Jordan Rivera", text)
        self.assertIn("FastAPI", text)

    def test_extract_docx_text(self):
        text = resume_parser.extract_text("resume.docx", make_docx_bytes())
        self.assertIn("Jordan Rivera", text)
        self.assertIn("PostgreSQL", text)

    def test_empty_pdf_raises_extraction_error(self):
        # A structurally valid but textless PDF should raise ExtractionError,
        # not silently return blank text.
        from reportlab.pdfgen import canvas
        import io

        buf = io.BytesIO()
        c = canvas.Canvas(buf)
        c.save()
        with self.assertRaises(ExtractionError):
            resume_parser.extract_text("blank.pdf", buf.getvalue())

    def test_corrupted_pdf_raises_extraction_error(self):
        with self.assertRaises(ExtractionError):
            resume_parser.extract_text("resume.pdf", b"%PDF-1.4 not a real pdf structure at all")

    def test_normalize_text_collapses_whitespace(self):
        raw = "Line1\r\n\r\n\r\n\r\nLine2   with   spaces"
        normalized = resume_parser.normalize_text(raw)
        self.assertNotIn("\r", normalized)
        self.assertNotIn("\n\n\n", normalized)


if __name__ == "__main__":
    unittest.main()
