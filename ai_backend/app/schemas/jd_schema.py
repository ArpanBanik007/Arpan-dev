"""
Pydantic Schemas for Job Description (JD) Parsing, Comparison, and Scoring.
Stage 4 of Arpan AI Portfolio RAG.
"""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ParsedJD(BaseModel):
    """Structured extraction from raw JD text, validated through Pydantic."""
    job_title: str = Field(default="Software Engineer", description="Extracted job title")
    required_skills: List[str] = Field(default_factory=list, description="Mandatory technical skills")
    preferred_skills: List[str] = Field(default_factory=list, description="Nice-to-have or preferred skills")
    experience_requirements: List[str] = Field(default_factory=list, description="Years or domain experience")
    education_requirements: List[str] = Field(default_factory=list, description="Degree or academic requirements")
    responsibilities: List[str] = Field(default_factory=list, description="Primary job duties")


class SkillMatchItem(BaseModel):
    """Detailed match status and evidence for an individual requirement."""
    skill: str
    evidence: str
    status: str = Field(
        ...,
        description="'matched', 'partially_matched', 'not_mentioned', or 'not_matched'"
    )


class ScoringBreakdown(BaseModel):
    """Detailed breakdown explaining how the match score out of 100 was computed."""
    required_skills: float = Field(..., description="Points earned for required skills (max 60)")
    preferred_skills: float = Field(..., description="Points earned for preferred skills (max 15)")
    education: float = Field(..., description="Points earned for education criteria (max 10)")
    experience: float = Field(..., description="Points earned for experience criteria (max 15)")
    methodology: str = Field(
        default="Weighted: Required Skills 60%, Preferred Skills 15%, Education 10%, Experience 15%. "
                "Partial matches receive 50% credit. Missing requirements receive 0% credit without penalty.",
        description="Explanation of formula"
    )


class JDAnalysisResponse(BaseModel):
    """Complete structured response returned to recruiters."""
    session_id: str
    job_title: str
    match_score: int = Field(..., ge=0, le=100, description="Overall match score out of 100")
    score_out_of: int = Field(default=100)
    summary: str
    matched_skills: List[SkillMatchItem] = Field(default_factory=list)
    partially_matched_skills: List[SkillMatchItem] = Field(default_factory=list)
    not_mentioned_skills: List[str] = Field(default_factory=list)
    not_matched_requirements: List[str] = Field(default_factory=list)
    education_match: Dict[str, Any] = Field(default_factory=dict)
    experience_match: Dict[str, Any] = Field(default_factory=dict)
    strengths: List[str] = Field(default_factory=list)
    skill_gaps: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)
    scoring_breakdown: ScoringBreakdown


class JDUploadResponse(BaseModel):
    """Response returned after successful file upload and text extraction."""
    session_id: str
    filename: str
    file_type: str
    file_size_bytes: int
    extracted_characters: int
    message: str


class JDAnalyzeRequest(BaseModel):
    """Request payload to initiate analysis."""
    session_id: Optional[str] = Field(default=None, description="Session ID from /api/v1/jd/upload")
    jd_text: Optional[str] = Field(default=None, description="Or direct raw JD text if pasted")
