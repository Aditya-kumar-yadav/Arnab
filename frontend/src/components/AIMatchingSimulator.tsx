"use client";

import React, { useState } from "react";
import {
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award
} from "lucide-react";

interface ProfilePreset {
  id: string;
  name: string;
  degree: string;
  institution: string;
  isFirstGen: boolean;
  isRural: boolean;
  skills: string[];
}

interface OpportunityTarget {
  id: string;
  title: string;
  company: string;
  requiredSkills: string[];
  preferredSkills: string[];
  academicCutoff: string;
  location: string;
  isRemote: boolean;
  baseMatch: number;
}

const PRESET_STUDENTS: ProfilePreset[] = [
  {
    id: "aarav",
    name: "Aarav Verma",
    degree: "B.Tech Computer Science (3rd Year)",
    institution: "Birla Institute of Technology, Mesra",
    isFirstGen: true,
    isRural: false,
    skills: ["Python", "React", "FastAPI", "SQL", "Git", "Docker"],
  },
  {
    id: "rahul",
    name: "Rahul Kumar",
    degree: "B.Tech CSE (Final Year)",
    institution: "Government Engineering College (Tier-3 Rural)",
    isFirstGen: true,
    isRural: true,
    skills: ["Python", "FastAPI", "PostgreSQL", "Machine Learning", "Git"],
  },
  {
    id: "priya",
    name: "Priya Sharma",
    degree: "Dual Degree CSE & AI",
    institution: "Indian Institute of Technology Delhi",
    isFirstGen: false,
    isRural: false,
    skills: ["Python", "PyTorch", "Transformers", "Distributed Systems", "C++", "Docker"],
  },
];

const PRESET_OPPORTUNITIES: OpportunityTarget[] = [
  {
    id: "opp-ruraltech",
    title: "AI & Full Stack Engineering Fellow",
    company: "RuralTech Labs & Systems",
    requiredSkills: ["Python", "React", "FastAPI", "SQL"],
    preferredSkills: ["Docker", "Git"],
    academicCutoff: "Recognized Accredited University • CGPA > 7.5",
    location: "Bengaluru, India / Hybrid",
    isRemote: true,
    baseMatch: 95,
  },
  {
    id: "opp-google",
    title: "Machine Learning Research Apprentice",
    company: "Google DeepMind",
    requiredSkills: ["Python", "PyTorch", "Machine Learning"],
    preferredSkills: ["Transformers", "Distributed Systems", "C++"],
    academicCutoff: "Undergraduate / Graduate in STEM",
    location: "Bengaluru, India / Flexible",
    isRemote: true,
    baseMatch: 92,
  },
  {
    id: "opp-msft",
    title: "Cloud Infrastructure & Distributed Systems Intern",
    company: "Microsoft Azure Core",
    requiredSkills: ["Python", "Distributed Systems", "Docker", "SQL"],
    preferredSkills: ["C++", "Kubernetes"],
    academicCutoff: "Accredited Technical Program",
    location: "Hyderabad / Bengaluru",
    isRemote: false,
    baseMatch: 89,
  },
];

export const AIMatchingSimulator: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<ProfilePreset>(PRESET_STUDENTS[0]);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityTarget>(PRESET_OPPORTUNITIES[0]);
  const [affirmativeEnabled, setAffirmativeEnabled] = useState<boolean>(true);

  // Compute live match breakdown
  const matchedRequired = selectedOpp.requiredSkills.filter((s) =>
    selectedStudent.skills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );
  const missingRequired = selectedOpp.requiredSkills.filter(
    (s) => !selectedStudent.skills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );

  const matchedPreferred = selectedOpp.preferredSkills.filter((s) =>
    selectedStudent.skills.some((sk) => sk.toLowerCase() === s.toLowerCase())
  );

  const reqScore = Math.round((matchedRequired.length / (selectedOpp.requiredSkills.length || 1)) * 65);
  const prefScore = Math.round((matchedPreferred.length / (selectedOpp.preferredSkills.length || 1)) * 20);
  const academicScore = 10;
  const affirmativeBoost = affirmativeEnabled && (selectedStudent.isFirstGen || selectedStudent.isRural) ? 5 : 0;

  const totalScore = Math.min(99, Math.max(50, reqScore + prefScore + academicScore + affirmativeBoost));

  return (
    <section id="ai-matching-simulator" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-xs font-mono font-bold mb-3 border border-[#DDD6FE]">
            <Cpu className="w-3.5 h-3.5" />
            <span>SECTION A • CLEARHIRE™ REVERSE-ENGINEERED MATCH SIMULATOR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D0B2D] tracking-tight leading-tight">
            How ClearHire™ AI Matches Talent to High-Impact Careers.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#77758F] leading-relaxed">
            Unlike traditional applicant tracking systems that filter by university brand names,
            PATHFINDER AI evaluates candidate competencies mathematically. Simulate live matching below:
          </p>
        </div>

        {/* Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Candidate Vector (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#DDD6FE] p-5 sm:p-6 shadow-[0_8px_30px_rgba(91,75,255,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD6FE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B4BFF]" />
                <span className="text-xs font-mono font-black text-[#0D0B2D] uppercase tracking-wider">
                  1. Candidate Vector
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#77758F]">SELECT PERSONA</span>
            </div>

            {/* Persona Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE]">
              {PRESET_STUDENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedStudent(p)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all text-center ${
                    selectedStudent.id === p.id
                      ? "bg-[#5B4BFF] text-white shadow-xs"
                      : "text-[#77758F] hover:text-[#0D0B2D]"
                  }`}
                >
                  {p.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {/* Candidate Card Summary */}
            <div className="p-4 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE]/80 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[#0D0B2D]">{selectedStudent.name}</h4>
                {selectedStudent.isFirstGen && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#E6E0FF] text-[#5B4BFF]">
                    1st Gen Scholar
                  </span>
                )}
              </div>
              <p className="text-xs text-[#77758F]">{selectedStudent.degree}</p>
              <p className="text-xs text-[#0D0B2D] font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>{selectedStudent.institution}</span>
              </p>
            </div>

            {/* Candidate Skills Multi-Pill List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0D0B2D] block">Verified Skills Vector:</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent.skills.map((sk) => (
                  <span
                    key={sk}
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-white border border-[#DDD6FE] text-[#0D0B2D] shadow-2xs"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Affirmative Inclusion Boost Toggle */}
            <div className="pt-2 border-t border-[#DDD6FE]/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0D0B2D] block">Affirmative Equity Protocol</span>
                <span className="text-[11px] text-[#77758F]">Tier-2/3 & First-Gen leveling</span>
              </div>
              <button
                onClick={() => setAffirmativeEnabled(!affirmativeEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  affirmativeEnabled ? "bg-[#16A36A]" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    affirmativeEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Column 2: Target Opportunity (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#DDD6FE] p-5 sm:p-6 shadow-[0_8px_30px_rgba(91,75,255,0.05)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD6FE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A78BFA]" />
                <span className="text-xs font-mono font-black text-[#0D0B2D] uppercase tracking-wider">
                  2. Opportunity Criteria
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#77758F]">SELECT ROLE</span>
            </div>

            {/* Opportunity Switcher Tabs */}
            <div className="space-y-2">
              {PRESET_OPPORTUNITIES.map((opp) => (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    selectedOpp.id === opp.id
                      ? "bg-[#F7F8FF] border-[#5B4BFF] shadow-xs ring-1 ring-[#5B4BFF]/20"
                      : "bg-white border-[#DDD6FE] hover:border-[#A78BFA]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-[#0D0B2D]">{opp.company}</span>
                    <span className="text-[10px] font-mono text-[#5B4BFF] font-bold">
                      {opp.isRemote ? "Remote / Hybrid" : "On-site"}
                    </span>
                  </div>
                  <p className="text-xs text-[#77758F] font-medium mt-0.5">{opp.title}</p>
                </div>
              ))}
            </div>

            {/* Target Opportunity Requirement Checklist */}
            <div className="p-4 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE]/80 space-y-3">
              <div>
                <span className="text-[11px] font-mono font-black text-[#0D0B2D] uppercase block mb-1">
                  Required Core Skills ({selectedOpp.requiredSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpp.requiredSkills.map((sk) => {
                    const isMatched = selectedStudent.skills.some(
                      (s) => s.toLowerCase() === sk.toLowerCase()
                    );
                    return (
                      <span
                        key={sk}
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                          isMatched
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {isMatched ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                        )}
                        <span>{sk}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono font-black text-[#0D0B2D] uppercase block mb-1">
                  Preferred / Bonus Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedOpp.preferredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] font-mono text-[#77758F] px-2 py-0.5 rounded-md bg-white border border-[#DDD6FE]"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: ClearHire Matching Result & Explainability Engine (4 cols) */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#0D0B2D] to-[#1F195E] text-white rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-5">
            {/* Atmospheric Background Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#5B4BFF]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold text-[#A78BFA] uppercase tracking-wider">
                ClearHire™ Output
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/15">
                Deterministic XAI
              </span>
            </div>

            {/* Massive Circular Compatibility Metric */}
            <div className="text-center py-2">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-36 h-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#ffffff"
                    strokeOpacity="0.1"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#5B4BFF"
                    strokeWidth="8"
                    strokeDasharray={364}
                    strokeDashoffset={364 - (364 * totalScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-black tracking-tight text-white">{totalScore}%</span>
                  <span className="text-[10px] font-mono font-bold text-[#A78BFA] uppercase tracking-wider">
                    Compatibility
                  </span>
                </div>
              </div>
            </div>

            {/* Multi-Dimensional Breakdown Bars */}
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/80">Skills Compatibility</span>
                  <span className="font-mono font-bold text-white">
                    {Math.round(((reqScore + prefScore) / 85) * 100)}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5B4BFF] rounded-full transition-all duration-700"
                    style={{ width: `${Math.round(((reqScore + prefScore) / 85) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/80">Academic Verification</span>
                  <span className="font-mono font-bold text-[#16A36A]">100% (Accredited)</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#16A36A] rounded-full" style={{ width: "100%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-white/80">Affirmative Equity Factor</span>
                  <span className="font-mono font-bold text-[#A78BFA]">
                    {affirmativeBoost > 0 ? "+10% Boost Active" : "Neutral (0%)"}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A78BFA] rounded-full transition-all duration-500"
                    style={{ width: affirmativeBoost > 0 ? "100%" : "20%" }}
                  />
                </div>
              </div>
            </div>

            {/* Explainable Text Card */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] leading-relaxed text-white/90 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#A78BFA]">
                <Zap className="w-3.5 h-3.5" />
                <span>Explainable AI Synthesis:</span>
              </div>
              <p>
                {matchedRequired.length} of {selectedOpp.requiredSkills.length} required skills verified via
                academic repository and GitHub audit. College prestige penalty: <strong>0%</strong>.
              </p>
              {missingRequired.length > 0 && (
                <p className="text-amber-200">
                  Recommended gap bridging: Focus on <strong>{missingRequired.join(", ")}</strong> to reach 98%
                  fit.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

