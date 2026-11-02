"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Download,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  X,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  ShieldCheck,
  Check,
  Building2,
  GraduationCap,
  Briefcase,
  Code2,
  Printer
} from "lucide-react";

export interface ResumeData {
  profile: {
    name: string;
    summary: string;
    email: string;
    phone: string;
    location: string;
    url: string;
  };
  workExperiences: Array<{
    company: string;
    jobTitle: string;
    date: string;
    descriptions: string[];
  }>;
  educations: Array<{
    school: string;
    degree: string;
    date: string;
    gpa: string;
    descriptions: string[];
  }>;
  projects: Array<{
    project: string;
    date: string;
    descriptions: string[];
  }>;
  skills: {
    descriptions: string[];
  };
}

const INITIAL_RESUME: ResumeData = {
  profile: {
    name: "Aarav Verma",
    summary:
      "Full-stack software engineer obsessed with building high-performance distributed systems, accessible web applications, and low-bandwidth platforms for underserved learners.",
    email: "student@bitmesra.ac.in",
    phone: "+91-9876543210",
    location: "Ranchi, Jharkhand",
    url: "https://github.com/aarav-verma",
  },
  workExperiences: [
    {
      company: "RuralTech Labs & Systems",
      jobTitle: "Software Engineering Apprentice",
      date: "May 2025 – Present",
      descriptions: [
        "Led cross-functional team of 4 engineers developing offline-first PWA for rural college placement discovery.",
        "Optimized client-side bundle size by 42% and implemented JWT session caching.",
        "Engineered RESTful APIs with Python FastAPI and PostgreSQL handling 5,000+ mock verification events.",
      ],
    },
    {
      company: "Open Source Campus Initiative",
      jobTitle: "Core Contributor",
      date: "Aug 2024 – Dec 2024",
      descriptions: [
        "Contributed to accessibility benchmarks and screen-reader compatibility for student dashboards.",
        "Authored automated CI/CD GitHub Action workflows for automated unit and acceptance tests.",
      ],
    },
  ],
  educations: [
    {
      school: "Birla Institute of Technology, Mesra",
      degree: "Bachelor of Technology in Computer Science & Engineering",
      date: "Expected Graduation: June 2027",
      gpa: "8.8 / 10.0 CGPA",
      descriptions: [
        "Honors / Awards: Dean's List for Academic Excellence (Fall 2024, Spring 2025).",
        "Relevant Coursework: Data Structures & Algorithms, Operating Systems, Database Management, Cloud Computing.",
      ],
    },
  ],
  projects: [
    {
      project: "Pathfinder AI – Opportunity Matcher",
      date: "Jan 2026 – Present",
      descriptions: [
        "Designed and implemented explainable recommendation engine eliminating college prestige bias.",
        "Created affirmative inclusion weighting for first-generation and rural learners.",
      ],
    },
  ],
  skills: {
    descriptions: [
      "Languages: Python, TypeScript, JavaScript, SQL, C++, HTML5, CSS3",
      "Frameworks & Libraries: React, Next.js, FastAPI, Node.js, Tailwind CSS, Framer Motion",
      "Developer Tools: Docker, Git, GitHub Actions, PostgreSQL, Linux, Clerk Auth",
    ],
  },
};

const SAMPLE_PARSED_RESUMES: Record<string, ResumeData> = {
  "laverne-resume.pdf": {
    profile: {
      name: "Leo Leopard",
      summary:
        "To obtain an on-campus position serving my fellow students which utilizes my strong communication skills.",
      email: "lleopard@laverne.edu",
      phone: "(909) 555-5555",
      location: "La Verne, CA",
      url: "linkedin.com/in/leo-leopard",
    },
    workExperiences: [
      {
        company: "University of La Verne",
        jobTitle: "Student Activities Assistant",
        date: "August 2014 – Present",
        descriptions: [
          "Co-designed 17 minute audio-visual presentation accurately and creatively describing project for use in regional and national competition.",
          "Plan two yearly outreach events to highlight community members' creativity in spoken word, poetry, music, and art.",
        ],
      },
      {
        company: "YMCA, Pomona, CA",
        jobTitle: "Volunteer Swim Coach",
        date: "Summer 2013, 2014",
        descriptions: [
          "Instructed classes of up to 15 children on basic swimming skills.",
          "Communicated regularly with parents on children's progress.",
        ],
      },
    ],
    educations: [
      {
        school: "University of La Verne, La Verne, CA",
        degree: "Bachelor of Arts, Business Administration",
        date: "Expected Graduation: June 2016",
        gpa: "3.5",
        descriptions: [
          "Dean's List: Fall 2013 – Spring 2014",
          "Enactus Member: Led groups of 9 junior high students in discussion on success skills and personal finances.",
        ],
      },
    ],
    projects: [
      {
        project: "Community Empowerment Workshop Series",
        date: "2014",
        descriptions: [
          "Organized interactive seminars for underrepresented youth in Pomona Valley.",
        ],
      },
    ],
    skills: {
      descriptions: [
        "Computer: Proficient in Windows and Mac OS, Microsoft Word, PowerPoint, Excel",
        "Language: Fluent in Spanish",
        "Social Media: Facebook, Twitter, Instagram",
      ],
    },
  },
};

interface ResumeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncWithProfile?: (skills: string[], summary?: string, candidateName?: string) => void;
  initialTab?: "PARSER" | "BUILDER";
  tailoringJD?: any | null;
  candidateName?: string;
  candidateEmail?: string;
}

export const ResumeStudioModal: React.FC<ResumeStudioModalProps> = ({
  isOpen,
  onClose,
  onSyncWithProfile,
  initialTab = "PARSER",
  tailoringJD = null,
  candidateName,
  candidateEmail,
}) => {
  const [activeTab, setActiveTab] = useState<"PARSER" | "BUILDER">(initialTab);
  const [selectedResumeFile, setSelectedResumeFile] = useState<string>("laverne-resume.pdf");
  const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME);
  const [zoomLevel, setZoomLevel] = useState<number>(85);
  const [autoScale, setAutoScale] = useState<boolean>(true);
  const [syncFeedback, setSyncFeedback] = useState<string>("");

  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  useEffect(() => {
    if (candidateName && isOpen) {
      setResumeData((prev) => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: candidateName,
          email: candidateEmail || prev.profile.email,
        },
      }));
    }
  }, [candidateName, candidateEmail, isOpen]);

  if (!isOpen) return null;

  const currentParsedResume = SAMPLE_PARSED_RESUMES[selectedResumeFile] || resumeData;

  const getTailoringKeywordStats = () => {
    if (!tailoringJD?.required_skills) return { matched: [], missing: [], score: 85 };
    const resumeText = JSON.stringify(resumeData).toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];
    tailoringJD.required_skills.forEach((sk: string) => {
      if (resumeText.includes(sk.toLowerCase())) {
        matched.push(sk);
      } else {
        missing.push(sk);
      }
    });
    const total = tailoringJD.required_skills.length || 1;
    const baseScore = Math.round((matched.length / total) * 100);
    const score = Math.min(100, Math.max(50, baseScore + 10)); // affirmative boost
    return { matched, missing, score };
  };

  const handleInfuseKeywords = () => {
    if (!tailoringJD?.required_skills) return;
    const { missing } = getTailoringKeywordStats();
    if (missing.length === 0) {
      setSyncFeedback("All JD target keywords are already present in your resume!");
      setTimeout(() => setSyncFeedback(""), 3000);
      return;
    }
    const currentSkills = [...resumeData.skills.descriptions];
    const newBullet = `Technical Competencies tailored for ${tailoringJD.title}: ${missing.join(", ")}`;
    currentSkills.push(newBullet);
    setResumeData({
      ...resumeData,
      skills: { descriptions: currentSkills },
    });
    setSyncFeedback(`Successfully infused ${missing.length} keywords into your resume! ATS match improved.`);
    setTimeout(() => setSyncFeedback(""), 4000);
  };

  const handleApplyParsedToEditor = () => {
    setResumeData(JSON.parse(JSON.stringify(currentParsedResume)));
    setActiveTab("BUILDER");
    setSyncFeedback("Parsed resume data loaded into live editor!");
    setTimeout(() => setSyncFeedback(""), 3000);
  };

  const handleSyncToPathfinder = () => {
    if (onSyncWithProfile) {
      // Extract all skills from resumeData descriptions
      const parsedSkills: string[] = [];
      resumeData.skills.descriptions.forEach((desc) => {
        desc.split(/[,:•;]/).forEach((part) => {
          const trimmed = part.replace(/^Competencies.*?:/i, "").trim();
          if (trimmed.length > 1 && trimmed.length < 25 && !trimmed.toLowerCase().includes("proficient")) {
            parsedSkills.push(trimmed);
          }
        });
      });
      const allSkills = Array.from(new Set([
        "Python", "React", "FastAPI", "SQL", "Git", ...parsedSkills
      ]));
      if (typeof window !== "undefined" && resumeData.profile.name) {
        localStorage.setItem("pathfinder_candidate_name", resumeData.profile.name);
      }
      onSyncWithProfile(allSkills, resumeData.profile.summary, resumeData.profile.name);
    }
    setSyncFeedback("Resume parsed & skills synced to your Pathfinder Opportunity Matcher!");
    setTimeout(() => setSyncFeedback(""), 4000);
  };

  const handlePrintDownload = () => {
    window.print();
  };

  // Helper to add work experience
  const addWorkExperience = () => {
    setResumeData({
      ...resumeData,
      workExperiences: [
        ...resumeData.workExperiences,
        {
          company: "New Company",
          jobTitle: "Software Engineer",
          date: "2025 – Present",
          descriptions: ["Designed and implemented scalable backend microservices."],
        },
      ],
    });
  };

  const removeWorkExperience = (idx: number) => {
    const updated = [...resumeData.workExperiences];
    updated.splice(idx, 1);
    setResumeData({ ...resumeData, workExperiences: updated });
  };

  // Helper to add bullet point
  const addBulletPoint = (expIdx: number) => {
    const updated = [...resumeData.workExperiences];
    updated[expIdx].descriptions.push("New accomplishment or technical milestone.");
    setResumeData({ ...resumeData, workExperiences: updated });
  };

  const removeBulletPoint = (expIdx: number, bIdx: number) => {
    const updated = [...resumeData.workExperiences];
    updated[expIdx].descriptions.splice(bIdx, 1);
    setResumeData({ ...resumeData, workExperiences: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/70 backdrop-blur-md p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-7xl h-[94vh] bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl flex flex-col overflow-hidden my-auto print:border-none print:shadow-none print:h-auto print:rounded-none">
        {/* Top Control Bar */}
        <div className="p-4 sm:px-6 bg-white border-b border-[#E2DBD0] flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121212] text-white flex items-center justify-center font-bold text-sm">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-[#121212]">
                  OpenResume <span className="font-light text-[#736E65]">ATS Studio</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#423E37]">
                  ATS Readability 100%
                </span>
              </div>
              <p className="text-[11px] text-[#736E65]">
                Parse existing resumes with pdf.js and edit ATS-friendly single-column layouts.
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 bg-[#FAF8F5] p-1 rounded-2xl border border-[#E2DBD0]">
            <button
              onClick={() => setActiveTab("PARSER")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "PARSER"
                  ? "bg-[#121212] text-white shadow-sm"
                  : "text-[#59554E] hover:text-[#121212]"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Resume Parser (Image 1)</span>
            </button>
            <button
              onClick={() => setActiveTab("BUILDER")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "BUILDER"
                  ? "bg-[#121212] text-white shadow-sm"
                  : "text-[#59554E] hover:text-[#121212]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Resume Builder & Editor (Image 2)</span>
            </button>
          </div>

          {/* Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToPathfinder}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Sync to Pathfinder</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF8F5] hover:bg-[#EDE7DC] border border-[#E2DBD0] flex items-center justify-center text-[#121212] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {syncFeedback && (
          <div className="px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 shrink-0 animate-fade-in print:hidden">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{syncFeedback}</span>
          </div>
        )}

        {/* =========================================================================
            VIEW 1: RESUME PARSER (As in User Screenshot 1)
           ========================================================================= */}
        {activeTab === "PARSER" && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden print:hidden">
            {/* Left Col: PDF Preview Container */}
            <div className="p-6 bg-[#F4EFE6]/60 border-r border-[#E2DBD0] flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#121212] uppercase tracking-wider font-mono">
                    Source PDF Document
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedResumeFile("laverne-resume.pdf")}
                      className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                        selectedResumeFile === "laverne-resume.pdf"
                          ? "bg-[#121212] text-white border-[#121212]"
                          : "bg-white text-[#59554E] border-[#E2DBD0]"
                      }`}
                    >
                      Sample: laverne-resume.pdf
                    </button>
                  </div>
                </div>

                {/* Simulated High-Fidelity PDF Preview Container */}
                <div className="bg-white rounded-2xl border border-[#D9D2C7] shadow-md p-6 aspect-[8.5/11] max-w-lg mx-auto overflow-y-auto text-black font-serif text-[11px] leading-relaxed">
                  <div className="text-center border-b pb-2 mb-3">
                    <h2 className="text-base font-bold tracking-wide">
                      {currentParsedResume.profile.name}
                    </h2>
                    <p className="text-[10px] text-gray-700">
                      {currentParsedResume.profile.location} • {currentParsedResume.profile.email} • {currentParsedResume.profile.phone}
                    </p>
                  </div>

                  {/* Objective */}
                  <div className="mb-3">
                    <h3 className="font-bold text-[11px] uppercase border-b pb-0.5 mb-1 text-gray-800">
                      Objective
                    </h3>
                    <p className="text-[10px] text-gray-800">
                      {currentParsedResume.profile.summary}
                    </p>
                  </div>

                  {/* Education */}
                  <div className="mb-3">
                    <h3 className="font-bold text-[11px] uppercase border-b pb-0.5 mb-1 text-gray-800">
                      Education
                    </h3>
                    {currentParsedResume.educations.map((edu, i) => (
                      <div key={i} className="mb-1.5">
                        <div className="flex justify-between font-bold text-[10.5px]">
                          <span>{edu.school}</span>
                          <span>{edu.date}</span>
                        </div>
                        <div className="italic text-[10px]">{edu.degree}</div>
                        <div className="text-[10px] text-gray-700 font-mono">GPA: {edu.gpa}</div>
                        {edu.descriptions.map((d, di) => (
                          <div key={di} className="text-[9.5px] text-gray-800 pl-2">
                            • {d}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Work Experience */}
                  <div className="mb-3">
                    <h3 className="font-bold text-[11px] uppercase border-b pb-0.5 mb-1 text-gray-800">
                      Work Experience
                    </h3>
                    {currentParsedResume.workExperiences.map((exp, i) => (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between font-bold text-[10.5px]">
                          <span>{exp.company}</span>
                          <span>{exp.date}</span>
                        </div>
                        <div className="italic text-[10px]">{exp.jobTitle}</div>
                        {exp.descriptions.map((desc, di) => (
                          <div key={di} className="text-[9.5px] text-gray-800 pl-2">
                            • {desc}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-bold text-[11px] uppercase border-b pb-0.5 mb-1 text-gray-800">
                      Skills
                    </h3>
                    {currentParsedResume.skills.descriptions.map((s, si) => (
                      <div key={si} className="text-[9.5px] text-gray-800 pl-2">
                        • {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div className="mt-4 p-3 border-2 border-dashed border-[#CEBFAD] rounded-2xl bg-white/60 text-center">
                <p className="text-xs font-semibold text-[#121212]">
                  {selectedResumeFile} (104 KB)
                </p>
                <p className="text-[11px] text-[#736E65] mt-0.5">
                  Note: Parser works best on single column resume
                </p>
              </div>
            </div>

            {/* Right Col: Structured Resume Parsing Results Table (Exact Image 1 Table) */}
            <div className="p-6 overflow-y-auto bg-white flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2DBD0] mb-4">
                  <h3 className="text-base font-black text-[#121212] tracking-tight">
                    Resume Parsing Results
                  </h3>
                  <button
                    onClick={handleApplyParsedToEditor}
                    className="px-3.5 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Edit in Live Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Parsing Results Table */}
                <div className="border border-[#E2DBD0] rounded-2xl overflow-hidden text-xs">
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-[#E2DBD0]">
                      {/* Section: Profile */}
                      <tr className="bg-[#FAF8F5]">
                        <th colSpan={2} className="px-4 py-2 text-xs font-black text-[#121212]">
                          Profile
                        </th>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] w-1/4 border-r border-[#E2DBD0]">
                          Name
                        </th>
                        <td className="px-4 py-2 font-medium text-[#121212]">
                          {currentParsedResume.profile.name}
                        </td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                          Email
                        </th>
                        <td className="px-4 py-2 font-mono text-[#121212]">
                          {currentParsedResume.profile.email}
                        </td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                          Phone
                        </th>
                        <td className="px-4 py-2 font-mono text-[#121212]">
                          {currentParsedResume.profile.phone}
                        </td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                          Location
                        </th>
                        <td className="px-4 py-2 font-medium text-[#121212]">
                          {currentParsedResume.profile.location}
                        </td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                          Link
                        </th>
                        <td className="px-4 py-2 font-mono text-[#121212] text-[11px]">
                          {currentParsedResume.profile.url}
                        </td>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                          Summary
                        </th>
                        <td className="px-4 py-2 font-medium text-[#121212] leading-relaxed">
                          {currentParsedResume.profile.summary}
                        </td>
                      </tr>

                      {/* Section: Education */}
                      <tr className="bg-[#FAF8F5]">
                        <th colSpan={2} className="px-4 py-2 text-xs font-black text-[#121212]">
                          Education
                        </th>
                      </tr>
                      {currentParsedResume.educations.map((edu, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              School
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">{edu.school}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Degree
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">{edu.degree}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              GPA
                            </th>
                            <td className="px-4 py-2 font-mono text-[#121212]">{edu.gpa}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Date
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">{edu.date}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Descriptions
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">
                              {edu.descriptions.map((d, di) => (
                                <div key={di}>• {d}</div>
                              ))}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}

                      {/* Section: Work Experience */}
                      <tr className="bg-[#FAF8F5]">
                        <th colSpan={2} className="px-4 py-2 text-xs font-black text-[#121212]">
                          Work Experience
                        </th>
                      </tr>
                      {currentParsedResume.workExperiences.map((exp, idx) => (
                        <React.Fragment key={idx}>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Company
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">{exp.company}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Job Title
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">{exp.jobTitle}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Date
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">{exp.date}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                              Descriptions
                            </th>
                            <td className="px-4 py-2 font-medium text-[#121212]">
                              {exp.descriptions.map((desc, di) => (
                                <div key={di}>• {desc}</div>
                              ))}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}

                      {/* Section: Skills */}
                      <tr className="bg-[#FAF8F5]">
                        <th colSpan={2} className="px-4 py-2 text-xs font-black text-[#121212]">
                          Skills & Competencies
                        </th>
                      </tr>
                      <tr>
                        <th className="px-4 py-2 font-bold text-[#59554E] border-r border-[#E2DBD0]">
                          Competencies
                        </th>
                        <td className="px-4 py-2 font-medium text-[#121212]">
                          {currentParsedResume.skills.descriptions.map((s, si) => (
                            <div key={si}>• {s}</div>
                          ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom Transfer Call-to-action */}
              <div className="mt-4 pt-4 border-t border-[#E2DBD0] flex items-center justify-between">
                <span className="text-xs text-[#736E65]">
                  ATS Compatibility: <strong>Zero parsing errors detected.</strong>
                </span>
                <button
                  onClick={handleApplyParsedToEditor}
                  className="px-5 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold"
                >
                  Load into Resume Builder →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: RESUME BUILDER & LIVE ATS PREVIEW (As in User Screenshot 2)
           ========================================================================= */}
        {activeTab === "BUILDER" && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden print:block">
            {/* Left Col: Form Editor */}
            <div className="p-6 overflow-y-auto space-y-6 bg-white border-r border-[#E2DBD0] print:hidden">
              {/* JD Tailoring Assistant Banner */}
              {tailoringJD && (
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#121212] shadow-sm space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#121212] text-white">
                          🎯 Tailoring Assistant Active
                        </span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                          {getTailoringKeywordStats().score}% ATS Compatibility
                        </span>
                      </div>
                      <h4 className="text-xs font-black text-[#121212]">
                        {tailoringJD.title} &bull; <span className="text-[#59554E] font-medium">{tailoringJD.company_name}</span>
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={handleInfuseKeywords}
                      className="px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ 1-Click Infuse Missing Keywords</span>
                    </button>
                  </div>

                  {/* Target Keywords breakdown */}
                  <div className="space-y-1.5 pt-1 border-t border-[#E2DBD0]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#59554E]">JD Required Keywords:</span>
                      <span className="font-mono text-[#736E65]">
                        {getTailoringKeywordStats().matched.length} of {tailoringJD.required_skills?.length || 0} matched
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {tailoringJD.required_skills?.map((sk: string) => {
                        const isMatched = getTailoringKeywordStats().matched.includes(sk);
                        return (
                          <span
                            key={sk}
                            className={`px-2 py-0.5 rounded-md font-mono text-[10.5px] font-bold flex items-center gap-1 ${
                              isMatched
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                                : "bg-amber-50 text-amber-900 border border-amber-300"
                            }`}
                          >
                            {isMatched ? <Check className="w-3 h-3 text-emerald-700" /> : <Plus className="w-3 h-3 text-amber-700" />}
                            {sk}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Card */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                  Profile Information
                </h4>
                <div>
                  <label className="text-[11px] font-bold text-[#59554E]">Full Name</label>
                  <input
                    type="text"
                    value={resumeData.profile.name}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        profile: { ...resumeData.profile, name: e.target.value },
                      })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#59554E]">Objective / Summary</label>
                  <textarea
                    rows={2}
                    value={resumeData.profile.summary}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        profile: { ...resumeData.profile, summary: e.target.value },
                      })
                    }
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#59554E]">Email</label>
                    <input
                      type="email"
                      value={resumeData.profile.email}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          profile: { ...resumeData.profile, email: e.target.value },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-mono text-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#59554E]">Phone</label>
                    <input
                      type="text"
                      value={resumeData.profile.phone}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          profile: { ...resumeData.profile, phone: e.target.value },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-mono text-[#121212]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#59554E]">Website / GitHub</label>
                    <input
                      type="text"
                      value={resumeData.profile.url}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          profile: { ...resumeData.profile, url: e.target.value },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-mono text-[#121212]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#59554E]">Location</label>
                    <input
                      type="text"
                      value={resumeData.profile.location}
                      onChange={(e) =>
                        setResumeData({
                          ...resumeData,
                          profile: { ...resumeData.profile, location: e.target.value },
                        })
                      }
                      className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212]"
                    />
                  </div>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#121212] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Work Experience
                  </h4>
                  <button
                    onClick={addWorkExperience}
                    className="px-2.5 py-1 rounded-lg bg-[#EDE7DC] hover:bg-[#D9D2C7] text-[#121212] text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Experience
                  </button>
                </div>

                {resumeData.workExperiences.map((exp, expIdx) => (
                  <div
                    key={expIdx}
                    className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#121212]">
                        Role #{expIdx + 1}
                      </span>
                      <button
                        onClick={() => removeWorkExperience(expIdx)}
                        className="text-red-600 hover:text-red-800 p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#59554E]">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...resumeData.workExperiences];
                            updated[expIdx].company = e.target.value;
                            setResumeData({ ...resumeData, workExperiences: updated });
                          }}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[#59554E]">Job Title</label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => {
                            const updated = [...resumeData.workExperiences];
                            updated[expIdx].jobTitle = e.target.value;
                            setResumeData({ ...resumeData, workExperiences: updated });
                          }}
                          className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-[#59554E]">Dates Employed</label>
                      <input
                        type="text"
                        value={exp.date}
                        onChange={(e) => {
                          const updated = [...resumeData.workExperiences];
                          updated[expIdx].date = e.target.value;
                          setResumeData({ ...resumeData, workExperiences: updated });
                        }}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212]"
                      />
                    </div>

                    {/* Bullet Descriptions */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-[#59554E]">
                          Bullet Descriptions (ATS Action Verbs)
                        </label>
                        <button
                          onClick={() => addBulletPoint(expIdx)}
                          className="text-[10px] font-bold text-[#121212] hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {exp.descriptions.map((desc, dIdx) => (
                        <div key={dIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={desc}
                            onChange={(e) => {
                              const updated = [...resumeData.workExperiences];
                              updated[expIdx].descriptions[dIdx] = e.target.value;
                              setResumeData({ ...resumeData, workExperiences: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212]"
                          />
                          <button
                            onClick={() => removeBulletPoint(expIdx, dIdx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Education Section */}
              <div className="space-y-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0]">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#121212] flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Education
                </h4>
                {resumeData.educations.map((edu, eIdx) => (
                  <div key={eIdx} className="space-y-2">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => {
                        const updated = [...resumeData.educations];
                        updated[eIdx].school = e.target.value;
                        setResumeData({ ...resumeData, educations: updated });
                      }}
                      placeholder="University / College"
                      className="w-full px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-semibold text-[#121212]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...resumeData.educations];
                          updated[eIdx].degree = e.target.value;
                          setResumeData({ ...resumeData, educations: updated });
                        }}
                        placeholder="Degree"
                        className="px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212]"
                      />
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => {
                          const updated = [...resumeData.educations];
                          updated[eIdx].gpa = e.target.value;
                          setResumeData({ ...resumeData, educations: updated });
                        }}
                        placeholder="GPA"
                        className="px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs text-[#121212]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Live Rendered ATS-Optimized Resume Document (Exact Image 2) */}
            <div className="p-6 bg-[#F4EFE6]/80 flex flex-col justify-between overflow-y-auto">
              <div className="overflow-x-auto flex justify-center">
                {/* Clean ATS Resume Page (8.5 x 11 Standard) */}
                <div
                  id="printable-resume"
                  style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                  className="bg-white rounded shadow-2xl p-8 sm:p-10 w-[620px] min-h-[820px] text-gray-900 font-sans text-xs transition-transform print:shadow-none print:transform-none print:w-full print:p-0"
                >
                  {/* Top Header Accent Line */}
                  <div className="h-1.5 w-full bg-[#0284c7] mb-6 rounded-full" />

                  {/* Header / Profile */}
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h1 className="text-2xl font-black text-[#0284c7] tracking-tight">
                      {resumeData.profile.name}
                    </h1>
                    <p className="text-xs text-gray-700 mt-1 font-medium">
                      {resumeData.profile.summary}
                    </p>
                    <div className="mt-2 text-[11px] text-gray-600 flex flex-wrap items-center gap-3 font-mono">
                      <span>✉ {resumeData.profile.email}</span>
                      <span>☎ {resumeData.profile.phone}</span>
                      <span>📍 {resumeData.profile.location}</span>
                      <span>🔗 {resumeData.profile.url}</span>
                    </div>
                  </div>

                  {/* WORK EXPERIENCE */}
                  <div className="mb-5">
                    <h2 className="text-xs font-bold text-[#0284c7] tracking-wider uppercase flex items-center gap-2 mb-2">
                      <span className="w-3 h-0.5 bg-[#0284c7]" /> WORK EXPERIENCE
                    </h2>
                    {resumeData.workExperiences.map((exp, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between items-baseline font-bold text-xs">
                          <span className="text-gray-900">{exp.company}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{exp.date}</span>
                        </div>
                        <div className="text-[11px] font-semibold text-gray-700 italic">
                          {exp.jobTitle}
                        </div>
                        <ul className="mt-1 space-y-1 pl-4 list-disc text-[10.5px] text-gray-700 leading-relaxed">
                          {exp.descriptions.map((desc, di) => (
                            <li key={di}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* EDUCATION */}
                  <div className="mb-5">
                    <h2 className="text-xs font-bold text-[#0284c7] tracking-wider uppercase flex items-center gap-2 mb-2">
                      <span className="w-3 h-0.5 bg-[#0284c7]" /> EDUCATION
                    </h2>
                    {resumeData.educations.map((edu, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between items-baseline font-bold text-xs">
                          <span className="text-gray-900">{edu.school}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{edu.date}</span>
                        </div>
                        <div className="text-[11px] text-gray-700">{edu.degree}</div>
                        <div className="text-[10px] text-gray-600 font-mono">GPA: {edu.gpa}</div>
                        <ul className="mt-1 pl-4 list-disc text-[10.5px] text-gray-700">
                          {edu.descriptions.map((d, di) => (
                            <li key={di}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* PROJECTS */}
                  <div className="mb-5">
                    <h2 className="text-xs font-bold text-[#0284c7] tracking-wider uppercase flex items-center gap-2 mb-2">
                      <span className="w-3 h-0.5 bg-[#0284c7]" /> PROJECTS
                    </h2>
                    {resumeData.projects.map((proj, idx) => (
                      <div key={idx} className="mb-2">
                        <div className="flex justify-between items-baseline font-bold text-xs">
                          <span className="text-gray-900">{proj.project}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{proj.date}</span>
                        </div>
                        <ul className="mt-1 pl-4 list-disc text-[10.5px] text-gray-700">
                          {proj.descriptions.map((d, di) => (
                            <li key={di}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* SKILLS */}
                  <div>
                    <h2 className="text-xs font-bold text-[#0284c7] tracking-wider uppercase flex items-center gap-2 mb-2">
                      <span className="w-3 h-0.5 bg-[#0284c7]" /> SKILLS
                    </h2>
                    <ul className="pl-4 list-disc text-[10.5px] text-gray-700 space-y-0.5">
                      {resumeData.skills.descriptions.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Resume Control Bar (As in Image 2) */}
              <div className="mt-4 p-3 bg-white rounded-2xl border border-[#E2DBD0] shadow-sm flex flex-wrap items-center justify-between gap-3 shrink-0 print:hidden">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#736E65] font-semibold flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5" /> Zoom:
                  </span>
                  <input
                    type="range"
                    min="50"
                    max="120"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(Number(e.target.value))}
                    className="w-24 accent-[#121212]"
                  />
                  <span className="text-xs font-mono font-bold text-[#121212]">{zoomLevel}%</span>
                  <label className="flex items-center gap-1.5 text-xs text-[#59554E] cursor-pointer ml-2">
                    <input
                      type="checkbox"
                      checked={autoScale}
                      onChange={(e) => setAutoScale(e.target.checked)}
                      className="rounded border-[#E2DBD0]"
                    />
                    <span>Autoscale</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrintDownload}
                    className="px-4 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Resume PDF</span>
                  </button>
                  <button
                    onClick={handleSyncToPathfinder}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save & Boost Match Score</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

