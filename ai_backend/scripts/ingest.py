"""
Portfolio Ingestion and Indexing Script
Executes the full pipeline:
1. Validates portfolio.json knowledge base
2. Extracts structured documents
3. Splits documents into semantically meaningful chunks
4. Generates dense embeddings using sentence-transformers/all-MiniLM-L6-v2
5. Upserts vectors into ChromaDB portfolio_collection
Phase 5 of Arpan AI Portfolio RAG.
"""

import sys
import time
from pathlib import Path

# Add project root to path
backend_root = Path(__file__).resolve().parents[1]
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.core.config import settings
from app.services.document_loader import DocumentLoader
from app.services.text_splitter import PortfolioTextSplitter
from app.services.embedding_service import embedding_service
from app.services.vector_store import ChromaVectorStore
from scripts.validate_data import validate_portfolio_data


def run_ingestion(reset: bool = True) -> int:
    """Run end-to-end ingestion pipeline."""
    start_time = time.time()
    portfolio_path = settings.PORTFOLIO_JSON_PATH

    print("\n" + "=" * 50)
    print("  ARPAN BOT: PORTFOLIO KNOWLEDGE BASE INGESTION")
    print("=" * 50)
    print(f"Knowledge Base Source: {portfolio_path}")
    print(f"ChromaDB Storage:      {settings.CHROMA_PERSIST_DIRECTORY}")
    print(f"Collection Name:       {settings.CHROMA_COLLECTION_NAME}")
    print(f"Embedding Model:       {settings.EMBEDDING_MODEL_NAME}")
    print("=" * 50)

    # Step 1: Validate data
    print("\n[Step 1/5] Validating portfolio.json integrity...")
    summary = validate_portfolio_data(portfolio_path)
    print(f"  ✓ Validation passed for: {summary['candidate_name']}")
    print(f"  ✓ Verified {summary['skill_categories']} skill categories ({summary['total_explicit_skills']} explicit skills)")
    print(f"  ✓ Verified {summary['projects_count']} projects ({summary['unique_project_techs']} project technologies)")

    # Step 2: Load documents
    print("\n[Step 2/5] Loading structured documents from portfolio.json...")
    documents = DocumentLoader.load_portfolio_json(portfolio_path)
    print(f"  ✓ Extracted {len(documents)} discrete documents with metadata.")

    # Step 3: Chunk documents
    print("\n[Step 3/5] Chunking documents (size ~400 tokens, overlap ~60 tokens)...")
    splitter = PortfolioTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
    )
    chunks = splitter.split_documents(documents)
    print(f"  ✓ Generated {len(chunks)} chunks ready for vectorization.")

    # Step 4: Generate Embeddings
    print(f"\n[Step 4/5] Generating embeddings with {settings.EMBEDDING_MODEL_NAME}...")
    texts = [c.text for c in chunks]
    embeddings = embedding_service.embed_documents(texts)
    print(f"  ✓ Generated {len(embeddings)} normalized 384-dimensional embeddings.")

    # Step 5: Upsert into ChromaDB
    print("\n[Step 5/5] Indexing vectors into ChromaDB portfolio_collection...")
    vector_store = ChromaVectorStore()
    if reset:
        print("  - Resetting existing collection for clean deterministic rebuild...")
        vector_store.reset_collection()

    total_indexed = vector_store.upsert_chunks(chunks, embeddings)
    status = vector_store.get_status()
    elapsed = time.time() - start_time

    print(f"  ✓ Successfully indexed {total_indexed} chunks.")
    print(f"  ✓ ChromaDB Collection Count: {status['document_count']}")
    print(f"  ✓ Total Ingestion Time: {elapsed:.2f} seconds")
    print("=" * 50)
    print("  INGESTION COMPLETE & VERIFIED")
    print("=" * 50 + "\n")

    return total_indexed


if __name__ == "__main__":
    run_ingestion(reset=True)
