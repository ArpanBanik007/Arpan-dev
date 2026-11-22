"""
Embedding Service
Wraps sentence-transformers/all-MiniLM-L6-v2 to produce normalized dense vectors.
Loads model once as a singleton to maximize performance and minimize memory usage.
Phase 4 of Arpan AI Portfolio RAG.
"""

from typing import List, Optional
import numpy as np
from sentence_transformers import SentenceTransformer
from app.core.config import settings


class EmbeddingService:
    """
    Singleton service managing sentence-transformers/all-MiniLM-L6-v2.
    Produces L2-normalized 384-dimensional embeddings.
    """

    _instance: Optional["EmbeddingService"] = None
    _model: Optional[SentenceTransformer] = None

    def __new__(cls) -> "EmbeddingService":
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def __init__(self, model_name: str = settings.EMBEDDING_MODEL_NAME):
        if self._model is None:
            self.model_name = model_name
            self._load_model()

    def _load_model(self) -> None:
        """Load the SentenceTransformer model once."""
        try:
            self._model = SentenceTransformer(self.model_name)
            # Verify embedding dimension
            dim = self._model.get_embedding_dimension()
            if dim != settings.EMBEDDING_DIMENSION:
                raise ValueError(
                    f"Model embedding dimension mismatch: expected {settings.EMBEDDING_DIMENSION}, got {dim}"
                )
        except Exception as e:
            raise RuntimeError(f"Failed to load embedding model '{self.model_name}': {e}") from e

    @property
    def model(self) -> SentenceTransformer:
        """Access the underlying SentenceTransformer instance."""
        if self._model is None:
            self._load_model()
        return self._model

    def embed_query(self, query: str) -> List[float]:
        """
        Embed a single search query into a normalized vector.
        """
        query_text = query.strip()
        if not query_text:
            raise ValueError("Query string cannot be empty")

        try:
            vector = self.model.encode(
                query_text,
                normalize_embeddings=True,
                show_progress_bar=False,
                convert_to_numpy=True,
            )
            return vector.tolist()
        except Exception as e:
            raise RuntimeError(f"Failed to generate query embedding: {e}") from e

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a list of document strings into normalized vectors.
        """
        if not texts:
            return []

        cleaned_texts = [t.strip() if t.strip() else " " for t in texts]

        try:
            vectors = self.model.encode(
                cleaned_texts,
                normalize_embeddings=True,
                show_progress_bar=False,
                convert_to_numpy=True,
                batch_size=32,
            )
            return vectors.tolist()
        except Exception as e:
            raise RuntimeError(f"Failed to generate document embeddings: {e}") from e

    def get_dimension(self) -> int:
        """Return the vector dimensionality."""
        return self.model.get_embedding_dimension()


# Global reusable instance
embedding_service = EmbeddingService()
