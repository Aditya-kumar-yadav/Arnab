"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  GraduationCap,
  Sparkles,
  Briefcase,
  Award,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Code2,
  Building2,
  DollarSign
} from "lucide-react";

interface RoadmapStage {
  id: number;
  stageName: string;
  subtitle: string;
  timeframe: string;
  metrics: string;
  icon: any;
  bulletPoints: string[];
  recommendedPlatforms: string[];
  deliverable: string;
}

const STAGES: RoadmapStage[] = [
  {
    id: 1,
    stageName: "1. Verified Foundation & Skill Audit",
    subtitle: "Reverse-engineering your academic background against market demand",
    timeframe: "Month 1 – 2",
    metrics: "Baseline Match: 65% – 75%",
    icon: GraduationCap,
    bulletPoints: [
      "Cryptographic institutional email verification (e.g. .ac.in / .edu)",
      "Automated OpenResume ATS parse and GitHub portfolio indexing",
      "Identification of high-demand regional and national skill deltas",
    ],
    recommendedPlatforms: ["PATHFINDER OpenResume ATS", "NPTEL Foundation Modules", "LeetCode Core"],
    deliverable: "Verified Competency Vector & Gap Blueprint",
  },
  {
    id: 2,
    stageName: "2. Targeted Micro-Credentialing & Gap Remediation",
    subtitle: "Closing critical technical deltas with guided high-yield learning",
    timeframe: "Month 2 – 4",
    metrics: "Elevated Match: 80% – 90%",
    icon: Code2,
    bulletPoints: [
      "Guided project-based sprints in missing technologies (FastAPI, Docker, PyTorch)",
      "Automated code review verifying asynchronous patterns and database schema design",
      "Prestige-neutral skill badge generation stored with SHA-256 provenance",
    ],
    recommendedPlatforms: ["Coursera Professional Specializations", "HackerRank Verified", "GitHub Actions CI"],
    deliverable: "2 Production Deployments + Verified Skill Badges",
  },
  {
    id: 3,
    stageName: "3. Verified Internship / Subsidized Fellowship",
    subtitle: "Gaining real-world production experience under senior engineering mentors",
    timeframe: "Month 4 – 8",
    metrics: "Average Stipend: ₹40,000 – ₹1,20,000/mo",
    icon: Briefcase,
    bulletPoints: [
      "Blind Mode application submission eliminating university tier discrimination",
      "Real-world microservice engineering or social tech impact delivery",
      "Performance evaluation logged directly into Pathfinder Verified Ledger",
    ],
    recommendedPlatforms: ["RuralTech Fellowships", "Enterprise Partner Internships", "National Research Labs"],
    deliverable: "Verified Industry Track Record & Reference Vector",
  },
  {
    id: 4,
    stageName: "4. Full-Time High-Trajectory Employment",
    subtitle: "Accelerated conversion into high-paying engineering careers",
    timeframe: "Month 8 – 12",
    metrics: "Compensation: ₹12 LPA – ₹36 LPA CTC",
    icon: Award,
    bulletPoints: [
      "Direct conversion from high-performing internship or enterprise referral",
      "Pre-vetted interview pipeline with zero repetitive technical screens",
      "Lifetime verified employment credential on the PATHFINDER network",
    ],
    recommendedPlatforms: ["Enterprise Talent Acquisition", "DeepTech Scaleups", "Global Remote Tech"],
    deliverable: "Permanent Career Launch & Financial Mobility",
  },
];

export const CareerRoadmapSection: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<number>(1);

  const selectedStage = STAGES.find((s) => s.id === selectedStageId) || STAGES[0];

  return (
    <section id="for-students" className="py-16 sm:py-24 bg-[#F7F8FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-xs font-mono font-bold mb-3 border border-[#DDD6FE]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>SECTION D • CAREER INTELLIGENCE TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D0B2D] tracking-tight leading-tight">
            From Campus Learner To Top-Tier Engineer.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#77758F] leading-relaxed">
            A structured, deterministic trajectory that replaces guesswork with clear, step-by-step
            milestones. See how PATHFINDER AI accelerates your path to employment:
          </p>
        </div>

        {/* 4-Step Interactive Horizontal Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAGES.map((stg) => {
            const Icon = stg.icon;
            const isSelected = selectedStageId === stg.id;
            return (
              <div
                key={stg.id}
                onClick={() => setSelectedStageId(stg.id)}
                className={`p-5 rounded-3xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isSelected
                    ? "bg-white border-2 border-[#5B4BFF] shadow-lg shadow-[#5B4BFF]/10 scale-[1.02]"
                    : "bg-white/80 border-[#DDD6FE] hover:border-[#A78BFA] hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                        isSelected ? "bg-[#5B4BFF] text-white" : "bg-[#E6E0FF] text-[#5B4BFF]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F7F8FF] text-[#77758F] border border-[#DDD6FE]">
                      {stg.timeframe}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-[#0D0B2D] tracking-tight leading-snug">
                    {stg.stageName}
                  </h4>
                  <p className="text-xs text-[#77758F] mt-1 line-clamp-2 leading-relaxed">
                    {stg.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DDD6FE]/60 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#5B4BFF]">{stg.metrics}</span>
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? "text-[#5B4BFF] translate-x-1" : "text-[#77758F]"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Stage Deep Dive Card */}
        <div className="rounded-3xl bg-white border border-[#DDD6FE] p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF]">
                Active Blueprint • {selectedStage.timeframe}
              </span>
              <span className="text-xs font-mono font-bold text-[#16A36A]">
                🎯 Target Metric: {selectedStage.metrics}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-[#0D0B2D] tracking-tight">
              {selectedStage.stageName}
            </h3>
            <p className="text-sm text-[#77758F] leading-relaxed max-w-2xl">
              {selectedStage.subtitle}
            </p>

            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-black text-[#0D0B2D] uppercase tracking-wider block">
                Key Milestone Deliverables:
              </span>
              {selectedStage.bulletPoints.map((bp, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-[#0D0B2D] font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#16A36A] shrink-0 mt-0.5" />
                  <span>{bp}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#77758F] font-mono mr-1">Recommended Platforms:</span>
              {selectedStage.recommendedPlatforms.map((plat) => (
                <span
                  key={plat}
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F7F8FF] border border-[#DDD6FE] text-[#0D0B2D]"
                >
                  {plat}
                </span>
              ))}
            </div>
          </div>

          {/* Right Callout Box */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-[#0D0B2D] to-[#1F195E] text-white space-y-4 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold text-white">
              <Award className="w-5 h-5 text-[#A78BFA]" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-[#A78BFA] uppercase tracking-wider block font-bold">
                Stage Deliverable:
              </span>
              <h4 className="text-base font-black text-white mt-1">
                {selectedStage.deliverable}
              </h4>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Every completed milestone automatically recalibrates your ClearHire™ neural vector, pushing
              your profile to the top of recruiter search queues.
            </p>
            <button
              onClick={() => {
                const el = document.getElementById("ai-matching-simulator");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Simulate Your Placement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

