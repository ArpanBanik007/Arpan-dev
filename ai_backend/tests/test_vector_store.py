"""
Tests for ChromaDB Vector Store Service
Phase 5 verification.
"""

from app.services.vector_store import ChromaVectorStore, _sanitize_metadata
from app.services.text_splitter import PortfolioChunk


def test_sanitize_metadata():
    """Verify metadata sanitization for ChromaDB compatibility."""
    raw_meta = {
        "string_val": "test",
        "int_val": 42,
        "float_val": 3.14,
        "bool_val": True,
        "list_val": ["react", "node", "mongo"],
        "dict_val": {"city": "Kolkata"},
        "none_val": None,
    }
    clean = _sanitize_metadata(raw_meta)
    assert clean["string_val"] == "test"
    assert clean["int_val"] == 42
    assert clean["float_val"] == 3.14
    assert clean["bool_val"] is True
    assert clean["list_val"] == "react, node, mongo"
    assert "Kolkata" in clean["dict_val"]
    assert clean["none_val"] == ""


def test_vector_store_status_and_count():
    """Verify vector store connects to portfolio_collection and reports count."""
    store = ChromaVectorStore()
    status = store.get_status()
    
    assert status["collection_name"] == "portfolio_collection"
    assert status["document_count"] >= 20
    assert status["status"] == "indexed"
    assert status["distance_metric"] == "cosine"


def test_deterministic_upsert_idempotence():
    """Verify upserting with identical chunk_id updates rather than duplicates."""
    store = ChromaVectorStore()
    initial_count = store.get_count()

    test_chunk = PortfolioChunk(
        chunk_id="test_idempotent_chunk_c0",
        text="Temporary test chunk for testing idempotency.",
        metadata={"section": "test", "source": "test"},
    )
    fake_vector = [0.05] * 384

    # First upsert
    store.upsert_chunks([test_chunk], [fake_vector])
    count_after_first = store.get_count()
    assert count_after_first == initial_count + 1

    # Second upsert with identical ID
    store.upsert_chunks([test_chunk], [fake_vector])
    count_after_second = store.get_count()
    assert count_after_second == count_after_first, "Duplicate upsert must not create extra records"

    # Cleanup test chunk
    store._collection.delete(ids=["test_idempotent_chunk_c0"])
    assert store.get_count() == initial_count
