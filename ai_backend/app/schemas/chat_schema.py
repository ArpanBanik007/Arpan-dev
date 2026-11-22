"""
Pydantic Request and Response Schemas for Chat & Portfolio Status.
Stage 3 of Arpan AI Portfolio RAG.
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Incoming user chat query."""
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="The question about Arpan Banik's portfolio, skills, projects, or education.",
        examples=["What are Arpan's technical skills?"]
    )


class SourceMetadata(BaseModel):
    """Provenance citation for retrieved portfolio evidence."""
    section: str = Field(..., description="Section of the portfolio where info was found")
    source: str = Field("portfolio.json", description="Source data file")
    title: str = Field("", description="Title or header of the retrieved document")


class ChatResponseSchema(BaseModel):
    """Standardized response schema returned to clients."""
    answer: str = Field(..., description="The evidence-grounded answer or safe fallback")
    grounded: bool = Field(..., description="True if answer is verified from portfolio context")
    sources: List[SourceMetadata] = Field(default_factory=list, description="List of cited portfolio sources")
    similarity_score: float = Field(0.0, description="Highest cosine similarity score achieved during retrieval")


class PortfolioStatusResponse(BaseModel):
    """Index and health status of the ChromaDB portfolio knowledge base."""
    collection_name: str
    document_count: int
    status: str
    persist_directory: str
    distance_metric: str
