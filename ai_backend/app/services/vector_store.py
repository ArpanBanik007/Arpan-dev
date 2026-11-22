"""
ChromaDB Vector Store Service
Manages persistent local storage, cosine index configuration, deterministic upserting,
and vector similarity querying for portfolio documents.
Phase 5 of Arpan AI Portfolio RAG.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional
import chromadb
from chromadb.config import Settings as ChromaSettings
from app.services.text_splitter import PortfolioChunk
from app.core.config import settings


def _sanitize_metadata(meta: Dict[str, Any]) -> Dict[str, Any]:
    """
    Ensure metadata values comply with ChromaDB requirements:
    Only primitive types (str, int, float, bool) are accepted.
    Lists and nested dicts are converted to strings.
    """
    clean_meta = {}
    for k, v in meta.items():
        if isinstance(v, (str, int, float, bool)):
            clean_meta[k] = v
        elif isinstance(v, (list, tuple)):
            clean_meta[k] = ", ".join(str(item) for item in v)
        elif isinstance(v, dict):
            clean_meta[k] = str(v)
        elif v is None:
            clean_meta[k] = ""
        else:
            clean_meta[k] = str(v)
    return clean_meta


class ChromaVectorStore:
    """
    Wrapper around persistent ChromaDB client configured for cosine distance.
    """

    def __init__(
        self,
        persist_directory: Path = settings.CHROMA_PERSIST_DIRECTORY,
        collection_name: str = settings.CHROMA_COLLECTION_NAME,
    ):
        self.persist_directory = Path(persist_directory)
        self.collection_name = collection_name
        self.persist_directory.mkdir(parents=True, exist_ok=True)

        self._client = chromadb.PersistentClient(
            path=str(self.persist_directory),
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self._collection = self._get_or_create_collection()

    def _get_or_create_collection(self):
        """Retrieve or create the portfolio collection using cosine distance."""
        return self._client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def upsert_chunks(
        self, chunks: List[PortfolioChunk], embeddings: List[List[float]]
    ) -> int:
        """
        Upsert chunks with deterministic IDs to prevent duplicates.
        Returns the number of chunks upserted.
        """
        if not chunks:
            return 0
        if len(chunks) != len(embeddings):
            raise ValueError("Number of chunks must match number of embeddings")

        ids = [c.chunk_id for c in chunks]
        documents = [c.text for c in chunks]
        metadatas = [_sanitize_metadata(c.metadata) for c in chunks]

        # ChromaDB accepts batches of up to ~4000 items
        batch_size = 200
        total_upserted = 0
        for i in range(0, len(chunks), batch_size):
            batch_ids = ids[i : i + batch_size]
            batch_docs = documents[i : i + batch_size]
            batch_metas = metadatas[i : i + batch_size]
            batch_embs = embeddings[i : i + batch_size]

            self._collection.upsert(
                ids=batch_ids,
                documents=batch_docs,
                metadatas=batch_metas,
                embeddings=batch_embs,
            )
            total_upserted += len(batch_ids)

        return total_upserted

    def query(
        self,
        query_embedding: List[float],
        top_k: int = settings.TOP_K,
        where: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Query ChromaDB by embedding vector using cosine similarity.
        """
        total_items = self.get_count()
        if total_items == 0:
            return {"ids": [[]], "documents": [[]], "metadatas": [[]], "distances": [[]]}

        actual_k = min(top_k, total_items)
        kwargs = {
            "query_embeddings": [query_embedding],
            "n_results": actual_k,
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where

        results = self._collection.query(**kwargs)
        return results

    def get_count(self) -> int:
        """Return total document count in the portfolio collection."""
        return self._collection.count()

    def get_status(self) -> Dict[str, Any]:
        """Return status information about the ChromaDB index."""
        count = self.get_count()
        return {
            "collection_name": self.collection_name,
            "document_count": count,
            "persist_directory": str(self.persist_directory),
            "status": "indexed" if count > 0 else "empty",
            "distance_metric": "cosine",
        }

    def reset_collection(self) -> None:
        """Delete existing collection and recreate an empty one for fresh ingestion."""
        try:
            self._client.delete_collection(name=self.collection_name)
        except Exception:
            pass
        self._collection = self._get_or_create_collection()


# Default singleton instance
vector_store = ChromaVectorStore()
