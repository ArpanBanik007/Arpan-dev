"""
RAG Service (Retrieval-Augmented Generation)
Orchestrates the full pipeline from user question to grounded, evidence-backed answer.

Pipeline:
  User Question
      ↓
  Generate Query Embedding (EmbeddingService)
      ↓
  Search ChromaDB (PortfolioRetriever)
      ↓
  Check Relevance Threshold
      ↓ (relevant)             ↓ (not relevant)
  Build Context String     Return Safe Fallback
      ↓
  Call Groq API (GroqService)
      ↓
  Return Structured ChatResponse

Stage 2 of Arpan AI Portfolio RAG.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field
from app.services.retriever import PortfolioRetriever, retriever
from app.services.groq_service import groq_service
from app.core.config import settings
from app.core.prompts import SAFE_FALLBACK_ANSWER, OUT_OF_SCOPE_ANSWER


# ---------------------------------------------------------------------------
# Response Schemas
# ---------------------------------------------------------------------------

class SourceInfo(BaseModel):
    """Provenance metadata for a retrieved document chunk."""
    section: str
    source: str
    title: str = ""


class ChatResponse(BaseModel):
    """
    Structured API response returned by the RAG service.

    Fields:
        answer:    The generated (or fallback) answer text.
        grounded:  True if the answer was generated from verified portfolio context.
                   False for fallback responses when no relevant context was found.
        sources:   List of portfolio sources used to construct the answer.
        similarity_score: Highest cosine similarity score from retrieval (for transparency).
    """
    answer: str
    grounded: bool
    sources: List[SourceInfo] = Field(default_factory=list)
    similarity_score: float = 0.0


# ---------------------------------------------------------------------------
# RAG Service
# ---------------------------------------------------------------------------

class RAGService:
    """
    Orchestrates the retrieval + generation pipeline with strict grounding.
    Anti-hallucination is enforced at THREE layers:
      1. Relevance threshold before any LLM call.
      2. Explicit context injection in every user message to Groq.
      3. Strict system prompt instructions in PORTFOLIO_SYSTEM_PROMPT.
    """

    def __init__(
        self,
        portfolio_retriever: Optional[PortfolioRetriever] = None,
        relevance_threshold: float = settings.RELEVANCE_THRESHOLD,
        top_k: int = settings.TOP_K,
    ):
        self._retriever = portfolio_retriever or retriever
        self._relevance_threshold = relevance_threshold
        self._top_k = top_k

    def answer(self, question: str) -> ChatResponse:
        """
        Process a user question through the full RAG pipeline.

        Returns a ChatResponse with:
        - Groq-generated answer if relevant portfolio context is found.
        - Safe fallback if no relevant chunks exceed the threshold.
        """
        question_stripped = question.strip()

        # Guard: empty questions
        if not question_stripped:
            return ChatResponse(
                answer="Please enter a question about Arpan's portfolio.",
                grounded=False,
                sources=[],
                similarity_score=0.0,
            )

        # --- Step 1: Retrieve relevant portfolio chunks ---
        retrieval = self._retriever.retrieve(
            query=question_stripped,
            top_k=self._top_k,
            threshold=self._relevance_threshold,
        )

        # --- Step 2: Relevance gate ----------------------
        # If nothing exceeds the threshold, return safe fallback.
        # This prevents Groq from generating an answer from its pre-training knowledge.
        if not retrieval.is_relevant:
            # Determine whether this looks like a totally off-topic question.
            # (Similarity score near 0 suggests zero semantic connection to portfolio)
            answer_text = (
                OUT_OF_SCOPE_ANSWER
                if retrieval.highest_similarity < 0.15
                else SAFE_FALLBACK_ANSWER
            )
            return ChatResponse(
                answer=answer_text,
                grounded=False,
                sources=[],
                similarity_score=retrieval.highest_similarity,
            )

        # --- Step 3: Build context string from retrieved chunks ---
        # Only pass chunks that are above the relevance threshold to Groq.
        relevant_chunks = [c for c in retrieval.chunks if c.is_above_threshold]
        context = retrieval.get_context_text(only_above_threshold=True)

        if not context.strip():
            return ChatResponse(
                answer=SAFE_FALLBACK_ANSWER,
                grounded=False,
                sources=[],
                similarity_score=retrieval.highest_similarity,
            )

        # --- Step 4: Call Groq with strict context injection ---
        try:
            answer_text = groq_service.generate_portfolio_answer(
                question=question_stripped,
                context=context,
            )
        except RuntimeError as e:
            # Groq API errors (rate limit, timeout, connection) bubble up cleanly.
            raise RuntimeError(str(e)) from e

        # --- Step 5: Build structured response with source metadata ---
        sources = [
            SourceInfo(
                section=s.get("section", "portfolio"),
                source=s.get("source", "portfolio.json"),
                title=s.get("title", ""),
            )
            for s in retrieval.sources
        ]

        return ChatResponse(
            answer=answer_text,
            grounded=True,
            sources=sources,
            similarity_score=retrieval.highest_similarity,
        )


# Global singleton instance — imported by FastAPI route handlers
rag_service = RAGService()
