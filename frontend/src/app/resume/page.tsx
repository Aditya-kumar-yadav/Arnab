"use client";

import React, { useState } from "react";
import { ResumeStudioModal } from "../../components/ResumeStudioModal";
import Link from "next/link";
import { ArrowLeft, Compass, Sparkles } from "lucide-react";

export default function ResumePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121212] flex flex-col">
      <header className="h-16 border-b border-[#E2DBD0] bg-white flex items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-[#121212] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunity Hub</span>
        </Link>
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#121212]" />
          <span className="font-black text-sm tracking-tight">
            PATHFINDER <span className="font-light text-[#736E65]">OpenResume ATS Studio</span>
          </span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="px-3.5 py-1.5 rounded-xl bg-[#121212] text-white text-xs font-bold"
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
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-black text-[#121212]">OpenResume ATS Studio Closed</h2>
            <p className="text-sm text-[#736E65]">
              Click the button below to re-open the interactive resume parser & live editor.
            </p>
            <button
              onClick={() => setIsOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-[#121212] text-white font-bold text-xs shadow-md"
            >
              Launch ATS Resume Studio
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

