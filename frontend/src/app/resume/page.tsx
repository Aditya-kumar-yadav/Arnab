"use client";

import React, { useState } from "react";
import { ResumeStudioModal } from "../../components/ResumeStudioModal";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";

export default function ResumePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#0D0B2D] flex flex-col">
      <header className="h-16 border-b border-[#DDD6FE] bg-white/85 backdrop-blur-xl flex items-center justify-between px-6 shadow-xs">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-[#0D0B2D] hover:text-[#5B4BFF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#5B4BFF]" />
          <span>Back to Opportunity Hub</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center shadow-xs">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm tracking-tight text-[#0D0B2D]">
            PATHFINDER <span className="font-semibold text-[#5B4BFF]">OpenResume ATS Studio</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs font-bold shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all"
        >
          Open Studio
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <ResumeStudioModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSyncWithProfile={(skills) => {
            alert(`Synced ${skills.length} skills to your Pathfinder profile!`);
          }}
        />
        {!isOpen && (
          <div className="text-center space-y-4 max-w-md mx-auto p-8 rounded-3xl bg-white border border-[#DDD6FE] shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-[#5B4BFF]" />
            </div>
            <h2 className="text-2xl font-black text-[#0D0B2D]">OpenResume ATS Studio Closed</h2>
            <p className="text-xs sm:text-sm text-[#77758F] leading-relaxed">
              Click the button below to re-open the interactive single-column resume parser & live editor.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white font-bold text-xs shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all"
            >
              Launch ATS Resume Studio
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
