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
    RequirementEvaluation,
    CategoryScores,
    ScoringBreakdown,
    JDAnalysisResponse,
)
from app.services.jd_comparator import comparator


class ScoringService:
    """
    Computes explainable, evidence-grounded match scores out of 100
    using the Strict Evidence-Based Job Description Matching Engine rules.
    Base Weights:
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
        """Run full programmatic comparison, scoring, and analysis according to strict rules."""
        
        # Determine applicable categories for proportional weight redistribution
        has_req = len(parsed_jd.required_skills) > 0
        has_pref = len(parsed_jd.preferred_skills) > 0
        has_edu = len(parsed_jd.education_requirements) > 0
        has_exp = len(parsed_jd.experience_requirements) > 0 or bool(parsed_jd.job_title)

        raw_weights = {
            "required": self.w_required if has_req else 0.0,
            "preferred": self.w_preferred if has_pref else 0.0,
            "education": self.w_education if has_edu else 0.0,
            "experience": self.w_experience if has_exp else 0.0,
        }
        total_active_weight = sum(raw_weights.values())

        if total_active_weight > 0:
            effective_weights = {
                k: (v / total_active_weight) * 100.0 for k, v in raw_weights.items()
            }
        else:
            effective_weights = {
                "required": 60.0,
                "preferred": 15.0,
                "education": 10.0,
                "experience": 15.0,
            }

        matched_reqs: List[RequirementEvaluation] = []
        partially_matched_reqs: List[RequirementEvaluation] = []
        not_mentioned_reqs: List[RequirementEvaluation] = []
        not_matched_reqs: List[RequirementEvaluation] = []

        # Legacy structures
        matched_skills: List[SkillMatchItem] = []
        partially_matched_skills: List[SkillMatchItem] = []
        not_mentioned_skills: List[str] = []

        # 1. Required Skills Evaluation
        req_points = 0.0
        req_count = len(parsed_jd.required_skills)
        critical_gaps: List[str] = []

        for skill in parsed_jd.required_skills:
            item = comparator.compare_skill(skill)
            source = "Project" if "project" in item.evidence.lower() else ("Portfolio" if item.status != "not_mentioned" else "None")

            if item.status == "matched":
                matched_skills.append(item)
                req_points += 1.0
                matched_reqs.append(
                    RequirementEvaluation(
                        requirement=f"Required Skill: {skill}",
                        status="MATCHED",
                        candidate_evidence=item.evidence,
                        evidence_source=source,
                        reason=f"Explicit evidence confirmed in {source.lower()}."
                    )
                )
            elif item.status == "partially_matched":
                partially_matched_skills.append(item)
                req_points += 0.5
                partially_matched_reqs.append(
                    RequirementEvaluation(
                        requirement=f"Required Skill: {skill}",
                        status="PARTIALLY_MATCHED",
                        candidate_evidence=item.evidence,
                        evidence_source=source,
                        reason="Relevant foundational or related technology demonstrated, but exact required proficiency not fully established."
                    )
                )
                critical_gaps.append(f"Required skill '{skill}' only partially demonstrated ({item.evidence}).")
            else:
                not_mentioned_skills.append(skill)
                not_mentioned_reqs.append(
                    RequirementEvaluation(
                        requirement=f"Required Skill: {skill}",
                        status="NOT_MENTIONED",
                        candidate_evidence=None,
                        evidence_source="None",
                        reason="Candidate profile does not provide sufficient evidence for this requirement."
                    )
                )
                critical_gaps.append(f"Mandatory skill '{skill}' is not mentioned in verified portfolio.")

        score_required = (req_points / req_count * effective_weights["required"]) if req_count > 0 else (effective_weights["required"] * 0.8)

        # 2. Preferred Skills Evaluation
        pref_points = 0.0
        pref_count = len(parsed_jd.preferred_skills)

        for skill in parsed_jd.preferred_skills:
            item = comparator.compare_skill(skill)
            source = "Project" if "project" in item.evidence.lower() else ("Portfolio" if item.status != "not_mentioned" else "None")

            if item.status == "matched":
                matched_skills.append(item)
                pref_points += 1.0
                matched_reqs.append(
                    RequirementEvaluation(
                        requirement=f"Preferred Skill: {skill}",
                        status="MATCHED",
                        candidate_evidence=item.evidence,
                        evidence_source=source,
                        reason=f"Explicit evidence confirmed in {source.lower()}."
                    )
                )
            elif item.status == "partially_matched":
                partially_matched_skills.append(item)
                pref_points += 0.5
                partially_matched_reqs.append(
                    RequirementEvaluation(
                        requirement=f"Preferred Skill: {skill}",
                        status="PARTIALLY_MATCHED",
                        candidate_evidence=item.evidence,
                        evidence_source=source,
                        reason="Related background present."
                    )
                )
            else:
                if skill not in not_mentioned_skills:
                    not_mentioned_skills.append(skill)
                not_mentioned_reqs.append(
                    RequirementEvaluation(
                        requirement=f"Preferred Skill: {skill}",
                        status="NOT_MENTIONED",
                        candidate_evidence=None,
                        evidence_source="None",
                        reason="Candidate profile does not provide sufficient evidence for this requirement."
                    )
                )

        score_preferred = (pref_points / pref_count * effective_weights["preferred"]) if pref_count > 0 else effective_weights["preferred"]

        # 3. Education Match
        edu_result = comparator.evaluate_education(parsed_jd.education_requirements)
        score_education = edu_result["score_factor"] * effective_weights["education"]
        if edu_result["status"] == "matched":
            matched_reqs.append(
                RequirementEvaluation(
                    requirement="Education Criteria",
                    status="MATCHED",
                    candidate_evidence=edu_result["evidence"],
                    evidence_source="Education",
                    reason="Candidate meets academic requirements with engineering degree/diploma."
                )
            )
        else:
            partially_matched_reqs.append(
                RequirementEvaluation(
                    requirement="Education Criteria",
                    status="PARTIALLY_MATCHED",
                    candidate_evidence=edu_result["evidence"],
                    evidence_source="Education",
                    reason="Academic credentials partially satisfy requirements."
                )
            )

        # 4. Experience Match
        exp_result = comparator.evaluate_experience(
            parsed_jd.experience_requirements, parsed_jd.job_title
        )
        score_experience = exp_result["score_factor"] * effective_weights["experience"]
        if exp_result["status"] == "matched":
            matched_reqs.append(
                RequirementEvaluation(
                    requirement="Experience Criteria",
                    status="MATCHED",
                    candidate_evidence=exp_result["evidence"],
                    evidence_source="Experience",
                    reason="Demonstrated experience aligns with target role level."
                )
            )
        elif exp_result["status"] == "partially_matched":
            partially_matched_reqs.append(
                RequirementEvaluation(
                    requirement="Experience Criteria",
                    status="PARTIALLY_MATCHED",
                    candidate_evidence=exp_result["evidence"],
                    evidence_source="Experience",
                    reason="Candidate has extensive project/architecture implementation, but full-time corporate years of experience are not established."
                )
            )
            critical_gaps.append("Professional full-time experience duration not established (personal/deployed platform projects only).")
        else:
            not_mentioned_reqs.append(
                RequirementEvaluation(
                    requirement="Experience Criteria",
                    status="NOT_MENTIONED",
                    candidate_evidence=None,
                    evidence_source="None",
                    reason="Candidate profile does not provide sufficient evidence for this requirement."
                )
            )

        # 5. Programmatic Score Calculation
        total_score_float = score_required + score_preferred + score_education + score_experience
        match_score = int(round(max(0.0, min(100.0, total_score_float))))

        # 6. Recommendation determination
        if not has_req and not has_edu and not has_exp:
            recommendation = "INSUFFICIENT DATA"
        elif match_score >= 80 and not any(r.status == "NOT_MATCHED" for r in matched_reqs + partially_matched_reqs):
            recommendation = "STRONG MATCH"
        elif match_score >= 60:
            recommendation = "MODERATE MATCH"
        elif match_score >= 40:
            recommendation = "PARTIAL MATCH"
        else:
            recommendation = "LOW MATCH"

        # 7. Strengths, Evidence Quality & Limitations
        strengths = []
        for s in matched_skills[:5]:
            strengths.append(f"Verified {s.skill}: {s.evidence}")
        if not strengths:
            strengths.append("Demonstrated foundational full-stack web and API engineering capabilities.")

        skill_gaps = []
        for nm in not_mentioned_skills:
            skill_gaps.append(f"{nm}: Candidate profile does not provide sufficient evidence for this requirement.")

        recommendations = []
        if not_mentioned_skills:
            rec_techs = ", ".join(not_mentioned_skills[:3])
            recommendations.append(
                f"Candidate should consider providing direct project evidence for {rec_techs}."
            )
        recommendations.append(
            "Emphasize verified production-grade platform deployments (Near It, Pluto) and 150+ architected REST endpoints."
        )

        evidence_quality = [
            "Skills backed by live full-stack deployed platforms (Near It on Vercel, Pluto on Vercel).",
            "Undergraduate B.Tech degree in progress (graduating 2027); completed Electrical Engineering Diploma (75%).",
            "Explicit technical skills verified in portfolio data; self-reported skills without projects are distinguished."
        ]

        limitations = [
            "Candidate is currently an undergraduate student (ECE B.Tech 2027); corporate full-time tenure is not documented.",
            "Technologies not explicitly listed in portfolio.json are treated strictly as unverified."
        ]

        summary_text = (
            f"{recommendation} ({match_score}/100) for '{parsed_jd.job_title}'. "
            f"Evaluated with strict evidence-based matching engine without score inflation. "
            f"{len(matched_skills)} skills matched with explicit evidence, {len(partially_matched_skills)} partially matched, "
            f"and {len(not_mentioned_skills)} skills not documented in verified portfolio."
        )

        final_assessment = (
            f"Candidate profile demonstrates {recommendation.lower()} compatibility for the position of {parsed_jd.job_title}. "
            "Evaluation adheres strictly to verified candidate portfolio evidence. Absence of evidence is not penalized as confirmed failure, "
            "nor is related familiarity treated as full production expertise."
        )

        breakdown = ScoringBreakdown(
            required_skills=round(score_required, 1),
            preferred_skills=round(score_preferred, 1),
            education=round(score_education, 1),
            experience=round(score_experience, 1),
            methodology=(
                f"Weighted Programmatic Model: Required Skills {effective_weights['required']:.1f}%, "
                f"Preferred Skills {effective_weights['preferred']:.1f}%, Education {effective_weights['education']:.1f}%, "
                f"Experience {effective_weights['experience']:.1f}%. Partial credit 50%, missing 0% without penalty."
            )
        )

        cat_scores = CategoryScores(
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
            recommendation=recommendation,
            confidence="HIGH",
            summary=summary_text,
            category_scores=cat_scores,
            matched_requirements=matched_reqs,
            partially_matched_requirements=partially_matched_reqs,
            not_mentioned_requirements=not_mentioned_reqs,
            not_matched_requirements=not_matched_reqs,
            critical_gaps=critical_gaps,
            strengths=strengths,
            evidence_quality=evidence_quality,
            limitations=limitations,
            final_assessment=final_assessment,
            matched_skills=matched_skills,
            partially_matched_skills=partially_matched_skills,
            not_mentioned_skills=not_mentioned_skills,
            education_match=edu_result,
            experience_match=exp_result,
            skill_gaps=skill_gaps,
            recommendations=recommendations,
            scoring_breakdown=breakdown,
        )


scoring_service = ScoringService()
