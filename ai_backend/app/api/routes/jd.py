"""
Job Description (JD) Upload, Analysis, and Session Management API Routes.
Exposes:
  - POST   /api/v1/jd/upload
  - POST   /api/v1/jd/analyze
  - DELETE /api/v1/jd/{session_id}
Stage 4 of Arpan AI Portfolio RAG.
"""

import logging
from typing import Optional
from fastapi import APIRouter, File, HTTPException, UploadFile, status
from app.schemas.jd_schema import (
    JDUploadResponse,
    JDAnalyzeRequest,
    JDAnalysisResponse,
)
from app.services.jd_parser import JDParser, ALLOWED_EXTENSIONS, MAX_FILE_SIZE_BYTES
from app.services.jd_session_manager import jd_session_manager
from app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/jd", tags=["Job Description Analyzer"])


@router.post(
    "/upload",
    response_model=JDUploadResponse,
    summary="Upload Job Description (PDF or DOCX)",
    description="Upload a recruiter job description file (PDF, DOCX, or TXT, max 5MB). Extracts text and stores it in an isolated temporary session.",
)
async def upload_jd(file: UploadFile = File(...)) -> JDUploadResponse:
    """Upload and extract text from a JD file."""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must have a valid filename.",
        )

    ext = "." + file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Supported formats: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    try:
        content = await file.read()
    except Exception as e:
        logger.error(f"Error reading uploaded file: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not read uploaded file: {str(e)}",
        )

    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)}MB.",
        )

    try:
        extracted_text = JDParser.extract_text(content, file.filename)
    except ValueError as e:
        logger.warning(f"Validation or extraction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(e),
        )
    except Exception as e:
        logger.error(f"Unexpected document extraction failure: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to extract text from document: {str(e)}",
        )

    session_id = jd_session_manager.create_session(
        filename=file.filename,
        file_type=ext,
        raw_text=extracted_text,
        file_size_bytes=len(content),
    )

    return JDUploadResponse(
        session_id=session_id,
        filename=file.filename,
        file_type=ext,
        file_size_bytes=len(content),
        extracted_characters=len(extracted_text),
        message="Job description uploaded and text extracted successfully.",
    )


@router.post(
    "/analyze",
    response_model=JDAnalysisResponse,
    summary="Analyze Job Description against Portfolio",
    description="Parses requirements from an uploaded session or direct JD text, compares with portfolio.json, and returns an explainable match score out of 100.",
)
async def analyze_jd(payload: JDAnalyzeRequest) -> JDAnalysisResponse:
    """Analyze job requirements against Arpan's verified portfolio."""
    raw_text: Optional[str] = None
    active_session_id: str = "direct_text"

    if payload.session_id:
        session = jd_session_manager.get_session(payload.session_id)
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Session '{payload.session_id}' not found or has expired. Please re-upload the document.",
            )
        raw_text = session["raw_text"]
        active_session_id = payload.session_id
    elif payload.jd_text and payload.jd_text.strip():
        raw_text = payload.jd_text.strip()
        active_session_id = "pasted_text"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Either a valid session_id or non-empty jd_text must be provided.",
        )

    if not raw_text or len(raw_text) < 30:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="The provided job description text is too short to analyze.",
        )

    try:
        # Step 1: LLM extracts requirements into validated ParsedJD
        parsed_jd = JDParser.parse_jd_with_llm(raw_text)

        # Step 2: Compare against portfolio.json and compute explainable score
        analysis = scoring_service.analyze(
            session_id=active_session_id,
            parsed_jd=parsed_jd,
        )
        return analysis

    except Exception as e:
        logger.error(f"Error during JD analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze job description: {str(e)}",
        )


@router.delete(
    "/{session_id}",
    summary="Delete JD Session Data",
    description="Permanently delete uploaded JD temporary data and session memory.",
)
async def delete_jd_session(session_id: str):
    """Explicitly delete session data."""
    deleted = jd_session_manager.delete_session(session_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Session '{session_id}' not found or already deleted.",
        )
    return {
        "deleted": True,
        "session_id": session_id,
        "message": "Session data deleted successfully.",
    }
