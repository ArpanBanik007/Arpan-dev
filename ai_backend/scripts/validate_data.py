"""
Portfolio Knowledge Base Validation Script
Validates structure, integrity, and completeness of portfolio.json.
Phase 1 of Arpan AI Portfolio RAG.
"""

import json
import sys
from pathlib import Path


def validate_portfolio_data(file_path: Path) -> dict:
    """Validate portfolio.json against expected schema and return summary statistics."""
    if not file_path.exists():
        raise FileNotFoundError(f"Portfolio file not found at: {file_path}")

    with open(file_path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON format in {file_path}: {e}")

    # 1. Required top-level sections
    required_sections = [
        "personal_info",
        "professional_summary",
        "education",
        "technical_skills",
        "engineering_strengths",
        "projects",
        "portfolio_metrics",
        "languages",
        "career_interests",
    ]

    missing_sections = [s for s in required_sections if s not in data]
    if missing_sections:
        raise ValueError(f"Missing required sections in portfolio.json: {missing_sections}")

    # 2. Validate personal_info
    p_info = data["personal_info"]
    required_p_fields = ["name", "headline", "current_role", "location", "contact"]
    for field in required_p_fields:
        if field not in p_info or not p_info[field]:
            raise ValueError(f"Missing or empty field in personal_info: {field}")

    # 3. Validate education
    education = data["education"]
    if not isinstance(education, list) or len(education) == 0:
        raise ValueError("Education section must be a non-empty list of education records")
    for idx, edu in enumerate(education):
        if "degree" not in edu or "institution" not in edu:
            raise ValueError(f"Education item #{idx+1} missing degree or institution")

    # 4. Validate technical_skills (dictionary of category -> list of skills)
    skills = data["technical_skills"]
    if not isinstance(skills, dict) or len(skills) == 0:
        raise ValueError("technical_skills must be a non-empty dictionary of skill categories")
    
    total_explicit_skills = 0
    for category, skill_list in skills.items():
        if not isinstance(skill_list, list) or len(skill_list) == 0:
            raise ValueError(f"Skill category '{category}' must be a non-empty list")
        total_explicit_skills += len(skill_list)

    # 5. Validate projects
    projects = data["projects"]
    if not isinstance(projects, list) or len(projects) == 0:
        raise ValueError("projects must be a non-empty list")
    
    project_technologies = set()
    for idx, proj in enumerate(projects):
        for field in ["name", "category", "tech_stack", "overview", "highlights"]:
            if field not in proj:
                raise ValueError(f"Project #{idx+1} missing required field '{field}'")
        if not isinstance(proj["tech_stack"], list) or len(proj["tech_stack"]) == 0:
            raise ValueError(f"Project '{proj['name']}' must have a non-empty tech_stack list")
        if not isinstance(proj["highlights"], list) or len(proj["highlights"]) == 0:
            raise ValueError(f"Project '{proj['name']}' must have a non-empty highlights list")
        
        for tech in proj["tech_stack"]:
            project_technologies.add(tech)

    # 6. Validate engineering strengths
    strengths = data["engineering_strengths"]
    if not isinstance(strengths, list) or len(strengths) == 0:
        raise ValueError("engineering_strengths must be a non-empty list")

    # Compile summary report
    summary = {
        "status": "VALID",
        "candidate_name": p_info["name"],
        "headline": p_info["headline"],
        "education_records": len(education),
        "skill_categories": len(skills),
        "total_explicit_skills": total_explicit_skills,
        "projects_count": len(projects),
        "unique_project_techs": len(project_technologies),
        "engineering_strengths_count": len(strengths),
        "languages_count": len(data.get("languages", [])),
    }

    return summary


def main():
    file_path = Path(__file__).resolve().parents[1] / "knowledge_base" / "portfolio.json"
    print(f"Validating portfolio data from: {file_path}")
    
    try:
        summary = validate_portfolio_data(file_path)
        print("\n==========================================")
        print("  PORTFOLIO KNOWLEDGE BASE VALIDATION: OK")
        print("==========================================")
        for key, value in summary.items():
            print(f"  - {key}: {value}")
        print("==========================================\n")
    except Exception as e:
        print(f"\n[ERROR] Portfolio validation failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
