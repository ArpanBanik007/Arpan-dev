"""
Tests for Embedding Service
Phase 4 verification.
"""

import math
import pytest
from app.services.embedding_service import EmbeddingService, embedding_service
from app.core.config import settings


def test_embedding_service_singleton():
    """Verify that EmbeddingService behaves as a singleton and does not reload."""
    service1 = EmbeddingService()
    service2 = EmbeddingService()
    assert service1 is service2
    assert service1 is embedding_service


def test_embedding_dimension():
    """Verify embedding vector dimensionality is 384 for all-MiniLM-L6-v2."""
    dim = embedding_service.get_dimension()
    assert dim == settings.EMBEDDING_DIMENSION
    assert dim == 384


def test_embed_query_normalized():
    """Verify query embedding is generated and normalized to unit length."""
    query = "What are Arpan's full-stack skills?"
    vector = embedding_service.embed_query(query)
    
    assert isinstance(vector, list)
    assert len(vector) == 384
    # Check L2 norm is approximately 1.0
    norm = math.sqrt(sum(x * x for x in vector))
    assert pytest.approx(norm, abs=0.05) == 1.0


def test_embed_documents_batch():
    """Verify batch document embeddings are generated with matching length."""
    texts = [
        "Arpan built Near It, a full-stack service marketplace.",
        "Arpan has experience with LangGraph and RAG workflows.",
    ]
    vectors = embedding_service.embed_documents(texts)
    
    assert len(vectors) == 2
    for v in vectors:
        assert len(v) == 384
        norm = math.sqrt(sum(x * x for x in v))
        assert pytest.approx(norm, abs=0.05) == 1.0


def test_empty_query_raises():
    """Verify empty query raises ValueError."""
    with pytest.raises(ValueError):
        embedding_service.embed_query("   ")
