"use client";

import React, { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  ArrowUpRight,
  Bookmark,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  ChevronRight
} from "lucide-react";

interface OpportunityItem {
  id: string;
  type: "INTERNSHIP" | "GRADUATE" | "APPRENTICESHIP" | "SUBSIDIZED" | "SCHOLARSHIP";
  title: string;
  company: string;
  domain: string;
  location: string;
  stipend: string;
  matchScore: number;
  featured?: boolean;
  isVerifiedEmployer: boolean;
  requiredSkills: string[];
  affirmativeBoost?: string;
  deadline: string;
  description: string;
}

const SAMPLE_OPPORTUNITIES: OpportunityItem[] = [
  {
    id: "opp-1",
    type: "SUBSIDIZED",
    title: "Software Engineering Fellow (Rural Digital Commons)",
    company: "RuralTech Labs & Systems",
    domain: "Full Stack & Social Technology",
    location: "Ranchi / Remote India",
    stipend: "₹45,000 / month + Equipment Grant",
    matchScore: 97,
    featured: true,
    isVerifiedEmployer: true,
    requiredSkills: ["Python", "FastAPI", "React", "PostgreSQL", "Offline-First PWAs"],
    affirmativeBoost: "Tier-2/3 & First-Gen Priority (+10% Boost)",
    deadline: "Dec 30, 2026",
    description:
      "Design open-source data synchronization engines for community healthcare and rural education networks. 100% blind evaluation policy.",
  },
  {
    id: "opp-2",
    type: "INTERNSHIP",
    title: "Distributed Systems & Cloud Infrastructure Intern",
    company: "Microsoft Research & Azure Core",
    domain: "Cloud Computing & Systems",
    location: "Bengaluru, Karnataka",
    stipend: "₹1,25,000 / month",
    matchScore: 94,
    isVerifiedEmployer: true,
    requiredSkills: ["Python", "Distributed Systems", "SQL", "Docker"],
    deadline: "Jan 15, 2027",
    description:
      "Build high-throughput telemetry pipelines for distributed databases with sub-millisecond query consensus guarantees.",
  },
  {
    id: "opp-3",
    type: "GRADUATE",
    title: "Associate AI Research Engineer",
    company: "Google DeepMind",
    domain: "Machine Learning & NLP",
    location: "Bengaluru / Hybrid",
    stipend: "₹24,00,000 – ₹32,00,000 CTC",
    matchScore: 92,
    isVerifiedEmployer: true,
    requiredSkills: ["Python", "PyTorch", "Transformers", "Algorithms"],
    deadline: "Jan 30, 2027",
    description:
      "Join foundational multimodal model optimization teams working on reasoning, code generation, and synthetic benchmark verification.",
  },
  {
    id: "opp-4",
    type: "APPRENTICESHIP",
    title: "FinTech Infrastructure Engineering Apprentice",
    company: "NPCI (National Payments Corporation of India)",
    domain: "FinTech & Transaction Security",
    location: "Mumbai / Hyderabad",
    stipend: "₹55,000 / month + Fast-track Full-time Offer",
    matchScore: 91,
    isVerifiedEmployer: true,
    requiredSkills: ["Java", "SQL", "Microservices", "REST APIs"],
    affirmativeBoost: "State University Accredited Track",
    deadline: "Feb 10, 2027",
    description:
      "Support next-generation UPI real-time settlement rails processing 12 billion monthly transactions with 99.999% reliability.",
  },
  {
    id: "opp-5",
    type: "SCHOLARSHIP",
    title: "Anita Borg Institute Women in STEM Fellowship",
    company: "Google Global Inclusion Fund",
    domain: "Academic Grant & Mentorship",
    location: "All-India Virtual / New Delhi",
    stipend: "₹1,50,000 Tuition Grant + 1:1 Senior Staff Mentorship",
    matchScore: 96,
    isVerifiedEmployer: true,
    requiredSkills: ["Computer Science", "Academic Excellence", "Community Leadership"],
    deadline: "Feb 28, 2027",
    description:
      "Prestigious merit and inclusion scholarship for women in computer science and software systems engineering across Tier-1/2/3 institutions.",
  },
];

interface OpportunityShowcaseProps {
  onSelectOpportunity?: (opp: OpportunityItem) => void;
  onExploreAll?: () => void;
}

export const OpportunityShowcase: React.FC<OpportunityShowcaseProps> = ({
  onSelectOpportunity,
  onExploreAll,
}) => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedOppForDrawer, setSelectedOppForDrawer] = useState<OpportunityItem | null>(null);

  const filteredOpportunities =
    activeTab === "ALL"
      ? SAMPLE_OPPORTUNITIES
      : SAMPLE_OPPORTUNITIES.filter((o) => o.type === activeTab);

  const featured = SAMPLE_OPPORTUNITIES.find((o) => o.featured) || SAMPLE_OPPORTUNITIES[0];

  return (
    <section id="explore-opportunities" className="py-16 sm:py-24 bg-[#F7F8FF] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-xs font-mono font-bold mb-3 border border-[#DDD6FE]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SECTION B • INTELLIGENT OPPORTUNITY DISCOVERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0D0B2D] tracking-tight leading-tight">
              Prestige-Blind Opportunities. Verified Employers.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#77758F] leading-relaxed">
              Every internship, graduate pathway, and fellowship is cryptographically authenticated and
              ranked exclusively by competence alignment and affirmative fairness.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#DDD6FE] shadow-2xs self-start md:self-auto">
            {[
              { key: "ALL", label: "All Pathways" },
              { key: "SUBSIDIZED", label: "Rural & Subsidized" },
              { key: "INTERNSHIP", label: "Internships" },
              { key: "GRADUATE", label: "Graduate Roles" },
              { key: "SCHOLARSHIP", label: "Scholarships" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? "bg-[#5B4BFF] text-white shadow-xs"
                    : "text-[#77758F] hover:text-[#0D0B2D] hover:bg-[#F7F8FF]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetrical Grid: 1 Featured Spotlight Card (Large) + 4 Editorial Cards */}
        <div className="space-y-6">
          {/* FEATURED SPOTLIGHT CARD (Wide Hero Format) */}
          {activeTab === "ALL" && (
            <div className="relative rounded-3xl bg-white border-2 border-[#5B4BFF] p-6 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(91,75,255,0.1)] overflow-hidden">
              <div className="absolute top-0 right-0 px-6 py-2 rounded-bl-3xl bg-[#5B4BFF] text-white text-xs font-mono font-black tracking-wider uppercase flex items-center gap-2 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Featured Affirmative Action Spotlight</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-4">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] border border-[#DDD6FE]">
                      {featured.type} • {featured.domain}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-[#16A36A] font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Authority Employer</span>
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-[#0D0B2D] tracking-tight">
                    {featured.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-[#77758F] font-medium">
                    <span className="text-sm font-bold text-[#0D0B2D]">{featured.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#5B4BFF]" />
                      {featured.location}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-[#16A36A]">
                      <DollarSign className="w-3.5 h-3.5" />
                      {featured.stipend}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Closes {featured.deadline}
                    </span>
                  </div>

                  <p className="text-sm text-[#0D0B2D]/80 leading-relaxed max-w-3xl">
                    {featured.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-xs font-mono text-[#77758F] mr-1">Target Competencies:</span>
                    {featured.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#F7F8FF] text-[#0D0B2D] border border-[#DDD6FE]"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side: AI Match & Action */}
                <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center p-6 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] text-center lg:text-right space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Top Percentile Match</span>
                    </div>
                    <div className="text-4xl font-black text-[#5B4BFF] font-mono tracking-tight">
                      {featured.matchScore}% Fit
                    </div>
                    <span className="text-[11px] text-[#77758F] block mt-0.5">
                      ClearHire™ Algorithmic Compatibility
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (onSelectOpportunity) onSelectOpportunity(featured);
                      else {
                        const el = document.getElementById("ai-matching-simulator");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs font-bold shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Inspect Neural Match</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GRID OF OTHER OPPORTUNITIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOpportunities
              .filter((o) => !o.featured || activeTab !== "ALL")
              .map((opp) => (
                <div
                  key={opp.id}
                  className="rounded-3xl bg-white border border-[#DDD6FE] p-6 hover:border-[#5B4BFF] hover:shadow-[0_12px_32px_rgba(91,75,255,0.08)] transition-all flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#E6E0FF] text-[#5B4BFF]">
                        {opp.type}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono font-black text-xs text-[#5B4BFF]">
                        <span>{opp.matchScore}% AI FIT</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-black text-[#0D0B2D] tracking-tight group-hover:text-[#5B4BFF] transition-colors">
                      {opp.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#77758F]">
                      <span className="font-bold text-[#0D0B2D] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />
                        {opp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#5B4BFF]" />
                        {opp.location}
                      </span>
                    </div>

                    <p className="text-xs text-[#77758F] line-clamp-2 leading-relaxed">
                      {opp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.requiredSkills.slice(0, 3).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F7F8FF] text-[#0D0B2D] border border-[#DDD6FE]"
                        >
                          {sk}
                        </span>
                      ))}
                      {opp.requiredSkills.length > 3 && (
                        <span className="text-[10px] font-mono text-[#77758F] px-1.5 py-0.5">
                          +{opp.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#DDD6FE]/70 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#16A36A] font-mono">{opp.stipend}</span>
                    <button
                      onClick={() => {
                        if (onSelectOpportunity) onSelectOpportunity(opp);
                        else {
                          const el = document.getElementById("ai-matching-simulator");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#F7F8FF] group-hover:bg-[#5B4BFF] text-[#0D0B2D] group-hover:text-white border border-[#DDD6FE] group-hover:border-[#5B4BFF] text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

