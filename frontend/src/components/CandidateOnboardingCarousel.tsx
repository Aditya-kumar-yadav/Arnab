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
  const [resumeChoice, setResumeChoice] = useState<"UPLOAD" | "BUILDER">("BUILDER");
  const [targetTracks, setTargetTracks] = useState<string[]>([
    "Summer/Winter Internships",
    "Final-Year Campus Placements",
  ]);
  const [preferredDomain, setPreferredDomain] = useState<string>("Full Stack Development");
  const [academicYear, setAcademicYear] = useState<string>("3rd Year");
  const [degree, setDegree] = useState<string>("B.Tech");
  const [branch, setBranch] = useState<string>("Computer Science & Engineering");
  const [graduationYear, setGraduationYear] = useState<number>(2027);

  // Slide 2 State: Skills & Work Setup
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
  const [isFirstGen, setIsFirstGen] = useState<boolean>(true);
  const [isRural, setIsRural] = useState<boolean>(true);
  const [collegeName, setCollegeName] = useState<string>(
    initialEmail.includes("bitmesra")
      ? "Birla Institute of Technology, Mesra"
      : "Birla Institute of Technology, Mesra"
  );
  const [collegeLocation, setCollegeLocation] = useState<string>("Ranchi, Jharkhand");
  const [isInstitutionalVerified] = useState<boolean>(
    initialEmail.includes(".ac.in") || initialEmail.includes(".edu")
  );

  const availableTracks = [
    "Summer/Winter Internships",
    "Final-Year Campus Placements",
    "Subsidized Skill-Upgrading Fellowships",
    "Open Source & Remote Apprenticeships",
  ];

  const popularDomains = [
    "Full Stack Development",
    "AI, Machine Learning & GenAI",
    "Cloud & DevOps Architecture",
    "Data Engineering & Analytics",
    "Embedded Systems & IoT",
  ];

  const commonSkills = [
    "Python",
    "React",
    "TypeScript",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "Git",
    "Tailwind CSS",
    "Next.js",
    "Machine Learning",
    "Linux",
    "Node.js",
    "PyTorch",
    "AWS/Cloud",
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
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const nextSlide = () => {
    if (currentSlide < 3) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleFinish = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pathfinder_candidate_name", candidateFullName);
    }
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
  };

  // Slide Animation Variants
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl overflow-hidden my-auto">
        {/* Top Header & Progress */}
        <div className="p-6 sm:p-8 bg-white border-b border-[#E2DBD0]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#121212] text-white flex items-center justify-center font-bold text-sm">
                PA
              </span>
              <div>
                <h2 className="text-sm font-bold text-[#121212] uppercase tracking-wider font-mono">
                  Personalize Your Opportunity Matrix
                </h2>
                <p className="text-xs text-[#736E65]">Step {currentSlide} of 3</p>
              </div>
            </div>
            {onSkip && (
              <button
                onClick={onSkip}
                className="text-xs font-semibold text-[#736E65] hover:text-[#121212] transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#E2DBD0] h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="bg-[#121212] h-full"
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
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE7DC] text-[#121212] text-[11px] font-bold font-mono mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#121212]" /> Step 1: Career Intent
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#121212] tracking-tight">
                    Welcome, {initialName}! What are you seeking?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#736E65] mt-1">
                    Pathfinder AI curates verified opportunities matching your academic stage and aspirations.
                  </p>
                </div>

                {/* Candidate Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
                    Full Name (As shown on Resume)
                  </label>
                  <input
                    type="text"
                    value={candidateFullName}
                    onChange={(e) => setCandidateFullName(e.target.value)}
                    placeholder="e.g. Aditya Yadav"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DBD0] bg-white text-xs font-bold text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                  />
                </div>

                {/* Opportunity Target Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
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
                              ? "bg-white border-[#121212] text-[#121212] shadow-sm font-bold ring-1 ring-[#121212]"
                              : "bg-[#FAF8F5] border-[#E2DBD0] text-[#59554E] hover:border-[#CEBFAD]"
                          }`}
                        >
                          <span>{track}</span>
                          {active && (
                            <div className="w-4 h-4 rounded-full bg-[#121212] text-white flex items-center justify-center shrink-0 ml-2">
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
                  <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
                    Primary Engineering Domain
                  </label>
                  <select
                    value={preferredDomain}
                    onChange={(e) => setPreferredDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
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
                    <label className="text-[11px] font-bold text-[#59554E] uppercase">Current Academic Year</label>
                    <select
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year (Final Year)</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#59554E] uppercase">Graduation Year</label>
                    <input
                      type="number"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212]"
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
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE7DC] text-[#121212] text-[11px] font-bold font-mono mb-2">
                    <Zap className="w-3.5 h-3.5 text-[#121212]" /> Step 2: Skills & Work Preferences
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#121212] tracking-tight">
                    Showcase Your Strengths
                  </h3>
                  <p className="text-xs sm:text-sm text-[#736E65] mt-1">
                    Select your competencies. Our Explainable AI uses these to match JDs and identify bridgeable skill gaps.
                  </p>
                </div>

                {/* Skills Multi-Select Pills */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
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
                              ? "bg-[#121212] text-white shadow-sm"
                              : "bg-white border border-[#E2DBD0] text-[#59554E] hover:border-[#121212]"
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
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-[#EDE7DC] hover:bg-[#D9D2C7] text-[#121212] rounded-xl text-xs font-bold"
                    >
                      + Add
                    </button>
                  </form>
                </div>

                {/* Preferred Work Model */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
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
                              ? "bg-white border-[#121212] text-[#121212] ring-1 ring-[#121212]"
                              : "bg-[#FAF8F5] border-[#E2DBD0] text-[#59554E]"
                          }`}
                        >
                          {pref}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hardware Support Flag for Rural Learners */}
                <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-[#E2DBD0] cursor-pointer hover:border-[#CEBFAD] transition-colors">
                  <input
                    type="checkbox"
                    checked={needsHardware}
                    onChange={(e) => setNeedsHardware(e.target.checked)}
                    className="mt-0.5 rounded border-[#E2DBD0] text-[#121212] focus:ring-[#121212]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-[#121212]" /> Request Hardware & Connectivity Sponsorship
                    </span>
                    <p className="text-[11px] text-[#736E65] mt-0.5">
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
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE7DC] text-[#121212] text-[11px] font-bold font-mono mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#121212]" /> Step 3: Equity & Campus Verification
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#121212] tracking-tight">
                    Leveling the Playing Field
                  </h3>
                  <p className="text-xs sm:text-sm text-[#736E65] mt-1">
                    Pathfinder AI uses affirmative action weighting to ensure rural and first-generation learners bypass traditional gatekeeping.
                  </p>
                </div>

                {/* Resume Path Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
                    Resume Setup (Upload or Create / Edit)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setResumeChoice("BUILDER")}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                        resumeChoice === "BUILDER"
                          ? "bg-white border-[#121212] ring-1 ring-[#121212] shadow-sm"
                          : "bg-[#FAF8F5] border-[#E2DBD0]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-[#EDE7DC] text-[#121212] flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        {resumeChoice === "BUILDER" && (
                          <span className="w-5 h-5 rounded-full bg-[#121212] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-[#121212]">Create / Edit ATS Resume</h4>
                      <p className="text-[11px] text-[#736E65]">
                        Craft a clean single-column ATS resume via OpenResume technique with live preview.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setResumeChoice("UPLOAD")}
                      className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
                        resumeChoice === "UPLOAD"
                          ? "bg-white border-[#121212] ring-1 ring-[#121212] shadow-sm"
                          : "bg-[#FAF8F5] border-[#E2DBD0]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-xl bg-[#EDE7DC] text-[#121212] flex items-center justify-center">
                          <UploadCloud className="w-4 h-4" />
                        </div>
                        {resumeChoice === "UPLOAD" && (
                          <span className="w-5 h-5 rounded-full bg-[#121212] text-white flex items-center justify-center text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-black text-[#121212]">Upload Existing Resume</h4>
                      <p className="text-[11px] text-[#736E65]">
                        Upload PDF or Docx to parse competencies automatically and edit freely later.
                      </p>
                    </button>
                  </div>
                </div>

                {/* College Info */}
                <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#121212]" /> Your College / Institution
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
                      className="w-full px-3 py-2 rounded-xl border border-[#E2DBD0] text-xs font-semibold text-[#121212]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      placeholder="Degree (e.g. B.Tech)"
                      className="px-3 py-1.5 rounded-xl border border-[#E2DBD0] text-xs text-[#121212]"
                    />
                    <input
                      type="text"
                      value={collegeLocation}
                      onChange={(e) => setCollegeLocation(e.target.value)}
                      placeholder="Location (e.g. Ranchi, Jharkhand)"
                      className="px-3 py-1.5 rounded-xl border border-[#E2DBD0] text-xs text-[#121212]"
                    />
                  </div>
                </div>

                {/* Affirmative Checkboxes */}
                <div className="space-y-2.5">
                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#E2DBD0] cursor-pointer hover:border-[#CEBFAD] transition-colors">
                    <input
                      type="checkbox"
                      checked={isFirstGen}
                      onChange={(e) => setIsFirstGen(e.target.checked)}
                      className="mt-0.5 rounded border-[#E2DBD0] text-[#121212] focus:ring-[#121212]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#121212]">
                        First-Generation College Student
                      </span>
                      <p className="text-[11px] text-[#736E65] mt-0.5">
                        First person in your family to pursue higher education. Unlocks priority mentorship & equity tracks.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-[#E2DBD0] cursor-pointer hover:border-[#CEBFAD] transition-colors">
                    <input
                      type="checkbox"
                      checked={isRural}
                      onChange={(e) => setIsRural(e.target.checked)}
                      className="mt-0.5 rounded border-[#E2DBD0] text-[#121212] focus:ring-[#121212]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#121212]">
                        Rural / Tier-2 / Tier-3 Town or District
                      </span>
                      <p className="text-[11px] text-[#736E65] mt-0.5">
                        Residing or studying outside Tier-1 metropolitan hubs. Unlocks hardware provision grants.
                      </p>
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-[#E2DBD0] flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={prevSlide}
              disabled={currentSlide === 1}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                currentSlide === 1
                  ? "opacity-30 cursor-not-allowed text-[#736E65]"
                  : "bg-white border border-[#E2DBD0] text-[#121212] hover:bg-[#EDE7DC]"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <button
              type="button"
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#121212] hover:bg-[#262626] text-white shadow-md transition-all"
            >
              {currentSlide === 3 ? (
                <>
                  <span>Launch My Opportunity Hub</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
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

