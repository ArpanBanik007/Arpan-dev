import React, { useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaQuestionCircle,
  FaGraduationCap,
  FaBriefcase,
  FaStar,
  FaLightbulb,
  FaRedo,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

export default function JDAnalysis({ analysis, onReset }) {
  const [showMethodology, setShowMethodology] = useState(false);

  if (!analysis) return null;

  const {
    job_title,
    match_score,
    summary,
    matched_skills = [],
    partially_matched_skills = [],
    not_mentioned_skills = [],
    education_match = {},
    experience_match = {},
    strengths = [],
    skill_gaps = [],
    recommendations = [],
    scoring_breakdown = {},
  } = analysis;

  // Determine badge color based on score
  const getScoreTheme = (score) => {
    if (score >= 80) {
      return {
        bg: 'from-emerald-500/20 to-teal-500/20',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        bar: 'bg-emerald-500',
        label: 'Strong Match',
      };
    }
    if (score >= 60) {
      return {
        bg: 'from-sky-500/20 to-blue-500/20',
        border: 'border-sky-500/40',
        text: 'text-sky-400',
        bar: 'bg-sky-500',
        label: 'Good Match',
      };
    }
    return {
      bg: 'from-amber-500/20 to-orange-500/20',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      bar: 'bg-amber-500',
      label: 'Moderate Match',
    };
  };

  const theme = getScoreTheme(match_score);

  return (
    <div className="p-4 space-y-4 text-xs text-gray-300">
      {/* 1. Header & Overall Score Card */}
      <div className={`rounded-2xl p-4 bg-gradient-to-br ${theme.bg} border ${theme.border} shadow-lg`}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
              Job Match Analysis
            </span>
            <h3 className="text-base font-bold text-white mt-0.5 truncate max-w-[210px] sm:max-w-xs">
              {job_title}
            </h3>
          </div>

          {/* Circular/Badge Score Indicator */}
          <div className="text-right">
            <div className={`text-3xl font-extrabold ${theme.text} leading-none`}>
              {match_score}
              <span className="text-xs text-gray-400 font-normal">/100</span>
            </div>
            <span className={`text-[10px] font-medium ${theme.text}`}>{theme.label}</span>
          </div>
        </div>

        {/* Overall Score Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className={`h-full ${theme.bar} transition-all duration-1000 ease-out`}
            style={{ width: `${match_score}%` }}
          />
        </div>

        <p className="mt-2.5 text-xs text-gray-200 leading-relaxed">{summary}</p>
      </div>

      {/* 2. Scoring Breakdown (Explainable Points) */}
      <div className="bg-card border border-white/10 rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white flex items-center gap-1.5 text-xs">
            📊 Explainable Score Calculation
          </span>
          <button
            onClick={() => setShowMethodology(!showMethodology)}
            className="text-[11px] text-primary hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            Formula {showMethodology ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}
          </button>
        </div>

        {showMethodology && (
          <p className="text-[11px] text-gray-400 bg-white/5 p-2 rounded-lg leading-relaxed border border-white/5">
            {scoring_breakdown.methodology}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 text-center">
            <span className="text-[10px] text-gray-400 block">Required Skills</span>
            <span className="font-bold text-white text-sm">
              {scoring_breakdown.required_skills}
              <span className="text-[10px] text-gray-500">/60</span>
            </span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 text-center">
            <span className="text-[10px] text-gray-400 block">Preferred Skills</span>
            <span className="font-bold text-white text-sm">
              {scoring_breakdown.preferred_skills}
              <span className="text-[10px] text-gray-500">/15</span>
            </span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 text-center">
            <span className="text-[10px] text-gray-400 block">Education</span>
            <span className="font-bold text-white text-sm">
              {scoring_breakdown.education}
              <span className="text-[10px] text-gray-500">/10</span>
            </span>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-lg p-2 text-center">
            <span className="text-[10px] text-gray-400 block">Experience</span>
            <span className="font-bold text-white text-sm">
              {scoring_breakdown.experience}
              <span className="text-[10px] text-gray-500">/15</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Skills Match Breakdown */}
      <div className="bg-card border border-white/10 rounded-xl p-3 space-y-3">
        <span className="font-semibold text-white block text-xs">
          🎯 Technical Skills Alignment
        </span>

        {/* Matched Skills */}
        {matched_skills.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-medium mb-1.5">
              <FaCheckCircle size={11} /> Matched Skills ({matched_skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matched_skills.map((item, i) => (
                <span
                  key={i}
                  className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1"
                  title={item.evidence}
                >
                  ✓ {item.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Partially Matched Skills */}
        {partially_matched_skills.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sky-400 text-[11px] font-medium mb-1.5">
              <FaExclamationCircle size={11} /> Partially Matched ({partially_matched_skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {partially_matched_skills.map((item, i) => (
                <span
                  key={i}
                  className="bg-sky-500/10 border border-sky-500/30 text-sky-300 px-2 py-0.5 rounded-md text-[11px]"
                  title={item.evidence}
                >
                  ~ {item.skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Not Mentioned Skills */}
        {not_mentioned_skills.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium mb-1.5">
              <FaQuestionCircle size={11} /> Not Mentioned in Portfolio ({not_mentioned_skills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {not_mentioned_skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded-md text-[11px]"
                >
                  ? {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Education & Experience Evidence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="bg-card border border-white/10 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-medium text-[11px]">
            <FaGraduationCap size={13} /> Education Evaluation
          </div>
          <p className="text-[11px] text-gray-300">{education_match.evidence || 'B.Tech in ECE (2027), EE Diploma.'}</p>
        </div>

        <div className="bg-card border border-white/10 rounded-xl p-3 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-medium text-[11px]">
            <FaBriefcase size={13} /> Experience Evaluation
          </div>
          <p className="text-[11px] text-gray-300">{experience_match.evidence || '2 live deployed platforms, 3 AI projects.'}</p>
        </div>
      </div>

      {/* 5. Key Strengths & Recommendations */}
      {strengths.length > 0 && (
        <div className="bg-card border border-white/10 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium text-[11px]">
            <FaStar size={11} /> Key Match Strengths
          </div>
          <ul className="space-y-1 pl-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                <span className="text-amber-400 mt-0.5">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="bg-card border border-white/10 rounded-xl p-3 space-y-1.5">
          <div className="flex items-center gap-1.5 text-primary font-medium text-[11px]">
            <FaLightbulb size={11} /> Recommendations for this Role
          </div>
          <ul className="space-y-1 pl-1">
            {recommendations.map((r, i) => (
              <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                <span className="text-primary mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Action Button: Analyze Another JD */}
      <button
        onClick={onReset}
        className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-white font-medium py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
      >
        <FaRedo size={11} /> Analyze Another Job Description
      </button>
    </div>
  );
}
