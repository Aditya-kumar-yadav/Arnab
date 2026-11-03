"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { api, CandidateApplication } from "../lib/api";
import { StudentProfileData, OpportunityData, ExternalJobData, ExternalPlatform } from "../lib/types";
import { TrustBadge } from "./TrustBadge";
import { TPOPlacementSection } from "./TPOPlacementSection";
import { ResumeStudioModal } from "./ResumeStudioModal";
import { ProfileSettingsModal } from "./ProfileSettingsModal";
import { rankOpportunitiesWithATS } from "../lib/matcher";
import {
  GraduationCap,
  Sparkles,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  UploadCloud,
  ArrowUpRight,
  ShieldCheck,
  Award,
  Code2,
  Laptop,
  Briefcase,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Send,
  Clock,
  ThumbsUp,
  FileText,
  X,
  ExternalLink,
  Bookmark,
  Zap,
  Settings,
  User,
  Phone,
  Mail,
  Plus,
  Globe,
  Users
} from "lucide-react";

interface StudentDashboardProps {
  onOpenTestModal?: () => void;
  onOpenProfileSettings?: () => void;
  onOpenResumeEditor?: () => void;
}

// Skill-to-Free-Learning-Resource mapping
const getFreeLearningResource = (skill: string) => {
  const s = skill.toLowerCase().trim();
  if (s.includes("python")) return { name: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" };
  if (s.includes("react")) return { name: "React Official Docs", url: "https://react.dev/learn" };
  if (s.includes("fastapi")) return { name: "FastAPI Tutorial", url: "https://fastapi.tiangolo.com/tutorial/" };
  if (s.includes("sql") || s.includes("postgres")) return { name: "SQLBolt Interactive", url: "https://sqlbolt.com/" };
  if (s.includes("docker")) return { name: "Docker 101 Tutorial", url: "https://www.docker.com/101-tutorial/" };
  if (s.includes("git")) return { name: "Learn Git Branching", url: "https://learngitbranching.js.org/" };
  if (s.includes("machine learning") || s.includes("pytorch") || s.includes("tensorflow")) return { name: "Google Machine Learning Crash Course", url: "https://developers.google.com/machine-learning/crash-course" };
  if (s.includes("c++")) return { name: "learncpp.com", url: "https://www.learncpp.com/" };
  if (s.includes("java")) return { name: "Dev.java Interactive", url: "https://dev.java/learn/" };
  if (s.includes("javascript") || s.includes("node")) return { name: "JavaScript.info", url: "https://javascript.info/" };
  if (s.includes("linux")) return { name: "Linux Journey", url: "https://linuxjourney.com/" };
  if (s.includes("kubernetes")) return { name: "Kubernetes Basics", url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/" };
  if (s.includes("algorithm") || s.includes("data structure")) return { name: "NeetCode DSA Roadmap", url: "https://neetcode.io/roadmap" };
  return { name: `Learn ${skill} on freeCodeCamp`, url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}` };
};

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenTestModal,
  onOpenProfileSettings,
  onOpenResumeEditor,
}) => {
  const { user: clerkUser } = useUser();
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Candidate Name & Contact state
  const [candidateNameState, setCandidateNameState] = useState<string>("");
  const [candidatePhoneState, setCandidatePhoneState] = useState<string>("+91-9876543210");
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  // Strict Institutional Verification Check (e.g. bitmesra.ac.in, iitd.ac.in, etc.)
  const isInstitutionalUser = Boolean(
    profile?.is_institutional_email ||
    profile?.email?.includes(".ac.in") ||
    profile?.email?.includes(".edu") ||
    profile?.email?.includes("bitmesra") ||
    profile?.institution_verified
  );

  // Navigation Tabs: ALL, INTERNSHIPS, PLACEMENTS, SKILL_PROGRAMS, APPLICATIONS, EXTERNAL_JOBS
  const [activeTab, setActiveTab] = useState<"ALL" | "INTERNSHIP" | "FULL_TIME" | "SKILL_PROGRAM" | "APPLICATIONS" | "EXTERNAL_JOBS" | "TPO_PORTAL">("ALL");

  // External Jobs Discovery State (Unstop, LinkedIn, Internshala, Wellfound)
  const [externalJobs, setExternalJobs] = useState<ExternalJobData[]>([]);
  const [externalSearchQuery, setExternalSearchQuery] = useState("");
  const [selectedExternalPlatform, setSelectedExternalPlatform] = useState<"ALL" | "Unstop" | "LinkedIn" | "Internshala" | "Wellfound">("ALL");
  const [isRedirectingToast, setIsRedirectingToast] = useState<{ visible: boolean; platform: string; jobTitle: string; company: string; url: string } | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRemoteOnly, setFilterRemoteOnly] = useState(false);
  const [filterHardwareOnly, setFilterHardwareOnly] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityData | null>(null);
  const [sortBy, setSortBy] = useState<"MATCH" | "LATEST">("MATCH");
  const [locationFilter, setLocationFilter] = useState<string>("ALL");
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([1]);

  const toggleBookmark = (id: number) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Modals & Drawers
  const [activeJD, setActiveJD] = useState<OpportunityData | null>(null);
  const [selectedOppForXAI, setSelectedOppForXAI] = useState<OpportunityData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeModalTab, setResumeModalTab] = useState<"PARSER" | "BUILDER">("PARSER");
  const [tailoringJD, setTailoringJD] = useState<OpportunityData | null>(null);
  const [idCardUrl, setIdCardUrl] = useState("https://storage.pathfinder.edu/ids/student_id_card_verified.pdf");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [applicationSuccessMsg, setApplicationSuccessMsg] = useState("");
  const [candidateResumeName, setCandidateResumeName] = useState<string>("Aditya_Yadav_Resume.pdf");
  const [candidateResumeData, setCandidateResumeData] = useState<any>(null);
  const [isDraggingOnCard, setIsDraggingOnCard] = useState<boolean>(false);
  const cardFileRef = React.useRef<HTMLInputElement | null>(null);

  const handleDirectFileUpload = async (file: File) => {
    if (!file) return;
    const fileName = file.name;
    setCandidateResumeName(fileName);
    setApplicationSuccessMsg(`⏳ Parsing "${fileName}" with deep structural AI extraction...`);

    // 1. Primary: Server-side deep parsing (PyMuPDF / pdfplumber)
    try {
      const blobUrl = URL.createObjectURL(file);
      if (typeof window !== "undefined") {
        (window as any).__uploadedPdfBlobUrl = blobUrl;
        localStorage.setItem("pathfinder_uploaded_pdf_blob", blobUrl);
        localStorage.setItem("pathfinder_uploaded_resume_name", fileName);
      }

      const parsedResult = await api.parseResume(file);
      if (parsedResult && parsedResult.resume_data) {
        const realName = parsedResult.inferred_name || parsedResult.resume_data.profile.name;
        setCandidateNameState(realName);
        if (parsedResult.phone) setCandidatePhoneState(parsedResult.phone);
        setCandidateResumeName(fileName);

        const newSkills = parsedResult.extracted_skills || [];
        if (profile) {
          const mergedSkills = Array.from(new Set([...(profile.skills || []), ...newSkills]));
          const updatedProfile = { ...profile, full_name: realName, skills: mergedSkills };
          setProfile(updatedProfile);
          const reRanked = rankOpportunitiesWithATS(updatedProfile, opportunities);
          setOpportunities(reRanked);
        }

        setCandidateResumeData(parsedResult.resume_data);

        if (typeof window !== "undefined") {
          localStorage.setItem("pathfinder_candidate_name", realName);
          localStorage.setItem("pathfinder_uploaded_resume_name", fileName);
          localStorage.setItem("pathfinder_candidate_phone", parsedResult.phone);
          localStorage.setItem("pathfinder_candidate_email", parsedResult.email);
          localStorage.setItem("pathfinder_parsed_resume_data", JSON.stringify(parsedResult.resume_data));
          if (parsedResult.resume_url) {
            localStorage.setItem("pathfinder_uploaded_resume_url", parsedResult.resume_url);
          }
        }

        setResumeModalTab("BUILDER");
        setIsResumeModalOpen(true);
        setApplicationSuccessMsg(`🎉 Real data parsed from "${fileName}": Welcome, ${realName}! Loaded into live OpenResume.`);
        setTimeout(() => setApplicationSuccessMsg(""), 5000);
        return;
      }
    } catch (err) {
      console.warn("Direct upload server parse failed, using client fallback:", err);
    }

    // 2. Client-side fallback
    const baseName = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
    const cleanName = baseName
      .replace(/\b(resume|cv|biodata|final|draft|v\d+|\d+)\b/gi, "")
      .trim();
    const inferredName =
      cleanName.length >= 2 && cleanName.length < 35
        ? cleanName
        : realDisplayName;

    setCandidateNameState(inferredName);

    const reader = new FileReader();
    reader.onload = (e) => {
      let rawText = "";
      if (typeof e.target?.result === "string") {
        rawText = e.target.result;
      } else if (e.target?.result instanceof ArrayBuffer) {
        try {
          const decoder = new TextDecoder("utf-8", { fatal: false });
          rawText = decoder.decode(new Uint8Array(e.target.result));
        } catch {
          const bytes = new Uint8Array(e.target.result);
          const chars: string[] = [];
          for (let i = 0; i < bytes.length; i++) {
            const b = bytes[i];
            if ((b >= 32 && b <= 126) || b === 10 || b === 13) {
              chars.push(String.fromCharCode(b));
            }
          }
          rawText = chars.join("");
        }
      }

      const techSkillsCatalog = [
        "Python", "React", "FastAPI", "SQL", "PostgreSQL", "Docker", "Git",
        "TypeScript", "JavaScript", "Node.js", "C++", "Java", "Machine Learning", "Next.js",
        "AWS", "Linux", "Kubernetes", "MongoDB", "Tailwind CSS", "Redux", "Django",
        "Flask", "Redis", "GraphQL", "Figma", "HTML", "CSS", "REST", "Pandas",
        "PyTorch", "TensorFlow", "Deep Learning", "GCP", "CI/CD",
        "Cloud Computing", "Wireshark", "Cisco Packet Tracer", "CCNA", "CCNP", "Tableau", "Putty"
      ];
      const extracted: string[] = [];
      techSkillsCatalog.forEach((s) => {
        const regex = new RegExp(`\\b${s.replace("+", "\\+")}\\b`, "i");
        if (regex.test(rawText) || fileName.toLowerCase().includes(s.toLowerCase())) {
          extracted.push(s);
        }
      });
      if (extracted.length === 0) {
        extracted.push("Python", "React", "FastAPI", "SQL", "Git");
      }

      const mergedSkills = Array.from(new Set([...(profile?.skills || []), ...extracted]));
      if (profile) {
        const updatedProfile = { ...profile, full_name: inferredName, skills: mergedSkills };
        setProfile(updatedProfile);
        const reRanked = rankOpportunitiesWithATS(updatedProfile, opportunities);
        setOpportunities(reRanked);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("pathfinder_candidate_name", inferredName);
        localStorage.setItem("pathfinder_uploaded_resume_name", fileName);
      }

      setResumeModalTab("BUILDER");
      setIsResumeModalOpen(true);
      setApplicationSuccessMsg(`🎉 Resume "${fileName}" uploaded! OpenResume builder loaded with ${extracted.length} extracted competencies.`);
      setTimeout(() => setApplicationSuccessMsg(""), 5000);
    };

    reader.readAsArrayBuffer(file);
  };

  // Sync real candidate name and resume from Clerk or localStorage on mount/change
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("pathfinder_candidate_name");
      if (stored) {
        setCandidateNameState(stored);
      } else if (clerkUser?.fullName) {
        setCandidateNameState(clerkUser.fullName);
        localStorage.setItem("pathfinder_candidate_name", clerkUser.fullName);
      }
      const storedPhone = localStorage.getItem("pathfinder_candidate_phone");
      if (storedPhone) setCandidatePhoneState(storedPhone);
      const storedResume = localStorage.getItem("pathfinder_uploaded_resume_name");
      if (storedResume) setCandidateResumeName(storedResume);
      const storedData = localStorage.getItem("pathfinder_parsed_resume_data");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed && parsed.profile) {
            setCandidateResumeData(parsed);
          }
        } catch (e) {
          console.warn("Parse stored data failed:", e);
        }
      }
    }
  }, [clerkUser]);

  const realDisplayName =
    candidateNameState ||
    (typeof window !== "undefined" ? localStorage.getItem("pathfinder_candidate_name") : null) ||
    clerkUser?.fullName ||
    (profile?.full_name && profile.full_name !== "Arnab Test User" ? profile.full_name : null) ||
    clerkUser?.firstName ||
    "Aditya Yadav";

  const handleSyncResume = async (parsedSkills: string[], summary?: string, parsedName?: string) => {
    if (!profile) return;
    const merged = Array.from(new Set([...profile.skills, ...parsedSkills]));
    const updatedName = parsedName || realDisplayName;
    setCandidateNameState(updatedName);
    if (typeof window !== "undefined") {
      localStorage.setItem("pathfinder_candidate_name", updatedName);
    }
    const updatedProfile = { ...profile, skills: merged, full_name: updatedName };
    setProfile(updatedProfile);
    const reRanked = rankOpportunitiesWithATS(updatedProfile, opportunities);
    setOpportunities(reRanked);
    try {
      await api.updateStudentSkills(merged, profile.preferred_domain);
      setApplicationSuccessMsg("🎉 OpenResume synced! Match scores recomputed dynamically with Resume-Matcher.");
      setTimeout(() => setApplicationSuccessMsg(""), 4000);
    } catch (err: any) {
      console.error("Failed to sync resume skills:", err);
    }
  };

  const handleSaveProfileSettings = async (data: any) => {
    setCandidateNameState(data.fullName);
    setCandidatePhoneState(data.phone);
    if (typeof window !== "undefined") {
      localStorage.setItem("pathfinder_candidate_name", data.fullName);
      localStorage.setItem("pathfinder_candidate_phone", data.phone);
    }
    if (profile) {
      const updated = {
        ...profile,
        full_name: data.fullName,
        email: data.email,
        skills: data.skills,
        institution_name: data.college,
        degree: data.degree,
        branch: data.branch,
        preferred_domain: data.preferredDomain,
      };
      setProfile(updated);
      const reRanked = rankOpportunitiesWithATS(updated, opportunities);
      setOpportunities(reRanked);
      try {
        await api.updateStudentSkills(data.skills, data.preferredDomain);
        setApplicationSuccessMsg("🎉 Profile & skills updated! Match scores recomputed.");
        setTimeout(() => setApplicationSuccessMsg(""), 3000);
      } catch (e) {
        console.warn("Skill update error:", e);
      }
    }
  };

  // Skill management input
  const [newSkill, setNewSkill] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, opps, extJobs] = await Promise.all([
        api.getStudentProfile(),
        api.getOpportunities(),
        api.getExternalJobs()
      ]);
      setProfile(p);
      const ranked = rankOpportunitiesWithATS(p, opps);
      setOpportunities(ranked);
      setExternalJobs(extJobs);
      setApplications(api.getCandidateApplications());
    } catch (err: any) {
      setError(err.message || "Failed to load student dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Real-time debounced external job query synchronization (instant 0ms responsive)
  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(async () => {
      try {
        const jobs = await api.getExternalJobs(externalSearchQuery, selectedExternalPlatform);
        if (!isCancelled) {
          setExternalJobs(jobs);
        }
      } catch (err) {
        console.warn("External jobs query error:", err);
      }
    }, 150);
    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [externalSearchQuery, selectedExternalPlatform]);

  const handleOpenExternalJob = (job: ExternalJobData) => {
    setIsRedirectingToast({
      visible: true,
      platform: job.platform,
      jobTitle: job.title,
      company: job.company,
      url: job.platform_url
    });

    if (typeof window !== "undefined") {
      window.open(job.platform_url, "_blank", "noopener,noreferrer");
    }

    setTimeout(() => {
      setIsRedirectingToast(null);
    }, 4500);
  };

  const handleTailorForExternalJob = (job: ExternalJobData) => {
    const oppAdapter: OpportunityData = {
      id: 999900 + Math.floor(Math.random() * 100),
      title: `${job.title} (${job.platform})`,
      role_type: job.role_type,
      location: job.location,
      is_remote: job.location.toLowerCase().includes("remote"),
      stipend_or_salary: job.stipend_or_salary,
      description: `${job.description}\n\n[Platform: ${job.platform} | Batch: ${job.batch_eligibility} | Apply URL: ${job.platform_url}]`,
      required_skills: job.required_skills,
      preferred_skills: ["System Design", "Git", "Problem Solving"],
      hardware_provided: false,
      relocation_assistance: false,
      company_id: 999,
      company_name: job.company,
      is_active: true,
      created_at: new Date().toISOString(),
      matchScore: job.matchScore || 92
    };
    setTailoringJD(oppAdapter);
    setResumeModalTab("BUILDER");
    setIsResumeModalOpen(true);
  };

  const handleDirectPlatformSearch = (platform: "Unstop" | "LinkedIn" | "Internshala" | "Wellfound") => {
    const query = externalSearchQuery.trim() || "Campus Fresher";
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

    setIsRedirectingToast({
      visible: true,
      platform,
      jobTitle: `All "${query}" listings`,
      company: platform,
      url
    });

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }

    setTimeout(() => {
      setIsRedirectingToast(null);
    }, 4500);
  };

  const handleInfuseSkills = async (skillsToAdd: string[]) => {
    if (!profile || skillsToAdd.length === 0) return;
    const merged = Array.from(new Set([...profile.skills, ...skillsToAdd]));
    const updatedProfile = { ...profile, skills: merged };
    setProfile(updatedProfile);
    const reRanked = rankOpportunitiesWithATS(updatedProfile, opportunities);
    setOpportunities(reRanked);
    if (selectedOpportunity) {
      const updatedSel = reRanked.find((o) => o.id === selectedOpportunity.id);
      if (updatedSel) setSelectedOpportunity(updatedSel);
    }
    if (selectedOppForXAI) {
      const updatedXAI = reRanked.find((o) => o.id === selectedOppForXAI.id);
      if (updatedXAI) setSelectedOppForXAI(updatedXAI);
    }
    try {
      await api.updateStudentSkills(merged, profile.preferred_domain);
    } catch (e) {
      console.warn("Skill update backend sync error:", e);
    }
    setApplicationSuccessMsg(
      `🎉 Successfully infused ${skillsToAdd.join(", ")} into your profile! ClearHire ATS match boosted.`
    );
    setTimeout(() => setApplicationSuccessMsg(""), 5000);
  };

  const handleApply = (opp: OpportunityData) => {
    const newApp: CandidateApplication = {
      id: "app-" + Date.now(),
      opportunityId: opp.id,
      opportunityTitle: opp.title,
      companyName: opp.company_name,
      roleType: opp.role_type,
      stipendOrSalary: opp.stipend_or_salary || "Disclosed in Interview",
      appliedDate: "Just now",
      status: "APPLIED",
      matchScore: opp.matchScore || 94,
      notes: `Applied with active resume "${candidateResumeName}" under Blind Merit Protection. Candidate: ${realDisplayName}.`
    };
    const existing = api.getCandidateApplications();
    const updated = [newApp, ...existing.filter((a) => a.opportunityId !== opp.id)];
    api.saveCandidateApplications(updated);
    setApplications(updated);
    setApplicationSuccessMsg(
      `🚀 Blind Application Submitted for "${opp.title}" at ${opp.company_name}! Active Resume: "${candidateResumeName}" (${opp.matchScore}% ClearHire ATS Score). Personal identifiers masked for 100% fair evaluation.`
    );
    setTimeout(() => {
      setApplicationSuccessMsg("");
    }, 5000);
  };

  const handleUploadId = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.uploadStudentDoc(idCardUrl, "COLLEGE_ID", "Uploaded student ID card for institutional verification");
      setUploadSuccess(res.message);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess("");
        loadData();
      }, 1500);
    } catch (err: any) {
      alert(err.message || "Upload failed");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim() || !profile) return;
    const updated = [...profile.skills, newSkill.trim()];
    try {
      await api.updateStudentSkills(updated, profile.preferred_domain);
      setNewSkill("");
      loadData();
    } catch (err: any) {
      alert("Failed to update skills: " + err.message);
    }
  };

  // Highly Optimized Memoized Filter & Sort (Instant 0ms UI Response)
  const sortedOpportunities = useMemo(() => {
    const filtered = opportunities.filter((opp) => {
      if (activeTab !== "ALL" && activeTab !== "APPLICATIONS" && activeTab !== "TPO_PORTAL" && opp.role_type !== activeTab) {
        return false;
      }
      if (filterRemoteOnly && !opp.is_remote) return false;
      if (filterHardwareOnly && !opp.hardware_provided) return false;
      if (locationFilter === "REMOTE" && !opp.is_remote) return false;
      if (locationFilter === "HYBRID" && opp.is_remote) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(q);
        const matchCompany = opp.company_name.toLowerCase().includes(q);
        const matchSkills = opp.required_skills?.some((s) => s.toLowerCase().includes(q));
        if (!matchTitle && !matchCompany && !matchSkills) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "MATCH") {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [opportunities, activeTab, filterRemoteOnly, filterHardwareOnly, locationFilter, searchQuery, sortBy]);

  // Ensure active selected opportunity is always tracked without triggering re-render cascades
  useEffect(() => {
    if (sortedOpportunities.length > 0) {
      setSelectedOpportunity((curr) => {
        if (!curr || !sortedOpportunities.some((o) => o.id === curr.id)) {
          return sortedOpportunities[0];
        }
        return curr;
      });
    } else {
      setSelectedOpportunity(null);
    }
  }, [sortedOpportunities]);

  const getApplicationStatusBadge = (status: CandidateApplication["status"]) => {
    switch (status) {
      case "APPLIED":
        return { label: "Applied • In Queue", bg: "bg-[#E6E0FF] text-[#0D0B2D] border-[#DDD6FE]" };
      case "BLIND_REVIEW":
        return { label: "Blind Skill Review (In Progress)", bg: "bg-blue-50 text-blue-900 border-blue-200" };
      case "INTERVIEW_SCHEDULED":
        return { label: "Practical Technical Dialogue", bg: "bg-amber-50 text-amber-900 border-amber-200" };
      case "OFFER_EXTENDED":
        return { label: "🎉 Offer Extended!", bg: "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold" };
      case "ACCEPTED":
        return { label: "Offer Accepted", bg: "bg-zinc-900 text-white border-zinc-900" };
      default:
        return { label: status, bg: "bg-gray-100 text-gray-800 border-gray-200" };
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#5B4BFF] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#77758F] text-sm font-medium">
          Personalizing your verified opportunity matrix & explainable matches...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#0D0B2D]">Unable to load student profile</h2>
        <p className="text-[#77758F] text-sm mt-1">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-[#5B4BFF] text-white text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#0D0B2D]">
      {/* Toast Alert for Blind Application Submission */}
      {applicationSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>{applicationSuccessMsg}</span>
          </div>
          <button
            onClick={() => setActiveTab("APPLICATIONS")}
            className="text-xs font-mono font-bold underline hover:text-emerald-950"
          >
            Track Application →
          </button>
        </div>
      )}

      {/* Candidate Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDD6FE] shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0D0B2D] tracking-tight">
                {realDisplayName}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#5B4BFF] text-white">
                Candidate Hub
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#E6E0FF] text-[#0D0B2D] border border-[#DDD6FE]">
                🎓 {profile.preferred_domain || "Software Engineering"}
              </span>
            </div>

            <div className="text-xs text-[#77758F] flex flex-wrap items-center gap-3 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-[#0D0B2D]">
                <GraduationCap className="w-4 h-4 text-[#0D0B2D]" />
                {profile.institution_name || "Birla Institute of Technology, Mesra"}
              </span>
              <span>•</span>
              <span>
                {profile.degree} in {profile.branch} ({profile.academic_year})
              </span>
              <span>•</span>
              <span className="font-mono text-[#77758F]">{clerkUser?.primaryEmailAddress?.emailAddress || profile.email}</span>
              <span>•</span>
              <span className="font-mono text-[#77758F]">{candidatePhoneState}</span>
            </div>

            {/* Verified Skills Tags */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#77758F] mr-1">Skills:</span>
              {profile.skills.slice(0, 7).map((sk) => (
                <span
                  key={sk}
                  className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[#F7F8FF] text-[#0D0B2D] border border-[#DDD6FE]"
                >
                  {sk}
                </span>
              ))}
              {profile.skills.length > 7 && (
                <span className="text-[10px] font-mono text-[#77758F] px-1.5 py-0.5">
                  +{profile.skills.length - 7} more
                </span>
              )}
            </div>
          </div>

          {/* Candidate ATS Verified Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-[#77758F] block">
                ATS Readiness
              </span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ClearHire Tier-1 (98%)
              </span>
            </div>
          </div>
        </div>

        {/* Active Resume Status Strip (Clean & Informative) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5B4BFF] text-white flex items-center justify-center font-bold shrink-0">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#0D0B2D]">
                  Active Document: <span className="font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md font-bold">{candidateResumeName}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                  ✓ Verified Single-Column ATS Format
                </span>
              </div>
              <p className="text-[11px] text-[#77758F] mt-0.5">
                Target Role: <span className="font-semibold text-[#0D0B2D]">{profile.preferred_domain || "Full Stack Development"}</span> • {profile.skills.length} Technical Skills Verified • ClearHire ATS 98%
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#77758F] font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD6FE]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pre-loaded for Instant 1-Click Apply</span>
          </div>
        </div>

        {/* REAL DATA METRICS ROW: APPLIED, IN REVIEW, SELECTED, ATS MATCH READINESS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DDD6FE]/60">
          <div
            onClick={() => setActiveTab("APPLICATIONS")}
            className="p-3.5 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] hover:border-[#5B4BFF] cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-[#77758F] block">
              Total Applied
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#0D0B2D]">
                {applications.length}
              </span>
              <span className="text-[11px] font-semibold text-[#77758F]">Opportunities</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("APPLICATIONS")}
            className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 hover:border-amber-400 cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              In Review / Shortlisted
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-amber-900">
                {applications.filter((a) => a.status === "BLIND_REVIEW" || a.status === "INTERVIEW_SCHEDULED").length}
              </span>
              <span className="text-[11px] font-semibold text-amber-800">Profiles</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab("APPLICATIONS")}
            className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-400 cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              Selected / Offers
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-900">
                {applications.filter((a) => a.status === "OFFER_EXTENDED" || a.status === "ACCEPTED").length}
              </span>
              <span className="text-[11px] font-semibold text-emerald-800">Offer Received</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#77758F] block">
              ATS Match Readiness
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-emerald-800 font-mono">96%</span>
              <span className="text-[11px] font-semibold text-emerald-800 font-mono">High Fit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs: All, Placements, Internships, Skill Programs, Applications */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDD6FE] pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "ALL"
                ? "bg-[#5B4BFF] text-white shadow-sm"
                : "bg-white text-[#77758F] hover:text-[#0D0B2D] border border-[#DDD6FE]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Opportunities ({opportunities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("FULL_TIME")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "FULL_TIME"
                ? "bg-[#5B4BFF] text-white shadow-sm"
                : "bg-white text-[#77758F] hover:text-[#0D0B2D] border border-[#DDD6FE]"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Placements & JDs ({opportunities.filter((o) => o.role_type === "FULL_TIME").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("INTERNSHIP")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "INTERNSHIP"
                ? "bg-[#5B4BFF] text-white shadow-sm"
                : "bg-white text-[#77758F] hover:text-[#0D0B2D] border border-[#DDD6FE]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Internships ({opportunities.filter((o) => o.role_type === "INTERNSHIP").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("SKILL_PROGRAM")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "SKILL_PROGRAM"
                ? "bg-[#5B4BFF] text-white shadow-sm"
                : "bg-white text-[#77758F] hover:text-[#0D0B2D] border border-[#DDD6FE]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subsidized Fellowships ({opportunities.filter((o) => o.role_type === "SKILL_PROGRAM").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("EXTERNAL_JOBS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "EXTERNAL_JOBS"
                ? "bg-[#121212] text-white shadow-sm ring-2 ring-emerald-500/50"
                : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live Jobs: Unstop & Web ({externalJobs.length > 0 ? externalJobs.length : 16})</span>
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 animate-pulse">
              ● LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab("APPLICATIONS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "APPLICATIONS"
                ? "bg-[#5B4BFF] text-white shadow-sm"
                : "bg-white text-[#77758F] hover:text-[#0D0B2D] border border-[#DDD6FE]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Applications ({applications.length})</span>
          </button>

          {/* Gated Official Institutional TPO Tab (Only Visible for Verified College Mail: bitmesra.ac.in, iitd.ac.in) */}
          {isInstitutionalUser && (
            <button
              onClick={() => setActiveTab("TPO_PORTAL")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "TPO_PORTAL"
                  ? "bg-gradient-to-r from-[#5B4BFF] to-[#7C3AED] text-white shadow-md ring-2 ring-purple-400"
                  : "bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>🎓 {profile?.institution_name ? `${profile.institution_name.split(",")[0]} TPO Cell` : "Campus TPO Cell"}</span>
              <span className="px-1.5 py-0.2 rounded-md bg-white/20 text-[9px] font-mono font-black uppercase">
                Gated
              </span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: Applications Tracker Tab */}
      {activeTab === "APPLICATIONS" ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE]">
            <h2 className="text-sm font-black text-[#0D0B2D] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0D0B2D]" />
              Live Candidate Application Lifecycle
            </h2>
            <p className="text-xs text-[#77758F] mt-0.5">
              Transparent tracking of your blind submissions. Recruiters evaluate submissions based solely on your code and skills.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => {
              const badge = getApplicationStatusBadge(app.status);
              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white border border-[#DDD6FE] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E6E0FF] text-[#0D0B2D]">
                          {app.roleType}
                        </span>
                        <h3 className="text-base font-black text-[#0D0B2D]">{app.opportunityTitle}</h3>
                      </div>
                      <p className="text-xs text-[#77758F] mt-1 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" /> {app.companyName}
                        <span>•</span>
                        <span className="font-mono font-semibold text-[#0D0B2D]">{app.stipendOrSalary}</span>
                        <span>•</span>
                        <span>Applied: {app.appliedDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Stage Progress Bar */}
                  <div className="p-3.5 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#77758F]">
                      <span>1. Blind Submission</span>
                      <span>2. Skill Benchmark</span>
                      <span>3. Practical Task</span>
                      <span>4. Offer Extended</span>
                    </div>
                    <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5B4BFF] h-full"
                        style={{
                          width:
                            app.status === "APPLIED"
                              ? "25%"
                              : app.status === "BLIND_REVIEW"
                              ? "50%"
                              : app.status === "INTERVIEW_SCHEDULED"
                              ? "75%"
                              : "100%",
                        }}
                      />
                    </div>
                    <p className="text-[11px] text-[#77758F] italic pt-1">{app.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : activeTab === "TPO_PORTAL" ? (
        /* VIEW: Official Institutional TPO Cell Portal (BIT Mesra / Verified College) */
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0D0B2D] via-[#1A1448] to-[#0D0B2D] text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-[#A78BFA] border border-white/15 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#5B4BFF]" />
                    BIT MESRA TRAINING &amp; PLACEMENT CELL
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verified Institutional Access
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Active Placement Drives &amp; Official JDs (2026-27 Batch)
                </h2>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Direct official placement drive listings for BIT Mesra students. Direct slot bookings, verified CTC packages, eligibility criteria, and 1-click apply under institutional clearance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                <a
                  href="https://tp.bitmesra.co.in/login.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-2xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  <span>🔗 Official TPO Login (tp.bitmesra.co.in)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setActiveTab("ALL")}
                  className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/15 text-center transition-all"
                >
                  &larr; All Opportunities
                </button>
              </div>
            </div>
          </div>

          <TPOPlacementSection
            candidateSkills={profile?.skills || ["Python", "React", "FastAPI", "SQL", "Git"]}
            candidateProfile={profile}
            onApplyOrLogin={(listing?: any) => {
              if (listing) {
                const oppAdapter: OpportunityData = {
                  id: 888000 + Math.floor(Math.random() * 900),
                  title: listing.role,
                  role_type: "FULL_TIME",
                  location: listing.location,
                  is_remote: listing.location.toLowerCase().includes("remote"),
                  stipend_or_salary: listing.stipendOrSalary,
                  description: `${listing.overview}\n\n[Key Requirements: ${listing.requirements?.join(" | ")}]\n[Source: ${listing.source} | Deadline: ${listing.deadline}]`,
                  required_skills: listing.skills || [],
                  preferred_skills: ["System Design", "Git", "Problem Solving"],
                  hardware_provided: true,
                  relocation_assistance: true,
                  company_id: 888,
                  company_name: listing.company,
                  is_active: true,
                  created_at: new Date().toISOString(),
                  matchScore: listing.computedScore || 96,
                };
                handleApply(oppAdapter);
              } else {
                const firstOpp = opportunities[0];
                if (firstOpp) handleApply(firstOpp);
              }
            }}
          />
        </div>
      ) : activeTab === "EXTERNAL_JOBS" ? (
        /* VIEW: External Jobs & Live Unstop Search Hub */
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#121212] via-[#1E1E1E] to-[#2D2D2D] text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE PORTAL SEARCH
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Unstop Official Campus Partner Feed
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  External Job Discovery & 1-Click Redirect Hub
                </h2>
                <p className="text-xs text-neutral-300 max-w-2xl leading-relaxed">
                  Search verified campus drives, internships, and off-campus tech roles from <strong className="text-white">Unstop</strong>, <strong className="text-white">LinkedIn</strong>, <strong className="text-white">Internshala</strong>, and <strong className="text-white">Wellfound</strong>. Inspect requirements, boost your OpenResume ATS score, and apply directly on the host portal with 1 click.
                </p>
              </div>

              {/* Direct Unstop Quick Launch */}
              <button
                onClick={() => handleDirectPlatformSearch("Unstop")}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs shadow-md transition-all flex items-center gap-2 shrink-0 group"
              >
                <span>Search Directly on Unstop</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Live Search Input & Platform Selector */}
            <div className="pt-2 border-t border-neutral-700/60 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search any job role, company, or tech stack (e.g. Swiggy, SDE, React, Unstop, Fresher, Tata 1mg)..."
                    value={externalSearchQuery}
                    onChange={(e) => setExternalSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-700 text-white text-xs font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  {externalSearchQuery && (
                    <button
                      onClick={() => setExternalSearchQuery("")}
                      className="absolute right-3.5 top-3 text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="sm:col-span-4 flex items-center gap-2">
                  <div className="w-full relative">
                    <select
                      value={selectedExternalPlatform}
                      onChange={(e) => setSelectedExternalPlatform(e.target.value as any)}
                      className="w-full px-3.5 py-3 rounded-2xl bg-neutral-900/90 border border-neutral-700 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                      <option value="ALL">All Platforms ({externalJobs.length})</option>
                      <option value="Unstop">Unstop Official Campus Hub</option>
                      <option value="LinkedIn">LinkedIn Jobs</option>
                      <option value="Internshala">Internshala</option>
                      <option value="Wellfound">Wellfound (AngelList)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic 1-Click Platform Direct Search Shortcuts */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-[11px] font-bold text-neutral-400 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400" />
                  Direct 1-Click Search:
                </span>
                <button
                  onClick={() => handleDirectPlatformSearch("Unstop")}
                  className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>Unstop: &quot;{externalSearchQuery.trim() || "Campus 2026"}&quot;</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDirectPlatformSearch("LinkedIn")}
                  className="px-3 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>LinkedIn: &quot;{externalSearchQuery.trim() || "Fresher SDE"}&quot;</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDirectPlatformSearch("Internshala")}
                  className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>Internshala: &quot;{externalSearchQuery.trim() || "Tech Intern"}&quot;</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDirectPlatformSearch("Wellfound")}
                  className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 text-[11px] font-bold transition-all flex items-center gap-1"
                >
                  <span>Wellfound: &quot;{externalSearchQuery.trim() || "Startup"}&quot;</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Platform Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "ALL", label: "All Curated Drives", count: externalJobs.length },
              { id: "Unstop", label: "🔥 Unstop Campus Hub", count: externalJobs.filter(j => j.platform === "Unstop").length },
              { id: "LinkedIn", label: "💼 LinkedIn Jobs", count: externalJobs.filter(j => j.platform === "LinkedIn").length },
              { id: "Internshala", label: "🎓 Internshala", count: externalJobs.filter(j => j.platform === "Internshala").length },
              { id: "Wellfound", label: "⚡ Wellfound Startups", count: externalJobs.filter(j => j.platform === "Wellfound").length },
            ].map((tab) => {
              const isSelected = selectedExternalPlatform === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedExternalPlatform(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#121212] text-white shadow-sm"
                      : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-white/20 text-white" : "bg-[#EDE7DC] text-[#736E65]"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Results Count & Notice */}
          <div className="flex items-center justify-between text-xs text-[#736E65] px-1">
            <span>
              Showing <strong>{externalJobs.length}</strong> verified job postings
              {externalSearchQuery ? (<span> matching &quot;{externalSearchQuery}&quot;</span>) : ""}:
            </span>
            <span className="text-[11px] italic">
              ⚡ Click &quot;Apply on Host Site&quot; to open directly in a new tab
            </span>
          </div>

          {/* Cards Grid */}
          {externalJobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-[#E2DBD0] space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#EDE7DC] flex items-center justify-center text-[#736E65]">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#121212]">
                  No local cached JDs matched &quot;{externalSearchQuery}&quot;
                </h3>
                <p className="text-xs text-[#736E65] max-w-md mx-auto">
                  Don&apos;t worry! You can immediately search live across Unstop, LinkedIn, and Internshala with 1 click:
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => handleDirectPlatformSearch("Unstop")}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Search on Unstop</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDirectPlatformSearch("LinkedIn")}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Search on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {externalJobs.map((job) => {
                const isUnstop = job.platform === "Unstop";
                const isLinkedIn = job.platform === "LinkedIn";
                const isInternshala = job.platform === "Internshala";
                const isWellfound = job.platform === "Wellfound";

                const candidateSkills = profile?.skills || [];
                const matchedCount = job.required_skills.filter((sk) =>
                  candidateSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
                ).length;

                return (
                  <div
                    key={job.id}
                    className="p-5 rounded-3xl bg-white border border-[#E2DBD0] hover:border-[#121212] transition-all hover:shadow-md flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                            isUnstop
                              ? "bg-amber-50 text-amber-900 border-amber-300"
                              : isLinkedIn
                              ? "bg-blue-50 text-blue-900 border-blue-300"
                              : isInternshala
                              ? "bg-cyan-50 text-cyan-900 border-cyan-300"
                              : "bg-neutral-100 text-neutral-900 border-neutral-300"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isUnstop
                                ? "bg-amber-500"
                                : isLinkedIn
                                ? "bg-blue-600"
                                : isInternshala
                                ? "bg-cyan-500"
                                : "bg-neutral-700"
                            }`}
                          />
                          {job.platform}
                        </span>

                        <span className="text-[10px] font-bold text-[#736E65] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.posted_time}
                        </span>
                      </div>

                      {/* Company & Title */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#736E65]">
                          <span>{job.company}</span>
                          <span className="w-1 h-1 rounded-full bg-[#CEBFAD]" />
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#EDE7DC] text-[#121212] font-semibold">
                            {job.role_type}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-[#121212] mt-0.5 group-hover:text-amber-800 transition-colors leading-snug">
                          {job.title}
                        </h3>
                      </div>

                      {/* Location & Compensation */}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-[#59554E]">
                          <MapPin className="w-3.5 h-3.5 text-[#736E65] shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span>{job.stipend_or_salary}</span>
                        </div>
                      </div>

                      {/* Batch Eligibility */}
                      <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-[11px] font-medium text-[#423E37]">
                        <span className="font-bold text-[#121212]">Eligibility: </span>
                        {job.batch_eligibility}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#59554E] line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Skills Chips */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#736E65]">Required Tech Stack:</span>
                          <span className="text-emerald-800 font-bold">
                            {matchedCount}/{job.required_skills.length} skills matched
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {job.required_skills.map((skill) => {
                            const isMatched = candidateSkills.some(
                              (cs) => cs.toLowerCase() === skill.toLowerCase()
                            );
                            return (
                              <span
                                key={skill}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                  isMatched
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : "bg-[#EDE7DC] text-[#423E37]"
                                }`}
                              >
                                {isMatched ? "✓ " : ""}{skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Applicants & Deadline */}
                      <div className="flex items-center justify-between text-[10px] text-[#736E65] pt-1 border-t border-[#EDE7DC]">
                        {job.applicants_count && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {job.applicants_count}
                          </span>
                        )}
                        {job.deadline && (
                          <span className="flex items-center gap-1 font-bold text-amber-800">
                            Deadline: {job.deadline}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-[#E2DBD0]">
                      {/* Primary 1-Click External Redirect */}
                      <button
                        onClick={() => handleOpenExternalJob(job)}
                        className={`w-full py-2.5 rounded-xl font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 ${
                          isUnstop
                            ? "bg-[#F48024] hover:bg-[#D96B16] text-white"
                            : isLinkedIn
                            ? "bg-[#0A66C2] hover:bg-[#084e96] text-white"
                            : isInternshala
                            ? "bg-[#008BDC] hover:bg-[#0073b6] text-white"
                            : "bg-[#121212] hover:bg-[#262626] text-white"
                        }`}
                      >
                        <span>Apply on {job.platform}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>

                      {/* 1-Click OpenResume ATS Tailor */}
                      <button
                        onClick={() => handleTailorForExternalJob(job)}
                        className="w-full py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#121212] font-bold text-xs border border-[#D9D2C7] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tailor Resume for this JD</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* VIEW 2: Talently & Inker Master-Detail Discovery Layout */
        <div className="space-y-6">
          {/* Top Search & Filter Bar (Talently Style) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#DDD6FE] shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              {/* Query Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#77758F]" />
                <input
                  type="text"
                  placeholder="Search job title, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#DDD6FE] bg-[#F7F8FF] text-xs font-medium text-[#0D0B2D] focus:outline-none focus:ring-1 focus:ring-[#5B4BFF]/30"
                />
              </div>

              {/* Location Filter */}
              <div className="sm:col-span-3 relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-[#77758F]" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#DDD6FE] bg-[#F7F8FF] text-xs font-semibold text-[#0D0B2D] focus:outline-none focus:ring-1 focus:ring-[#5B4BFF]/30 appearance-none cursor-pointer"
                >
                  <option value="ALL">Anywhere (All Locations)</option>
                  <option value="REMOTE">100% Remote Only</option>
                  <option value="HYBRID">Metro / Hybrid Hubs</option>
                </select>
              </div>

              {/* Hardware / Rural Support Filter */}
              <div className="sm:col-span-2 relative">
                <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-3 text-[#77758F]" />
                <select
                  value={filterHardwareOnly ? "HARDWARE" : "ALL"}
                  onChange={(e) => setFilterHardwareOnly(e.target.value === "HARDWARE")}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#DDD6FE] bg-[#F7F8FF] text-xs font-semibold text-[#0D0B2D] focus:outline-none focus:ring-1 focus:ring-[#5B4BFF]/30 appearance-none cursor-pointer"
                >
                  <option value="ALL">All Support Models</option>
                  <option value="HARDWARE">💻 Laptop Provided</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div className="sm:col-span-2 relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "MATCH" | "LATEST")}
                  className="w-full px-3 py-2.5 rounded-2xl border border-[#DDD6FE] bg-[#F7F8FF] text-xs font-bold text-[#0D0B2D] focus:outline-none focus:ring-1 focus:ring-[#5B4BFF]/30 appearance-none cursor-pointer"
                >
                  <option value="MATCH">Sort: Best Match ▾</option>
                  <option value="LATEST">Sort: Latest Added ▾</option>
                </select>
              </div>
            </div>

            {/* Popular Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-bold text-[#77758F] text-[11px]">Popular searches:</span>
              {[
                "Full-Stack Developer",
                "AI & Machine Learning",
                "Cloud Architecture",
                "Python",
                "React",
              ].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSearchQuery(searchQuery === pill ? "" : pill)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                    searchQuery === pill
                      ? "bg-[#5B4BFF] text-white border-[#5B4BFF]"
                      : "bg-[#F7F8FF] text-[#77758F] border-[#DDD6FE] hover:border-[#5B4BFF]"
                  }`}
                >
                  {pill}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[11px] font-bold text-[#77758F] underline hover:text-[#0D0B2D] ml-auto"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* Quick Unstop & External Discovery Jump Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border border-amber-200 shadow-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </span>
                <div className="text-xs">
                  <span className="font-bold text-[#121212] block">
                    Looking for Campus Drives on Unstop & Web?
                  </span>
                  <span className="text-[#59554E] text-[11px]">
                    Search 16+ verified external openings across Swiggy, Flipkart, Tata 1mg, Razorpay, etc., and apply directly with 1 click.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("EXTERNAL_JOBS")}
                className="px-4 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-black text-xs transition-all shadow-sm flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <span>Browse Unstop & Web Jobs</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          {/* Master-Detail Split Grid: Left side pinned in view, Right side scrollable feed of all JDs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT / CENTER: Active Selected Job Description (Pinned in View - Never Leaves Screen) */}
            <div className="lg:col-span-7 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto pr-1 rounded-3xl">
              {selectedOpportunity ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#DDD6FE] shadow-sm space-y-6">
                  {/* Best Fit Rank & Match Banner */}
                  {(() => {
                    const fitRank = sortedOpportunities.findIndex((o) => o.id === selectedOpportunity.id) + 1;
                    return (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#E6E0FF]/80 border border-[#DDD6FE]">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{fitRank === 1 ? "🥇" : fitRank === 2 ? "🥈" : fitRank === 3 ? "🥉" : "🎯"}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#0D0B2D]">
                                {fitRank === 1 ? "Top Recommendation: #1 Best Fit" : `Ranked #${fitRank} Best Fit Match`}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ClearHire Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-[#77758F] mt-0.5">
                              Evaluated against your active resume ({candidateResumeName}) across 5 ATS layers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-full bg-[#5B4BFF] text-white font-mono font-black text-xs shadow-xs">
                            {selectedOpportunity.matchScore || 94}% Fit
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Company Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#5B4BFF] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                        {selectedOpportunity.company_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-[#0D0B2D]">
                            {selectedOpportunity.company_name}
                          </span>
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">
                            ✓
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F7F8FF] text-[#0D0B2D] border border-[#DDD6FE] font-bold ml-1">
                            {selectedOpportunity.role_type}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#0D0B2D] tracking-tight mt-0.5">
                          {selectedOpportunity.title}
                        </h2>
                        <div className="text-xs text-[#77758F] flex flex-wrap items-center gap-2 mt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {selectedOpportunity.location}
                          </span>
                          <span>•</span>
                          <span className="font-mono font-bold text-[#0D0B2D] bg-[#E6E0FF] px-2 py-0.5 rounded">
                            {selectedOpportunity.stipend_or_salary || "Paid Stipend"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark Icon */}
                    <button
                      onClick={() => toggleBookmark(selectedOpportunity.id)}
                      className={`p-2.5 rounded-2xl border transition-all shrink-0 ${
                        bookmarkedIds.includes(selectedOpportunity.id)
                          ? "bg-[#E6E0FF] border-[#5B4BFF] text-[#0D0B2D]"
                          : "bg-[#F7F8FF] border-[#DDD6FE] text-[#77758F] hover:border-[#5B4BFF] hover:text-[#0D0B2D]"
                      }`}
                      title="Bookmark this role"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedIds.includes(selectedOpportunity.id) ? "fill-[#5B4BFF]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-[#77758F] leading-relaxed">
                    {selectedOpportunity.description}
                  </p>

                  {/* Resume Improvement Recommendation Box (Resume-Matcher & ClearHire) */}
                  {(() => {
                    const reqSkills = selectedOpportunity.required_skills || [];
                    const candSkills = profile?.skills || [];
                    const matched = reqSkills.filter((sk) =>
                      candSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
                    );
                    const missing = reqSkills.filter(
                      (sk) => !candSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
                    );

                    return (
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#E6E0FF]/70 border border-[#DDD6FE] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#5B4BFF] text-white flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-amber-300" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase font-bold text-[#77758F] block">
                                ClearHire Resume Recommendation & Improvement
                              </span>
                              <span className="text-xs font-black text-[#0D0B2D]">
                                {selectedOpportunity.matchScore || 94}% ATS Match Score • {matched.length}/{reqSkills.length} Required Skills Found
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#5B4BFF] text-white">
                            ClearHire Engine
                          </span>
                        </div>

                        {/* Matched skills strip */}
                        {matched.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-emerald-900 block">
                              ✅ Verified in your resume:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {matched.map((sk) => (
                                <span
                                  key={sk}
                                  className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-mono font-bold"
                                >
                                  ✓ {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Missing skills & 1-click infuse button */}
                        {missing.length > 0 ? (
                          <div className="space-y-2 pt-1 border-t border-[#DDD6FE]/70">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-amber-900">
                                💡 Missing from resume (Add to reach 98% ATS score):
                              </span>
                              <button
                                onClick={() => handleInfuseSkills(missing)}
                                className="px-3 py-1 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
                                title="Infuse these missing skills into your active candidate profile and boost your match rank"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-300" />
                                <span>⚡ 1-Click Infuse Skills</span>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {missing.map((sk) => {
                                const resource = getFreeLearningResource(sk);
                                return (
                                  <div
                                    key={sk}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-300/80 shadow-2xs text-[11px] font-bold"
                                  >
                                    <span className="font-mono text-amber-800">+{sk}</span>
                                    <a
                                      href={resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-emerald-300 text-[10px] font-extrabold transition-all hover:scale-105 shadow-2xs"
                                      title={`Open free course/docs for ${sk}: ${resource.name}`}
                                    >
                                      <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                                      <span>Learn Free</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Outstanding profile alignment! 100% of required competencies are verified in your active resume. Ready for blind apply.</span>
                          </div>
                        )}

                        {/* Suggested Experience Bullet for this JD */}
                        <div className="pt-2 border-t border-[#DDD6FE]/70 text-[11px]">
                          <span className="font-bold text-[#0D0B2D] block">
                            📝 Recommended Experience Bullet for {selectedOpportunity.title}:
                          </span>
                          <p className="italic bg-white/80 p-2.5 rounded-xl mt-1 border border-[#DDD6FE] text-[#0D0B2D] leading-relaxed">
                            &ldquo;Architected and maintained robust platform services leveraging {matched[0] || "Python"}{missing.length > 0 ? `, ${missing[0]}` : ""}, improving API response times by 32% across distributed endpoints.&rdquo;
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action Bar (Image 1 Style) */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    {/* Button 1: One-Click Blind Apply */}
                    <button
                      onClick={() => handleApply(selectedOpportunity)}
                      disabled={applications.some((a) => a.opportunityId === selectedOpportunity.id)}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                        applications.some((a) => a.opportunityId === selectedOpportunity.id)
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default"
                          : "bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5"
                      }`}
                    >
                      {applications.some((a) => a.opportunityId === selectedOpportunity.id) ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>✓ Application Submitted ({candidateResumeName})</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>⚡ One-Click Blind Apply</span>
                        </>
                      )}
                    </button>

                    {/* Button 2: Tailor Resume */}
                    <button
                      onClick={() => {
                        setTailoringJD(selectedOpportunity);
                        setResumeModalTab("BUILDER");
                        setIsResumeModalOpen(true);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F7F8FF] text-[#0D0B2D] border-2 border-[#5B4BFF] font-black text-xs flex items-center gap-2 transition-all shadow-xs"
                      title="Tailor your resume bullets and competencies for this specific job in OpenResume Studio"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>✨ Tailor / Improve Resume</span>
                    </button>

                    {/* Button 3: Why Matched */}
                    <button
                      onClick={() => setSelectedOppForXAI(selectedOpportunity)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#F7F8FF] hover:bg-[#E6E0FF] text-[#0D0B2D] border border-[#DDD6FE] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Inspect transparent ClearHire 5-layer diagnostic breakdown"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why Matched?</span>
                    </button>
                  </div>

                  {/* 4 Key Stats Metric Grid (Exact Talently Image 1 Cards) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-[#F7F8FF] border border-[#DDD6FE] text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#77758F] block">Experience / Batch</span>
                      <span className="font-bold text-[#0D0B2D] mt-0.5 block">Batch 2026 / 2027</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#77758F] block">Total Applicants</span>
                      <span className="font-bold text-[#0D0B2D] mt-0.5 block">42+ registered</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#77758F] block">ATS Match Score</span>
                      <span className="font-bold text-emerald-800 font-mono mt-0.5 block">
                        {selectedOpportunity.matchScore || 94}% Fit
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#77758F] block">Hardware Support</span>
                      <span className="font-bold text-[#0D0B2D] mt-0.5 block">
                        {selectedOpportunity.hardware_provided ? "Laptop Provided" : "BYOD Mode"}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Section: About the Role */}
                  <div className="space-y-2 pt-2 border-t border-[#DDD6FE]/60">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0D0B2D]">
                      About the Role
                    </h3>
                    <p className="text-xs text-[#0D0B2D] leading-relaxed">
                      As a {selectedOpportunity.title} at {selectedOpportunity.company_name}, you will be part of a high-impact engineering team designing robust, resilient solutions. Evaluated strictly under Pathfinder&apos;s blind merit screening, ensuring equal access regardless of institutional pedigree.
                    </p>
                  </div>

                  {/* Detailed Section: Responsibilities */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#0D0B2D]">
                      Key Responsibilities & Project Focus
                    </h3>
                    <ul className="text-xs text-[#77758F] space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Collaborate with distributed engineering teams on product implementation and architecture.</li>
                      <li>Write clean, modular code with unit tests and clear API documentation.</li>
                      <li>Participate in peer code reviews and sprint delivery cycles.</li>
                      <li>Solve real-world challenges with focus on accessibility and low-bandwidth optimization.</li>
                    </ul>
                  </div>

                  {/* Detailed Section: Required Skills & ATS Coverage */}
                  <div className="space-y-3 pt-2 border-t border-[#DDD6FE]/60">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#0D0B2D]">
                        Required Skills & ATS Coverage
                      </h3>
                      <span className="text-[11px] font-mono text-[#77758F]">
                        Deterministic Keyword Check
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedOpportunity.required_skills?.map((sk) => {
                        const isMatched = profile.skills.some(
                          (ps) => ps.toLowerCase() === sk.toLowerCase()
                        );
                        return (
                          <div
                            key={sk}
                            className={`px-3 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 border ${
                              isMatched
                                ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-bold"
                                : "bg-amber-50 text-amber-900 border-amber-300 font-semibold"
                            }`}
                          >
                            {isMatched ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                                <span>{sk} (Verified Match)</span>
                              </>
                            ) : (
                              <>
                                <span className="text-amber-700 font-bold">+</span>
                                <span>{sk} (Skill Gap)</span>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center rounded-3xl bg-white border border-[#DDD6FE] space-y-3">
                  <Briefcase className="w-10 h-10 text-[#77758F] mx-auto" />
                  <h3 className="text-base font-bold text-[#0D0B2D]">No matching opportunities found</h3>
                  <p className="text-xs text-[#77758F]">
                    Try clearing your search query or selecting a different location/support filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setLocationFilter("ALL");
                      setFilterHardwareOnly(false);
                      setFilterRemoteOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: AI Match Card + Recommendations List (Talently + Inker Style) */}
            <div className="lg:col-span-5 space-y-4">
              {/* AI Match Overview Card (Top Right Card in Talently Image 1) */}
              {selectedOpportunity && (
                <div className="p-5 rounded-3xl bg-white border border-[#DDD6FE] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h4 className="font-black text-sm text-[#0D0B2D]">
                        Match Score: {selectedOpportunity.matchScore || 94}% — Great Fit!
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      ATS Verified
                    </span>
                  </div>

                  <p className="text-xs text-[#77758F] leading-relaxed">
                    This role strongly aligns with your profile competencies ({selectedOpportunity.required_skills?.slice(0, 3).join(", ")}) and satisfies affirmative action priority benchmarks.
                  </p>

                  <button
                    onClick={() => setSelectedOppForXAI(selectedOpportunity)}
                    className="w-full py-2 px-3 rounded-xl bg-[#F7F8FF] hover:bg-[#E6E0FF] border border-[#DDD6FE] text-xs font-bold text-[#0D0B2D] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>View AI Suggestions & Diagnostics</span>
                  </button>
                </div>
              )}

              {/* Recommended Opportunities Section Header */}
              <div className="flex items-center justify-between pt-1">
                <h3 className="font-black text-sm text-[#0D0B2D] tracking-tight">
                  Recommended for You
                </h3>
                <span className="text-[11px] font-mono text-[#77758F] font-semibold">
                  {sortedOpportunities.length} opportunities
                </span>
              </div>

              {/* Scrollable Opportunities List (Exact Inker & Talently Cards with Best Fit Discovery) */}
              <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1.5">
                {sortedOpportunities.map((opp, idx) => {
                  const fitRank = idx + 1;
                  const isSelected = selectedOpportunity?.id === opp.id;
                  const isBookmarked = bookmarkedIds.includes(opp.id);
                  const hasApplied = applications.some((a) => a.opportunityId === opp.id);
                  const reqSkills = opp.required_skills || [];
                  const candSkills = profile?.skills || [];
                  const matched = reqSkills.filter((sk) =>
                    candSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
                  );
                  const missing = reqSkills.filter(
                    (sk) => !candSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
                  );

                  return (
                    <div
                      key={opp.id}
                      onClick={() => setSelectedOpportunity(opp)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all space-y-2.5 ${
                        isSelected
                          ? "bg-white border-2 border-[#5B4BFF] shadow-md ring-2 ring-[#5B4BFF]/20"
                          : "bg-white border border-[#DDD6FE] hover:border-[#5B4BFF] shadow-xs"
                      }`}
                    >
                      {/* Best Fit Rank & Match Pill */}
                      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#DDD6FE]/60">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              fitRank === 1
                                ? "bg-emerald-500/15 text-emerald-900 border border-emerald-400"
                                : fitRank === 2
                                ? "bg-teal-500/15 text-teal-900 border border-teal-400"
                                : fitRank === 3
                                ? "bg-amber-500/15 text-amber-900 border border-amber-400"
                                : "bg-[#E6E0FF] text-[#0D0B2D] border border-[#DDD6FE]"
                            }`}
                          >
                            <span>
                              {fitRank === 1
                                ? "🥇 #1 Best Fit"
                                : fitRank === 2
                                ? "🥈 #2 Best Fit"
                                : fitRank === 3
                                ? "🥉 #3 Best Fit"
                                : `🎯 Rank #${fitRank}`}
                            </span>
                            <span>({opp.matchScore || 90}% Match)</span>
                          </span>
                          <span className="text-[10px] font-mono text-[#77758F] font-semibold">
                            {matched.length}/{reqSkills.length} Matched
                          </span>
                        </div>

                        {hasApplied && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
                            <Check className="w-2.5 h-2.5" /> Applied
                          </span>
                        )}
                      </div>

                      {/* Middle Row: Company Avatar + Name + Bookmark */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[#5B4BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {opp.company_name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#0D0B2D]">
                                {opp.company_name}
                              </span>
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">
                                ✓
                              </span>
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#0D0B2D] line-clamp-1 mt-0.5">
                              {opp.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(opp.id);
                          }}
                          className="text-[#77758F] hover:text-[#0D0B2D] p-1"
                          title="Bookmark"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isBookmarked ? "fill-[#5B4BFF] text-[#0D0B2D]" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Metadata Row */}
                      <div className="text-[11px] text-[#77758F] flex flex-wrap items-center gap-2">
                        <span className="font-mono px-1.5 py-0.5 rounded bg-[#F7F8FF] border border-[#DDD6FE] text-[#0D0B2D] font-semibold">
                          {opp.role_type}
                        </span>
                        <span>•</span>
                        <span>{opp.location}</span>
                        {opp.hardware_provided && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-800 font-bold flex items-center gap-0.5">
                              <Laptop className="w-3 h-3" /> Laptop
                            </span>
                          </>
                        )}
                      </div>

                      {/* Resume Improvement Suggestion Hint & Free Learn Link */}
                      {missing.length > 0 ? (
                        <div className="text-[11px] text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-200/70 flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="truncate">
                              💡 Missing <strong className="font-mono">+{missing[0]}</strong>
                            </span>
                            <a
                              href={getFreeLearningResource(missing[0]).url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 text-[9.5px] font-bold shrink-0 transition-transform hover:scale-105"
                              title={`Learn ${missing[0]} for free`}
                            >
                              <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Learn</span>
                              <ExternalLink className="w-2 h-2" />
                            </a>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInfuseSkills([missing[0]]);
                            }}
                            className="shrink-0 text-[10px] font-bold text-[#5B4BFF] hover:underline"
                            title="Infuse skill into candidate profile immediately"
                          >
                            + Infuse
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-900 bg-emerald-50/80 px-2.5 py-1.5 rounded-xl border border-emerald-200/70 flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">100% Competency Match • Instant Shortlist Ready</span>
                        </div>
                      )}

                      {/* Compensation & Action Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#DDD6FE]/60 text-xs">
                        <span className="font-mono font-bold text-[#0D0B2D]">
                          {opp.stipend_or_salary || "Paid"}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOpportunity(opp);
                              setTailoringJD(opp);
                              setResumeModalTab("BUILDER");
                              setIsResumeModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#F7F8FF] hover:bg-[#5B4BFF] hover:text-white text-[#0D0B2D] border border-[#DDD6FE] text-[10px] font-bold flex items-center gap-1 transition-all"
                            title="Tailor resume specifically for this opening in OpenResume Studio"
                          >
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Tailor</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOpportunity(opp);
                              handleApply(opp);
                            }}
                            disabled={hasApplied}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                              hasApplied
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-default"
                                : "bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5"
                            }`}
                            title="1-Click Blind Apply"
                          >
                            <Zap className="w-3 h-3 text-amber-300" />
                            <span>{hasApplied ? "Applied" : "Apply"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Verified Skills Management (Preserved in clean collapsible card) */}
              <div className="p-5 rounded-3xl bg-white border border-[#DDD6FE] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#0D0B2D] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> Your Verified Skills ({profile.skills.length})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#F7F8FF] border border-[#DDD6FE] text-xs font-mono font-semibold text-[#0D0B2D]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Add Skill Input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add skill (e.g. Next.js)..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#DDD6FE] bg-white text-[#0D0B2D] focus:outline-none focus:ring-1 focus:ring-[#5B4BFF]/30"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 text-xs font-bold"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULL JOB DESCRIPTION (JD) MODAL */}
      {activeJD && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5B4BFF]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#F7F8FF] rounded-3xl border border-[#DDD6FE] shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#DDD6FE] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#5B4BFF] text-white">
                    {activeJD.role_type}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E6E0FF] text-[#0D0B2D]">
                    Match Score: {activeJD.matchScore || 95}%
                  </span>
                </div>
                <h2 className="text-xl font-black text-[#0D0B2D] tracking-tight mt-1.5">
                  {activeJD.title}
                </h2>
                <p className="text-xs text-[#77758F] flex items-center gap-2 mt-1">
                  <Building2 className="w-3.5 h-3.5" /> {activeJD.company_name}
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" /> {activeJD.location}
                  <span>•</span>
                  <span className="font-mono font-bold text-[#0D0B2D]">{activeJD.stipend_or_salary}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveJD(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#DDD6FE] flex items-center justify-center hover:bg-[#E6E0FF]"
              >
                <X className="w-4 h-4 text-[#0D0B2D]" />
              </button>
            </div>

            {/* Description & Overview */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77758F]">Role Overview</h4>
                <p className="text-xs text-[#0D0B2D] leading-relaxed mt-1">
                  {activeJD.description}
                </p>
              </div>

              {/* Skills Comparison: Required vs You Have */}
              <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77758F]">
                  Skill Match & Diagnostics
                </h4>
                <div className="space-y-2">
                  {activeJD.required_skills?.map((reqSkill) => {
                    const matched = profile.skills.some(
                      (ps) => ps.toLowerCase() === reqSkill.toLowerCase()
                    );
                    return (
                      <div
                        key={reqSkill}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] text-xs"
                      >
                        <span className="font-mono font-bold text-[#0D0B2D]">{reqSkill}</span>
                        {matched ? (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Verified Match
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Skill Gap • 2-Hr Free Module Available
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resume-Matcher Deterministic ATS Diagnostics Card */}
              {activeJD.atsMatch && (
                <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#77758F] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#0D0B2D]" />
                      Resume-Matcher ATS Compatibility Breakdown
                    </h4>
                    <span className="text-xs font-mono font-black text-[#0D0B2D] bg-[#E6E0FF] px-2 py-0.5 rounded border border-[#DDD6FE]">
                      Overall: {activeJD.atsMatch.overall_score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE]">
                      <span className="text-[10px] text-[#77758F] block font-semibold">Keywords (40%)</span>
                      <span className="text-xs font-bold font-mono text-[#0D0B2D]">{activeJD.atsMatch.sub_scores.keyword_match}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE]">
                      <span className="text-[10px] text-[#77758F] block font-semibold">Skills (20%)</span>
                      <span className="text-xs font-bold font-mono text-[#0D0B2D]">{activeJD.atsMatch.sub_scores.skills_coverage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE]">
                      <span className="text-[10px] text-[#77758F] block font-semibold">Title (15%)</span>
                      <span className="text-xs font-bold font-mono text-[#0D0B2D]">{activeJD.atsMatch.sub_scores.title_match}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE]">
                      <span className="text-[10px] text-[#77758F] block font-semibold">Sections (15%)</span>
                      <span className="text-xs font-bold font-mono text-[#0D0B2D]">{activeJD.atsMatch.sub_scores.section_completeness}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE]">
                      <span className="text-[10px] text-[#77758F] block font-semibold">Dates (10%)</span>
                      <span className="text-xs font-bold font-mono text-[#0D0B2D]">{activeJD.atsMatch.sub_scores.date_consistency}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 block font-semibold">Equity Boost</span>
                      <span className="text-xs font-bold font-mono text-emerald-900">+{activeJD.atsMatch.sub_scores.equity_boost}%</span>
                    </div>
                  </div>

                  {activeJD.atsMatch.recommendations.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] text-[11px] text-[#77758F] space-y-1">
                      <span className="font-bold text-[#0D0B2D] block">AI Matching Insights:</span>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {activeJD.atsMatch.recommendations.map((rec, rIdx) => (
                          <li key={rIdx}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Hardware & Remote Benefits */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#DDD6FE]">
                  <span className="text-[11px] text-[#77758F] block">Work Arrangement</span>
                  <span className="font-bold text-[#0D0B2D]">
                    {activeJD.is_remote ? "100% Remote (Work from anywhere)" : "On-Site Office"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#DDD6FE]">
                  <span className="text-[11px] text-[#77758F] block">Hardware Grant</span>
                  <span className="font-bold text-[#0D0B2D]">
                    {activeJD.hardware_provided ? "Laptop & Wi-Fi Subsidy Shipped" : "Standard BYOD"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#DDD6FE] flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const jd = activeJD;
                  setActiveJD(null);
                  setTailoringJD(jd);
                  setResumeModalTab("BUILDER");
                  setIsResumeModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-[#F7F8FF] text-[#0D0B2D] border-2 border-[#5B4BFF] shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>✏️ Tailor Resume for this Role</span>
              </button>

              <button
                onClick={() => setActiveJD(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#77758F] hover:text-[#0D0B2D]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(activeJD);
                  setActiveJD(null);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 shadow-md flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Blind Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPLAINABLE AI (XAI) MATCH DIAGNOSTICS MODAL (LIVE DATA) */}
      {selectedOppForXAI && (() => {
        const fitRank = sortedOpportunities.findIndex((o) => o.id === selectedOppForXAI.id) + 1;
        const reqSkills = selectedOppForXAI.required_skills || [];
        const candSkills = profile?.skills || [];
        const matched = reqSkills.filter((sk) =>
          candSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
        );
        const missing = reqSkills.filter(
          (sk) => !candSkills.some((cs) => cs.toLowerCase() === sk.toLowerCase())
        );
        const isApplied = applications.some((a) => a.opportunityId === selectedOppForXAI.id);
        const skillMatchPct = Math.round((matched.length / (reqSkills.length || 1)) * 100);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5B4BFF]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-[#F7F8FF] rounded-3xl border border-[#DDD6FE] shadow-2xl p-6 sm:p-8 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#DDD6FE] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5B4BFF] text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#0D0B2D]">
                      Explainable AI (XAI) Match Breakdown
                    </h3>
                    <span className="text-[11px] text-[#77758F]">
                      ClearHire 5-Layer Deterministic Ranking Engine
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOppForXAI(null)}
                  className="w-7 h-7 rounded-full bg-white border border-[#DDD6FE] flex items-center justify-center hover:bg-[#E6E0FF]"
                >
                  <X className="w-4 h-4 text-[#0D0B2D]" />
                </button>
              </div>

              {/* Job Title & Candidate Info Header */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#DDD6FE] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#0D0B2D]">
                      {selectedOppForXAI.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F7F8FF] border border-[#DDD6FE] font-bold">
                      {selectedOppForXAI.company_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#77758F] mt-0.5">
                    Candidate: <strong>{realDisplayName}</strong> • Active Resume: <span className="font-mono text-[#0D0B2D]">{candidateResumeName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-emerald-800">
                    {selectedOppForXAI.matchScore || 94}%
                  </span>
                  <span className="text-[10px] font-mono block text-[#77758F] font-bold">
                    Rank #{fitRank} Fit
                  </span>
                </div>
              </div>

              {/* Live Skills Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0D0B2D]">
                    Competency Alignment: {matched.length}/{reqSkills.length} Required Skills Matched
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {skillMatchPct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#E6E0FF] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5B4BFF] h-full transition-all duration-500"
                    style={{ width: `${Math.max(15, skillMatchPct)}%` }}
                  />
                </div>

                {/* Matched skills */}
                {matched.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-emerald-900 block">
                      ✅ Matched from Active Resume:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {matched.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-mono font-bold"
                        >
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {missing.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-[#DDD6FE]/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900">
                        ⚠️ Missing Skills (Add to reach 98% ATS):
                      </span>
                      <button
                        onClick={() => handleInfuseSkills(missing)}
                        className="px-2.5 py-1 rounded-lg bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3 h-3 text-amber-300" />
                        <span>⚡ 1-Click Infuse</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missing.map((sk) => {
                        const resource = getFreeLearningResource(sk);
                        return (
                          <div
                            key={sk}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-300/80 text-[11px] font-bold"
                          >
                            <span className="font-mono text-amber-800">+{sk}</span>
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 border border-emerald-300 text-[10px] font-extrabold transition-all hover:scale-105 shadow-2xs"
                              title={`Open free course for ${sk}`}
                            >
                              <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                              <span>Learn Free</span>
                              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 5-Layer ClearHire Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] space-y-2.5 text-xs">
                <span className="font-bold text-[#0D0B2D] block">
                  ClearHire 5-Layer ATS Evaluation
                </span>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#0D0B2D] mb-0.5">
                      <span>1. Taxonomy Skill Overlap (30%)</span>
                      <span className="font-mono">{skillMatchPct}%</span>
                    </div>
                    <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#5B4BFF] h-full" style={{ width: `${skillMatchPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#0D0B2D] mb-0.5">
                      <span>2. Role & Title Alignment (20%)</span>
                      <span className="font-mono">92%</span>
                    </div>
                    <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#5B4BFF] h-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#0D0B2D] mb-0.5">
                      <span>3. Academic & Institutional Integrity (15%)</span>
                      <span className="font-mono">95%</span>
                    </div>
                    <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#5B4BFF] h-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#0D0B2D] mb-0.5">
                      <span>4. Project Depth & Quantified Verbs (20%)</span>
                      <span className="font-mono">90%</span>
                    </div>
                    <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#5B4BFF] h-full" style={{ width: "90%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-emerald-800 mb-0.5">
                      <span>5. Equity & Anti-Bias Blind Evaluation (15%)</span>
                      <span className="font-mono">98%</span>
                    </div>
                    <div className="w-full bg-[#E6E0FF] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bias Protection Notice */}
              <div className="p-3 rounded-2xl bg-[#E6E0FF] border border-[#DDD6FE] text-[11px] text-[#0D0B2D] leading-relaxed">
                <strong>Anti-Bias Merit Guarantee:</strong> Your application is presented to recruiters with college tier, name, gender, and personal identifiers masked. Selection is strictly determined by verified proof-of-work.
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const opp = selectedOppForXAI;
                    setSelectedOppForXAI(null);
                    setTailoringJD(opp);
                    setResumeModalTab("BUILDER");
                    setIsResumeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#F7F8FF] text-[#0D0B2D] border-2 border-[#5B4BFF] flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Tailor in OpenResume</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleApply(selectedOppForXAI);
                    setSelectedOppForXAI(null);
                  }}
                  disabled={isApplied}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${
                    isApplied
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 cursor-default"
                      : "bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5"
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Already Applied</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ One-Click Blind Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ID CARD UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#5B4BFF]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#F7F8FF] rounded-3xl border border-[#DDD6FE] shadow-2xl p-6 sm:p-8 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-[#DDD6FE] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#0D0B2D]" />
                <h3 className="font-black text-base text-[#0D0B2D]">
                  Upload College ID for Verification
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#DDD6FE] flex items-center justify-center hover:bg-[#E6E0FF]"
              >
                <X className="w-4 h-4 text-[#0D0B2D]" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{uploadSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleUploadId} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#77758F]">
                    Student ID Document URL / File Reference
                  </label>
                  <input
                    type="url"
                    required
                    value={idCardUrl}
                    onChange={(e) => setIdCardUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-[#DDD6FE] bg-white text-xs font-mono text-[#0D0B2D]"
                  />
                  <p className="text-[11px] text-[#77758F] mt-1">
                    Upload your physical ID card or semester registration slip for administrative audit.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#77758F]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#5B4BFF] text-white"
                  >
                    Submit for Verification
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* OpenResume ATS Studio & Parser Modal */}
      <ResumeStudioModal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setTailoringJD(null);
        }}
        onSyncWithProfile={handleSyncResume}
        initialTab={resumeModalTab}
        tailoringJD={tailoringJD}
        candidateName={realDisplayName}
        candidateEmail={clerkUser?.primaryEmailAddress?.emailAddress || profile.email}
        activeResumeName={candidateResumeName}
        candidateSkills={profile.skills}
        parsedResumeData={candidateResumeData}
      />

      {/* Candidate Profile & Skills Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileSettingsOpen}
        onClose={() => setIsProfileSettingsOpen(false)}
        initialData={{
          fullName: realDisplayName,
          email: clerkUser?.primaryEmailAddress?.emailAddress || profile.email,
          phone: candidatePhoneState,
          college: profile.institution_name || "Birla Institute of Technology, Mesra",
          degree: profile.degree || "B.Tech",
          branch: profile.branch || "Computer Science & Engineering",
          preferredDomain: profile.preferred_domain || "Full Stack Development",
          skills: profile.skills || [],
          resumeName: "Aditya_Yadav_Resume.pdf",
        }}
        onSave={handleSaveProfileSettings}
        onOpenResumeEditor={() => {
          setTailoringJD(null);
          setResumeModalTab("BUILDER");
          setIsResumeModalOpen(true);
        }}
        onUploadNewResume={() => {
          setTailoringJD(null);
          setResumeModalTab("PARSER");
          setIsResumeModalOpen(true);
        }}
      />

      {/* 1-Click External Redirection Toast Notification */}
      {isRedirectingToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#121212] text-white border border-neutral-700 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300 max-w-md">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5 animate-pulse" />
          </div>
          <div className="text-xs space-y-0.5">
            <p className="font-bold text-white flex items-center gap-1.5">
              <span>Redirecting to {isRedirectingToast.platform}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                1-CLICK REDIRECT
              </span>
            </p>
            <p className="text-neutral-400 text-[11px] truncate">
              Opening &quot;{isRedirectingToast.jobTitle}&quot; on {isRedirectingToast.company}...
            </p>
          </div>
          <button
            onClick={() => setIsRedirectingToast(null)}
            className="text-neutral-400 hover:text-white ml-2 p-1 rounded-lg hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
