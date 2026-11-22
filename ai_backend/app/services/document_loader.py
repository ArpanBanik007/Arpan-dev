"""
Document Loader Service
Loads JSON and TXT documents, specifically parsing portfolio.json
into granular, semantically structured Document objects with rich metadata.
Phase 2 of Arpan AI Portfolio RAG.
"""

import json
import re
from pathlib import Path
from typing import Any, Dict, List
from pydantic import BaseModel, Field


class Document(BaseModel):
    """Represents a single modular document with content and metadata."""
    page_content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def __repr__(self) -> str:
        doc_id = self.metadata.get("document_id", "unknown")
        section = self.metadata.get("section", "unknown")
        return f"<Document id='{doc_id}' section='{section}' length={len(self.page_content)}>"


def _slugify(text: str) -> str:
    """Convert text into a safe lowercase slug for IDs."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    return re.sub(r"[-\s]+", "_", text)


class DocumentLoader:
    """Service to load documents from various formats (JSON, TXT, portfolio.json)."""

    @staticmethod
    def load_text_file(file_path: Path, metadata: Dict[str, Any] = None) -> List[Document]:
        """Load a plain text file into a Document."""
        if not file_path.exists():
            raise FileNotFoundError(f"Text file not found: {file_path}")
        
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        base_meta = {
            "source": file_path.name,
            "section": "text_document",
            "document_id": f"doc_{_slugify(file_path.stem)}",
            "category": "plain_text",
            "title": file_path.stem,
        }
        if metadata:
            base_meta.update(metadata)

        return [Document(page_content=content.strip(), metadata=base_meta)]

    @staticmethod
    def load_portfolio_json(file_path: Path) -> List[Document]:
        """
        Parse portfolio.json into discrete, independently retrievable Document instances.
        Keeps sections modular and attaches full provenance metadata.
        """
        if not file_path.exists():
            raise FileNotFoundError(f"Portfolio file not found: {file_path}")

        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        documents: List[Document] = []
        source_name = file_path.name
        candidate_name = data.get("personal_info", {}).get("name", "Arpan Banik")

        # 1. Personal Info
        p_info = data.get("personal_info", {})
        if p_info:
            location = p_info.get("location", {})
            loc_str = f"{location.get('city', '')}, {location.get('state', '')}, {location.get('country', '')} ({location.get('area', '')})"
            contact = p_info.get("contact", {})
            career_objs = ", ".join(p_info.get("career_objective", []))
            
            content = (
                f"Personal Profile and Contact Information of {candidate_name}:\n"
                f"Name: {candidate_name}\n"
                f"Headline: {p_info.get('headline')}\n"
                f"Current Role: {p_info.get('current_role')}\n"
                f"Location: {loc_str}\n"
                f"Availability: {p_info.get('availability')}\n"
                f"Career Objectives: {career_objs}\n"
                f"Contact Details:\n"
                f"- Email: {contact.get('email')}\n"
                f"- Phone: {contact.get('phone')}\n"
                f"- LinkedIn: {contact.get('linkedin')}\n"
                f"- GitHub: {contact.get('github')}\n"
                f"- Portfolio: {contact.get('portfolio')}"
            )
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": source_name,
                        "section": "personal_info",
                        "document_id": "doc_personal_info",
                        "category": "profile",
                        "title": f"Personal Profile: {candidate_name}",
                    },
                )
            )

        # 2. Professional Summary
        summary = data.get("professional_summary")
        if summary:
            content = (
                f"Professional Summary of {candidate_name}:\n"
                f"{summary}"
            )
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": source_name,
                        "section": "professional_summary",
                        "document_id": "doc_professional_summary",
                        "category": "summary",
                        "title": "Professional Summary",
                    },
                )
            )

        # 3. Education (Individual documents per degree/diploma)
        for idx, edu in enumerate(data.get("education", [])):
            degree = edu.get("degree", "Degree")
            inst = edu.get("institution", "")
            loc = edu.get("location", "")
            start = edu.get("start_date", "")
            end = edu.get("end_date") or edu.get("expected_graduation") or edu.get("year", "")
            status = edu.get("status", "Completed")
            cgpa = edu.get("cgpa")
            pct = edu.get("percentage")
            coursework = edu.get("relevant_coursework", [])

            lines = [
                f"{candidate_name}'s Education Record: {degree}",
                f"Candidate: {candidate_name}",
                f"Degree: {degree}",
                f"Institution: {inst}",
            ]
            if loc:
                lines.append(f"Location: {loc}")
            lines.append(f"Timeline: {start} – {end} ({status})")
            if cgpa:
                lines.append(f"CGPA: {cgpa}")
            if pct:
                lines.append(f"Percentage: {pct}%")
            if coursework:
                lines.append(f"Relevant Coursework: {', '.join(coursework)}")

            slug = _slugify(degree)[:30]
            documents.append(
                Document(
                    page_content="\n".join(lines),
                    metadata={
                        "source": source_name,
                        "section": "education",
                        "document_id": f"doc_education_{idx}_{slug}",
                        "category": "education",
                        "title": f"Education: {degree}",
                        "institution": inst,
                    },
                )
            )

        # 4. Technical Skills (Individual document per skill category + an overarching summary)
        tech_skills = data.get("technical_skills", {})
        all_skills_overview = []

        for category, skills in tech_skills.items():
            cat_readable = category.replace("_", " ").title()
            skills_joined = ", ".join(skills)
            all_skills_overview.append(f"- {cat_readable}: {skills_joined}")

            content = (
                f"{candidate_name}'s Verified Technical Skills in {cat_readable}:\n"
                f"Candidate: {candidate_name}\n"
                f"Category: {cat_readable}\n"
                f"Verified Skills: {skills_joined}\n"
                f"Note: These skills are explicitly verified in {candidate_name}'s portfolio."
            )
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": source_name,
                        "section": "technical_skills",
                        "document_id": f"doc_skills_{category}",
                        "category": category,
                        "title": f"Technical Skills: {cat_readable}",
                        "skill_type": "explicit_inventory",
                    },
                )
            )

        # Master skills overview document for broad skill questions
        if all_skills_overview:
            documents.append(
                Document(
                    page_content=(
                        f"Complete Overview of {candidate_name}'s Technical Skills:\n"
                        f"Candidate: {candidate_name}\n"
                        + "\n".join(all_skills_overview)
                    ),
                    metadata={
                        "source": source_name,
                        "section": "technical_skills",
                        "document_id": "doc_skills_all_overview",
                        "category": "skills_overview",
                        "title": "All Technical Skills Overview",
                        "skill_type": "explicit_inventory_all",
                    },
                )
            )

        # 5. Engineering Strengths
        strengths = data.get("engineering_strengths", [])
        if strengths:
            str_lines = [
                f"{candidate_name}'s Core Engineering Strengths and Architectural Capabilities:",
                f"Candidate: {candidate_name}",
            ]
            for s in strengths:
                area = s.get("area", "")
                details = s.get("details", "")
                str_lines.append(f"- {area}: {details}")

            documents.append(
                Document(
                    page_content="\n".join(str_lines),
                    metadata={
                        "source": source_name,
                        "section": "engineering_strengths",
                        "document_id": "doc_engineering_strengths",
                        "category": "strengths",
                        "title": "Engineering Strengths and Core Capabilities",
                    },
                )
            )

        # 6. Projects (Independent document per project)
        all_projects_summary = []
        for proj in data.get("projects", []):
            name = proj.get("name", "Project")
            cat = proj.get("category", "")
            tagline = proj.get("tagline", "")
            status = proj.get("status", "")
            dates = proj.get("dates", "")
            links = proj.get("links", {})
            techs = ", ".join(proj.get("tech_stack", []))
            arch = proj.get("architecture", "")
            overview = proj.get("overview", "")
            highlights = proj.get("highlights", [])

            all_projects_summary.append(f"- {name} ({cat}): {tagline}. Tech Stack: {techs}")

            lines = [
                f"Project: {name}",
                f"Developer: {candidate_name}",
                f"Category: {cat}",
                f"Tagline: {tagline}",
                f"Status: {status}",
            ]
            if dates:
                lines.append(f"Timeline: {dates}")
            if links:
                link_strs = [f"{k.capitalize()}: {v}" for k, v in links.items()]
                lines.append(f"Project Links: {', '.join(link_strs)}")
            lines.append(f"Project Tech Stack: {techs}")
            if arch:
                lines.append(f"Architecture: {arch}")
            if overview:
                lines.append(f"Overview: {overview}")
            if highlights:
                lines.append("Key Highlights and Achievements:")
                for hl in highlights:
                    lines.append(f"- {hl}")

            slug = _slugify(name)[:30]
            documents.append(
                Document(
                    page_content="\n".join(lines),
                    metadata={
                        "source": source_name,
                        "section": "projects",
                        "document_id": f"doc_project_{slug}",
                        "category": cat,
                        "title": f"Project: {name}",
                        "project_name": name,
                        "project_status": status,
                    },
                )
            )

        # Master projects overview document for broad project questions
        if all_projects_summary:
            documents.append(
                Document(
                    page_content=(
                        f"Projects Built by {candidate_name}:\n"
                        f"Candidate: {candidate_name}\n"
                        + "\n".join(all_projects_summary)
                    ),
                    metadata={
                        "source": source_name,
                        "section": "projects",
                        "document_id": "doc_projects_all_overview",
                        "category": "projects_overview",
                        "title": "All Projects Overview",
                    },
                )
            )

        # 7. Portfolio Metrics
        metrics = data.get("portfolio_metrics", {})
        if metrics:
            m_lines = [
                f"{candidate_name}'s Portfolio Metrics & Accomplishments:",
                f"Candidate: {candidate_name}",
                f"- Live Deployed Platforms: {metrics.get('live_deployed_platforms')}",
                f"- Generative AI and RAG Systems: {metrics.get('generative_ai_and_rag_systems')}",
                f"- REST APIs Architected: {metrics.get('rest_apis_architected')}",
                f"- Featured Projects: {metrics.get('featured_projects')}",
            ]
            if metrics.get("note"):
                m_lines.append(f"- Note: {metrics.get('note')}")

            documents.append(
                Document(
                    page_content="\n".join(m_lines),
                    metadata={
                        "source": source_name,
                        "section": "portfolio_metrics",
                        "document_id": "doc_portfolio_metrics",
                        "category": "metrics",
                        "title": "Portfolio Metrics & Key Numbers",
                    },
                )
            )

        # 8. Languages
        languages = data.get("languages", [])
        if languages:
            lang_strs = [f"{lang.get('language')} ({lang.get('proficiency')})" for lang in languages]
            content = f"Spoken Languages of {candidate_name}:\nCandidate: {candidate_name}\nLanguages: {', '.join(lang_strs)}"
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": source_name,
                        "section": "languages",
                        "document_id": "doc_languages",
                        "category": "languages",
                        "title": "Languages Spoken",
                    },
                )
            )

        # 9. Career Interests
        interests = data.get("career_interests", [])
        if interests:
            content = f"{candidate_name}'s Career Interests and Target Domains:\nCandidate: {candidate_name}\n- " + "\n- ".join(interests)
            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "source": source_name,
                        "section": "career_interests",
                        "document_id": "doc_career_interests",
                        "category": "career_interests",
                        "title": "Career Interests",
                    },
                )
            )

        return documents
