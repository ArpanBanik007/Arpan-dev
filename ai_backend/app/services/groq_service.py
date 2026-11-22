"""
Groq LLM Service
Handles all interactions with the Groq API for text generation.
Implements strict anti-hallucination safeguards at the API call level.
Stage 2 of Arpan AI Portfolio RAG.

Design decisions:
- Uses a synchronous Groq client (Groq's Python SDK supports both sync/async).
- Always passes the retrieved portfolio context in the user message rather
  than trusting the system prompt alone.
- Validates that GROQ_API_KEY is present before attempting any call.
"""

import time
from typing import List, Optional
from groq import Groq
from groq import APIError, APIConnectionError, RateLimitError, APITimeoutError
from app.core.config import settings
from app.core.prompts import PORTFOLIO_SYSTEM_PROMPT


class GroqService:
    """
    Wrapper around the Groq Python SDK.
    Singleton per process — the client is stateless so a single instance is safe.
    """

    _instance: Optional["GroqService"] = None
    _client: Optional[Groq] = None

    def __new__(cls) -> "GroqService":
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        # Only initialise the client once.
        if self._client is None:
            if not settings.GROQ_API_KEY:
                raise RuntimeError(
                    "GROQ_API_KEY is not set. "
                    "Add it to ai_backend/.env before using the Groq service."
                )
            self._client = Groq(api_key=settings.GROQ_API_KEY)

    # ------------------------------------------------------------------
    # Core generation method
    # ------------------------------------------------------------------

    def generate_portfolio_answer(
        self,
        question: str,
        context: str,
        model: Optional[str] = None,
        max_tokens: int = 800,
        temperature: float = 0.1,   # Very low temperature for factual, grounded answers
    ) -> str:
        """
        Call Groq with the strict system prompt + retrieved portfolio context.

        The context is injected into the user turn so the LLM cannot ignore it.
        Temperature is kept very low (0.1) to minimise creative hallucination.

        Args:
            question:   The raw user question.
            context:    Retrieved and formatted portfolio chunks.
            model:      Groq model ID; defaults to settings.GROQ_MODEL.
            max_tokens: Maximum response length in tokens.
            temperature: Sampling temperature (0.0–1.0).

        Returns:
            The generated answer string.

        Raises:
            RuntimeError: On any Groq API error, with a human-readable message.
        """
        if not question.strip():
            raise ValueError("Question cannot be empty.")
        if not context.strip():
            raise ValueError("Context cannot be empty. Use safe fallback when no context.")

        active_model = model or settings.GROQ_MODEL

        # Build the user message with explicit context injection.
        # This is the key anti-hallucination technique beyond the system prompt:
        # the model SEES the retrieved evidence in the same message as the question.
        user_message = (
            f"RETRIEVED PORTFOLIO CONTEXT (use ONLY this information):\n"
            f"{'─' * 60}\n"
            f"{context}\n"
            f"{'─' * 60}\n\n"
            f"USER QUESTION: {question}"
        )

        max_retries = 2
        for attempt in range(max_retries + 1):
            try:
                response = self._client.chat.completions.create(
                    model=active_model,
                    messages=[
                        {"role": "system", "content": PORTFOLIO_SYSTEM_PROMPT},
                        {"role": "user", "content": user_message},
                    ],
                    max_tokens=max_tokens,
                    temperature=temperature,
                    # Stop sequences to prevent run-on answers.
                    stop=None,
                )
                answer = response.choices[0].message.content
                if not answer or not answer.strip():
                    return "I was unable to generate a response. Please try again."
                return answer.strip()

            except RateLimitError as e:
                if attempt < max_retries:
                    time.sleep(3)
                    continue
                raise RuntimeError(
                    f"Groq API rate limit reached. Please wait a moment and try again. Details: {e}"
                ) from e
            except APITimeoutError as e:
                raise RuntimeError(
                    f"Groq API request timed out. Please try again. Details: {e}"
                ) from e
            except APIConnectionError as e:
                raise RuntimeError(
                    f"Could not connect to Groq API. Check your network connection. Details: {e}"
                ) from e
            except APIError as e:
                raise RuntimeError(
                    f"Groq API error (status {e.status_code}): {e.message}"
                ) from e
            except Exception as e:
                raise RuntimeError(f"Unexpected error from Groq service: {e}") from e

    # ------------------------------------------------------------------
    # Token usage helper (optional — useful for observability)
    # ------------------------------------------------------------------

    def get_token_estimate(self, text: str) -> int:
        """Rough token count estimate (1 token ≈ 4 chars for English)."""
        return max(1, len(text) // 4)


# Global singleton instance — imported by rag_service.py
groq_service = GroqService()
