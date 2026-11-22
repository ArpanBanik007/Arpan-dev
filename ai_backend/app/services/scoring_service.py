"""
Scoring and Analysis Service.
Programmatically computes transparent match score out of 100
based on validated comparison results against portfolio.json.
Stage 4 of Arpan AI Portfolio RAG.
"""

from typing import Any, Dict, List, Tuple
from app.schemas.jd_schema import (
    ParsedJD,
    SkillMatchItem,
    ScoringBreakdown,
    JDAnalysisResponse,
)
from app.services.jd_comparator import comparator


class ScoringService:
    """
    Computes explainable, evidence-grounded match scores out of 100.
    Configurable weights:
      - Required Skills: 60%
      - Preferred Skills: 15%
      - Education: 10%
      - Experience: 15%
    """

    def __init__(
        self,
        weight_required: float = 60.0,
        weight_preferred: float = 15.0,
        weight_education: float = 10.0,
        weight_experience: float = 15.0,
    ):
        self.w_required = weight_required
        self.w_preferred = weight_preferred
        self.w_education = weight_education
        self.w_experience = weight_experience

    def analyze(self, session_id: str, parsed_jd: ParsedJD) -> JDAnalysisResponse:
        """Run full programmatic comparison, scoring, and analysis."""
        
        # 1. Compare Required Skills
        matched_skills: List[SkillMatchItem] = []
        partially_matched_skills: List[SkillMatchItem] = []
        not_mentioned_skills: List[str] = []

        req_points = 0.0
        req_count = len(parsed_jd.required_skills)

        for skill in parsed_jd.required_skills:
            item = comparator.compare_skill(skill)
            if item.status == "matched":
                matched_skills.append(item)
                req_points += 1.0
            elif item.status == "partially_matched":
                partially_matched_skills.append(item)
                req_points += 0.5  # 50% partial credit
            else:
                not_mentioned_skills.append(skill)
                # 0 credit

        # Calculate required score out of 60
        if req_count > 0:
            score_required = (req_points / req_count) * self.w_required
        else:
            # If JD specified no required skills, award default baseline
            score_required = self.w_required * 0.8

        # 2. Compare Preferred Skills
        pref_points = 0.0
        pref_count = len(parsed_jd.preferred_skills)

        for skill in parsed_jd.preferred_skills:
            item = comparator.compare_skill(skill)
            if item.status == "matched":
                matched_skills.append(item)
                pref_points += 1.0
            elif item.status == "partially_matched":
                partially_matched_skills.append(item)
                pref_points += 0.5
            else:
                if skill not in not_mentioned_skills:
                    not_mentioned_skills.append(skill)

        # Calculate preferred score out of 15
        if pref_count > 0:
            score_preferred = (pref_points / pref_count) * self.w_preferred
        else:
            # If no preferred skills, award full weight
            score_preferred = self.w_preferred

        # 3. Education Match (out of 10)
        edu_result = comparator.evaluate_education(parsed_jd.education_requirements)
        score_education = edu_result["score_factor"] * self.w_education

        # 4. Experience Match (out of 15)
        exp_result = comparator.evaluate_experience(
            parsed_jd.experience_requirements, parsed_jd.job_title
        )
        score_experience = exp_result["score_factor"] * self.w_experience

        # 5. Total Score
        total_score_float = score_required + score_preferred + score_education + score_experience
        match_score = int(round(max(0.0, min(100.0, total_score_float))))

        # 6. Generate Strengths, Skill Gaps, and Recommendations
        strengths = []
        for s in matched_skills[:5]:
            strengths.append(f"Strong match for {s.skill}: {s.evidence}")
        if not strengths:
            strengths.append("Foundational software engineering and full-stack capabilities.")

        skill_gaps = []
        for nm in not_mentioned_skills:
            skill_gaps.append(f"{nm}: Not explicitly documented in Arpan's verified portfolio.")

        recommendations = []
        if not_mentioned_skills:
            rec_techs = ", ".join(not_mentioned_skills[:3])
            recommendations.append(
                f"Consider highlighting or exploring {rec_techs} to broaden alignment with this specific role."
            )
        recommendations.append(
            "Emphasize Arpan's live deployed platforms (Near It and Pluto) and 150+ architected REST APIs."
        )

        # Summary text
        if match_score >= 80:
            summary_text = (
                f"Excellent match ({match_score}/100) for {parsed_jd.job_title}. "
                "Arpan's verified skills, project implementations, and architectural background "
                "closely align with the core job requirements."
            )
        elif match_score >= 60:
            summary_text = (
                f"Good match ({match_score}/100) for {parsed_jd.job_title}. "
                "Arpan demonstrates strong foundational coverage of primary technical requirements, "
                "with a few secondary technologies not explicitly listed."
            )
        else:
            summary_text = (
                f"Moderate match ({match_score}/100) for {parsed_jd.job_title}. "
                "Arpan matches several core technologies, but several required tools or senior criteria "
                "are outside the verified portfolio profile."
            )

        breakdown = ScoringBreakdown(
            required_skills=round(score_required, 1),
            preferred_skills=round(score_preferred, 1),
            education=round(score_education, 1),
            experience=round(score_experience, 1),
        )

        return JDAnalysisResponse(
            session_id=session_id,
            job_title=parsed_jd.job_title,
            match_score=match_score,
            score_out_of=100,
            summary=summary_text,
            matched_skills=matched_skills,
            partially_matched_skills=partially_matched_skills,
            not_mentioned_skills=not_mentioned_skills,
            not_matched_requirements=[],
            education_match=edu_result,
            experience_match=exp_result,
            strengths=strengths,
            skill_gaps=skill_gaps,
            recommendations=recommendations,
            scoring_breakdown=breakdown,
        )


scoring_service = ScoringService()
