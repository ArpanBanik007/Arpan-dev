"""
JD Comparator Service.
Compares structured JD requirements against verified information in portfolio.json.
Determines matched, partially_matched, not_mentioned, and not_matched requirements.
Stage 4 of Arpan AI Portfolio RAG.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Set, Tuple
from app.core.config import settings
from app.schemas.jd_schema import ParsedJD, SkillMatchItem


def _normalize(text: str) -> str:
    """Normalize skill string for case-insensitive and punctuation-free matching."""
    s = text.lower().strip()
    # Normalize variants like React.js -> react, Node.js -> node
    s = re.sub(r"\.js\b", "", s)
    s = re.sub(r"[^\w\s]", "", s)
    return s.strip()


class JDComparator:
    """Compares JD requirements against verified portfolio knowledge base."""

    def __init__(self, portfolio_path: Path = settings.PORTFOLIO_JSON_PATH):
        self.portfolio_path = portfolio_path
        self._load_portfolio()

    def _load_portfolio(self):
        with open(self.portfolio_path, "r", encoding="utf-8") as f:
            self.data = json.load(f)

        # Build fast lookup indexes of all verified skills
        self.explicit_skills: Dict[str, str] = {}  # normalized -> original + category
        for cat, skills in self.data.get("technical_skills", {}).items():
            cat_name = cat.replace("_", " ").title()
            for s in skills:
                self.explicit_skills[_normalize(s)] = f"Verified in Technical Skills ({cat_name})"
                # Also index individual tokens for multi-word skills
                norm = _normalize(s)
                if norm not in self.explicit_skills:
                    self.explicit_skills[norm] = f"Verified in Technical Skills ({cat_name})"

        # Build project tech stack lookup
        self.project_skills: Dict[str, str] = {}
        for proj in self.data.get("projects", []):
            pname = proj.get("name", "Project")
            for t in proj.get("tech_stack", []):
                norm = _normalize(t)
                if norm not in self.project_skills:
                    self.project_skills[norm] = f"Used in project '{pname}'"

        # Education overview
        self.education = self.data.get("education", [])
        # Summary & strengths
        self.strengths = self.data.get("engineering_strengths", [])

    def compare_skill(self, skill: str) -> SkillMatchItem:
        """
        Evaluate an individual skill against verified portfolio data.
        Returns SkillMatchItem with status: 'matched', 'partially_matched', or 'not_mentioned'.
        """
        norm_skill = _normalize(skill)

        # 1. Exact match in explicit technical skills
        if norm_skill in self.explicit_skills:
            return SkillMatchItem(
                skill=skill,
                evidence=self.explicit_skills[norm_skill],
                status="matched",
            )

        # 2. Check for word boundary or substantive match in explicit skills
        for exp_norm, evidence in self.explicit_skills.items():
            if not exp_norm or not norm_skill:
                continue
            if len(exp_norm) <= 2:
                # For short tokens like "C", only match exact word or explicitly named language
                if norm_skill == exp_norm or norm_skill in [f"{exp_norm} language", f"{exp_norm} programming"]:
                    return SkillMatchItem(skill=skill, evidence=evidence, status="matched")
            else:
                if re.search(r"\b" + re.escape(exp_norm) + r"\b", norm_skill) or re.search(r"\b" + re.escape(norm_skill) + r"\b", exp_norm):
                    return SkillMatchItem(
                        skill=skill,
                        evidence=evidence,
                        status="matched",
                    )

        # 3. Match in project tech stacks
        if norm_skill in self.project_skills:
            return SkillMatchItem(
                skill=skill,
                evidence=self.project_skills[norm_skill],
                status="matched",
            )

        for proj_norm, evidence in self.project_skills.items():
            if not proj_norm or not norm_skill:
                continue
            if len(proj_norm) <= 2:
                if norm_skill == proj_norm:
                    return SkillMatchItem(skill=skill, evidence=evidence, status="matched")
            else:
                if re.search(r"\b" + re.escape(proj_norm) + r"\b", norm_skill) or re.search(r"\b" + re.escape(norm_skill) + r"\b", proj_norm):
                    return SkillMatchItem(
                        skill=skill,
                        evidence=evidence,
                        status="matched",
                    )

        # 4. Partial / related domain match
        related_matches = {
            "sql": ("mysql", "Experience with relational databases including MySQL in portfolio"),
            "nosql": ("mongodb", "Extensive experience with NoSQL database MongoDB"),
            "relational": ("mysql", "Experience with relational database MySQL"),
            "cloud": ("vercel", "Experience with cloud deployment on Vercel and CI/CD"),
            "docker": ("vercel", "Experience with deployment and environment management"),
            "aws": ("vercel", "Experience with modern cloud platforms (Vercel) and REST API hosting"),
            "testing": ("postman", "API testing experience using Postman and Pytest"),
            "devops": ("git", "Experience with Git, GitHub, and CI/CD Workflows"),
            "rag": ("rag", "Verified engineering strength in RAG and Vector Retrieval"),
            "llm": ("groq", "Hands-on experience with Groq API, LangGraph, and LLM applications"),
            "agent": ("langgraph", "Experience building stateful agents with LangGraph"),
        }

        for keyword, (alt_skill, rel_evidence) in related_matches.items():
            if keyword in norm_skill:
                return SkillMatchItem(
                    skill=skill,
                    evidence=rel_evidence,
                    status="partially_matched",
                )

        # 5. Missing / not mentioned (NEVER call this not_matched per rules)
        return SkillMatchItem(
            skill=skill,
            evidence="Not explicitly mentioned in Arpan's verified portfolio",
            status="not_mentioned",
        )

    def evaluate_education(self, requirements: List[str]) -> Dict[str, Any]:
        """Compare JD education requirements against Arpan's academic profile."""
        if not requirements:
            return {
                "status": "matched",
                "evidence": "Arpan is pursuing B.Tech in ECE (2027) with 7.05 CGPA and holds an EE Diploma (75%).",
                "score_factor": 1.0,
            }

        req_text = " ".join(requirements).lower()
        # Check if degree matches engineering, tech, or CS
        degree_keywords = ["b.tech", "btech", "b.e", "be", "bachelor", "engineering", "degree", "diploma", "computer", "electronics"]
        if any(k in req_text for k in degree_keywords):
            return {
                "status": "matched",
                "evidence": "Meets education requirement: Pursuing B.Tech in Electronics & Communication Engineering (SVIST) and holds Diploma in Electrical Engineering (75%).",
                "score_factor": 1.0,
            }
        elif "master" in req_text or "phd" in req_text:
            return {
                "status": "partially_matched",
                "evidence": "Currently an undergraduate B.Tech student; does not hold a Master's or PhD degree.",
                "score_factor": 0.5,
            }
        else:
            return {
                "status": "matched",
                "evidence": "Arpan holds formal technical credentials in Engineering and Web Development.",
                "score_factor": 1.0,
            }

    def evaluate_experience(self, requirements: List[str], job_title: str) -> Dict[str, Any]:
        """Compare JD experience requirements against Arpan's background."""
        title_lower = job_title.lower()
        req_text = " ".join(requirements).lower()

        is_junior_or_intern = any(w in title_lower or w in req_text for w in ["junior", "entry", "fresher", "intern", "associate", "0-", "1-", "2 years", "1 year"])
        is_senior = any(w in title_lower or w in req_text for w in ["senior", "lead", "staff", "principal", "5+", "7+", "8+"])

        if is_junior_or_intern:
            return {
                "status": "matched",
                "evidence": "Strong match for junior/entry-level/intern role: 2 live deployed full-stack platforms (Near It, Pluto), 3 AI repositories, 150+ REST APIs.",
                "score_factor": 1.0,
            }
        elif is_senior:
            return {
                "status": "partially_matched",
                "evidence": "Strong technical portfolio with architecture, but currently pursuing B.Tech (2027); partial match for senior-level years of experience.",
                "score_factor": 0.5,
            }
        else:
            return {
                "status": "matched",
                "evidence": "Demonstrated practical experience building production-grade web applications and RAG systems.",
                "score_factor": 0.85,
            }


comparator = JDComparator()
