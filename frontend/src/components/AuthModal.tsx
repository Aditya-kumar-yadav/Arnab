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
  X,
  Zap,
  Award,
  Users
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (tokenData: any) => void;
  initialRole?: "STUDENT" | "RECRUITER";
  initialMode?: "LOGIN" | "REGISTER";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialRole = "STUDENT",
  initialMode = "LOGIN",
}) => {
  const { user: clerkUser } = useUser();
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [mode, setMode] = useState<"LOGIN" | "REGISTER">(initialMode);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Domain verification state
  const [domainCheck, setDomainCheck] = useState<DomainCheckResponse | null>(null);

  // Common credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Student details
  const [collegeName, setCollegeName] = useState("Birla Institute of Technology, Mesra");
  const [degree, setDegree] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science & Engineering");
  const [academicYear, setAcademicYear] = useState("3rd Year");
  const [graduationYear, setGraduationYear] = useState(2027);
  const [collegeLocation, setCollegeLocation] = useState("Ranchi, Jharkhand");
  const [preferredDomain, setPreferredDomain] = useState("Full Stack Development");
  const [isFirstGen, setIsFirstGen] = useState(true);
  const [isRural, setIsRural] = useState(true);

  // Recruiter details
  const [companyName, setCompanyName] = useState("RuralTech Labs & Systems");
  const [officialWebsite, setOfficialWebsite] = useState("https://ruraltechlabs.io");
  const [designation, setDesignation] = useState("Head of Talent Acquisition");
  const [industry, setIndustry] = useState("Software & Social Technology");
  const [location, setLocation] = useState("Bengaluru, India");

  useEffect(() => {
    if (initialRole) setSelectedRole(initialRole);
    if (initialMode) setMode(initialMode);
  }, [initialRole, initialMode, isOpen]);

  // Real-time domain verification debounce
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

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const res = await api.login(email, password);
      onAuthSuccess(res);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials. Please verify your email and password.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      if (selectedRole === "STUDENT") {
        const res = await api.registerStudent({
          full_name: fullName,
          email,
          password,
          college_name: collegeName,
          degree,
          branch,
          academic_year: academicYear,
          graduation_year: graduationYear,
          college_location: collegeLocation,
          preferred_domain: preferredDomain,
          is_first_generation: isFirstGen,
          is_rural_or_disadvantaged: isRural,
        });
        onAuthSuccess(res);
        onClose();
      } else {
        const res = await api.registerRecruiter({
          full_name: fullName,
          work_email: email,
          designation,
          password,
          company_name: companyName,
          official_website: officialWebsite,
        });
        onAuthSuccess(res);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  // Demo Autofill for Instant Hackathon Testing
  const handleAutofillDemo = (persona: "STUDENT_INST" | "STUDENT_RURAL" | "RECRUITER" | "ADMIN") => {
    setMode("LOGIN");
    setErrorMessage("");
    if (persona === "STUDENT_INST") {
      setSelectedRole("STUDENT");
      setEmail("student@bitmesra.ac.in");
      setPassword("StudentPass2026!");
    } else if (persona === "STUDENT_RURAL") {
      setSelectedRole("STUDENT");
      setEmail("rahul.learner@gmail.com");
      setPassword("StudentPass2026!");
    } else if (persona === "RECRUITER") {
      setSelectedRole("RECRUITER");
      setEmail("talent@ruraltechlabs.io");
      setPassword("RecruiterPass2026!");
    } else if (persona === "ADMIN") {
      setSelectedRole("ADMIN");
      setEmail("admin@pathfinder.ai");
      setPassword("AdminSecurePassword2026!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B2D]/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#DDD6FE] shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-[#F7F8FF] to-[#E6E0FF]/50 border-b border-[#DDD6FE] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center font-bold shadow-md shadow-[#5B4BFF]/25">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-[#0D0B2D] tracking-tight">
                  PATHFINDER AI
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B4BFF] text-white">
                  SECURE PORTAL
                </span>
              </div>
              <p className="text-xs text-[#77758F]">
                {mode === "LOGIN" ? "Sign in to access your neural opportunity dashboard" : "Create your cryptographically verified profile"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F7F8FF] border border-[#DDD6FE] flex items-center justify-center text-[#77758F] hover:text-[#0D0B2D] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs (STUDENT vs RECRUITER) */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F7F8FF] rounded-2xl border border-[#DDD6FE]">
            <button
              onClick={() => setSelectedRole("STUDENT")}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                selectedRole === "STUDENT"
                  ? "bg-[#5B4BFF] text-white shadow-sm"
                  : "text-[#77758F] hover:text-[#0D0B2D]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student / Candidate</span>
            </button>
            <button
              onClick={() => setSelectedRole("RECRUITER")}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                selectedRole === "RECRUITER"
                  ? "bg-[#5B4BFF] text-white shadow-sm"
                  : "text-[#77758F] hover:text-[#0D0B2D]"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Recruiter / Enterprise</span>
            </button>
          </div>

          {/* Mode Switcher: Sign In vs Create Account */}
          <div className="flex items-center justify-between mt-4 pb-2 border-b border-[#DDD6FE]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode("LOGIN")}
                className={`text-xs font-bold pb-1 transition-all ${
                  mode === "LOGIN"
                    ? "text-[#5B4BFF] border-b-2 border-[#5B4BFF]"
                    : "text-[#77758F] hover:text-[#0D0B2D]"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("REGISTER")}
                className={`text-xs font-bold pb-1 transition-all ${
                  mode === "REGISTER"
                    ? "text-[#5B4BFF] border-b-2 border-[#5B4BFF]"
                    : "text-[#77758F] hover:text-[#0D0B2D]"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Quick Demo Autofill Pill */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-[#77758F] hidden sm:inline">Autofill:</span>
              {selectedRole === "STUDENT" ? (
                <>
                  <button
                    onClick={() => handleAutofillDemo("STUDENT_INST")}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E6E0FF] text-[#5B4BFF] hover:bg-[#DDD6FE]"
                  >
                    Institutional
                  </button>
                  <button
                    onClick={() => handleAutofillDemo("STUDENT_RURAL")}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E6E0FF] text-[#5B4BFF] hover:bg-[#DDD6FE]"
                  >
                    Rural
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleAutofillDemo("RECRUITER")}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E6E0FF] text-[#5B4BFF] hover:bg-[#DDD6FE]"
                >
                  Verified Recruiter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mx-6 mb-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 pt-2 max-h-[65vh] overflow-y-auto">
          {mode === "LOGIN" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#0D0B2D] block mb-1">
                  {selectedRole === "STUDENT" ? "College or Personal Email" : "Official Work Email"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === "STUDENT" ? "student@bitmesra.ac.in" : "talent@ruraltechlabs.io"
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD6FE] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 text-xs sm:text-sm text-[#0D0B2D] bg-[#F7F8FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0D0B2D] block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DDD6FE] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 text-xs sm:text-sm text-[#0D0B2D] bg-[#F7F8FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#77758F] hover:text-[#0D0B2D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter {selectedRole === "STUDENT" ? "Student" : "Recruiter"} Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Clerk Google OAuth Button */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#DDD6FE]" />
                </div>
                <span className="relative px-3 bg-white text-[11px] font-mono text-[#77758F]">
                  OR ONE-CLICK IDENTITY
                </span>
              </div>

              <SignInButton mode="modal">
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-[#F7F8FF] hover:bg-[#E6E0FF] border border-[#DDD6FE] text-xs font-bold text-[#0D0B2D] flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google / Clerk SSO</span>
                </button>
              </SignInButton>
            </form>
          ) : (
            /* REGISTRATION FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#0D0B2D] block mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD6FE] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 text-xs sm:text-sm text-[#0D0B2D] bg-[#F7F8FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#0D0B2D] block mb-1">
                  {selectedRole === "STUDENT" ? "College or Personal Email" : "Official Corporate Email"}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === "STUDENT" ? "priya@iitd.ac.in" : "talent@ruraltechlabs.io"
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#DDD6FE] focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 text-xs sm:text-sm text-[#0D0B2D] bg-[#F7F8FF]"
                />

                {/* Real-time Domain Verification Status Badge */}
                {domainCheck && (
                  <div
                    className={`mt-1.5 p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5 ${
                      domainCheck.is_institutional
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : domainCheck.is_public_provider
                        ? "bg-blue-50 text-blue-800 border border-blue-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>{domainCheck.reason}</span>
                  </div>
                )}
              </div>

              {selectedRole === "STUDENT" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Degree</label>
                      <input
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Branch</label>
                      <input
                        type="text"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">College Name</label>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] space-y-2">
                    <span className="text-[11px] font-bold text-[#0D0B2D] block">
                      Affirmative Inclusion Factors:
                    </span>
                    <label className="flex items-center gap-2 text-xs text-[#0D0B2D] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFirstGen}
                        onChange={(e) => setIsFirstGen(e.target.checked)}
                        className="rounded border-[#DDD6FE] text-[#5B4BFF]"
                      />
                      <span>First-generation college learner</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-[#0D0B2D] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isRural}
                        onChange={(e) => setIsRural(e.target.checked)}
                        className="rounded border-[#DDD6FE] text-[#5B4BFF]"
                      />
                      <span>Enrolled in rural or Tier-2/3 regional college</span>
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Official Website</label>
                    <input
                      type="text"
                      value={officialWebsite}
                      onChange={(e) => setOfficialWebsite(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Your Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 chars"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#0D0B2D] block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] bg-[#F7F8FF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Complete {selectedRole === "STUDENT" ? "Student" : "Recruiter"} Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

