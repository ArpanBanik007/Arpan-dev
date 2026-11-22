"""
Retriever Service
Performs semantic retrieval against the ChromaDB portfolio_collection,
calculates cosine similarity scores, enforces relevance thresholds,
and bundles structured source provenance metadata.
Phase 6 of Arpan AI Portfolio RAG.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from app.services.embedding_service import embedding_service
from app.services.vector_store import ChromaVectorStore, vector_store
from app.core.config import settings


class RetrievedChunk(BaseModel):
    """A single retrieved chunk with its distance and similarity score."""
    chunk_id: str
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    distance: float
    similarity_score: float
    is_above_threshold: bool


class RetrievalResult(BaseModel):
    """Structured result returned by the retriever."""
    query: str
    is_relevant: bool
    highest_similarity: float
    chunks: List[RetrievedChunk] = Field(default_factory=list)
    sources: List[Dict[str, str]] = Field(default_factory=list)

    def get_context_text(self, only_above_threshold: bool = True) -> str:
        """Helper to format retrieved chunks into unified prompt context."""
        selected_chunks = [c for c in self.chunks if not only_above_threshold or c.is_above_threshold]
        if not selected_chunks:
            return ""
        return "\n\n---\n\n".join(c.text for c in selected_chunks)


class PortfolioRetriever:
    """Retrieval engine for Arpan's portfolio knowledge base."""

    def __init__(
        self,
        store: Optional[ChromaVectorStore] = None,
        default_top_k: int = settings.TOP_K,
        default_threshold: float = settings.RELEVANCE_THRESHOLD,
    ):
        self.store = store or vector_store
        self.default_top_k = default_top_k
        self.default_threshold = default_threshold

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        threshold: Optional[float] = None,
    ) -> RetrievalResult:
        """
        Embed the user query, search ChromaDB, compute similarity scores,
        and evaluate against the relevance threshold.
        """
        k = top_k if top_k is not None else self.default_top_k
        min_threshold = threshold if threshold is not None else self.default_threshold
        query_text = query.strip()

        if not query_text:
            return RetrievalResult(
                query=query,
                is_relevant=False,
                highest_similarity=0.0,
                chunks=[],
                sources=[],
            )

        # 1. Generate query embedding
        query_embedding = embedding_service.embed_query(query_text)

        # 2. Query ChromaDB
        raw_results = self.store.query(query_embedding, top_k=k)

        ids = raw_results.get("ids", [[]])[0]
        documents = raw_results.get("documents", [[]])[0]
        metadatas = raw_results.get("metadatas", [[]])[0]
        distances = raw_results.get("distances", [[]])[0]

        retrieved_chunks: List[RetrievedChunk] = []
        highest_similarity = 0.0
        unique_sources: Dict[str, Dict[str, str]] = {}

        for chunk_id, text, meta, dist in zip(ids, documents, metadatas, distances):
            # For cosine distance: distance is in [0, 2], where 0 = identical
            # Similarity = 1.0 - distance (bounded to [0.0, 1.0])
            similarity = max(0.0, min(1.0, 1.0 - float(dist)))
            if similarity > highest_similarity:
                highest_similarity = similarity

            is_above = similarity >= min_threshold
            retrieved_chunks.append(
                RetrievedChunk(
                    chunk_id=chunk_id,
                    text=text,
                    metadata=meta,
                    distance=round(float(dist), 4),
                    similarity_score=round(similarity, 4),
                    is_above_threshold=is_above,
                )
            )

            # Deduplicate sources based on document_id or title
            source_key = meta.get("document_id") or meta.get("title") or chunk_id
            if source_key not in unique_sources and is_above:
                unique_sources[source_key] = {
                    "section": meta.get("section", "portfolio"),
                    "source": meta.get("source", "portfolio.json"),
                    "title": meta.get("title", ""),
                }

        is_relevant = any(c.is_above_threshold for c in retrieved_chunks)

        return RetrievalResult(
            query=query,
            is_relevant=is_relevant,
            highest_similarity=round(highest_similarity, 4),
            chunks=retrieved_chunks,
            sources=list(unique_sources.values()),
        )


# Global retriever instance
retriever = PortfolioRetriever()
