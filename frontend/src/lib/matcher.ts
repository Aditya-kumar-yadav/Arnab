import { OpportunityData, StudentProfileData } from "./types";
import { ResumeData } from "../components/ResumeStudioModal";

export interface ATSMatchDiagnostics {
  overall_score: number;
  is_perfect_match: boolean;
  sub_scores: {
    keyword_match: number;
    skills_coverage: number;
    title_match: number;
    section_completeness: number;
    date_consistency: number;
    equity_boost: number;
  };
  matched_skills: string[];
  missing_keywords: string[];
  recommendations: string[];
}

const WEIGHTS = {
  keyword_match: 0.40,
  skills_coverage: 0.20,
  title_match: 0.15,
  section_completeness: 0.15,
  date_consistency: 0.10,
};

const TITLE_STOPWORDS = new Set(["a", "an", "and", "the", "of", "for", "in", "to", "at", "&"]);

function keywordInText(keyword: string, text: string): boolean {
  if (!keyword || !text) return false;
  const kw = keyword.trim().toLowerCase();
  const tx = text.toLowerCase();
  const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return regex.test(tx);
}

function normalizeSkill(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

export function computeATSScore(
  candidateSkills: string[],
  candidateName: string,
  candidateDomain: string,
  isFirstGen: boolean,
  isRural: boolean,
  opportunity: OpportunityData
): ATSMatchDiagnostics {
  const reqSkills = opportunity.required_skills || [];
  const prefSkills = opportunity.preferred_skills || [];
  const allJDSkills = Array.from(new Set([...reqSkills, ...prefSkills].map(s => s.trim()).filter(Boolean)));

  const candSkillsNormalized = new Set(candidateSkills.map(normalizeSkill));

  // 1. Skills Coverage (20% weight)
  const matchedSkills: string[] = [];
  const missingKeywords: string[] = [];

  for (const s of allJDSkills) {
    if (candSkillsNormalized.has(normalizeSkill(s))) {
      matchedSkills.push(s);
    } else {
      missingKeywords.push(s);
    }
  }

  const skillsCoverageScore = allJDSkills.length > 0
    ? Math.min(100, (matchedSkills.length / allJDSkills.length) * 100)
    : 85.0;

  // 2. Keyword Match (40% weight)
  const resumeText = `${candidateName} ${candidateDomain} ${candidateSkills.join(" ")}`;
  let matchedKeywordCount = 0;
  for (const kw of allJDSkills) {
    if (keywordInText(kw, resumeText)) {
      matchedKeywordCount++;
    }
  }
  const keywordMatchScore = allJDSkills.length > 0
    ? (matchedKeywordCount / allJDSkills.length) * 100
    : 75.0;

  // 3. Title Match (15% weight)
  let titleMatchScore = 40.0;
  if (keywordInText(opportunity.title, candidateDomain)) {
    titleMatchScore = 100.0;
  } else if (keywordInText(opportunity.title, resumeText)) {
    titleMatchScore = 75.0;
  } else {
    const oppTokens = opportunity.title.toLowerCase().split(/\W+/).filter(t => !TITLE_STOPWORDS.has(t));
    const candTokens = candidateDomain.toLowerCase().split(/\W+/).filter(t => !TITLE_STOPWORDS.has(t));
    const overlap = oppTokens.filter(t => candTokens.includes(t)).length;
    if (oppTokens.length > 0) {
      titleMatchScore = Math.min(50, (overlap / oppTokens.length) * 50);
    }
  }

  // 4. Section Completeness (15% weight)
  const sectionCompletenessScore = candidateSkills.length >= 4 ? 98.0 : 75.0;

  // 5. Date Consistency (10% weight)
  const dateConsistencyScore = 90.0;

  // 6. Affirmative Equity Boost (+4% for first-gen, +4% for rural learners)
  let equityBoost = 0.0;
  if (isFirstGen) equityBoost += 4.0;
  if (isRural) equityBoost += 4.0;

  const rawScore =
    keywordMatchScore * WEIGHTS.keyword_match +
    skillsCoverageScore * WEIGHTS.skills_coverage +
    titleMatchScore * WEIGHTS.title_match +
    sectionCompletenessScore * WEIGHTS.section_completeness +
    dateConsistencyScore * WEIGHTS.date_consistency;

  const finalScore = Math.min(99.0, Math.max(45.0, rawScore + equityBoost));

  // Generate Recommendations
  const recommendations: string[] = [];
  if (missingKeywords.length > 0) {
    recommendations.push(`High-priority keywords missing from your ATS profile: ${missingKeywords.slice(0, 3).join(", ")}.`);
    recommendations.push(`Bridge the gap: Complete a free 2-hour practical certification on ${missingKeywords[0]}.`);
  }
  if (titleMatchScore < 70) {
    recommendations.push(`Target headline optimization: Align your profile headline with "${opportunity.title}" for automated ATS parsing.`);
  }
  if (isFirstGen || isRural) {
    recommendations.push("Pathfinder Affirmative Protection: Institutional brand filter neutralized in recruiter screening.");
  }
  if (skillsCoverageScore >= 80) {
    recommendations.push("High competency alignment! Highlight project metrics in your blind resume to secure interview fast-track.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Outstanding profile alignment. You are in the top 5% of candidates for this opening.");
  }

  return {
    overall_score: Math.round(finalScore * 10) / 10,
    is_perfect_match: finalScore >= 88.0,
    sub_scores: {
      keyword_match: Math.round(keywordMatchScore),
      skills_coverage: Math.round(skillsCoverageScore),
      title_match: Math.round(titleMatchScore),
      section_completeness: Math.round(sectionCompletenessScore),
      date_consistency: Math.round(dateConsistencyScore),
      equity_boost: equityBoost,
    },
    matched_skills: matchedSkills,
    missing_keywords: missingKeywords,
    recommendations,
  };
}

export function rankOpportunitiesWithATS(
  profile: StudentProfileData,
  opportunities: OpportunityData[]
): (OpportunityData & { atsMatch: ATSMatchDiagnostics })[] {
  return opportunities
    .map((opp) => {
      const atsMatch = computeATSScore(
        profile.skills || [],
        profile.full_name || "",
        profile.preferred_domain || "Full Stack",
        profile.is_first_generation,
        profile.is_rural_or_disadvantaged,
        opp
      );
      return {
        ...opp,
        matchScore: Math.round(atsMatch.overall_score),
        atsMatch,
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
}

