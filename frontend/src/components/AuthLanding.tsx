"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { UserRole, DomainCheckResponse } from "../lib/types";
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
  Cpu,
  TrendingUp,
  FileText
} from "lucide-react";

interface AuthLandingProps {
  onAuthSuccess: (tokenData: any) => void;
  onOpenTestModal: () => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ onAuthSuccess, onOpenTestModal }) => {
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [selectedRole, setSelectedRole] = useState<UserRole>("STUDENT");
  const [step, setStep] = useState<number>(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Domain check state
  const [domainCheck, setDomainCheck] = useState<DomainCheckResponse | null>(null);
  const [checkingDomain, setCheckingDomain] = useState<boolean>(false);

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
        setCheckingDomain(true);
        const result = await api.checkDomain(email);
        setDomainCheck(result);
      } catch {
        setDomainCheck(null);
      } finally {
        setCheckingDomain(false);
      }
    }, 450);

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-zinc-950 text-zinc-100">
      {/* LEFT SECTION: Brand, Pitch, Floating Opportunity Cards */}
      <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-zinc-800/80 bg-radial from-indigo-950/20 via-zinc-950 to-zinc-950 relative overflow-hidden">
        {/* Glow ambient background circles */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI-Driven Opportunity Equity Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Bridging Campuses to <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              High-Impact Careers.
            </span>
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-lg leading-relaxed">
            Connecting first-generation, rural, and economically disadvantaged learners with verified internships, jobs, and subsidized programs. Built with bias-prevention and explainable matching.
          </p>

          {/* Floating Opportunity Showcase Cards */}
          <div className="space-y-3.5 pt-4">
            {/* Opportunity Card 1 */}
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 backdrop-blur-md shadow-lg hover:border-zinc-700 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                      Full-Stack Engineering Apprentice
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      ₹30,000 / mo
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-zinc-500" /> RuralTech Labs
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-500" /> Remote (All India)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-400">96% Fit</span>
                  <div className="text-[10px] text-zinc-400">Affirmative Match</div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex flex-wrap gap-1.5 text-[10px] text-zinc-300">
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60">Laptop Provided</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/60">No Tier-1 College Filter</span>
                <span className="px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/40">Explainable AI</span>
              </div>
            </div>

            {/* Opportunity Card 2 */}
            <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 backdrop-blur-md shadow-lg hover:border-zinc-700 transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors">
                      AI & Data Science Fellowship
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/40">
                      Subsidized Training
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-zinc-500" /> NextGen AI Foundation
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Laptop className="w-3 h-3 text-zinc-500" /> Cloud Compute Grant
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-indigo-400">91% Fit</span>
                  <div className="text-[10px] text-zinc-400">Skill Gap: 1 course</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="pt-8 mt-6 border-t border-zinc-800/60 text-xs text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Blind-Hiring Protocol & Anti-Bias Verification</span>
          </div>
          <button
            onClick={onOpenTestModal}
            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 font-mono text-[11px]"
          >
            Launch Judge Verification Sandbox →
          </button>
        </div>
      </div>

      {/* RIGHT SECTION: Multi-Role Auth Form */}
      <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center max-w-xl mx-auto w-full">
        {/* Toggle Mode: Login vs Register */}
        <div className="flex items-center p-1 bg-zinc-900 border border-zinc-800 rounded-xl mb-6">
          <button
            onClick={() => {
              setMode("LOGIN");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "LOGIN"
                ? "bg-zinc-800 text-zinc-100 shadow-md border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
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
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "REGISTER"
                ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-900/30"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error message alert */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-950/80 border border-red-800/80 text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            MODE A: LOGIN FORM
           ========================================================================= */}
        {mode === "LOGIN" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@bitmesra.ac.in or work@company.com"
                  className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all pl-10"
                />
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all pl-10 pr-10"
                />
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-zinc-950 font-bold text-sm transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In with Secure Session"}
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials Reminder */}
            <div className="mt-4 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-zinc-400 space-y-1">
              <span className="font-semibold text-zinc-300">Quick Test Credentials (Pre-Seeded):</span>
              <div className="font-mono text-[11px] text-zinc-400 flex flex-col gap-0.5">
                <span>Student: <code className="text-cyan-300">student@bitmesra.ac.in</code> / <code className="text-zinc-300">StudentPass2026!</code></span>
                <span>Recruiter: <code className="text-purple-300">talent@ruraltechlabs.io</code> / <code className="text-zinc-300">RecruiterPass2026!</code></span>
                <span>Admin: <code className="text-red-300">admin@pathfinder.ai</code> / <code className="text-zinc-300">AdminSecurePassword2026!</code></span>
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
            <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
              <span className="font-semibold text-zinc-200">
                Step {step} of 3: {step === 1 ? "Role & Account" : step === 2 ? "Affiliation Details" : "Verification Preview"}
              </span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className={`w-2 h-2 rounded-full ${step >= 1 ? "bg-cyan-400" : "bg-zinc-800"}`} />
                <span className={`w-2 h-2 rounded-full ${step >= 2 ? "bg-cyan-400" : "bg-zinc-800"}`} />
                <span className={`w-2 h-2 rounded-full ${step >= 3 ? "bg-cyan-400" : "bg-zinc-800"}`} />
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
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedRole === "STUDENT"
                        ? "bg-indigo-950/50 border-indigo-500 shadow-md shadow-indigo-900/30"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <GraduationCap className={`w-5 h-5 ${selectedRole === "STUDENT" ? "text-indigo-400" : "text-zinc-400"}`} />
                      {selectedRole === "STUDENT" && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="text-xs font-bold text-zinc-100">Continue as Student</div>
                    <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      Internships, subsidized programs, explainable matching.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole("RECRUITER")}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedRole === "RECRUITER"
                        ? "bg-purple-950/50 border-purple-500 shadow-md shadow-purple-900/30"
                        : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Briefcase className={`w-5 h-5 ${selectedRole === "RECRUITER" ? "text-purple-400" : "text-zinc-400"}`} />
                      {selectedRole === "RECRUITER" && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <div className="text-xs font-bold text-zinc-100">Continue as Recruiter</div>
                    <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      Verified hiring, blind evaluations, high-potential learners.
                    </div>
                  </button>
                </div>

                {/* Common Credentials */}
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === "STUDENT" ? "e.g. Priya Sharma" : "e.g. Alok Verma"}
                    className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    {selectedRole === "STUDENT" ? "College or Personal Email" : "Official Work Email"}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={selectedRole === "STUDENT" ? "student@bitmesra.ac.in or learner@gmail.com" : "recruiter@company.com"}
                    className="w-full px-3.5 py-2.5 bg-zinc-900/90 border border-zinc-800 focus:border-cyan-500 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-all"
                  />
                  {/* Real-time Domain Recognition Pill */}
                  {domainCheck && (
                    <div className="mt-1.5 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] flex items-start gap-1.5 animate-in fade-in">
                      {domainCheck.is_institutional ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      ) : domainCheck.is_public_provider ? (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                      ) : (
                        <Mail className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-zinc-200">
                          {domainCheck.is_institutional
                            ? `Recognized Institution: ${domainCheck.institution_name}`
                            : domainCheck.is_public_provider
                            ? "Personal Email Provider"
                            : "Custom Domain"}
                        </span>
                        <p className="text-zinc-400 text-[10px] leading-tight mt-0.5">{domainCheck.reason}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-zinc-100 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500 rounded-xl text-xs text-zinc-100 outline-none"
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
                  className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs transition-colors flex items-center justify-center gap-2 mt-2"
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
                      <label className="block text-xs font-medium text-zinc-300 mb-1">College / University Name</label>
                      <input
                        type="text"
                        required
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        placeholder="Birla Institute of Technology, Mesra"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Degree</label>
                        <input
                          type="text"
                          value={degree}
                          onChange={(e) => setDegree(e.target.value)}
                          placeholder="B.Tech"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Graduation Year</label>
                        <input
                          type="number"
                          value={graduationYear}
                          onChange={(e) => setGraduationYear(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Branch / Department</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Computer Science & Engineering"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">College Location (City, State)</label>
                      <input
                        type="text"
                        value={collegeLocation}
                        onChange={(e) => setCollegeLocation(e.target.value)}
                        placeholder="Ranchi, Jharkhand"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                      />
                    </div>

                    {/* Social Equity and Affirmative Context Flags */}
                    <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 mt-2">
                      <div className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        Affirmative & Rural Representation Flags
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={isFirstGen}
                          onChange={(e) => setIsFirstGen(e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-700 text-indigo-600 focus:ring-0"
                        />
                        <span>I am a first-generation college student in my family</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="checkbox"
                          checked={isRural}
                          onChange={(e) => setIsRural(e.target.checked)}
                          className="w-4 h-4 rounded border-zinc-700 text-indigo-600 focus:ring-0"
                        />
                        <span>I am from a rural area or Tier-2/3 town</span>
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Company / Organization Name</label>
                      <input
                        type="text"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="RuralTech Innovations"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Official Website</label>
                        <input
                          type="url"
                          required
                          value={officialWebsite}
                          onChange={(e) => setOfficialWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-1">Job Designation</label>
                        <input
                          type="text"
                          required
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Technical Recruiter"
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91-9876543210"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-semibold text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-2/3 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    Review Verification Status <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Verification Preview & Final Submission */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                  <div className="text-xs font-bold text-zinc-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>System Verification Diagnostic</span>
                  </div>

                  {selectedRole === "STUDENT" ? (
                    <div className="space-y-2 text-xs text-zinc-300">
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Account Type:</span>
                        <span className="font-semibold text-indigo-300">Student Profile</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Email Address:</span>
                        <span className="font-mono text-zinc-200">{email}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Domain Classification:</span>
                        <span className={`font-semibold ${domainCheck?.is_institutional ? "text-emerald-400" : "text-amber-400"}`}>
                          {domainCheck?.is_institutional ? "Verified Institutional Domain" : "Personal Email (Gmail/Outlook)"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1">
                        <span className="text-zinc-400">Badge Earned Upon Signup:</span>
                        <span className="font-semibold text-cyan-300">
                          {domainCheck?.is_institutional ? "Institutional Email Verified" : "Personal Email (ID Verification Pending)"}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs text-zinc-300">
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Account Type:</span>
                        <span className="font-semibold text-purple-300">Recruiter Profile</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Company:</span>
                        <span className="font-semibold text-zinc-200">{companyName}</span>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-zinc-800/80">
                        <span className="text-zinc-400">Initial Status:</span>
                        <span className="font-semibold text-amber-400">Pending Administrative Review</span>
                      </div>
                      <div className="p-2 rounded bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-300 leading-snug">
                        Security Notice: Recruiters cannot publish job postings or view sensitive candidate information until approved by an administrator.
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms Acceptance */}
                <label className="flex items-start gap-2 cursor-pointer text-xs text-zinc-400">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-indigo-600 focus:ring-0"
                  />
                  <span>
                    I confirm my provided credentials are authentic, and agree to the PATHFINDER AI Anti-Bias Fair-Hiring Charter and Privacy Terms.
                  </span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 font-semibold text-xs transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={selectedRole === "STUDENT" ? handleStudentRegister : handleRecruiterRegister}
                    disabled={loading}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 hover:from-cyan-300 hover:to-indigo-400 text-zinc-950 font-extrabold text-sm transition-all shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "Registering Account..." : "Complete Registration"}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
