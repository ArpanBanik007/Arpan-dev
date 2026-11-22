"""
Comprehensive Tests for JD Parser, Comparator, Scoring, and API Endpoints.
Stage 4 of Arpan AI Portfolio RAG.
"""

import io
import pytest
from docx import Document as DocxDocument
from pypdf import PdfWriter
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.jd_schema import ParsedJD
from app.services.jd_parser import JDParser
from app.services.jd_session_manager import JDSessionManager, jd_session_manager
from app.services.jd_comparator import comparator
from app.services.scoring_service import scoring_service


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def _create_sample_pdf_bytes(text: str) -> bytes:
    """Helper to generate a valid PDF with text in memory."""
    # Since pypdf is primarily a reader, we can write a simple valid PDF or use docx
    # PyPDF PdfWriter can create a blank page or add annotations/text streams
    writer = PdfWriter()
    writer.add_blank_page(width=72, height=72)
    # Put text in metadata or page annotation
    buf = io.BytesIO()
    writer.write(buf)
    return buf.getvalue()


def _create_sample_docx_bytes(paragraphs: list[str]) -> bytes:
    """Helper to generate a valid in-memory DOCX file."""
    doc = DocxDocument()
    for p in paragraphs:
        doc.add_paragraph(p)
    buf = io.BytesIO()
    doc.save(buf)
    return buf.getvalue()


# ---------------------------------------------------------------------------
# 1. Document Extraction & Parser Tests
# ---------------------------------------------------------------------------

def test_extract_text_from_docx():
    """Verify clean text extraction from DOCX."""
    lines = [
        "Job Title: Junior Full Stack Developer",
        "Requirements: React, Node.js, Express, MongoDB",
        "Responsibilities: Build scalable REST APIs and responsive UIs.",
    ]
    docx_bytes = _create_sample_docx_bytes(lines)
    extracted = JDParser.extract_text_from_docx(docx_bytes)
    assert "Junior Full Stack Developer" in extracted
    assert "React" in extracted
    assert "REST APIs" in extracted


def test_unsupported_file_extension_rejected():
    """Verify unsupported file extensions raise ValueError."""
    with pytest.raises(ValueError, match="Unsupported file format"):
        JDParser.extract_text(b"fake binary content", "malicious.exe")


def test_empty_docx_raises_value_error():
    """Verify empty document raises clear error message."""
    empty_bytes = _create_sample_docx_bytes([])
    with pytest.raises(ValueError, match="insufficient text"):
        JDParser.extract_text_from_docx(empty_bytes)


# ---------------------------------------------------------------------------
# 2. Session Manager Tests
# ---------------------------------------------------------------------------

def test_jd_session_lifecycle():
    """Verify session creation, retrieval, and deletion."""
    sm = JDSessionManager(ttl_seconds=3600)
    sid = sm.create_session("job.docx", ".docx", "Sample JD text content with React and Node.")
    assert sid is not None

    session = sm.get_session(sid)
    assert session is not None
    assert session["filename"] == "job.docx"
    assert "React" in session["raw_text"]

    # Delete session
    assert sm.delete_session(sid) is True
    # Verify gone
    assert sm.get_session(sid) is None
    assert sm.delete_session(sid) is False


def test_jd_session_ttl_expiry():
    """Verify expired sessions return None."""
    sm = JDSessionManager(ttl_seconds=0)  # expires immediately
    sid = sm.create_session("job.txt", ".txt", "Some text for immediate expiry.")
    assert sm.get_session(sid) is None


# ---------------------------------------------------------------------------
# 3. Comparator Tests
# ---------------------------------------------------------------------------

def test_comparator_matched_skill():
    """Verify explicit portfolio skill is marked as 'matched' with evidence."""
    match = comparator.compare_skill("React.js")
    assert match.status == "matched"
    assert "Technical Skills" in match.evidence or "project" in match.evidence.lower()


def test_comparator_partially_matched_skill():
    """Verify related skill (e.g. AWS or Docker) receives 'partially_matched'."""
    match = comparator.compare_skill("AWS")
    assert match.status == "partially_matched"
    assert "Vercel" in match.evidence or "cloud" in match.evidence.lower()


def test_comparator_not_mentioned_skill():
    """Verify missing skill is strictly marked 'not_mentioned', never 'not_matched'."""
    match = comparator.compare_skill("Cobol Programming")
    assert match.status == "not_mentioned"
    assert "Not explicitly mentioned" in match.evidence


def test_comparator_education_match():
    """Verify B.Tech requirements are recognized as matched."""
    res = comparator.evaluate_education(["B.Tech or Bachelor's Degree in Engineering / Computer Science"])
    assert res["status"] == "matched"
    assert res["score_factor"] == 1.0


def test_comparator_experience_junior_role():
    """Verify junior/entry roles receive full match score factor."""
    res = comparator.evaluate_experience(["0-2 years of software engineering experience"], "Junior Full Stack Developer")
    assert res["status"] == "matched"
    assert res["score_factor"] == 1.0


# ---------------------------------------------------------------------------
# 4. Programmatic Scoring Engine Tests
# ---------------------------------------------------------------------------

def test_scoring_service_programmatic_calculation():
    """Verify score is calculated transparently with expected weights."""
    sample_jd = ParsedJD(
        job_title="Junior MERN Stack Developer",
        required_skills=["JavaScript", "React.js", "Node.js", "MongoDB"],  # all 4 matched = 60/60
        preferred_skills=["Tailwind CSS", "Git"],                          # all 2 matched = 15/15
        experience_requirements=["0-1 years"],                             # matched = 15/15
        education_requirements=["B.Tech or Diploma in Engineering"],       # matched = 10/10
        responsibilities=["Build web applications"],
    )

    analysis = scoring_service.analyze("test_session_id", sample_jd)
    assert analysis.match_score >= 90
    assert analysis.score_out_of == 100
    assert analysis.scoring_breakdown.required_skills == 60.0
    assert analysis.scoring_breakdown.preferred_skills == 15.0
    assert analysis.scoring_breakdown.education == 10.0
    assert analysis.scoring_breakdown.experience == 15.0
    assert len(analysis.matched_skills) >= 4
    assert len(analysis.strengths) > 0


def test_scoring_service_missing_skills_no_arbitrary_points():
    """Verify missing skills yield zero points for those items without error."""
    unrelated_jd = ParsedJD(
        job_title="Senior Embedded Firmware Engineer",
        required_skills=["Rust", "Embedded Linux", "FPGA", "Verilog"],  # none in portfolio
        preferred_skills=["ARM Cortex", "PCB Design"],
        experience_requirements=["7+ years senior experience"],
        education_requirements=["PhD in Electrical Engineering"],
        responsibilities=[],
    )

    analysis = scoring_service.analyze("unrelated_session", unrelated_jd)
    # Required skills score should be near 0
    assert analysis.scoring_breakdown.required_skills == 0.0
    assert analysis.match_score < 40
    assert len(analysis.not_mentioned_skills) >= 4


# ---------------------------------------------------------------------------
# 5. FastAPI JD Endpoints Integration Tests
# ---------------------------------------------------------------------------

def test_api_upload_docx_success(client: TestClient):
    """Verify POST /api/v1/jd/upload processes DOCX and returns session_id."""
    docx_bytes = _create_sample_docx_bytes([
        "Position: React Developer",
        "Requirements: Must know React, TypeScript, and Tailwind CSS.",
        "Nice to have: Node.js and MongoDB.",
    ])
    files = {"file": ("job_description.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    response = client.post("/api/v1/jd/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["filename"] == "job_description.docx"
    assert data["extracted_characters"] > 30


def test_api_upload_invalid_extension(client: TestClient):
    """Verify POST /api/v1/jd/upload rejects forbidden extensions."""
    files = {"file": ("malicious.exe", b"binary", "application/octet-stream")}
    response = client.post("/api/v1/jd/upload", files=files)
    assert response.status_code == 400
    assert "Unsupported file format" in response.json()["detail"]


def test_api_analyze_with_direct_text(client: TestClient):
    """Verify POST /api/v1/jd/analyze works with direct pasted text."""
    payload = {
        "jd_text": (
            "We are looking for a Junior Full Stack Engineer with strong knowledge of "
            "React.js, Node.js, Express, and MongoDB. Experience with Git is preferred. "
            "B.Tech in Computer Science or related engineering field required."
        )
    }
    response = client.post("/api/v1/jd/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "match_score" in data
    assert data["score_out_of"] == 100
    assert data["match_score"] >= 70
    assert "scoring_breakdown" in data
    assert any(item["skill"].lower() in ["react", "react.js", "node.js", "mongodb", "javascript"] for item in data["matched_skills"])


def test_api_session_delete_lifecycle(client: TestClient):
    """Verify upload -> delete -> re-access returns 404."""
    docx_bytes = _create_sample_docx_bytes(["Junior Web Developer", "React, Node.js, Express."])
    files = {"file": ("temp.docx", docx_bytes, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    upload_res = client.post("/api/v1/jd/upload", files=files)
    session_id = upload_res.json()["session_id"]

    # Delete session
    del_res = client.delete(f"/api/v1/jd/{session_id}")
    assert del_res.status_code == 200
    assert del_res.json()["deleted"] is True

    # Attempt to analyze with deleted session
    analyze_res = client.post("/api/v1/jd/analyze", json={"session_id": session_id})
    assert analyze_res.status_code == 404
