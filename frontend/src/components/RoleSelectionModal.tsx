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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#121212] text-white flex items-center justify-center mx-auto shadow-sm">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EDE7DC] text-[#121212]">
            Account Setup Required
          </span>
          <h2 className="text-2xl font-black text-[#121212] tracking-tight">
            Welcome to PATHFINDER AI, {userName}!
          </h2>
          <p className="text-xs sm:text-sm text-[#736E65] max-w-md mx-auto">
            &ldquo;Talent Has No Location. Opportunity Shouldn&apos;t Either.&rdquo; Choose how you want to use the platform:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Option A: Candidate */}
          <button
            onClick={() => onSelectRole("STUDENT")}
            className="group p-5 rounded-2xl bg-white border border-[#E2DBD0] hover:border-[#121212] text-left transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE7DC] text-[#121212] flex items-center justify-center group-hover:bg-[#121212] group-hover:text-white transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#121212] flex items-center justify-between">
                Candidate / Student
                <ArrowRight className="w-4 h-4 text-[#736E65] group-hover:text-[#121212] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#736E65] leading-relaxed">
                Discover curated internships, campus placement JDs, and free subsidized skill fellowships with Explainable AI.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2DBD0] flex items-center gap-1.5 text-[11px] font-bold text-[#121212]">
              <Sparkles className="w-3.5 h-3.5" /> 3-Step Sliding Setup
            </div>
          </button>

          {/* Option B: Recruiter */}
          <button
            onClick={() => onSelectRole("RECRUITER")}
            className="group p-5 rounded-2xl bg-white border border-[#E2DBD0] hover:border-[#121212] text-left transition-all hover:shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#EDE7DC] text-[#121212] flex items-center justify-center group-hover:bg-[#121212] group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#121212] flex items-center justify-between">
                Recruiter / Employer
                <ArrowRight className="w-4 h-4 text-[#736E65] group-hover:text-[#121212] group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs text-[#736E65] leading-relaxed">
                Post high-impact roles, discover pre-verified rural & tier-2/3 college talent, and review candidates without bias.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2DBD0] flex items-center gap-1.5 text-[11px] font-bold text-[#121212]">
              <ShieldCheck className="w-3.5 h-3.5" /> Fast Intent Setup
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

