"use client";

import React from "react";
import { ArrowRight, Sparkles, Play, ShieldCheck, Cpu, CheckCircle2, TrendingUp } from "lucide-react";
import { HeroMatchingNetwork } from "./HeroMatchingNetwork";

interface ProductHeroSectionProps {
  onExploreOpportunities: () => void;
  onDiscoverHowItWorks: () => void;
  onGetStarted: () => void;
}

export const ProductHeroSection: React.FC<ProductHeroSectionProps> = ({
  onExploreOpportunities,
  onDiscoverHowItWorks,
  onGetStarted,
}) => {
  return (
    <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 overflow-hidden">
      {/* Background Subtle Atmospheric Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#A78BFA]/15 via-[#5B4BFF]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN: Editorial Brand Statement & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            {/* Small PATHFINDER AI Identity Label */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6E0FF] text-[#0D0B2D] text-xs font-mono font-bold border border-[#DDD6FE] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#5B4BFF] animate-pulse" />
              <span>INTELLIGENT TALENT ORCHESTRATION ENGINE</span>
            </div>

            {/* Powerful Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0D0B2D] tracking-tight leading-[1.08]">
              Your Potential. <br />
              Our <span className="text-[#5B4BFF]">Intelligence</span>. <br />
              Infinite <span className="text-[#5B4BFF]">Possibilities</span>.
            </h1>

            {/* Short, Meaningful Description */}
            <p className="text-base sm:text-lg text-[#77758F] leading-relaxed max-w-xl font-medium">
              PATHFINDER AI eliminates university tier prejudice. Our neural matching engine directly aligns
              student competency vectors with verified enterprise requirements through explainable,
              prestige-blind intelligence.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreOpportunities}
                className="px-6 py-3.5 rounded-2xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
              >
                <span>Explore Opportunities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onDiscoverHowItWorks}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F7F8FF] text-[#0D0B2D] border border-[#DDD6FE] text-xs sm:text-sm font-bold shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 text-[#5B4BFF] fill-[#5B4BFF]" />
                <span>Discover How It Works</span>
              </button>
            </div>

            {/* Micro Trust Proof Metrics */}
            <div className="pt-6 border-t border-[#DDD6FE]/80 grid grid-cols-3 gap-4">
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0D0B2D] font-mono">100%</span>
                <span className="text-[11px] text-[#77758F] block font-medium mt-0.5 leading-tight">
                  Blind Mode Anonymization
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#5B4BFF] font-mono">SHA-256</span>
                <span className="text-[11px] text-[#77758F] block font-medium mt-0.5 leading-tight">
                  Cryptographic Verification
                </span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#16A36A] font-mono">+10%</span>
                <span className="text-[11px] text-[#77758F] block font-medium mt-0.5 leading-tight">
                  Rural Affirmative Boost
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive AI Neural Matching Visualization (7 cols) */}
          <div className="lg:col-span-7">
            <HeroMatchingNetwork />
          </div>
        </div>
      </div>
    </section>
  );
};

