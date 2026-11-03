"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Compass
} from "lucide-react";

interface RoleSelectionModalProps {
  userName?: string;
  onSelectRole: (role: "STUDENT" | "RECRUITER") => void;
}

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  userName = "There",
  onSelectRole,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B2D]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-[#F7F8FF] rounded-3xl border border-[#DDD6FE] shadow-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center mx-auto shadow-md shadow-[#5B4BFF]/25">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="inline-block text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] border border-[#DDD6FE]">
            Account Setup Required
          </span>
          <h2 className="text-2xl font-black text-[#0D0B2D] tracking-tight">
            Welcome to PATHFINDER AI, {userName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#77758F] max-w-md mx-auto">
            &ldquo;Talent Has No Location. Opportunity Shouldn&apos;t Either.&rdquo; Choose your primary portal:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A: Candidate */}
          <button
            onClick={() => onSelectRole("STUDENT")}
            className="group p-5 rounded-2xl bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] text-left transition-all hover:shadow-[0_12px_32px_rgba(91,75,255,0.12)] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center group-hover:bg-[#5B4BFF] group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0D0B2D] flex items-center justify-between">
                Candidate / Student
                <ArrowRight className="w-4 h-4 text-[#77758F] group-hover:text-[#5B4BFF] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#77758F] leading-relaxed">
                First-generation, tier-2/3, and rural learners. Access AI matches, verified skill tracks, and subsidized fellowships.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F7F8FF] flex items-center gap-1.5 text-[10px] font-bold text-[#5B4BFF]">
              <Sparkles className="w-3.5 h-3.5 text-[#5B4BFF]" />
              <span>Anti-Bias Blind Reviews</span>
            </div>
          </button>

          {/* Option B: Recruiter */}
          <button
            onClick={() => onSelectRole("RECRUITER")}
            className="group p-5 rounded-2xl bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] text-left transition-all hover:shadow-[0_12px_32px_rgba(91,75,255,0.12)] flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center group-hover:bg-[#5B4BFF] group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#0D0B2D] flex items-center justify-between">
                Recruiter / Company
                <ArrowRight className="w-4 h-4 text-[#77758F] group-hover:text-[#5B4BFF] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#77758F] leading-relaxed">
                Hire talent based purely on validated competency and projects — with demographic and college pedigree bias stripped away.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F7F8FF] flex items-center gap-1.5 text-[10px] font-bold text-[#5B4BFF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B4BFF]" />
              <span>Gated Clearance Workflow</span>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
