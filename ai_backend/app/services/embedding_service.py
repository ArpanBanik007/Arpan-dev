"""
Embedding Service
Wraps sentence-transformers/all-MiniLM-L6-v2 via FastEmbed (ONNX Runtime, CPU-only)
to produce normalized dense vectors without PyTorch.
Loads model once as a singleton to maximize performance and minimize memory usage.
Phase 4 of Arpan AI Portfolio RAG.
"""

from typing import List, Optional
import numpy as np
from fastembed import TextEmbedding
from app.core.config import settings

# FastEmbed model name mapping: HF canonical → fastembed registry name
_FASTEMBED_MODEL_MAP = {
    "sentence-transformers/all-MiniLM-L6-v2": "sentence-transformers/all-MiniLM-L6-v2",
}


class EmbeddingService:
    """
    Singleton service managing sentence-transformers/all-MiniLM-L6-v2 via ONNX Runtime.
    Produces L2-normalized 384-dimensional embeddings.
    """

    _instance: Optional["EmbeddingService"] = None
    _model: Optional[TextEmbedding] = None

    def __new__(cls) -> "EmbeddingService":
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
        return cls._instance

    def __init__(self, model_name: str = settings.EMBEDDING_MODEL_NAME):
        if self._model is None:
            self.model_name = model_name
            self._load_model()

    def _load_model(self) -> None:
        """Load the ONNX embedding model once via FastEmbed."""
        try:
            fastembed_name = _FASTEMBED_MODEL_MAP.get(self.model_name, self.model_name)
            self._model = TextEmbedding(model_name=fastembed_name)
            # Verify embedding dimension with a probe
            probe = list(self._model.embed(["dimension check"]))[0]
            dim = len(probe)
            if dim != settings.EMBEDDING_DIMENSION:
                raise ValueError(
                    f"Model embedding dimension mismatch: expected {settings.EMBEDDING_DIMENSION}, got {dim}"
                )
        except Exception as e:
            raise RuntimeError(f"Failed to load embedding model '{self.model_name}': {e}") from e

    @property
    def model(self) -> TextEmbedding:
        """Access the underlying FastEmbed TextEmbedding instance."""
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
            vectors = list(self.model.embed([query_text]))
            return vectors[0].tolist()
        except Exception as e:
            raise RuntimeError(f"Failed to generate query embedding: {e}") from e

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """
        Embed a list of document strings into normalized vectors.
        Uses small batches to control memory usage.
        """
        if not texts:
            return []

        cleaned_texts = [t.strip() if t.strip() else " " for t in texts]

        try:
            vectors = list(self.model.embed(cleaned_texts, batch_size=16))
            return [v.tolist() for v in vectors]
        except Exception as e:
            raise RuntimeError(f"Failed to generate document embeddings: {e}") from e

    def get_dimension(self) -> int:
        """Return the vector dimensionality."""
        return settings.EMBEDDING_DIMENSION


# Global reusable instance
embedding_service = EmbeddingService()
