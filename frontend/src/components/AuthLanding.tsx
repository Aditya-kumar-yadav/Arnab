"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { UserRole, DomainCheckResponse } from "../lib/types";
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
  Users
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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-[#FAF8F5] text-[#121212]">
      {/* LEFT SECTION: Brand, Tagline & Editorial Showcase Cards */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#E2DBD0] bg-[#F4EFE6]/50">
        <div className="space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#D9D2C7] text-[#121212] text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
            <span>Campus-to-Employment Opportunity Matcher</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#121212]">
            Democratizing <br />
            <span className="underline decoration-2 underline-offset-8 decoration-[#121212]">
              Campus Careers.
            </span>
          </h1>

          <p className="text-[#59554E] text-sm sm:text-base max-w-lg leading-relaxed font-medium">
            Connecting first-generation, rural, and economically disadvantaged learners with verified internships, jobs, and subsidized programs. Built with anti-bias blind review and explainable matching.
          </p>

          {/* Floating Opportunity Showcase Cards (Beige & White Aesthetic) */}
          <div className="space-y-3.5 pt-4">
            {/* Opportunity Card 1 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm hover:border-[#121212] transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#121212]">
                      Full-Stack Engineering Apprentice
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7]">
                      ₹30,000 / mo
                    </span>
                  </div>
                  <div className="text-xs text-[#736E65] flex items-center gap-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#59554E]" /> RuralTech Labs
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#59554E]" /> Remote (All India)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#121212] bg-[#EDE7DC] px-2 py-0.5 rounded">96% Fit</span>
                  <div className="text-[10px] text-[#736E65] font-semibold mt-0.5">Competency Match</div>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[#F4EFE6] flex flex-wrap gap-1.5 text-[10px] font-medium text-[#423E37]">
                <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E2DBD0]">💻 Laptop Provided</span>
                <span className="px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E2DBD0]">Zero Prestige Filter</span>
                <span className="px-2 py-0.5 rounded bg-[#121212] text-white">Explainable AI</span>
              </div>
            </div>

            {/* Opportunity Card 2 */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm hover:border-[#121212] transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#121212]">
                      AI Systems Fellowship (Subsidized)
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7]">
                      Full Grant
                    </span>
                  </div>
                  <div className="text-xs text-[#736E65] flex items-center gap-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#59554E]" /> NextGen AI Foundation
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Laptop className="w-3 h-3 text-[#59554E]" /> Cloud Compute Subsidized
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-[#121212] bg-[#EDE7DC] px-2 py-0.5 rounded">91% Fit</span>
                  <div className="text-[10px] text-[#736E65] font-semibold mt-0.5">Gap: 1 Free Course</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-8 mt-6 border-t border-[#E2DBD0] text-xs text-[#59554E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#121212]" />
            <span>Anti-Bias Blind Reviews & Exact Domain Verification</span>
          </div>
          <button
            onClick={onOpenTestModal}
            className="text-[#121212] hover:underline underline-offset-4 font-mono font-bold text-[11px]"
          >
            Launch Judge Verification Sandbox →
          </button>
        </div>
      </div>

      {/* RIGHT SECTION: Interactive White & Beige Auth Box */}
      <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2DBD0] shadow-sm">
          {/* Toggle Mode: Login vs Register */}
          <div className="flex items-center p-1 bg-[#FAF8F5] border border-[#E2DBD0] rounded-2xl mb-6">
            <button
              onClick={() => {
                setMode("LOGIN");
                setErrorMessage("");
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === "LOGIN"
                  ? "bg-[#121212] text-white shadow-sm"
                  : "text-[#736E65] hover:text-[#121212]"
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
                  ? "bg-[#121212] text-white shadow-sm"
                  : "text-[#736E65] hover:text-[#121212]"
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Error message alert */}
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-[#FDF2F2] border border-[#F87171] text-[#991B1B] text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Real Clerk OAuth / Social Authentication */}
          <div className="mb-5">
            <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#D9D2C7] hover:border-[#121212] text-[#121212] font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-sm"
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
                <div className="w-full border-t border-[#E2DBD0]" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono font-bold tracking-wider">
                <span className="bg-white px-2 text-[#8C877D]">Or with PATHFINDER credentials</span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MODE A: LOGIN FORM WITH QUICK FILL DEMO CHIPS (MAKES IT VERY INTERESTING)
             ========================================================================= */}
          {mode === "LOGIN" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@bitmesra.ac.in or talent@ruraltechlabs.io"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D2C7] focus:border-[#121212] rounded-xl text-sm text-[#121212] placeholder:text-[#A8A297] outline-none transition-all pl-10"
                  />
                  <Mail className="w-4 h-4 text-[#736E65] absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D2C7] focus:border-[#121212] rounded-xl text-sm text-[#121212] placeholder:text-[#A8A297] outline-none transition-all pl-10 pr-10"
                  />
                  <Lock className="w-4 h-4 text-[#736E65] absolute left-3.5 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#736E65] hover:text-[#121212]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? "Authenticating Session..." : "Sign In to Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* INTERACTIVE 1-CLICK DEMO AUTO-FILL CHIPS */}
              <div className="mt-5 p-3.5 bg-[#FAF8F5] border border-[#E2DBD0] rounded-2xl space-y-2">
                <div className="text-[11px] font-bold text-[#121212] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#121212]" />
                  <span>1-Click Test Credentials (Pre-Configured):</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickFill("student@bitmesra.ac.in", "StudentPass2026!")}
                    className="p-2 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#121212] text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-[#121212]">🎓 Student (BIT Mesra)</div>
                    <div className="text-[9px] text-[#736E65] font-mono">Institutional Verified</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("rahul.learner@gmail.com", "StudentPass2026!")}
                    className="p-2 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#121212] text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-[#121212]">🌾 Rural Learner (Gmail)</div>
                    <div className="text-[9px] text-[#736E65] font-mono">Affiliation Pending</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("talent@ruraltechlabs.io", "RecruiterPass2026!")}
                    className="p-2 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#121212] text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-[#121212]">💼 Verified Recruiter</div>
                    <div className="text-[9px] text-[#736E65] font-mono">RuralTech Labs</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickFill("admin@pathfinder.ai", "AdminSecurePassword2026!")}
                    className="p-2 rounded-lg bg-white border border-[#D9D2C7] hover:border-[#121212] text-left transition-all"
                  >
                    <div className="text-[11px] font-bold text-[#121212]">🛡️ Root Administrator</div>
                    <div className="text-[9px] text-[#736E65] font-mono">Governance Console</div>
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
              <div className="flex items-center justify-between text-xs text-[#736E65] pb-2 border-b border-[#E2DBD0]">
                <span className="font-bold text-[#121212]">
                  Step {step} of 3: {step === 1 ? "Role & Account" : step === 2 ? "Affiliation Details" : "Verification Preview"}
                </span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-[#121212]" : "bg-[#D9D2C7]"}`} />
                  <span className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-[#121212]" : "bg-[#D9D2C7]"}`} />
                  <span className={`w-2 h-2 rounded-full ${step >= 3 ? "bg-[#121212]" : "bg-[#D9D2C7]"}`} />
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
                          ? "bg-[#FAF8F5] border-[#121212] shadow-sm"
                          : "bg-white border-[#E2DBD0] hover:border-[#121212]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <GraduationCap className="w-5 h-5 text-[#121212]" />
                        {selectedRole === "STUDENT" && <Check className="w-4 h-4 text-[#121212]" />}
                      </div>
                      <div className="text-xs font-bold text-[#121212]">Continue as Student</div>
                      <div className="text-[11px] text-[#736E65] leading-tight mt-0.5">
                        Internships, subsidized training, explainable matching.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedRole("RECRUITER")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        selectedRole === "RECRUITER"
                          ? "bg-[#FAF8F5] border-[#121212] shadow-sm"
                          : "bg-white border-[#E2DBD0] hover:border-[#121212]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <Briefcase className="w-5 h-5 text-[#121212]" />
                        {selectedRole === "RECRUITER" && <Check className="w-4 h-4 text-[#121212]" />}
                      </div>
                      <div className="text-xs font-bold text-[#121212]">Continue as Recruiter</div>
                      <div className="text-[11px] text-[#736E65] leading-tight mt-0.5">
                        Verified hiring, blind evaluations, high-potential learners.
                      </div>
                    </button>
                  </div>

                  {/* Common Credentials */}
                  <div>
                    <label className="block text-xs font-bold text-[#121212] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={selectedRole === "STUDENT" ? "e.g. Priya Sharma" : "e.g. Alok Verma"}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D2C7] focus:border-[#121212] rounded-xl text-sm text-[#121212] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#121212] mb-1">
                      {selectedRole === "STUDENT" ? "College or Personal Email" : "Official Work Email"}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === "STUDENT" ? "student@bitmesra.ac.in or learner@gmail.com" : "recruiter@company.com"}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D2C7] focus:border-[#121212] rounded-xl text-sm text-[#121212] outline-none transition-all"
                    />
                    {/* Real-time Domain Recognition Pill */}
                    {domainCheck && (
                      <div className="mt-1.5 p-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-[11px] flex items-start gap-1.5 animate-in fade-in">
                        {domainCheck.is_institutional ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#121212] mt-0.5 shrink-0" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-[#736E65] mt-0.5 shrink-0" />
                        )}
                        <div>
                          <span className="font-bold text-[#121212]">
                            {domainCheck.is_institutional
                              ? `Recognized College: ${domainCheck.institution_name}`
                              : domainCheck.is_public_provider
                              ? "Personal Email Provider"
                              : "Custom Domain"}
                          </span>
                          <p className="text-[#59554E] text-[10px] leading-tight mt-0.5">{domainCheck.reason}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#121212] mb-1">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] focus:border-[#121212] rounded-xl text-xs text-[#121212] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#121212] mb-1">Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] focus:border-[#121212] rounded-xl text-xs text-[#121212] outline-none"
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
                    className="w-full py-2.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 mt-2"
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
                        <label className="block text-xs font-bold text-[#121212] mb-1">College / University Name</label>
                        <input
                          type="text"
                          required
                          value={collegeName}
                          onChange={(e) => setCollegeName(e.target.value)}
                          placeholder="Birla Institute of Technology, Mesra"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#121212] mb-1">Degree</label>
                          <input
                            type="text"
                            value={degree}
                            onChange={(e) => setDegree(e.target.value)}
                            placeholder="B.Tech"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#121212] mb-1">Graduation Year</label>
                          <input
                            type="number"
                            value={graduationYear}
                            onChange={(e) => setGraduationYear(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#121212] mb-1">Branch / Department</label>
                        <input
                          type="text"
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          placeholder="Computer Science & Engineering"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#121212] mb-1">College Location (City, State)</label>
                        <input
                          type="text"
                          value={collegeLocation}
                          onChange={(e) => setCollegeLocation(e.target.value)}
                          placeholder="Ranchi, Jharkhand"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                        />
                      </div>

                      {/* Social Equity and Affirmative Context Flags */}
                      <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-2 mt-2">
                        <div className="text-[11px] font-bold text-[#121212] flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#121212]" />
                          Affirmative & Rural Representation Flags
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#423E37]">
                          <input
                            type="checkbox"
                            checked={isFirstGen}
                            onChange={(e) => setIsFirstGen(e.target.checked)}
                            className="w-4 h-4 rounded border-[#CEBFAD] text-[#121212] focus:ring-0"
                          />
                          <span>I am a first-generation college student in my family</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#423E37]">
                          <input
                            type="checkbox"
                            checked={isRural}
                            onChange={(e) => setIsRural(e.target.checked)}
                            className="w-4 h-4 rounded border-[#CEBFAD] text-[#121212] focus:ring-0"
                          />
                          <span>I am from a rural area or Tier-2/3 town</span>
                        </label>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[#121212] mb-1">Company / Organization Name</label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="RuralTech Innovations"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#121212] mb-1">Official Website</label>
                          <input
                            type="url"
                            required
                            value={officialWebsite}
                            onChange={(e) => setOfficialWebsite(e.target.value)}
                            placeholder="https://company.com"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#121212] mb-1">Job Designation</label>
                          <input
                            type="text"
                            required
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="Technical Recruiter"
                            className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#121212] mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+91-9876543210"
                          className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#736E65] font-bold text-xs border border-[#D9D2C7] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-2/3 py-2.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      Review Verification Status <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Verification Preview & Final Submission */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-3">
                    <div className="text-xs font-bold text-[#121212] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#121212]" />
                      <span>System Verification Diagnostic</span>
                    </div>

                    {selectedRole === "STUDENT" ? (
                      <div className="space-y-2 text-xs text-[#423E37]">
                        <div className="flex items-center justify-between py-1 border-b border-[#E2DBD0]">
                          <span className="text-[#736E65]">Account Type:</span>
                          <span className="font-bold text-[#121212]">Student Profile</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#E2DBD0]">
                          <span className="text-[#736E65]">Email Address:</span>
                          <span className="font-mono text-[#121212]">{email}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#E2DBD0]">
                          <span className="text-[#736E65]">Domain Classification:</span>
                          <span className="font-bold text-[#121212]">
                            {domainCheck?.is_institutional ? "Verified Institutional Domain" : "Personal Email (Gmail/Outlook)"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-[#736E65]">Badge Issued Upon Signup:</span>
                          <span className="font-bold text-[#121212]">
                            {domainCheck?.is_institutional ? "Institutional Email Verified" : "Personal Email (Pending ID)"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-[#423E37]">
                        <div className="flex items-center justify-between py-1 border-b border-[#E2DBD0]">
                          <span className="text-[#736E65]">Account Type:</span>
                          <span className="font-bold text-[#121212]">Recruiter Profile</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#E2DBD0]">
                          <span className="text-[#736E65]">Company:</span>
                          <span className="font-bold text-[#121212]">{companyName}</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#E2DBD0]">
                          <span className="text-[#736E65]">Initial Status:</span>
                          <span className="font-bold text-[#121212]">Pending Administrative Review</span>
                        </div>
                        <div className="p-2 rounded bg-white border border-[#CEBFAD] text-[11px] text-[#59554E] leading-snug">
                          Security Notice: Recruiters cannot publish jobs or view sensitive candidate information until approved by an administrator.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Acceptance */}
                  <label className="flex items-start gap-2 cursor-pointer text-xs text-[#59554E]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-[#CEBFAD] text-[#121212] focus:ring-0"
                    />
                    <span>
                      I confirm my provided credentials are authentic, and agree to the PATHFINDER AI Anti-Bias Fair-Hiring Charter and Privacy Terms.
                    </span>
                  </label>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-3 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#736E65] font-bold text-xs border border-[#D9D2C7] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={selectedRole === "STUDENT" ? handleStudentRegister : handleRecruiterRegister}
                      disabled={loading}
                      className="w-2/3 py-3 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-black text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
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
    </div>
  );
};
