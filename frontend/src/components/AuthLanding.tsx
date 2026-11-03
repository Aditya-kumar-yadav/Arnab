"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { UserRole, DomainCheckResponse, ExternalJobData } from "../lib/types";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  Compass,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Lock,
  Building2,
  Mail,
  MapPin,
  Laptop,
  Check,
  Zap,
  Award,
  Users,
  Search,
  Globe,
  ExternalLink,
  ArrowUpRight,
  X,
  Clock
} from "lucide-react";

interface AuthLandingProps {
  onAuthSuccess: (tokenData: any) => void;
  onOpenTestModal: () => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ onAuthSuccess, onOpenTestModal }) => {
  const { user: clerkUser } = useUser();
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Live External Job Search Modal State (Accessible to Anyone)
  const [showLiveJobsModal, setShowLiveJobsModal] = useState<boolean>(false);
  const [landingSearchQuery, setLandingSearchQuery] = useState<string>("");
  const [landingPlatform, setLandingPlatform] = useState<"ALL" | "Unstop" | "LinkedIn" | "Internshala" | "Wellfound">("ALL");
  const [landingJobs, setLandingJobs] = useState<ExternalJobData[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchJobs = async () => {
      try {
        const jobs = await api.getExternalJobs(landingSearchQuery, landingPlatform);
        if (isMounted) setLandingJobs(jobs);
      } catch (e) {
        console.warn("Landing jobs fetch error:", e);
      }
    };
    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, [landingSearchQuery, landingPlatform]);

  const handleLandingDirectSearch = (platform: "Unstop" | "LinkedIn" | "Internshala" | "Wellfound") => {
    const query = landingSearchQuery.trim() || "Campus Fresher";
    let url = "";
    if (platform === "Unstop") {
      url = `https://unstop.com/jobs?searchTerm=${encodeURIComponent(query)}`;
    } else if (platform === "LinkedIn") {
      url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}`;
    } else if (platform === "Internshala") {
      url = `https://internshala.com/jobs/keywords-${encodeURIComponent(query.toLowerCase().replace(/\s+/g, "-"))}/`;
    } else if (platform === "Wellfound") {
      url = `https://wellfound.com/jobs?role=${encodeURIComponent(query)}`;
    }
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenJob = (url: string) => {
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  // Domain check state
  const [domainCheck, setDomainCheck] = useState<DomainCheckResponse | null>(null);

  // Common credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Student form state
  const [collegeName, setCollegeName] = useState("Birla Institute of Technology, Mesra");
  const [degree, setDegree] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [academicYear, setAcademicYear] = useState("3rd Year");
  const [graduationYear, setGraduationYear] = useState(2027);
  const [collegeLocation, setCollegeLocation] = useState("Ranchi, Jharkhand");
  const [preferredDomain, setPreferredDomain] = useState("Full Stack Development");
  const [isFirstGen, setIsFirstGen] = useState(true);
  const [isRural, setIsRural] = useState(true);

  // Recruiter form state
  const [companyName, setCompanyName] = useState("RuralTech Innovations");
  const [officialWebsite, setOfficialWebsite] = useState("https://ruraltechlabs.io");
  const [designation, setDesignation] = useState("Senior Technical Recruiter");
  const [phoneNumber, setPhoneNumber] = useState("+91-9876543210");
  const [industry, setIndustry] = useState("Software & Social Technology");
  const [location, setLocation] = useState("Bengaluru, India");

  // Dynamic live domain check
  useEffect(() => {
    if (!email || !email.includes("@")) {
      setDomainCheck(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const result = await api.checkDomain(email);
        setDomainCheck(result);
      } catch {
        setDomainCheck(null);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [email]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await api.login(email, password);
      onAuthSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Credentials Auto-Fill
  const handleQuickFill = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setErrorMessage("");
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please accept the terms of service and privacy agreement");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        email,
        password,
        confirm_password: confirmPassword,
        college_name: collegeName,
        degree,
        branch,
        academic_year: academicYear,
        graduation_year: Number(graduationYear),
        college_location: collegeLocation,
        preferred_domain: preferredDomain,
        is_first_generation: isFirstGen,
        is_rural_or_disadvantaged: isRural,
        skills: ["Python", "React", "SQL", "Git"]
      };
      const res = await api.registerStudent(payload);
      onAuthSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to register student");
    } finally {
      setLoading(false);
    }
  };

  const handleRecruiterRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!agreeTerms) {
      setErrorMessage("Please accept the terms of service and privacy agreement");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: fullName,
        work_email: email,
        phone_number: phoneNumber,
        designation,
        password,
        company_name: companyName,
        official_website: officialWebsite,
        industry,
        location,
        description: "Committed to bias-free campus talent acquisition."
      };
      const res = await api.registerRecruiter(payload);
      onAuthSuccess(res);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to register recruiter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#F7F8FF] text-[#0D0B2D]">
      {/* LEFT SECTION: Brand, Tagline & Editorial Showcase Cards */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#DDD6FE] bg-gradient-to-br from-[#F7F8FF] via-[#E6E0FF]/35 to-[#F7F8FF] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#A78BFA]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#5B4BFF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#DDD6FE] text-[#5B4BFF] text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#5B4BFF]" />
            <span>Campus-to-Employment Opportunity Matcher</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#0D0B2D]">
            Democratizing <br />
            <span className="text-[#5B4BFF] underline decoration-[#A78BFA] decoration-2 underline-offset-8">
              Campus Careers.
            </span>
          </h1>

          <p className="text-[#77758F] text-sm sm:text-base max-w-lg leading-relaxed font-medium">
            Connecting first-generation, rural, and economically disadvantaged learners with verified internships, jobs, and subsidized programs. Built with anti-bias blind review and explainable matching.
          </p>

          {/* Floating Opportunity Showcase Cards */}
          <div className="space-y-3.5 pt-4">
            {/* Opportunity Card 1 */}
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#DDD6FE] hover:border-[#5B4BFF] shadow-[0_8px_30px_rgba(91,75,255,0.06)] hover:shadow-[0_12px_36px_rgba(91,75,255,0.12)] transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0D0B2D]">
                      Full-Stack Engineering Apprentice
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E6E0FF] text-[#5B4BFF] border border-[#DDD6FE]">
                      ₹30,000 / mo
                    </span>
                  </div>
                  <div className="text-xs text-[#77758F] flex items-center gap-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#5B4BFF]" /> RuralTech Labs
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#77758F]" /> Remote (All India)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-white bg-[#5B4BFF] px-2.5 py-0.5 rounded-md shadow-xs">96% Fit</span>
                  <div className="text-[10px] text-[#77758F] font-semibold mt-0.5">Competency Match</div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#F7F8FF] flex flex-wrap gap-1.5 text-[10px] font-medium text-[#0D0B2D]">
                <span className="px-2 py-0.5 rounded bg-[#E6E0FF] border border-[#DDD6FE]">💻 Laptop Provided</span>
                <span className="px-2 py-0.5 rounded bg-[#F7F8FF] border border-[#DDD6FE]">Zero Prestige Filter</span>
                <span className="px-2 py-0.5 rounded bg-[#0D0B2D] text-white">Explainable AI</span>
              </div>
            </div>

            {/* Opportunity Card 2 */}
            <div className="p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#DDD6FE] hover:border-[#5B4BFF] shadow-[0_8px_30px_rgba(91,75,255,0.06)] hover:shadow-[0_12px_36px_rgba(91,75,255,0.12)] transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0D0B2D]">
                      AI Systems Fellowship (Subsidized)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E6E0FF] text-[#5B4BFF] border border-[#DDD6FE]">
                      Full Grant
                    </span>
                  </div>
                  <div className="text-xs text-[#77758F] flex items-center gap-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#5B4BFF]" /> NextGen AI Foundation
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Laptop className="w-3 h-3 text-[#77758F]" /> Cloud Compute Subsidized
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-white bg-[#5B4BFF] px-2.5 py-0.5 rounded-md shadow-xs">91% Fit</span>
                  <div className="text-[10px] text-[#77758F] font-semibold mt-0.5">Gap: 1 Free Course</div>
                </div>
              </div>
            </div>

            {/* Live External Jobs Button / Banner for Anyone */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-900 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4 text-amber-700" />
                </span>
                <div className="text-xs">
                  <span className="font-bold text-[#121212] block">
                    🌐 Direct Job Search (Unstop & Web)
                  </span>
                  <span className="text-[#59554E] text-[11px]">
                    Anyone can search fresh JDs across Unstop, LinkedIn & Internshala with 1-click redirects.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveJobsModal(true)}
                className="px-3.5 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-black transition-all shadow-sm flex items-center gap-1 shrink-0"
              >
                <span>Search Jobs ↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="relative z-10 pt-8 mt-6 border-t border-[#DDD6FE] text-xs text-[#77758F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A36A]" />
            <span>Anti-Bias Blind Reviews & Exact Domain Verification</span>
          </div>
          <button
            onClick={onOpenTestModal}
            className="text-[#5B4BFF] hover:underline underline-offset-4 font-mono font-bold text-[11px]"
          >
            Launch Judge Verification Sandbox →
          </button>
        </div>
      </div>

      {/* RIGHT SECTION: Interactive Lavender Glass Auth Box */}
      <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-[#DDD6FE] shadow-[0_12px_40px_rgba(91,75,255,0.08)]">
          {/* Toggle Mode: Login vs Register */}
          <div className="flex items-center p-1 bg-[#E6E0FF]/60 border border-[#DDD6FE] rounded-2xl mb-6">
            <button
              onClick={() => {
                setMode("LOGIN");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === "LOGIN"
                  ? "bg-[#5B4BFF] text-white shadow-md shadow-[#5B4BFF]/25"
                  : "text-[#77758F] hover:text-[#0D0B2D]"
              }`}
            >
              Sign In to PATHFINDER
            </button>
            <button
              onClick={() => {
                setMode("REGISTER");
                setStep(1);
                setErrorMessage("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === "REGISTER"
                  ? "bg-[#5B4BFF] text-white shadow-md shadow-[#5B4BFF]/25"
                  : "text-[#77758F] hover:text-[#0D0B2D]"
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Error message alert */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-[#E5484D] text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#E5484D] mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Real Clerk OAuth / Social Authentication */}
          <div className="mb-5">
            <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl bg-[#F7F8FF] hover:bg-[#E6E0FF]/60 border border-[#DDD6FE] hover:border-[#5B4BFF] text-[#0D0B2D] font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Clerk (Google / Social / Passkeys)</span>
              </button>
            </SignInButton>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DDD6FE]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono font-bold tracking-wider">
                <span className="bg-white px-2 text-[#77758F]">Or with PATHFINDER credentials</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MODE A: LOGIN FORM WITH QUICK FILL DEMO CHIPS
             ========================================================================= */}
          {mode === "LOGIN" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0D0B2D] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@bitmesra.ac.in or talent@ruraltechlabs.io"
                    className="w-full px-3.5 py-2.5 bg-[#F7F8FF] border border-[#DDD6FE] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 rounded-xl text-sm text-[#0D0B2D] placeholder:text-[#77758F]/60 outline-none transition-all pl-10"
                  />
                  <Mail className="w-4 h-4 text-[#77758F] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0D0B2D] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#F7F8FF] border border-[#DDD6FE] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 rounded-xl text-sm text-[#0D0B2D] placeholder:text-[#77758F]/60 outline-none transition-all pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-[#77758F] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#77758F] hover:text-[#0D0B2D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white font-bold text-sm transition-all shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? "Authenticating Session..." : "Sign In to Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* INTERACTIVE 1-CLICK DEMO AUTO-FILL CHIPS */}
              <div className="mt-5 p-3.5 bg-[#F7F8FF] border border-[#DDD6FE] rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-[#0D0B2D] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#5B4BFF]" />
                  <span>1-Click Test Credentials (Pre-Configured):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("student@bitmesra.ac.in", "StudentPass2026!")}
                    className="p-2 rounded-xl bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] text-left transition-all hover:shadow-xs"
                  >
                    <div className="text-[11px] font-bold text-[#0D0B2D]">🎓 Student (BIT Mesra)</div>
                    <div className="text-[9px] text-[#5B4BFF] font-mono">Institutional Verified</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("rahul.learner@gmail.com", "StudentPass2026!")}
                    className="p-2 rounded-xl bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] text-left transition-all hover:shadow-xs"
                  >
                    <div className="text-[11px] font-bold text-[#0D0B2D]">🌾 Rural Learner (Gmail)</div>
                    <div className="text-[9px] text-[#77758F] font-mono">Affiliation Pending</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("talent@ruraltechlabs.io", "RecruiterPass2026!")}
                    className="p-2 rounded-xl bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] text-left transition-all hover:shadow-xs"
                  >
                    <div className="text-[11px] font-bold text-[#0D0B2D]">💼 Verified Recruiter</div>
                    <div className="text-[9px] text-[#16A36A] font-mono font-semibold">RuralTech Labs</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("admin@pathfinder.ai", "AdminSecurePassword2026!")}
                    className="p-2 rounded-xl bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] text-left transition-all hover:shadow-xs"
                  >
                    <div className="text-[11px] font-bold text-[#0D0B2D]">🛡️ Root Administrator</div>
                    <div className="text-[9px] text-[#5B4BFF] font-mono font-semibold">Governance Console</div>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* =========================================================================
              MODE B: REGISTER FLOW (ROLE SELECTION + MULTI-STEP)
             ========================================================================= */}
          {mode === "REGISTER" && (
            <div className="space-y-5">
              {/* Step Indicators */}
              <div className="flex items-center justify-between text-xs text-[#77758F] pb-2 border-b border-[#DDD6FE]">
                <span className="font-bold text-[#0D0B2D]">
                  Step {step} of 3: {step === 1 ? "Role & Account" : step === 2 ? "Affiliation Details" : "Verification Preview"}
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-[#5B4BFF]" : "bg-[#DDD6FE]"}`} />
                  <span className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-[#5B4BFF]" : "bg-[#DDD6FE]"}`} />
                  <span className={`w-2 h-2 rounded-full ${step >= 3 ? "bg-[#5B4BFF]" : "bg-[#DDD6FE]"}`} />
                </div>
              </div>

              {/* STEP 1: Role Selection & Basic Credentials */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Role Switcher Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedRole("STUDENT")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedRole === "STUDENT"
                          ? "bg-white border-[#5B4BFF] ring-2 ring-[#5B4BFF]/30 shadow-xs"
                          : "bg-[#F7F8FF] border-[#DDD6FE] hover:border-[#A78BFA]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <GraduationCap className="w-5 h-5 text-[#5B4BFF]" />
                        {selectedRole === "STUDENT" && <Check className="w-4 h-4 text-[#5B4BFF]" />}
                      </div>
                      <div className="text-xs font-bold text-[#0D0B2D]">Continue as Student</div>
                      <div className="text-[11px] text-[#77758F] leading-tight mt-0.5">
                        Internships, subsidized training, explainable matching.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole("RECRUITER")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedRole === "RECRUITER"
                          ? "bg-white border-[#5B4BFF] ring-2 ring-[#5B4BFF]/30 shadow-xs"
                          : "bg-[#F7F8FF] border-[#DDD6FE] hover:border-[#A78BFA]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Briefcase className="w-5 h-5 text-[#5B4BFF]" />
                        {selectedRole === "RECRUITER" && <Check className="w-4 h-4 text-[#5B4BFF]" />}
                      </div>
                      <div className="text-xs font-bold text-[#0D0B2D]">Continue as Recruiter</div>
                      <div className="text-[11px] text-[#77758F] leading-tight mt-0.5">
                        Verified hiring, blind evaluations, high-potential learners.
                      </div>
                    </button>
                  </div>

                  {/* Common Credentials */}
                  <div>
                    <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={selectedRole === "STUDENT" ? "e.g. Priya Sharma" : "e.g. Alok Verma"}
                      className="w-full px-3.5 py-2.5 bg-[#F7F8FF] border border-[#DDD6FE] focus:border-[#5B4BFF] rounded-xl text-sm text-[#0D0B2D] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D0B2D] mb-1">
                      {selectedRole === "STUDENT" ? "College or Personal Email" : "Official Work Email"}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === "STUDENT" ? "student@bitmesra.ac.in or learner@gmail.com" : "recruiter@company.com"}
                      className="w-full px-3.5 py-2.5 bg-[#F7F8FF] border border-[#DDD6FE] focus:border-[#5B4BFF] rounded-xl text-sm text-[#0D0B2D] outline-none transition-all"
                    />
                    {/* Real-time Domain Recognition Pill */}
                    {domainCheck && (
                      <div className="mt-1.5 p-2 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] text-[11px] flex items-start gap-1.5 animate-in fade-in">
                        {domainCheck.is_institutional ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A] mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-[#77758F] mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-[#0D0B2D]">
                            {domainCheck.is_institutional
                              ? `Recognized College: ${domainCheck.institution_name}`
                              : domainCheck.is_public_provider
                              ? "Personal Email Provider"
                              : "Custom Domain"}
                          </span>
                          <p className="text-[#77758F] text-[10px] leading-tight mt-0.5">{domainCheck.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] focus:border-[#5B4BFF] rounded-xl text-xs text-[#0D0B2D] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] focus:border-[#5B4BFF] rounded-xl text-xs text-[#0D0B2D] outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName || !email || !password) {
                        setErrorMessage("Please complete all required fields");
                        return;
                      }
                      if (password !== confirmPassword) {
                        setErrorMessage("Passwords do not match");
                        return;
                      }
                      setErrorMessage("");
                      setStep(2);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-2 shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5"
                  >
                    Continue to Affiliation Details <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* STEP 2: Educational (Student) or Company (Recruiter) Info */}
              {step === 2 && (
                <div className="space-y-3.5">
                  {selectedRole === "STUDENT" ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[#0D0B2D] mb-1">College / University Name</label>
                        <input
                          type="text"
                          required
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          placeholder="Birla Institute of Technology, Mesra"
                          className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Degree</label>
                          <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="B.Tech"
                            className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Graduation Year</label>
                          <input
                            type="number"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Branch / Department</label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="Computer Science & Engineering"
                          className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0D0B2D] mb-1">College Location (City, State)</label>
                        <input
                          type="text"
                          value={collegeLocation}
                          onChange={(e) => setCollegeLocation(e.target.value)}
                          placeholder="Ranchi, Jharkhand"
                          className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                        />
                      </div>

                      {/* Social Equity and Affirmative Context Flags */}
                      <div className="p-3.5 rounded-2xl bg-[#E6E0FF]/40 border border-[#DDD6FE] space-y-2 mt-2">
                        <div className="text-[11px] font-bold text-[#0D0B2D] flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#5B4BFF]" />
                          Affirmative & Rural Representation Flags
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0D0B2D]">
                          <input
                            type="checkbox"
                            checked={isFirstGen}
                            onChange={(e) => setIsFirstGen(e.target.checked)}
                            className="w-4 h-4 rounded border-[#DDD6FE] text-[#5B4BFF] focus:ring-[#5B4BFF]"
                          />
                          <span>I am a first-generation college student in my family</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0D0B2D]">
                          <input
                            type="checkbox"
                            checked={isRural}
                            onChange={(e) => setIsRural(e.target.checked)}
                            className="w-4 h-4 rounded border-[#DDD6FE] text-[#5B4BFF] focus:ring-[#5B4BFF]"
                          />
                          <span>I am from a rural area or Tier-2/3 town</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Company / Organization Name</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="RuralTech Innovations"
                          className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Official Website</label>
                          <input
                            type="url"
                            required
                            value={officialWebsite}
                            onChange={(e) => setOfficialWebsite(e.target.value)}
                            placeholder="https://company.com"
                            className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Job Designation</label>
                          <input
                            type="text"
                            required
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Technical Recruiter"
                            className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#0D0B2D] mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91-9876543210"
                          className="w-full px-3 py-2 bg-[#F7F8FF] border border-[#DDD6FE] rounded-xl text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-2.5 rounded-xl bg-[#F7F8FF] hover:bg-[#E6E0FF]/50 text-[#77758F] font-bold text-xs border border-[#DDD6FE] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-2.5 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5"
                    >
                      Review Verification Status <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Verification Preview & Final Submission */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] space-y-3">
                    <div className="text-xs font-bold text-[#0D0B2D] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#5B4BFF]" />
                      <span>System Verification Diagnostic</span>
                    </div>

                    {selectedRole === "STUDENT" ? (
                      <div className="space-y-2 text-xs text-[#0D0B2D]">
                        <div className="flex items-center justify-between py-1 border-b border-[#DDD6FE]">
                          <span className="text-[#77758F]">Account Type:</span>
                          <span className="font-bold text-[#0D0B2D]">Student Profile</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#DDD6FE]">
                          <span className="text-[#77758F]">Email Address:</span>
                          <span className="font-mono text-[#0D0B2D]">{email}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#DDD6FE]">
                          <span className="text-[#77758F]">Domain Classification:</span>
                          <span className="font-bold text-[#0D0B2D]">
                            {domainCheck?.is_institutional ? "Verified Institutional Domain" : "Personal Email (Gmail/Outlook)"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-[#77758F]">Badge Issued Upon Signup:</span>
                          <span className="font-bold text-[#16A36A]">
                            {domainCheck?.is_institutional ? "Institutional Email Verified" : "Personal Email (Pending ID)"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-[#0D0B2D]">
                        <div className="flex items-center justify-between py-1 border-b border-[#DDD6FE]">
                          <span className="text-[#77758F]">Account Type:</span>
                          <span className="font-bold text-[#0D0B2D]">Recruiter Profile</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#DDD6FE]">
                          <span className="text-[#77758F]">Company:</span>
                          <span className="font-bold text-[#0D0B2D]">{companyName}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#DDD6FE]">
                          <span className="text-[#77758F]">Initial Status:</span>
                          <span className="font-bold text-[#5B4BFF]">Pending Administrative Review</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#DDD6FE] text-[11px] text-[#77758F] leading-snug">
                          Security Notice: Recruiters cannot publish jobs or view sensitive candidate information until approved by an administrator.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Acceptance */}
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-[#77758F]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#DDD6FE] text-[#5B4BFF] focus:ring-[#5B4BFF]"
                    />
                    <span>
                      I confirm my provided credentials are authentic, and agree to the PATHFINDER AI Anti-Bias Fair-Hiring Charter and Privacy Terms.
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 rounded-xl bg-[#F7F8FF] hover:bg-[#E6E0FF]/50 text-[#77758F] font-bold text-xs border border-[#DDD6FE] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={selectedRole === "STUDENT" ? handleStudentRegister : handleRecruiterRegister}
                      disabled={loading}
                      className="w-2/3 py-3 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white font-black text-sm transition-all shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? "Registering..." : "Complete Registration"}
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Live External Jobs Modal (For Anyone Browsing) */}
      {showLiveJobsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/70 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl p-6 sm:p-8 space-y-5 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                    Unstop & External Job Finder
                  </span>
                </div>
                <h3 className="font-black text-lg text-[#121212]">
                  Live Campus & Fresher Job Discovery
                </h3>
                <p className="text-xs text-[#736E65]">
                  Search verified JDs across Unstop, LinkedIn, and Internshala. Click any job to directly apply in 1-click!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLiveJobsModal(false)}
                className="w-8 h-8 rounded-full bg-white border border-[#E2DBD0] flex items-center justify-center hover:bg-[#EDE7DC] text-[#121212]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search & Platform Filter */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#736E65]" />
                  <input
                    type="text"
                    placeholder="Search any job role, company, or tech stack (e.g. Swiggy, SDE, React, Unstop)..."
                    value={landingSearchQuery}
                    onChange={(e) => setLandingSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-[#E2DBD0] bg-white text-xs font-medium text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                  />
                  {landingSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setLandingSearchQuery("")}
                      className="absolute right-3.5 top-3 text-[#736E65] hover:text-[#121212]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <select
                    value={landingPlatform}
                    onChange={(e) => setLandingPlatform(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-2xl border border-[#E2DBD0] bg-white text-xs font-bold text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                  >
                    <option value="ALL">All Platforms ({landingJobs.length})</option>
                    <option value="Unstop">Unstop Official Campus Hub</option>
                    <option value="LinkedIn">LinkedIn Jobs</option>
                    <option value="Internshala">Internshala</option>
                    <option value="Wellfound">Wellfound</option>
                  </select>
                </div>
              </div>

              {/* Dynamic 1-Click Search Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] font-bold text-[#736E65] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" />
                  Direct 1-Click Search:
                </span>
                <button
                  type="button"
                  onClick={() => handleLandingDirectSearch("Unstop")}
                  className="px-3 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>Search on Unstop</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleLandingDirectSearch("LinkedIn")}
                  className="px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>Search on LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleLandingDirectSearch("Internshala")}
                  className="px-3 py-1 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>Search on Internshala</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Jobs Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              {landingJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl bg-white border border-[#E2DBD0] hover:border-[#121212] transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase bg-[#EDE7DC] text-[#121212]">
                        {job.platform}
                      </span>
                      <span className="text-[10px] text-[#736E65] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {job.posted_time}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#736E65]">{job.company}</div>
                      <h4 className="text-xs font-black text-[#121212] line-clamp-1">
                        {job.title}
                      </h4>
                    </div>

                    <div className="text-[11px] text-[#59554E] flex items-center gap-3">
                      <span>📍 {job.location}</span>
                      <span className="font-bold text-emerald-800">💰 {job.stipend_or_salary}</span>
                    </div>

                    <p className="text-[11px] text-[#736E65] line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#E2DBD0]">
                    <button
                      type="button"
                      onClick={() => handleOpenJob(job.platform_url)}
                      className="w-full py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>🚀 Apply on {job.platform}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
