"""
Stage 2 RAG tests covering:
- Relevant portfolio questions → grounded answer from Groq
- Missing portfolio information → safe fallback, grounded=False
- Unrelated questions → out-of-scope rejection, grounded=False
- Empty questions → safe fallback
- Groq API integration checks
- Source metadata on grounded responses
"""

import pytest
from unittest.mock import patch, MagicMock
from app.services.rag_service import RAGService, ChatResponse
from app.services.retriever import retriever
from app.core.config import settings


# ---------------------------------------------------------------------------
# Live integration tests (require real Groq API key + running ChromaDB)
# ---------------------------------------------------------------------------

class TestRAGPipelineLive:
    """Live integration tests that make real API calls."""

    def setup_method(self):
        self.rag = RAGService()

    def test_skills_question_returns_grounded_answer(self):
        """Relevant skills question must produce a grounded answer with sources."""
        result = self.rag.answer("What are Arpan's technical skills?")
        assert result.grounded is True, f"Expected grounded=True, got answer: {result.answer}"
        assert result.similarity_score >= settings.RELEVANCE_THRESHOLD
        assert len(result.sources) > 0
        assert len(result.answer) > 20
        # Answer must reference at least one real skill from portfolio
        answer_lower = result.answer.lower()
        portfolio_skills = ["react", "node.js", "python", "mongodb", "express", "javascript", "typescript"]
        assert any(skill in answer_lower for skill in portfolio_skills), (
            f"Answer does not mention any verified portfolio skills: {result.answer}"
        )

    def test_education_question_returns_grounded_answer(self):
        """Education question must produce grounded answer citing Swami Vivekananda Institute."""
        result = self.rag.answer(
            "What is Arpan's education background? What B.Tech degree is he pursuing?"
        )
        assert result.grounded is True
        assert result.similarity_score >= settings.RELEVANCE_THRESHOLD
        assert "swami vivekananda" in result.answer.lower() or "electronics" in result.answer.lower()
        assert len(result.sources) > 0

    def test_project_question_returns_grounded_answer(self):
        """Project question must produce grounded answer citing specific project details."""
        result = self.rag.answer(
            "What is the Pluto social media project built by Arpan Banik?"
        )
        assert result.grounded is True
        assert result.similarity_score >= settings.RELEVANCE_THRESHOLD
        answer_lower = result.answer.lower()
        assert "pluto" in answer_lower
        assert len(result.sources) > 0

    def test_capital_of_france_is_rejected(self):
        """Geography question must be rejected as out-of-scope."""
        result = self.rag.answer("What is the capital of France?")
        assert result.grounded is False
        assert result.similarity_score < settings.RELEVANCE_THRESHOLD

    def test_math_question_is_rejected(self):
        """Math question must be rejected as out-of-scope."""
        result = self.rag.answer("What is 2 + 3?")
        assert result.grounded is False
        assert result.similarity_score < settings.RELEVANCE_THRESHOLD

    def test_elon_musk_is_rejected(self):
        """Unrelated person question must be rejected."""
        result = self.rag.answer("Who is Elon Musk?")
        assert result.grounded is False

    def test_missing_skill_aws_unavailable_response(self):
        """AWS not in portfolio → response clearly states skill is unavailable or not mentioned."""
        result = self.rag.answer("Does Arpan have AWS cloud experience?")
        answer_lower = result.answer.lower()
        # Must clearly state that AWS is not available/mentioned in Arpan's portfolio
        assert (
            "not available" in answer_lower
            or "does not mention" in answer_lower
            or "not mentioned" in answer_lower
            or "could not find" in answer_lower
            or not result.grounded
        ), f"Expected unavailable response for unverified skill AWS. Got: {result.answer}"
        # Must never hallucinate that Arpan has AWS experience
        assert "extensive aws experience" not in answer_lower
        assert "certified in aws" not in answer_lower

    def test_empty_question_handled_safely(self):
        """Empty question must return safe fallback without calling Groq."""
        result = self.rag.answer("   ")
        assert result.grounded is False
        assert result.similarity_score == 0.0
        assert len(result.sources) == 0

    def test_sources_contain_section_and_source_fields(self):
        """Every source in a grounded response must have section and source fields."""
        result = self.rag.answer("What programming languages does Arpan know?")
        assert result.grounded is True
        for source in result.sources:
            assert source.section, "Source missing 'section' field"
            assert source.source, "Source missing 'source' field"
            assert source.source == "portfolio.json"


# ---------------------------------------------------------------------------
# Unit tests with mocked Groq (fast, no API calls)
# ---------------------------------------------------------------------------

class TestRAGPipelineUnit:
    """Unit tests with Groq mocked to avoid API calls."""

    def _make_rag(self):
        return RAGService()

    def test_irrelevant_query_never_calls_groq(self):
        """Groq must NOT be called when relevance threshold fails."""
        rag = self._make_rag()
        with patch("app.services.rag_service.groq_service") as mock_groq:
            result = rag.answer("What is the capital of France?")
        mock_groq.generate_portfolio_answer.assert_not_called()
        assert result.grounded is False

    def test_empty_query_never_calls_groq(self):
        """Groq must NOT be called for empty questions."""
        rag = self._make_rag()
        with patch("app.services.rag_service.groq_service") as mock_groq:
            result = rag.answer("")
        mock_groq.generate_portfolio_answer.assert_not_called()
        assert result.grounded is False

    def test_groq_error_propagates_as_runtime_error(self):
        """When Groq raises RuntimeError, RAGService propagates it."""
        rag = self._make_rag()
        with patch("app.services.rag_service.groq_service") as mock_groq:
            mock_groq.generate_portfolio_answer.side_effect = RuntimeError("Groq API rate limit")
            # Need a question that will get past retrieval threshold
            with pytest.raises(RuntimeError, match="Groq API rate limit"):
                # Directly test the groq call path by patching retrieval to be relevant
                with patch.object(rag._retriever, "retrieve") as mock_retrieve:
                    from app.services.retriever import RetrievalResult, RetrievedChunk
                    mock_result = MagicMock()
                    mock_result.is_relevant = True
                    mock_result.highest_similarity = 0.75
                    mock_result.chunks = []
                    mock_result.sources = [{"section": "skills", "source": "portfolio.json", "title": "Skills"}]
                    mock_result.get_context_text.return_value = "Arpan knows Python, React, Node.js."
                    mock_retrieve.return_value = mock_result
                    rag.answer("What are Arpan's skills?")

    def test_response_schema_fields_present(self):
        """ChatResponse Pydantic model must always have all required fields."""
        response = ChatResponse(
            answer="Arpan knows Python.",
            grounded=True,
            sources=[],
            similarity_score=0.72,
        )
        assert response.answer == "Arpan knows Python."
        assert response.grounded is True
        assert response.sources == []
        assert response.similarity_score == 0.72

    def test_grounded_false_response_has_empty_sources(self):
        """Safe fallback responses must have no sources."""
        rag = self._make_rag()
        result = rag.answer("What is the speed of light?")
        assert result.grounded is False
        assert result.sources == []
