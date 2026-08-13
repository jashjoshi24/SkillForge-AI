"""
Synthetic resume fixtures generated on the fly with reportlab (PDF) and
python-docx (DOCX) so tests don't depend on committing binary sample files.
"""
import io

SAMPLE_RESUME_TEXT = """Jordan Rivera
Backend Developer

SKILLS
Python, FastAPI, PostgreSQL, Docker, Git, REST API design, Unit Testing

EXPERIENCE
Software Engineer Intern, Acme Corp (Jun 2024 - Aug 2024)
Built and deployed a FastAPI microservice handling 10k requests/day using PostgreSQL and Docker.

PROJECTS
Task Tracker API
A REST API for tracking personal tasks, built with FastAPI and PostgreSQL, containerized with Docker.

EDUCATION
B.Tech in Computer Science, State University (2021 - 2025)
"""


def make_pdf_bytes(text: str = SAMPLE_RESUME_TEXT) -> bytes:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    y = 750
    for line in text.splitlines():
        c.drawString(50, y, line)
        y -= 15
        if y < 50:
            c.showPage()
            y = 750
    c.save()
    return buf.getvalue()


def make_docx_bytes(text: str = SAMPLE_RESUME_TEXT) -> bytes:
    from docx import Document

    doc = Document()
    for line in text.splitlines():
        doc.add_paragraph(line)
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()
