"""
Tests for Text Splitter Service
Phase 3 verification.
"""

from app.services.document_loader import Document, DocumentLoader
from app.services.text_splitter import PortfolioTextSplitter, PortfolioChunk
from app.core.config import settings


def test_short_document_preservation():
    """Verify that documents within chunk_size are preserved intact."""
    splitter = PortfolioTextSplitter(chunk_size=400, chunk_overlap=60)
    doc = Document(
        page_content="Arpan Banik is a Full-Stack and Generative AI developer in Kolkata.",
        metadata={"document_id": "doc_test", "title": "Test Title", "section": "personal_info"},
    )
    chunks = splitter.split_document(doc)
    assert len(chunks) == 1
    assert chunks[0].chunk_id == "doc_test_c0"
    assert chunks[0].metadata["total_chunks"] == 1
    assert chunks[0].metadata["section"] == "personal_info"
    assert "Arpan Banik" in chunks[0].text


def test_long_document_splitting_with_overlap():
    """Verify that documents exceeding chunk_size split properly with overlap and context header."""
    splitter = PortfolioTextSplitter(chunk_size=50, chunk_overlap=15)
    
    # Generate 15 distinct lines
    lines = [f"Highlight point number {i}: building robust scalable systems and APIs" for i in range(1, 16)]
    doc = Document(
        page_content="\n".join(lines),
        metadata={"document_id": "doc_long_project", "title": "Project Pluto", "section": "projects"},
    )
    chunks = splitter.split_document(doc)
    
    assert len(chunks) > 1, "Expected long document to be split into multiple chunks"
    for idx, c in enumerate(chunks):
        assert c.chunk_id == f"doc_long_project_c{idx}"
        assert c.metadata["section"] == "projects"
        assert c.metadata["title"] == "Project Pluto"
        # Verify context header preservation
        assert "[Project Pluto]" in c.text


def test_portfolio_documents_chunking():
    """Verify chunking against real portfolio documents."""
    docs = DocumentLoader.load_portfolio_json(settings.PORTFOLIO_JSON_PATH)
    splitter = PortfolioTextSplitter(chunk_size=settings.CHUNK_SIZE, chunk_overlap=settings.CHUNK_OVERLAP)
    chunks = splitter.split_documents(docs)

    assert len(chunks) >= len(docs), "Total chunks should be at least equal to number of documents"
    for chunk in chunks:
        assert isinstance(chunk, PortfolioChunk)
        assert chunk.chunk_id
        assert chunk.text.strip()
        assert "section" in chunk.metadata
        assert "source" in chunk.metadata
