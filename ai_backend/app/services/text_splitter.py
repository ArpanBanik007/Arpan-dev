"""
Text Splitter Service
Performs semantic, metadata-preserving chunking for portfolio documents.
Avoids fragmentation of concise documents while breaking large descriptions
into clean, overlapping chunks with contextual headers.
Phase 3 of Arpan AI Portfolio RAG.
"""

from typing import Any, Dict, List
from pydantic import BaseModel, Field
from app.services.document_loader import Document
from app.core.config import settings


class PortfolioChunk(BaseModel):
    """Represents a discrete text chunk ready for vectorization and indexing."""
    chunk_id: str
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def __repr__(self) -> str:
        return f"<PortfolioChunk id='{self.chunk_id}' len={len(self.text)} sec='{self.metadata.get('section')}'>"


class PortfolioTextSplitter:
    """
    Configurable text splitter tailored for portfolio knowledge.
    Uses token/word approximations with paragraph boundary awareness.
    """

    def __init__(
        self,
        chunk_size: int = settings.CHUNK_SIZE,
        chunk_overlap: int = settings.CHUNK_OVERLAP,
    ):
        if chunk_overlap >= chunk_size:
            raise ValueError("chunk_overlap must be strictly less than chunk_size")
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    @staticmethod
    def _approx_tokens(text: str) -> int:
        """Approximate token count using word splits and punctuation."""
        return max(1, len(text.split()))

    def split_document(self, doc: Document) -> List[PortfolioChunk]:
        """
        Split a single Document into one or more PortfolioChunk instances.
        If the document is already within chunk_size, keeps it intact.
        """
        content = doc.page_content.strip()
        doc_meta = doc.metadata.copy()
        doc_id = doc_meta.get("document_id", "doc")
        title = doc_meta.get("title", "")
        token_count = self._approx_tokens(content)

        # If document comfortably fits within target chunk size, preserve it intact
        if token_count <= self.chunk_size:
            chunk = PortfolioChunk(
                chunk_id=f"{doc_id}_c0",
                text=content,
                metadata={
                    **doc_meta,
                    "chunk_id": f"{doc_id}_c0",
                    "chunk_index": 0,
                    "total_chunks": 1,
                    "token_count": token_count,
                },
            )
            return [chunk]

        # For larger documents, split across paragraphs or bullet points
        lines = [line.strip() for line in content.split("\n") if line.strip()]
        chunks_text: List[str] = []
        current_chunk_lines: List[str] = []
        current_tokens = 0

        # Context header prefix to prevent orphaned chunk context
        header_prefix = f"[{title}]\n" if title else ""
        header_tokens = self._approx_tokens(header_prefix)

        for line in lines:
            line_tokens = self._approx_tokens(line)
            if current_tokens + line_tokens + header_tokens > self.chunk_size and current_chunk_lines:
                # Save current chunk
                full_text = header_prefix + "\n".join(current_chunk_lines)
                chunks_text.append(full_text)

                # Overlap: keep trailing lines that sum up to approximately chunk_overlap
                overlap_lines: List[str] = []
                overlap_tokens = 0
                for prev_line in reversed(current_chunk_lines):
                    prev_tokens = self._approx_tokens(prev_line)
                    if overlap_tokens + prev_tokens <= self.chunk_overlap:
                        overlap_lines.insert(0, prev_line)
                        overlap_tokens += prev_tokens
                    else:
                        break

                current_chunk_lines = overlap_lines + [line]
                current_tokens = overlap_tokens + line_tokens
            else:
                current_chunk_lines.append(line)
                current_tokens += line_tokens

        if current_chunk_lines:
            full_text = header_prefix + "\n".join(current_chunk_lines)
            chunks_text.append(full_text)

        total_chunks = len(chunks_text)
        result: List[PortfolioChunk] = []
        for idx, text in enumerate(chunks_text):
            chunk_id = f"{doc_id}_c{idx}"
            chunk = PortfolioChunk(
                chunk_id=chunk_id,
                text=text,
                metadata={
                    **doc_meta,
                    "chunk_id": chunk_id,
                    "chunk_index": idx,
                    "total_chunks": total_chunks,
                    "token_count": self._approx_tokens(text),
                },
            )
            result.append(chunk)

        return result

    def split_documents(self, documents: List[Document]) -> List[PortfolioChunk]:
        """Split multiple documents and return flattened list of PortfolioChunk."""
        chunks: List[PortfolioChunk] = []
        for doc in documents:
            chunks.extend(self.split_document(doc))
        return chunks
