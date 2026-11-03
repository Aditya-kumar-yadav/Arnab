"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  Globe2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Users
} from "lucide-react";

interface RecruiterIntentModalProps {
  initialName?: string;
  initialEmail?: string;
  onComplete: (data: {
    companyName: string;
    officialWebsite: string;
    designation: string;
    hiringIntent: string[];
    targetTalentPool: string;
  }) => void;
  onClose?: () => void;
}

export const RecruiterIntentModal: React.FC<RecruiterIntentModalProps> = ({
  initialName = "Recruiter",
  initialEmail = "",
  onComplete,
  onClose,
}) => {
  const [companyName, setCompanyName] = useState<string>("RuralTech Labs");
  const [officialWebsite, setOfficialWebsite] = useState<string>("https://ruraltechlabs.io");
  const [designation, setDesignation] = useState<string>("Head of Inclusive Hiring");
  const [hiringIntent, setHiringIntent] = useState<string[]>([
    "Summer/Winter Internships",
    "Campus Placement (Batch 2026/2027)",
  ]);
  const [targetTalentPool, setTargetTalentPool] = useState<string>("Tier-2/3 & Rural Engineering Colleges");

  const intentOptions = [
    "Summer/Winter Internships",
    "Campus Placement (Batch 2026/2027)",
    "Upskilled Project Apprentices",
    "Direct Junior Full-Time Roles",
  ];

  const toggleIntent = (item: string) => {
    if (hiringIntent.includes(item)) {
      if (hiringIntent.length > 1) {
        setHiringIntent(hiringIntent.filter((i) => i !== item));
      }
    } else {
      setHiringIntent([...hiringIntent, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      companyName,
      officialWebsite,
      designation,
      hiringIntent,
      targetTalentPool,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B2D]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-xl bg-[#F7F8FF] rounded-3xl border border-[#DDD6FE] shadow-2xl overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 bg-white border-b border-[#DDD6FE]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center shadow-md shadow-[#5B4BFF]/20">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E6E0FF] text-[#5B4BFF] uppercase tracking-wider border border-[#DDD6FE]">
                Recruiter Intent Setup
              </span>
              <h2 className="text-xl font-black text-[#0D0B2D] tracking-tight mt-1">
                Welcome, {initialName}! Set Your Hiring Goals
              </h2>
            </div>
          </div>
          <p className="text-xs text-[#77758F] mt-2">
            Configure your company profile and discover pre-verified candidates with blind merit screening.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">Company Name</label>
              <div className="relative mt-1">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-[#77758F]" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF] outline-none"
                  placeholder="e.g. Acme Tech Solutions"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">Official Website</label>
                <div className="relative mt-1">
                  <Globe2 className="w-4 h-4 absolute left-3 top-3 text-[#77758F]" />
                  <input
                    type="url"
                    required
                    value={officialWebsite}
                    onChange={(e) => setOfficialWebsite(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF] outline-none"
                    placeholder="https://company.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">Your Designation</label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF] outline-none"
                  placeholder="e.g. Lead Technical Recruiter"
                />
              </div>
            </div>
          </div>

          {/* Hiring Intent Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
              What opportunities are you hiring for?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {intentOptions.map((opt) => {
                const active = hiringIntent.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleIntent(opt)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      active
                        ? "bg-white border-[#5B4BFF] text-[#0D0B2D] ring-2 ring-[#5B4BFF]/30 font-bold"
                        : "bg-white/80 border-[#DDD6FE] text-[#77758F] hover:border-[#A78BFA]"
                    }`}
                  >
                    <span>{opt}</span>
                    {active && <Check className="w-3.5 h-3.5 text-[#5B4BFF]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Talent Pool */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
              Primary Outreach Focus
            </label>
            <select
              value={targetTalentPool}
              onChange={(e) => setTargetTalentPool(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] outline-none focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF]"
            >
              <option value="Tier-2/3 & Rural Engineering Colleges">
                Tier-2/3 & Rural Engineering Colleges (Affirmative Merit)
              </option>
              <option value="All-India Pan-Campus (Open Merit)">
                All-India Pan-Campus (Open Merit)
              </option>
              <option value="First-Generation Diversity Talent Pool">
                First-Generation Diversity Talent Pool
              </option>
            </select>
          </div>

          {/* Blind Hiring Assurance */}
          <div className="p-3.5 rounded-2xl bg-[#E6E0FF]/50 border border-[#DDD6FE] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#5B4BFF] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#0D0B2D]/80 leading-relaxed">
              <strong className="text-[#0D0B2D]">Pathfinder Anti-Bias Protocol:</strong> Candidate profiles are anonymized during initial evaluation to prevent college-tier or demographic bias.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-3 flex items-center justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#77758F] hover:text-[#0D0B2D]"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all"
            >
              <span>Confirm Intent & Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
