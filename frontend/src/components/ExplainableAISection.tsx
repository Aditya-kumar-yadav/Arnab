"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  EyeOff,
  Sparkles,
  Zap,
  Lock,
  Layers
} from "lucide-react";

export const ExplainableAISection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"BLIND" | "SKILLS" | "EQUITY">("SKILLS");

  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-xs font-mono font-bold mb-3 border border-[#DDD6FE]">
            <Cpu className="w-3.5 h-3.5" />
            <span>SECTION C • CLEARHIRE™ EXPLAINABLE AI (XAI)</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D0B2D] tracking-tight leading-tight">
            Transparent Matching. Never A Black Box.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#77758F] leading-relaxed">
            Every match score generates an auditable, deterministic vector breakdown. Both students and
            recruiters see exactly why a profile fits, what skills are missing, and how to bridge the gap.
          </p>
        </div>

        {/* 3 Pillars Selector */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {[
            { key: "SKILLS", label: "Skill Vector Alignment & Gap Analysis" },
            { key: "BLIND", label: "Anti-Bias Anonymization Protocol" },
            { key: "EQUITY", label: "Affirmative Regional Equity Weighting" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === tab.key
                  ? "bg-[#5B4BFF] text-white shadow-md shadow-[#5B4BFF]/25 scale-[1.01]"
                  : "bg-[#F7F8FF] hover:bg-[#E6E0FF] text-[#0D0B2D] border border-[#DDD6FE]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Pillar Interactive Visual Container */}
        <div className="rounded-3xl bg-[#F7F8FF] border border-[#DDD6FE] p-6 sm:p-8 lg:p-10 shadow-sm">
          {activeTab === "SKILLS" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-mono font-black text-[#5B4BFF] uppercase tracking-wider block">
                  Deterministic Vector Diagnostic
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0D0B2D] tracking-tight">
                  &ldquo;Your React and Python experience matches 4 of 5 required skills.&rdquo;
                </h3>
                <p className="text-sm text-[#77758F] leading-relaxed">
                  Instead of ambiguous rejection emails, candidates receive actionable reverse engineering.
                  The platform pinpoints the exact technical delta required to unlock interview shortlists.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#16A36A] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-xs text-[#0D0B2D]">
                        4 Core Competencies Verified (80% Base Weight)
                      </span>
                      <p className="text-xs text-[#77758F] mt-0.5">
                        Python 3.12, React 19, FastAPI, and PostgreSQL confirmed via Git repo evaluation and
                        academic transcript.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-xs text-[#0D0B2D]">
                        1 Missing Skill Delta: Docker Containerization
                      </span>
                      <p className="text-xs text-[#77758F] mt-0.5">
                        Closing this single gap elevates compatibility from 84% to 96%.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-[#5B4BFF] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-xs text-[#0D0B2D]">
                        Automated Bridge Recommendation
                      </span>
                      <p className="text-xs text-[#77758F] mt-0.5">
                        Recommended: Complete Coursera &ldquo;Containerized Cloud Architectures&rdquo; or NPTEL
                        Cloud Computing Week 7.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphic Matrix */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#DDD6FE] p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDD6FE]">
                  <span className="font-mono text-xs font-black text-[#0D0B2D]">
                    CLEARHIRE AUDIT TELEMETRY
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E6E0FF] text-[#5B4BFF]">
                    AUDIT PROVENANCE #892-A
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { skill: "Python & Asynchronous I/O", status: "MATCHED", confidence: "99.2%", color: "text-[#16A36A]" },
                    { skill: "React Architecture & Hooks", status: "MATCHED", confidence: "98.7%", color: "text-[#16A36A]" },
                    { skill: "FastAPI RESTful Endpoints", status: "MATCHED", confidence: "97.4%", color: "text-[#16A36A]" },
                    { skill: "PostgreSQL Schema Indexing", status: "MATCHED", confidence: "96.1%", color: "text-[#16A36A]" },
                    { skill: "Docker Containerization", status: "GAP IDENTIFIED", confidence: "0%", color: "text-amber-600" },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE]/70 text-xs font-mono"
                    >
                      <span className="font-bold text-[#0D0B2D]">{row.skill}</span>
                      <div className="flex items-center gap-3">
                        <span className={`font-black ${row.color}`}>{row.status}</span>
                        <span className="text-[#77758F] font-medium">{row.confidence}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-2xl bg-[#5B4BFF]/10 text-[#5B4BFF] text-xs font-bold text-center">
                  Overall Algorithmic Fit: 94.2% • Interview Threshold Exceeded
                </div>
              </div>
            </div>
          )}

          {activeTab === "BLIND" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-mono font-black text-[#5B4BFF] uppercase tracking-wider block">
                  Anti-Bias Evaluation Protocol
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0D0B2D] tracking-tight">
                  Evaluating Code & Concepts. Not Names Or Postal Codes.
                </h3>
                <p className="text-sm text-[#77758F] leading-relaxed">
                  When recruiters activate Blind Review Mode, candidate identity, gender, photograph, and
                  college pedigree are cryptographically masked. Candidates are evaluated on actual skill
                  demonstrations and verified project outputs.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] text-center">
                    <span className="text-2xl font-black text-[#16A36A] font-mono">0%</span>
                    <span className="text-xs font-bold text-[#0D0B2D] block mt-1">Prestige Bias</span>
                    <p className="text-[11px] text-[#77758F] mt-0.5">Tier-3 colleges treated on equal technical footing</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] text-center">
                    <span className="text-2xl font-black text-[#5B4BFF] font-mono">3.4x</span>
                    <span className="text-xs font-bold text-[#0D0B2D] block mt-1">Higher Tier-3 Placements</span>
                    <p className="text-[11px] text-[#77758F] mt-0.5">Verified candidate shortlists across non-metro colleges</p>
                  </div>
                </div>
              </div>

              {/* Masking Visual Preview */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#DDD6FE] p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDD6FE]">
                  <span className="font-mono text-xs font-black text-[#0D0B2D]">BLIND MODE ANONYMIZER</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    ACTIVE MASKING
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#DDD6FE] flex items-center justify-center font-bold text-xs text-[#77758F]">
                        ?
                      </div>
                      <div>
                        <span className="text-xs font-mono font-bold text-[#0D0B2D] bg-[#E6E0FF] px-2 py-0.5 rounded">
                          CANDIDATE #8492-CS
                        </span>
                        <span className="text-[10px] text-[#77758F] block">Identity Cryptographically Masked</span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-black text-[#5B4BFF]">97% FIT</span>
                  </div>

                  <div className="text-xs font-mono text-[#77758F] space-y-1 pt-1">
                    <div>
                      Institution: <span className="bg-[#E6E0FF] px-1.5 py-0.2 rounded text-[#0D0B2D]">[Accredited Technical University, Jharkhand]</span>
                    </div>
                    <div>
                      Verified Skills: <strong className="text-[#0D0B2D]">Python, FastAPI, React, SQL</strong>
                    </div>
                    <div>
                      Project Benchmark: <strong className="text-[#16A36A]">Exceeds Top 5% Code Quality</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "EQUITY" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-mono font-black text-[#5B4BFF] uppercase tracking-wider block">
                  Affirmative Action Leveling
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#0D0B2D] tracking-tight">
                  Democratizing High-Trajectory Tech Careers For First-Gen Learners.
                </h3>
                <p className="text-sm text-[#77758F] leading-relaxed">
                  Students from rural, non-metro, or first-generation academic backgrounds receive calibrated
                  affirmative leveling (+10% matching boost) to counter uneven access to campus career fairs
                  and high-speed connectivity.
                </p>

                <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] space-y-2">
                  <span className="text-xs font-bold text-[#0D0B2D] block">
                    Built-in Rural Data-Saver Protocol:
                  </span>
                  <p className="text-xs text-[#77758F] leading-relaxed">
                    Students in low-bandwidth regions can toggle Data-Saver mode to completely disable heavy
                    assets, guaranteeing seamless applications over 2G/3G campus connections.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-6 bg-white rounded-3xl border border-[#DDD6FE] p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#DDD6FE]">
                  <span className="font-mono text-xs font-black text-[#0D0B2D]">EQUITY COEFFICIENT MATRIX</span>
                  <span className="px-2.5 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-[10px] font-bold font-mono">
                    POLICY VERIFIED
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#0D0B2D]">First-Generation College Scholar</span>
                      <span className="text-[11px] text-[#77758F] block">Zero generational tech network</span>
                    </div>
                    <span className="font-mono font-black text-[#16A36A]">+5% Boost</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#0D0B2D]">Non-Metro / Rural Institution</span>
                      <span className="text-[11px] text-[#77758F] block">Absence of on-campus Tier-1 companies</span>
                    </div>
                    <span className="font-mono font-black text-[#16A36A]">+5% Boost</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-[#0D0B2D]">Technical Skill Mastery</span>
                      <span className="text-[11px] text-[#77758F] block">Standardized automated test score</span>
                    </div>
                    <span className="font-mono font-black text-[#5B4BFF]">Core 85% Weight</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

