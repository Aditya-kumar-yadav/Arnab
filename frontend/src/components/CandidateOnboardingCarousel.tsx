"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Laptop,
  Globe2,
  Building2,
  MapPin,
  ShieldCheck,
  Layers,
  Award,
  Zap,
  BookOpen,
  Briefcase,
  UploadCloud
} from "lucide-react";

interface CandidateOnboardingCarouselProps {
  initialName?: string;
  initialEmail?: string;
  onComplete: (data: {
    fullName: string;
    targetTracks: string[];
    preferredDomain: string;
    skills: string[];
    workPreference: string;
    needsHardware: boolean;
    isFirstGen: boolean;
    isRural: boolean;
    collegeName: string;
    collegeLocation: string;
    degree: string;
    branch: string;
    academicYear: string;
    graduationYear: number;
    resumeChoice: "UPLOAD" | "BUILDER";
  }) => void;
  onSkip?: () => void;
}

export const CandidateOnboardingCarousel: React.FC<CandidateOnboardingCarouselProps> = ({
  initialName = "Candidate",
  initialEmail = "",
  onComplete,
  onSkip,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);

  // Slide 1 State: Goals & Career Tracks
  const [candidateFullName, setCandidateFullName] = useState<string>(
    initialName && initialName !== "Candidate" ? initialName : "Aditya Yadav"
  );
  const [targetTracks, setTargetTracks] = useState<string[]>([
    "Summer 2026 Internships",
    "Campus Placements (Final Year)",
  ]);
  const [preferredDomain, setPreferredDomain] = useState<string>("Full Stack Development");
  const [academicYear, setAcademicYear] = useState<string>("3rd Year");
  const [graduationYear, setGraduationYear] = useState<number>(2027);

  // Slide 2 State: Competencies & Work Preference
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Python",
    "React",
    "FastAPI",
    "SQL",
    "Git",
  ]);
  const [customSkillInput, setCustomSkillInput] = useState<string>("");
  const [workPreference, setWorkPreference] = useState<string>("Remote-First (Work from anywhere)");
  const [needsHardware, setNeedsHardware] = useState<boolean>(true);

  // Slide 3 State: Equity & Institutional Verification
  const isInstitutionalVerified = initialEmail.includes(".ac.in") || initialEmail.includes(".edu");
  const [collegeName, setCollegeName] = useState<string>(
    isInstitutionalVerified
      ? "Birla Institute of Technology, Mesra"
      : "Birla Institute of Technology, Mesra"
  );
  const [collegeLocation, setCollegeLocation] = useState<string>("Ranchi, Jharkhand");
  const [degree, setDegree] = useState<string>("B.Tech");
  const [branch, setBranch] = useState<string>("Computer Science & Engineering");
  const [isFirstGen, setIsFirstGen] = useState<boolean>(true);
  const [isRural, setIsRural] = useState<boolean>(true);
  const [resumeChoice, setResumeChoice] = useState<"UPLOAD" | "BUILDER">("BUILDER");

  const availableTracks = [
    "Summer 2026 Internships",
    "Campus Placements (Final Year)",
    "Upskilling Fellowships (Govt. Subsidized)",
    "Off-Campus Lateral Opportunities",
  ];

  const popularDomains = [
    "Full Stack Development",
    "Backend & Distributed Systems",
    "AI / Machine Learning & Data Intelligence",
    "Cloud Architecture & DevOps",
    "Mobile & Cross-Platform Engineering",
  ];

  const commonSkills = [
    "Python",
    "React",
    "FastAPI",
    "SQL",
    "Git",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Docker",
    "Machine Learning",
    "Next.js",
    "Tailwind CSS",
    "AWS",
    "PostgreSQL",
    "C++",
    "Java",
  ];

  const toggleTrack = (track: string) => {
    if (targetTracks.includes(track)) {
      if (targetTracks.length > 1) {
        setTargetTracks(targetTracks.filter((t) => t !== track));
      }
    } else {
      setTargetTracks([...targetTracks, track]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      if (selectedSkills.length > 1) {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
      }
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
      setCustomSkillInput("");
    }
  };

  const nextSlide = () => {
    if (currentSlide < 3) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete({
        fullName: candidateFullName,
        targetTracks,
        preferredDomain,
        skills: selectedSkills,
        workPreference,
        needsHardware,
        isFirstGen,
        isRural,
        collegeName,
        collegeLocation,
        degree,
        branch,
        academicYear,
        graduationYear,
        resumeChoice,
      });
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B2D]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#F7F8FF] rounded-3xl border border-[#DDD6FE] shadow-2xl overflow-hidden my-auto">
        {/* Top Header & Progress */}
        <div className="p-6 sm:p-8 bg-white border-b border-[#DDD6FE]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#5B4BFF]/20">
                PA
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#0D0B2D] uppercase tracking-wider font-mono">
                  Personalize Your Opportunity Matrix
                </h2>
                <p className="text-xs text-[#77758F]">Step {currentSlide} of 3</p>
              </div>
            </div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-xs font-semibold text-[#77758F] hover:text-[#5B4BFF] transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#5B4BFF] h-full"
              initial={{ width: "33%" }}
              animate={{ width: `${(currentSlide / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Carousel Content with AnimatePresence */}
        <div className="p-6 sm:p-8 min-h-[420px] flex flex-col justify-between">
          <AnimatePresence mode="wait" custom={direction}>
            {/* SLIDE 1: Career Targets & Goals */}
            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-[11px] font-bold font-mono mb-2 border border-[#DDD6FE]">
                    <Sparkles className="w-3.5 h-3.5 text-[#5B4BFF]" /> Step 1: Career Intent
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0D0B2D] tracking-tight">
                    Welcome, {initialName}! What are you seeking?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77758F] mt-1">
                    Pathfinder AI curates verified opportunities matching your academic stage and aspirations.
                  </p>
                </div>

                {/* Candidate Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
                    Full Name (As shown on Resume)
                  </label>
                  <input
                    type="text"
                    value={candidateFullName}
                    onChange={(e) => setCandidateFullName(e.target.value)}
                    placeholder="e.g. Aditya Yadav"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-xs font-bold text-[#0D0B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF]"
                  />
                </div>

                {/* Opportunity Target Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
                    Target Opportunity Types (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {availableTracks.map((track) => {
                      const active = targetTracks.includes(track);
                      return (
                        <button
                          key={track}
                          type="button"
                          onClick={() => toggleTrack(track)}
                          className={`flex items-center justify-between p-3 rounded-2xl text-left border text-xs font-semibold transition-all ${
                            active
                              ? "bg-white border-[#5B4BFF] text-[#0D0B2D] shadow-sm font-bold ring-2 ring-[#5B4BFF]/30"
                              : "bg-white/80 border-[#DDD6FE] text-[#77758F] hover:border-[#A78BFA]"
                          }`}
                        >
                          <span>{track}</span>
                          {active && (
                            <div className="w-4 h-4 rounded-full bg-[#5B4BFF] text-white flex items-center justify-center shrink-0 ml-2">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Technical Domain */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
                    Primary Engineering Domain
                  </label>
                  <select
                    value={preferredDomain}
                    onChange={(e) => setPreferredDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF]"
                  >
                    {popularDomains.map((dom) => (
                      <option key={dom} value={dom}>
                        {dom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Academic Standing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#0D0B2D] uppercase">Current Academic Year</label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] focus:border-[#5B4BFF]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year (Final Year)</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#0D0B2D] uppercase">Graduation Year</label>
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#DDD6FE] bg-white text-xs font-semibold text-[#0D0B2D] focus:border-[#5B4BFF]"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* SLIDE 2: Skills & Work Setup */}
            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-[11px] font-bold font-mono mb-2 border border-[#DDD6FE]">
                    <Zap className="w-3.5 h-3.5 text-[#5B4BFF]" /> Step 2: Skills & Work Preferences
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0D0B2D] tracking-tight">
                    Showcase Your Strengths
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77758F] mt-1">
                    Select your competencies. Our Explainable AI uses these to match JDs and identify bridgeable skill gaps.
                  </p>
                </div>

                {/* Skills Multi-Select Pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
                      Select Your Skills ({selectedSkills.length} selected)
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                    {commonSkills.map((skill) => {
                      const active = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            active
                              ? "bg-[#5B4BFF] text-white shadow-sm"
                              : "bg-white border border-[#DDD6FE] text-[#77758F] hover:border-[#5B4BFF] hover:text-[#0D0B2D]"
                          }`}
                        >
                          {active && <Check className="w-3 h-3 stroke-[3]" />}
                          {skill}
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom Skill */}
                  <form onSubmit={addCustomSkill} className="flex gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="Add custom skill (e.g. GraphQL, Flutter, Rust)..."
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#DDD6FE] bg-white text-xs text-[#0D0B2D] focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]/30 focus:border-[#5B4BFF]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-[#E6E0FF] hover:bg-[#DDD6FE] text-[#0D0B2D] rounded-xl text-xs font-bold transition-colors"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                {/* Preferred Work Model */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
                    Work Environment Preference
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      "Remote-First (Work from anywhere)",
                      "Hybrid (Flexible Office & Remote)",
                      "On-Site (Metro Tech Hubs)",
                    ].map((pref) => {
                      const isSelected = workPreference === pref;
                      return (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setWorkPreference(pref)}
                          className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-white border-[#5B4BFF] text-[#0D0B2D] ring-2 ring-[#5B4BFF]/30 font-bold"
                              : "bg-white/80 border-[#DDD6FE] text-[#77758F] hover:border-[#A78BFA]"
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware Support Flag for Rural Learners */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#DDD6FE] cursor-pointer hover:border-[#5B4BFF] transition-colors">
                  <input
                    type="checkbox"
                    checked={needsHardware}
                    onChange={(e) => setNeedsHardware(e.target.checked)}
                    className="mt-0.5 rounded border-[#DDD6FE] text-[#5B4BFF] focus:ring-[#5B4BFF]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0D0B2D] flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-[#5B4BFF]" /> Request Hardware & Connectivity Sponsorship
                    </span>
                    <p className="text-[11px] text-[#77758F] mt-0.5">
                      Flag my profile for employer-provided laptops, remote stipends, and broadband subsidies.
                    </p>
                  </div>
                </label>
              </motion.div>
            )}

            {/* SLIDE 3: Affirmative Inclusion & Institutional Verification */}
            {currentSlide === 3 && (
              <motion.div
                key="slide-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-[11px] font-bold font-mono mb-2 border border-[#DDD6FE]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5B4BFF]" /> Step 3: Equity & Campus Verification
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0D0B2D] tracking-tight">
                    Leveling the Playing Field
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77758F] mt-1">
                    Pathfinder AI uses affirmative action weighting to ensure rural and first-generation learners bypass traditional gatekeeping.
                  </p>
                </div>

                {/* Resume Path Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#0D0B2D]">
                    Resume Setup (Upload or Create / Edit)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setResumeChoice("BUILDER")}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                        resumeChoice === "BUILDER"
                          ? "bg-white border-[#5B4BFF] ring-2 ring-[#5B4BFF]/30 shadow-sm"
                          : "bg-white/80 border-[#DDD6FE]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        {resumeChoice === "BUILDER" && (
                          <span className="w-5 h-5 rounded-full bg-[#5B4BFF] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-[#0D0B2D]">Create / Edit ATS Resume</h4>
                      <p className="text-[11px] text-[#77758F]">
                        Craft a clean single-column ATS resume via OpenResume technique with live preview.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResumeChoice("UPLOAD")}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                        resumeChoice === "UPLOAD"
                          ? "bg-white border-[#5B4BFF] ring-2 ring-[#5B4BFF]/30 shadow-sm"
                          : "bg-white/80 border-[#DDD6FE]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        {resumeChoice === "UPLOAD" && (
                          <span className="w-5 h-5 rounded-full bg-[#5B4BFF] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-[#0D0B2D]">Upload Existing Resume</h4>
                      <p className="text-[11px] text-[#77758F]">
                        Upload PDF or Docx to parse competencies automatically and edit freely later.
                      </p>
                    </button>
                  </div>
                </div>

                {/* College Info */}
                <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0D0B2D] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#5B4BFF]" /> Your College / Institution
                    </span>
                    {isInstitutionalVerified && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Domain Verified
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g. Birla Institute of Technology, Mesra"
                      className="w-full px-3 py-2 rounded-xl border border-[#DDD6FE] text-xs font-semibold text-[#0D0B2D] focus:border-[#5B4BFF]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="Degree (e.g. B.Tech)"
                      className="px-3 py-1.5 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                    />
                    <input
                      type="text"
                      value={collegeLocation}
                      onChange={(e) => setCollegeLocation(e.target.value)}
                      placeholder="Location (e.g. Ranchi, Jharkhand)"
                      className="px-3 py-1.5 rounded-xl border border-[#DDD6FE] text-xs text-[#0D0B2D] focus:border-[#5B4BFF]"
                    />
                  </div>
                </div>

                {/* Affirmative Checkboxes */}
                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#DDD6FE] cursor-pointer hover:border-[#5B4BFF] transition-colors">
                    <input
                      type="checkbox"
                      checked={isFirstGen}
                      onChange={(e) => setIsFirstGen(e.target.checked)}
                      className="mt-0.5 rounded border-[#DDD6FE] text-[#5B4BFF] focus:ring-[#5B4BFF]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0D0B2D]">
                        First-Generation College Student
                      </span>
                      <p className="text-[11px] text-[#77758F] mt-0.5">
                        First person in your family to pursue higher education. Unlocks priority mentorship & equity tracks.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#DDD6FE] cursor-pointer hover:border-[#5B4BFF] transition-colors">
                    <input
                      type="checkbox"
                      checked={isRural}
                      onChange={(e) => setIsRural(e.target.checked)}
                      className="mt-0.5 rounded border-[#DDD6FE] text-[#5B4BFF] focus:ring-[#5B4BFF]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0D0B2D]">
                        Rural / Tier-2 / Tier-3 Town or District
                      </span>
                      <p className="text-[11px] text-[#77758F] mt-0.5">
                        Residing or studying outside Tier-1 metropolitan hubs. Unlocks hardware provision grants.
                      </p>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-[#DDD6FE] flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentSlide === 1}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentSlide === 1
                  ? "opacity-30 cursor-not-allowed text-[#77758F]"
                  : "bg-white border border-[#DDD6FE] text-[#0D0B2D] hover:bg-[#E6E0FF]/40"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all"
            >
              {currentSlide === 3 ? (
                <>
                  <span>Launch My Opportunity Hub</span>
                  <Sparkles className="w-4 h-4 text-[#E6E0FF]" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
