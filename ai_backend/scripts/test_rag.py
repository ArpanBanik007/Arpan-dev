"""Quick RAG pipeline test script for Stage 2 validation."""
import sys
sys.path.insert(0, "ai_backend")

from app.services.rag_service import rag_service

test_questions = [
    "What are Arpan's technical skills?",
    "Tell me about the Pluto project.",
    "What is the capital of France?",
    "2 + 3 = ?",
    "Does Arpan know AWS?",
    "What is Arpan's education background?",
    "Who is Arpan Banik?",
]

for question in test_questions:
    print(f"\n{'='*60}")
    print(f"Q: {question}")
    print("-" * 60)
    try:
        res = rag_service.answer(question)
        print(f"grounded: {res.grounded}")
        print(f"similarity: {res.similarity_score}")
        print(f"sources: {[s.section for s in res.sources]}")
        print(f"A: {res.answer[:300]}...")
    except Exception as e:
        print(f"ERROR: {e}")
