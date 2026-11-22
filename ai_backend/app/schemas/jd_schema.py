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


class RequirementEvaluation(BaseModel):
    """Detailed evaluation for an individual JD requirement."""
    requirement: str
    status: str = Field(..., description="MATCHED | PARTIALLY_MATCHED | NOT_MENTIONED | NOT_MATCHED")
    candidate_evidence: Optional[str] = None
    evidence_source: str = Field(default="None", description="Resume | Portfolio | Project | Education | Experience | None")
    reason: str


class CategoryScores(BaseModel):
    """Normalized category scores calculated programmatically."""
    required_skills: float = 0.0
    preferred_skills: float = 0.0
    education: float = 0.0
    experience: float = 0.0


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
    recommendation: str = Field(default="PARTIAL MATCH", description="STRONG MATCH | MODERATE MATCH | PARTIAL MATCH | LOW MATCH | INSUFFICIENT DATA")
    confidence: str = Field(default="HIGH", description="Confidence level based on verified candidate profile")
    summary: str
    category_scores: Optional[CategoryScores] = None
    matched_requirements: List[RequirementEvaluation] = Field(default_factory=list)
    partially_matched_requirements: List[RequirementEvaluation] = Field(default_factory=list)
    not_mentioned_requirements: List[RequirementEvaluation] = Field(default_factory=list)
    not_matched_requirements: List[RequirementEvaluation] = Field(default_factory=list)
    critical_gaps: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    evidence_quality: List[str] = Field(default_factory=list)
    limitations: List[str] = Field(default_factory=list)
    final_assessment: str = Field(default="", description="Honest and evidence-based assessment")
    
    # Legacy fields preserved for frontend backward compatibility
    matched_skills: List[SkillMatchItem] = Field(default_factory=list)
    partially_matched_skills: List[SkillMatchItem] = Field(default_factory=list)
    not_mentioned_skills: List[str] = Field(default_factory=list)
    education_match: Dict[str, Any] = Field(default_factory=dict)
    experience_match: Dict[str, Any] = Field(default_factory=dict)
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
