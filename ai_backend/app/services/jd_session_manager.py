"""
Session Manager for JD Uploads.
Maintains isolated, temporary session data with unique UUIDs and TTL expiry.
Ensures uploaded recruiter data is never mixed with the portfolio vector store.
Stage 4 of Arpan AI Portfolio RAG.
"""

import time
import uuid
import threading
from typing import Any, Dict, Optional


class JDSessionManager:
    """In-memory session store with thread-safe access and timestamp expiry."""

    def __init__(self, ttl_seconds: int = 3600):
        self.ttl_seconds = ttl_seconds
        self._sessions: Dict[str, Dict[str, Any]] = {}
        self._lock = threading.Lock()

    def create_session(
        self,
        filename: str,
        file_type: str,
        raw_text: str,
        file_size_bytes: int = 0,
    ) -> str:
        """Create a new isolated session and store extracted text."""
        session_id = str(uuid.uuid4())
        now = time.time()
        
        with self._lock:
            # Clean up old sessions opportunistically
            self._cleanup_expired_unlocked(now)
            self._sessions[session_id] = {
                "session_id": session_id,
                "filename": filename,
                "file_type": file_type,
                "file_size_bytes": file_size_bytes,
                "raw_text": raw_text,
                "created_at": now,
                "last_accessed": now,
            }
        return session_id

    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve session data by session_id if not expired."""
        with self._lock:
            session = self._sessions.get(session_id)
            if not session:
                return None
            
            now = time.time()
            if now - session["created_at"] >= self.ttl_seconds:
                del self._sessions[session_id]
                return None
            
            session["last_accessed"] = now
            return session

    def delete_session(self, session_id: str) -> bool:
        """Explicitly delete session data when requested."""
        with self._lock:
            if session_id in self._sessions:
                del self._sessions[session_id]
                return True
            return False

    def _cleanup_expired_unlocked(self, current_time: float) -> int:
        """Remove sessions exceeding TTL (caller must hold self._lock)."""
        expired = [
            sid for sid, data in self._sessions.items()
            if current_time - data["created_at"] > self.ttl_seconds
        ]
        for sid in expired:
            del self._sessions[sid]
        return len(expired)

    def count(self) -> int:
        """Return active session count."""
        with self._lock:
            return len(self._sessions)


# Global session manager instance
jd_session_manager = JDSessionManager(ttl_seconds=3600)
