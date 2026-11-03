"use client";

import React from "react";
import { ProductHeroSection } from "./ProductHeroSection";
import { AIMatchingSimulator } from "./AIMatchingSimulator";
import { OpportunityShowcase } from "./OpportunityShowcase";
import { TPOPlacementSection } from "./TPOPlacementSection";
import { ExplainableAISection } from "./ExplainableAISection";
import { CareerRoadmapSection } from "./CareerRoadmapSection";
import { Compass, ShieldCheck, ArrowRight, Heart } from "lucide-react";

interface ProductLandingViewProps {
  onOpenAuthModal: (role?: "STUDENT" | "RECRUITER", mode?: "LOGIN" | "REGISTER") => void;
  onOpenTestModal: () => void;
}

export const ProductLandingView: React.FC<ProductLandingViewProps> = ({
  onOpenAuthModal,
  onOpenTestModal,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <ProductHeroSection
        onExploreOpportunities={() => scrollTo("explore-opportunities")}
        onDiscoverHowItWorks={() => scrollTo("how-it-works")}
        onGetStarted={() => onOpenAuthModal("STUDENT", "REGISTER")}
      />

      {/* Section A: AI Matching Engine Simulator */}
      <AIMatchingSimulator />

      {/* Section B: Intelligent Opportunity Discovery */}
      <OpportunityShowcase
        onSelectOpportunity={() => onOpenAuthModal("STUDENT", "LOGIN")}
        onExploreAll={() => onOpenAuthModal("STUDENT", "LOGIN")}
      />

      {/* Official TPO Cell: BIT Mesra Placement Listings */}
      <TPOPlacementSection onApplyOrLogin={() => onOpenAuthModal("STUDENT", "LOGIN")} />

      {/* Section C: Explainable AI (XAI) Deep Dive */}
      <ExplainableAISection />

      {/* Section D: Career Intelligence Roadmap */}
      <CareerRoadmapSection />

      {/* Bottom Conversion Banner */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-[#0D0B2D] via-[#161245] to-[#0D0B2D] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#5B4BFF_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#A78BFA] text-xs font-mono font-bold border border-white/15">
            <span>START YOUR VERIFIED CAREER VECTOR TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight">
            Ready To Disconnect Placement Outcomes From College Prestige?
          </h2>

          <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto leading-relaxed">
            Join thousands of verified students and inclusive hiring partners discovering opportunities based on
            genuine technical competencies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenAuthModal("STUDENT", "REGISTER")}
              className="px-7 py-3.5 rounded-2xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-sm font-bold shadow-xl shadow-[#5B4BFF]/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Get Started as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuthModal("RECRUITER", "REGISTER")}
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-bold hover:-translate-y-0.5 transition-all"
            >
              <span>Partner as Recruiter</span>
            </button>
          </div>
        </div>
      </section>

      {/* Professional Brand Footer */}
      <footer className="border-t border-[#DDD6FE] bg-white py-12 text-[#77758F] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center font-bold">
              <Compass className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#0D0B2D]">PATHFINDER AI</span>
              <p className="text-[11px] text-[#77758F]">
                Talent Has No Location. Opportunity Shouldn&apos;t Either.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <button onClick={() => scrollTo("explore-opportunities")} className="hover:text-[#5B4BFF]">
              Opportunities
            </button>
            <button onClick={() => scrollTo("how-it-works")} className="hover:text-[#5B4BFF]">
              ClearHire XAI
            </button>
            <button onClick={() => scrollTo("for-students")} className="hover:text-[#5B4BFF]">
              Career Roadmap
            </button>
            <button onClick={onOpenTestModal} className="hover:text-[#5B4BFF] font-mono">
              Acceptance Test Bench
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-[#77758F]">
            <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
            <span>SHA-256 Provenance Ledger • Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

