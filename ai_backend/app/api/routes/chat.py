"""
Portfolio Chat and Status API Routes.
Exposes /api/v1/chat and /api/v1/portfolio/status.
Stage 3 of Arpan AI Portfolio RAG.
"""

import logging
from fastapi import APIRouter, HTTPException, status
from app.schemas.chat_schema import (
    ChatRequest,
    ChatResponseSchema,
    PortfolioStatusResponse,
    SourceMetadata,
)
from app.services.rag_service import rag_service
from app.services.vector_store import vector_store

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Portfolio Chat"])


@router.get(
    "/portfolio/status",
    response_model=PortfolioStatusResponse,
    summary="Portfolio Index Status",
    description="Check the current ChromaDB collection name, document count, and index status.",
)
async def get_portfolio_status() -> PortfolioStatusResponse:
    """Return status information about the portfolio vector store."""
    try:
        status_info = vector_store.get_status()
        return PortfolioStatusResponse(
            collection_name=status_info["collection_name"],
            document_count=status_info["document_count"],
            status=status_info["status"],
            persist_directory=status_info["persist_directory"],
            distance_metric=status_info["distance_metric"],
        )
    except Exception as e:
        logger.error(f"Error fetching portfolio status: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query portfolio status: {str(e)}",
        )


@router.post(
    "/chat",
    response_model=ChatResponseSchema,
    summary="Ask Arpan Bot",
    description="Ask a question about Arpan Banik's portfolio. Answers are strictly grounded in verified data.",
)
async def chat(request: ChatRequest) -> ChatResponseSchema:
    """Process a user question through the strict RAG pipeline."""
    question = request.question.strip()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty or whitespace.",
        )

    try:
        result = rag_service.answer(question)
        sources_converted = [
            SourceMetadata(
                section=s.section,
                source=s.source,
                title=s.title,
            )
            for s in result.sources
        ]
        return ChatResponseSchema(
            answer=result.answer,
            grounded=result.grounded,
            sources=sources_converted,
            similarity_score=result.similarity_score,
        )
    except RuntimeError as e:
        logger.error(f"Upstream service error during chat generation: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected error in chat route: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing your request.",
        )
