import { SignIn } from "@clerk/nextjs";
import { Compass, Sparkles, ShieldCheck, CheckCircle2, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FF] flex flex-col lg:flex-row">
      {/* LEFT PANEL: Brand Showcase & Value Proposition */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#DDD6FE] bg-gradient-to-br from-[#F7F8FF] via-[#E6E0FF]/40 to-[#F7F8FF] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#A78BFA]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#5B4BFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8">
          {/* Logo Header */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white shadow-md shadow-[#5B4BFF]/25 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#0D0B2D]">
                  PATHFINDER
                </span>
                <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-[#E6E0FF] text-[#5B4BFF]">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#77758F] font-medium tracking-wide">
                Campus-to-Employment Opportunity Matcher
              </p>
            </div>
          </Link>

          {/* Heading */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-xs font-bold border border-[#DDD6FE]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Equal Access Career Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0D0B2D] leading-tight">
              Talent Has No Location. <br />
              <span className="text-[#5B4BFF]">Opportunity Shouldn&apos;t Either.</span>
            </h1>
            <p className="text-sm sm:text-base text-[#77758F] max-w-lg leading-relaxed font-medium">
              Join thousands of first-generation learners and inclusive recruiters building merit-driven careers on zero-prestige bias matching.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2 max-w-md">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDD6FE] shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0D0B2D]">Anti-Bias Blind Review</h4>
                <p className="text-[11px] text-[#77758F]">
                  Candidate evaluations stripped of pedigree and demographic proxies for true merit.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDD6FE] shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0D0B2D]">Deterministic Domain Matcher</h4>
                <p className="text-[11px] text-[#77758F]">
                  Exact verification for college domains with substring spoofing defense.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-[#DDD6FE] shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#0D0B2D]">Explainable Skill-Gap Diagnostics</h4>
                <p className="text-[11px] text-[#77758F]">
                  Direct match breakdown and personalized bridges to free certified courses.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Badge */}
        <div className="relative z-10 pt-8 mt-8 border-t border-[#DDD6FE]/60 flex items-center justify-between text-xs text-[#77758F]">
          <span>Institutional Verification Protocol</span>
          <span className="font-mono text-[11px] font-bold text-[#5B4BFF]">PS-22 Finalist</span>
        </div>
      </div>

      {/* RIGHT PANEL: Authentication Form */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignIn
            fallbackRedirectUrl="/"
            forceRedirectUrl="/"
            appearance={{
              elements: {
                card: "bg-white border border-[#DDD6FE] rounded-3xl shadow-xl p-6",
                headerTitle: "text-[#0D0B2D] font-extrabold text-xl",
                headerSubtitle: "text-[#77758F] text-xs",
                formButtonPrimary:
                  "bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5B4BFF]/25 py-2.5 transition-all hover:-translate-y-0.5",
                formFieldInput:
                  "rounded-xl border-[#DDD6FE] text-xs text-[#0D0B2D] focus:border-[#5B4BFF] focus:ring-[#5B4BFF]/30 py-2.5",
                footerActionLink: "text-[#5B4BFF] font-bold hover:underline",
                socialButtonsBlockButton:
                  "border border-[#DDD6FE] hover:border-[#5B4BFF] rounded-xl text-xs font-semibold text-[#0D0B2D] hover:bg-[#E6E0FF]/30 transition-all",
                dividerLine: "bg-[#DDD6FE]",
                dividerText: "text-[#77758F] text-xs font-medium",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
