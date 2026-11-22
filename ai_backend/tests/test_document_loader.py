"""
Tests for Document Loader Service
Phase 2 verification.
"""

from pathlib import Path
from app.services.document_loader import DocumentLoader, Document
from app.core.config import settings


def test_portfolio_json_loading():
    """Verify that portfolio.json loads into granular, well-formed Documents."""
    docs = DocumentLoader.load_portfolio_json(settings.PORTFOLIO_JSON_PATH)
    assert len(docs) > 0, "No documents were extracted from portfolio.json"

    # Verify sections exist
    sections = {doc.metadata.get("section") for doc in docs}
    expected_sections = {
        "personal_info",
        "professional_summary",
        "education",
        "technical_skills",
        "engineering_strengths",
        "projects",
        "portfolio_metrics",
        "languages",
        "career_interests",
    }
    assert expected_sections.issubset(sections), f"Missing sections in extracted docs: {expected_sections - sections}"

    # Verify each document has required metadata
    for doc in docs:
        assert doc.page_content.strip(), f"Empty page_content in document: {doc.metadata}"
        assert "document_id" in doc.metadata
        assert "section" in doc.metadata
        assert "source" in doc.metadata
        assert "title" in doc.metadata

    # Verify individual project separation (5 individual projects + 1 overview)
    project_docs = [d for d in docs if d.metadata.get("section") == "projects"]
    individual_project_docs = [d for d in project_docs if d.metadata.get("category") != "projects_overview"]
    assert len(individual_project_docs) == 5, f"Expected 5 individual project documents, found {len(individual_project_docs)}"
    assert len(project_docs) == 6, f"Expected 6 total project documents (including overview), found {len(project_docs)}"

    # Verify skill category separation and explicit tagging
    skill_docs = [d for d in docs if d.metadata.get("section") == "technical_skills"]
    assert len(skill_docs) >= 7, f"Expected at least 7 skill category docs, found {len(skill_docs)}"
    for s_doc in skill_docs:
        assert "skill_type" in s_doc.metadata

    # Verify education separation
    edu_docs = [d for d in docs if d.metadata.get("section") == "education"]
    assert len(edu_docs) == 3, f"Expected 3 education documents, found {len(edu_docs)}"


def test_text_file_loading(tmp_path: Path):
    """Verify plain text loading into Document."""
    test_file = tmp_path / "sample.txt"
    test_file.write_text("Hello Arpan Bot RAG system!", encoding="utf-8")
    
    docs = DocumentLoader.load_text_file(test_file)
    assert len(docs) == 1
    assert docs[0].page_content == "Hello Arpan Bot RAG system!"
    assert docs[0].metadata["source"] == "sample.txt"
    assert docs[0].metadata["section"] == "text_document"
