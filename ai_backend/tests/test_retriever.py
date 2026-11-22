"""
Tests for Portfolio Retriever Service
Phase 6 verification.
"""

from app.services.retriever import PortfolioRetriever, retriever
from app.core.config import settings


def test_relevant_skills_query():
    """Verify retriever identifies and retrieves relevant skills data."""
    result = retriever.retrieve("What are Arpan's technical skills and programming languages?", top_k=4)
    assert result.is_relevant is True
    assert result.highest_similarity >= settings.RELEVANCE_THRESHOLD
    assert len(result.chunks) > 0
    assert len(result.sources) > 0
    
    sections = [c.metadata.get("section") for c in result.chunks]
    assert "technical_skills" in sections


def test_relevant_project_query():
    """Verify retriever finds specific project details."""
    result = retriever.retrieve("Tell me about the Pluto project built by Arpan", top_k=4)
    assert result.is_relevant is True
    assert result.highest_similarity >= settings.RELEVANCE_THRESHOLD
    assert any("Pluto" in c.text for c in result.chunks)
    assert any(c.metadata.get("section") == "projects" for c in result.chunks)


def test_relevant_education_query():
    """Verify retriever finds education history."""
    result = retriever.retrieve("Where did Arpan complete his B.Tech in Electronics & Communication?", top_k=3)
    assert result.is_relevant is True
    assert result.highest_similarity >= settings.RELEVANCE_THRESHOLD
    assert any("Swami Vivekananda Institute" in c.text or "B.Tech" in c.text for c in result.chunks)


def test_irrelevant_query_rejected():
    """Verify completely irrelevant queries fail the relevance threshold."""
    irrelevant_queries = [
        "What is the capital of France?",
        "Solve equation 2 + 3 = 5",
        "Who is the CEO of Tesla Elon Musk?",
        "How to bake a chocolate cake?",
    ]
    
    for query in irrelevant_queries:
        res = retriever.retrieve(query, top_k=4)
        assert res.is_relevant is False, f"Query '{query}' was falsely marked relevant with score {res.highest_similarity}"
        assert res.highest_similarity < settings.RELEVANCE_THRESHOLD


def test_empty_query():
    """Verify empty or whitespace query returns non-relevant result safely."""
    result = retriever.retrieve("   ")
    assert result.is_relevant is False
    assert result.highest_similarity == 0.0
    assert len(result.chunks) == 0


def test_configurable_threshold():
    """Verify that raising threshold rejects marginal matches and lowering it accepts."""
    query = "Does Arpan have experience in cloud computing and AWS deployment?"
    # Raising threshold to high bar (0.85) should reject
    res_high = retriever.retrieve(query, threshold=0.85)
    assert res_high.is_relevant is False
