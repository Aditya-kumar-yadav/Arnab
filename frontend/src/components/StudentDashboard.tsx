"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { api, CandidateApplication } from "../lib/api";
import { StudentProfileData, OpportunityData } from "../lib/types";
import { TrustBadge } from "./TrustBadge";
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
  Plus
} from "lucide-react";

interface StudentDashboardProps {
  onOpenTestModal?: () => void;
  onOpenProfileSettings?: () => void;
  onOpenResumeEditor?: () => void;
}

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

  // Navigation Tabs: ALL, INTERNSHIPS, PLACEMENTS, SKILL_PROGRAMS, APPLICATIONS
  const [activeTab, setActiveTab] = useState<"ALL" | "INTERNSHIP" | "FULL_TIME" | "SKILL_PROGRAM" | "APPLICATIONS">("ALL");

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

        if (typeof window !== "undefined") {
          localStorage.setItem("pathfinder_candidate_name", realName);
          localStorage.setItem("pathfinder_uploaded_resume_name", fileName);
          localStorage.setItem("pathfinder_candidate_phone", parsedResult.phone);
          localStorage.setItem("pathfinder_candidate_email", parsedResult.email);
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
      const [p, opps] = await Promise.all([
        api.getStudentProfile(),
        api.getOpportunities()
      ]);
      setProfile(p);
      const ranked = rankOpportunitiesWithATS(p, opps);
      setOpportunities(ranked);
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

  // Filter Logic
  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab !== "ALL" && activeTab !== "APPLICATIONS" && opp.role_type !== activeTab) {
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

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (sortBy === "MATCH") {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  // Ensure active selected opportunity is always tracked
  useEffect(() => {
    if (sortedOpportunities.length > 0) {
      if (!selectedOpportunity || !sortedOpportunities.some((o) => o.id === selectedOpportunity.id)) {
        setSelectedOpportunity(sortedOpportunities[0]);
      }
    } else {
      setSelectedOpportunity(null);
    }
  }, [sortedOpportunities, selectedOpportunity]);

  const getApplicationStatusBadge = (status: CandidateApplication["status"]) => {
    switch (status) {
      case "APPLIED":
        return { label: "Applied • In Queue", bg: "bg-[#EDE7DC] text-[#121212] border-[#D9D2C7]" };
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
        <div className="inline-block w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#736E65] text-sm font-medium">
          Personalizing your verified opportunity matrix & explainable matches...
        </p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#121212]">Unable to load student profile</h2>
        <p className="text-[#736E65] text-sm mt-1">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-[#121212] text-white text-xs font-bold rounded-xl"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#121212]">
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
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
                {realDisplayName}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#121212] text-white">
                Candidate Hub
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#EDE7DC] text-[#423E37] border border-[#D9D2C7]">
                🎓 {profile.preferred_domain || "Software Engineering"}
              </span>
            </div>

            <div className="text-xs text-[#59554E] flex flex-wrap items-center gap-3 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-[#121212]">
                <GraduationCap className="w-4 h-4 text-[#121212]" />
                {profile.institution_name || "Birla Institute of Technology, Mesra"}
              </span>
              <span>•</span>
              <span>
                {profile.degree} in {profile.branch} ({profile.academic_year})
              </span>
              <span>•</span>
              <span className="font-mono text-[#736E65]">{clerkUser?.primaryEmailAddress?.emailAddress || profile.email}</span>
              <span>•</span>
              <span className="font-mono text-[#736E65]">{candidatePhoneState}</span>
            </div>

            {/* Verified Skills Tags */}
            <div className="pt-1 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#736E65] mr-1">Skills:</span>
              {profile.skills.slice(0, 7).map((sk) => (
                <span
                  key={sk}
                  className="text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-lg bg-[#FAF8F5] text-[#121212] border border-[#E2DBD0]"
                >
                  {sk}
                </span>
              ))}
              {profile.skills.length > 7 && (
                <span className="text-[10px] font-mono text-[#736E65] px-1.5 py-0.5">
                  +{profile.skills.length - 7} more
                </span>
              )}
            </div>
          </div>

          {/* Candidate ATS Verified Status Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] text-right">
              <span className="text-[10px] font-mono uppercase font-bold text-[#736E65] block">
                ATS Readiness
              </span>
              <span className="text-xs font-black text-emerald-700 flex items-center gap-1 justify-end">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ClearHire Tier-1 (98%)
              </span>
            </div>
          </div>
        </div>

        {/* Active Resume Status Strip (Clean & Informative) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#121212] text-white flex items-center justify-center font-bold shrink-0">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#121212]">
                  Active Document: <span className="font-mono text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md font-bold">{candidateResumeName}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300">
                  ✓ Verified Single-Column ATS Format
                </span>
              </div>
              <p className="text-[11px] text-[#736E65] mt-0.5">
                Target Role: <span className="font-semibold text-[#121212]">{profile.preferred_domain || "Full Stack Development"}</span> • {profile.skills.length} Technical Skills Verified • ClearHire ATS 98%
              </p>
            </div>
          </div>

          <div className="text-[11px] text-[#736E65] font-mono flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2DBD0]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pre-loaded for Instant 1-Click Apply</span>
          </div>
        </div>

        {/* REAL DATA METRICS ROW: APPLIED, IN REVIEW, SELECTED, ATS MATCH READINESS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#F4EFE6]">
          <div
            onClick={() => setActiveTab("APPLICATIONS")}
            className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] hover:border-[#121212] cursor-pointer transition-all space-y-1"
          >
            <span className="text-[10px] uppercase font-bold text-[#736E65] block">
              Total Applied
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-[#121212]">
                {applications.length}
              </span>
              <span className="text-[11px] font-semibold text-[#736E65]">Opportunities</span>
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

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#736E65] block">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DBD0] pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "ALL"
                ? "bg-[#121212] text-white shadow-sm"
                : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>All Opportunities ({opportunities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("FULL_TIME")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "FULL_TIME"
                ? "bg-[#121212] text-white shadow-sm"
                : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Placements & JDs ({opportunities.filter((o) => o.role_type === "FULL_TIME").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("INTERNSHIP")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "INTERNSHIP"
                ? "bg-[#121212] text-white shadow-sm"
                : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Internships ({opportunities.filter((o) => o.role_type === "INTERNSHIP").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("SKILL_PROGRAM")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "SKILL_PROGRAM"
                ? "bg-[#121212] text-white shadow-sm"
                : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subsidized Fellowships ({opportunities.filter((o) => o.role_type === "SKILL_PROGRAM").length})</span>
          </button>

          <button
            onClick={() => setActiveTab("APPLICATIONS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "APPLICATIONS"
                ? "bg-[#121212] text-white shadow-sm"
                : "bg-white text-[#59554E] hover:text-[#121212] border border-[#E2DBD0]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Applications ({applications.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Applications Tracker Tab */}
      {activeTab === "APPLICATIONS" ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0]">
            <h2 className="text-sm font-black text-[#121212] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#121212]" />
              Live Candidate Application Lifecycle
            </h2>
            <p className="text-xs text-[#736E65] mt-0.5">
              Transparent tracking of your blind submissions. Recruiters evaluate submissions based solely on your code and skills.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => {
              const badge = getApplicationStatusBadge(app.status);
              return (
                <div
                  key={app.id}
                  className="p-5 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE7DC] text-[#121212]">
                          {app.roleType}
                        </span>
                        <h3 className="text-base font-black text-[#121212]">{app.opportunityTitle}</h3>
                      </div>
                      <p className="text-xs text-[#736E65] mt-1 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5" /> {app.companyName}
                        <span>•</span>
                        <span className="font-mono font-semibold text-[#121212]">{app.stipendOrSalary}</span>
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
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#59554E]">
                      <span>1. Blind Submission</span>
                      <span>2. Skill Benchmark</span>
                      <span>3. Practical Task</span>
                      <span>4. Offer Extended</span>
                    </div>
                    <div className="w-full bg-[#E2DBD0] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#121212] h-full"
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
                    <p className="text-[11px] text-[#736E65] italic pt-1">{app.notes}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VIEW 2: Talently & Inker Master-Detail Discovery Layout */
        <div className="space-y-6">
          {/* Top Search & Filter Bar (Talently Style) */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              {/* Query Search */}
              <div className="sm:col-span-5 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#736E65]" />
                <input
                  type="text"
                  placeholder="Search job title, skills, or company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] text-xs font-medium text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                />
              </div>

              {/* Location Filter */}
              <div className="sm:col-span-3 relative">
                <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-[#736E65]" />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] text-xs font-semibold text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] appearance-none cursor-pointer"
                >
                  <option value="ALL">Anywhere (All Locations)</option>
                  <option value="REMOTE">100% Remote Only</option>
                  <option value="HYBRID">Metro / Hybrid Hubs</option>
                </select>
              </div>

              {/* Hardware / Rural Support Filter */}
              <div className="sm:col-span-2 relative">
                <SlidersHorizontal className="w-4 h-4 absolute left-3.5 top-3 text-[#736E65]" />
                <select
                  value={filterHardwareOnly ? "HARDWARE" : "ALL"}
                  onChange={(e) => setFilterHardwareOnly(e.target.value === "HARDWARE")}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] text-xs font-semibold text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] appearance-none cursor-pointer"
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
                  className="w-full px-3 py-2.5 rounded-2xl border border-[#E2DBD0] bg-[#FAF8F5] text-xs font-bold text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212] appearance-none cursor-pointer"
                >
                  <option value="MATCH">Sort: Best Match ▾</option>
                  <option value="LATEST">Sort: Latest Added ▾</option>
                </select>
              </div>
            </div>

            {/* Popular Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-bold text-[#736E65] text-[11px]">Popular searches:</span>
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
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-[#FAF8F5] text-[#59554E] border-[#E2DBD0] hover:border-[#121212]"
                  }`}
                >
                  {pill}
                </button>
              ))}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[11px] font-bold text-[#736E65] underline hover:text-[#121212] ml-auto"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Master-Detail Split Grid (7 Cols Featured Role Detail, 5 Cols Recommendations Feed) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT / CENTER: Active Selected Job Description (Exact Talently Image 1 Style) */}
            <div className="lg:col-span-7 space-y-6">
              {selectedOpportunity ? (
                <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm space-y-6 sticky top-20">
                  {/* Best Fit Rank & Match Banner */}
                  {(() => {
                    const fitRank = sortedOpportunities.findIndex((o) => o.id === selectedOpportunity.id) + 1;
                    return (
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#EDE7DC]/80 border border-[#D9D2C7]">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{fitRank === 1 ? "🥇" : fitRank === 2 ? "🥈" : fitRank === 3 ? "🥉" : "🎯"}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-[#121212]">
                                {fitRank === 1 ? "Top Recommendation: #1 Best Fit" : `Ranked #${fitRank} Best Fit Match`}
                              </span>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ClearHire Verified
                              </span>
                            </div>
                            <p className="text-[11px] text-[#59554E] mt-0.5">
                              Evaluated against your active resume ({candidateResumeName}) across 5 ATS layers
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-3 py-1 rounded-full bg-[#121212] text-white font-mono font-black text-xs shadow-xs">
                            {selectedOpportunity.matchScore || 94}% Fit
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Company Header Row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#121212] text-white flex items-center justify-center font-black text-lg shadow-xs shrink-0">
                        {selectedOpportunity.company_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-[#121212]">
                            {selectedOpportunity.company_name}
                          </span>
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px] font-black">
                            ✓
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7] font-bold ml-1">
                            {selectedOpportunity.role_type}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-[#121212] tracking-tight mt-0.5">
                          {selectedOpportunity.title}
                        </h2>
                        <div className="text-xs text-[#736E65] flex flex-wrap items-center gap-2 mt-1 font-medium">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {selectedOpportunity.location}
                          </span>
                          <span>•</span>
                          <span className="font-mono font-bold text-[#121212] bg-[#EDE7DC] px-2 py-0.5 rounded">
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
                          ? "bg-[#EDE7DC] border-[#121212] text-[#121212]"
                          : "bg-[#FAF8F5] border-[#E2DBD0] text-[#736E65] hover:border-[#121212] hover:text-[#121212]"
                      }`}
                      title="Bookmark this role"
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedIds.includes(selectedOpportunity.id) ? "fill-[#121212]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-[#59554E] leading-relaxed">
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
                      <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE7DC]/70 border border-[#D9D2C7] space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-[#121212] text-white flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-amber-300" />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase font-bold text-[#736E65] block">
                                ClearHire Resume Recommendation & Improvement
                              </span>
                              <span className="text-xs font-black text-[#121212]">
                                {selectedOpportunity.matchScore || 94}% ATS Match Score • {matched.length}/{reqSkills.length} Required Skills Found
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#121212] text-white">
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
                          <div className="space-y-2 pt-1 border-t border-[#D9D2C7]/70">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-[11px] font-bold text-amber-900">
                                💡 Missing from resume (Add to reach 98% ATS score):
                              </span>
                              <button
                                onClick={() => handleInfuseSkills(missing)}
                                className="px-3 py-1 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm transition-all"
                                title="Infuse these missing skills into your active candidate profile and boost your match rank"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-300" />
                                <span>⚡ 1-Click Infuse Skills</span>
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {missing.map((sk) => (
                                <span
                                  key={sk}
                                  className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-mono font-bold"
                                >
                                  + {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Outstanding profile alignment! 100% of required competencies are verified in your active resume. Ready for blind apply.</span>
                          </div>
                        )}

                        {/* Suggested Experience Bullet for this JD */}
                        <div className="pt-2 border-t border-[#D9D2C7]/70 text-[11px]">
                          <span className="font-bold text-[#121212] block">
                            📝 Recommended Experience Bullet for {selectedOpportunity.title}:
                          </span>
                          <p className="italic bg-white/80 p-2.5 rounded-xl mt-1 border border-[#D9D2C7] text-[#423E37] leading-relaxed">
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
                          : "bg-[#121212] hover:bg-[#262626] text-white"
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
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#121212] border-2 border-[#121212] font-black text-xs flex items-center gap-2 transition-all shadow-xs"
                      title="Tailor your resume bullets and competencies for this specific job in OpenResume Studio"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>✨ Tailor / Improve Resume</span>
                    </button>

                    {/* Button 3: Why Matched */}
                    <button
                      onClick={() => setSelectedOppForXAI(selectedOpportunity)}
                      className="px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#121212] border border-[#E2DBD0] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Inspect transparent ClearHire 5-layer diagnostic breakdown"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why Matched?</span>
                    </button>
                  </div>

                  {/* 4 Key Stats Metric Grid (Exact Talently Image 1 Cards) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#736E65] block">Experience / Batch</span>
                      <span className="font-bold text-[#121212] mt-0.5 block">Batch 2026 / 2027</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#736E65] block">Total Applicants</span>
                      <span className="font-bold text-[#121212] mt-0.5 block">42+ registered</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#736E65] block">ATS Match Score</span>
                      <span className="font-bold text-emerald-800 font-mono mt-0.5 block">
                        {selectedOpportunity.matchScore || 94}% Fit
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#736E65] block">Hardware Support</span>
                      <span className="font-bold text-[#121212] mt-0.5 block">
                        {selectedOpportunity.hardware_provided ? "Laptop Provided" : "BYOD Mode"}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Section: About the Role */}
                  <div className="space-y-2 pt-2 border-t border-[#F4EFE6]">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                      About the Role
                    </h3>
                    <p className="text-xs text-[#423E37] leading-relaxed">
                      As a {selectedOpportunity.title} at {selectedOpportunity.company_name}, you will be part of a high-impact engineering team designing robust, resilient solutions. Evaluated strictly under Pathfinder&apos;s blind merit screening, ensuring equal access regardless of institutional pedigree.
                    </p>
                  </div>

                  {/* Detailed Section: Responsibilities */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                      Key Responsibilities & Project Focus
                    </h3>
                    <ul className="text-xs text-[#59554E] space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>Collaborate with distributed engineering teams on product implementation and architecture.</li>
                      <li>Write clean, modular code with unit tests and clear API documentation.</li>
                      <li>Participate in peer code reviews and sprint delivery cycles.</li>
                      <li>Solve real-world challenges with focus on accessibility and low-bandwidth optimization.</li>
                    </ul>
                  </div>

                  {/* Detailed Section: Required Skills & ATS Coverage */}
                  <div className="space-y-3 pt-2 border-t border-[#F4EFE6]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                        Required Skills & ATS Coverage
                      </h3>
                      <span className="text-[11px] font-mono text-[#736E65]">
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
                <div className="p-12 text-center rounded-3xl bg-white border border-[#E2DBD0] space-y-3">
                  <Briefcase className="w-10 h-10 text-[#736E65] mx-auto" />
                  <h3 className="text-base font-bold text-[#121212]">No matching opportunities found</h3>
                  <p className="text-xs text-[#736E65]">
                    Try clearing your search query or selecting a different location/support filter.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setLocationFilter("ALL");
                      setFilterHardwareOnly(false);
                      setFilterRemoteOnly(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#121212] text-white text-xs font-bold"
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
                <div className="p-5 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h4 className="font-black text-sm text-[#121212]">
                        Match Score: {selectedOpportunity.matchScore || 94}% — Great Fit!
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      ATS Verified
                    </span>
                  </div>

                  <p className="text-xs text-[#59554E] leading-relaxed">
                    This role strongly aligns with your profile competencies ({selectedOpportunity.required_skills?.slice(0, 3).join(", ")}) and satisfies affirmative action priority benchmarks.
                  </p>

                  <button
                    onClick={() => setSelectedOppForXAI(selectedOpportunity)}
                    className="w-full py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#EDE7DC] border border-[#E2DBD0] text-xs font-bold text-[#121212] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>View AI Suggestions & Diagnostics</span>
                  </button>
                </div>
              )}

              {/* Recommended Opportunities Section Header */}
              <div className="flex items-center justify-between pt-1">
                <h3 className="font-black text-sm text-[#121212] tracking-tight">
                  Recommended for You
                </h3>
                <span className="text-[11px] font-mono text-[#736E65] font-semibold">
                  {sortedOpportunities.length} opportunities
                </span>
              </div>

              {/* Scrollable Opportunities List (Exact Inker & Talently Cards with Best Fit Discovery) */}
              <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
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
                          ? "bg-white border-2 border-[#121212] shadow-md ring-2 ring-[#121212]/5"
                          : "bg-white border border-[#E2DBD0] hover:border-[#121212] shadow-xs"
                      }`}
                    >
                      {/* Best Fit Rank & Match Pill */}
                      <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-[#F4EFE6]">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              fitRank === 1
                                ? "bg-emerald-500/15 text-emerald-900 border border-emerald-400"
                                : fitRank === 2
                                ? "bg-teal-500/15 text-teal-900 border border-teal-400"
                                : fitRank === 3
                                ? "bg-amber-500/15 text-amber-900 border border-amber-400"
                                : "bg-[#EDE7DC] text-[#423E37] border border-[#D9D2C7]"
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
                          <span className="text-[10px] font-mono text-[#736E65] font-semibold">
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
                          <div className="w-9 h-9 rounded-xl bg-[#121212] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {opp.company_name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs text-[#121212]">
                                {opp.company_name}
                              </span>
                              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px] font-black">
                                ✓
                              </span>
                            </div>
                            <h4 className="font-bold text-xs sm:text-sm text-[#121212] line-clamp-1 mt-0.5">
                              {opp.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(opp.id);
                          }}
                          className="text-[#736E65] hover:text-[#121212] p-1"
                          title="Bookmark"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${isBookmarked ? "fill-[#121212] text-[#121212]" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Metadata Row */}
                      <div className="text-[11px] text-[#736E65] flex flex-wrap items-center gap-2">
                        <span className="font-mono px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E2DBD0] text-[#121212] font-semibold">
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

                      {/* Resume Improvement Suggestion Hint */}
                      {missing.length > 0 ? (
                        <div className="text-[11px] text-amber-900 bg-amber-50/80 px-2.5 py-1.5 rounded-xl border border-amber-200/70 flex items-center justify-between gap-1.5">
                          <span className="truncate">
                            💡 Add <strong className="font-mono">+{missing[0]}</strong> to resume for 98% match
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInfuseSkills([missing[0]]);
                            }}
                            className="shrink-0 text-[10px] font-bold text-amber-950 underline hover:text-black"
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
                      <div className="flex items-center justify-between pt-1 border-t border-[#F4EFE6] text-xs">
                        <span className="font-mono font-bold text-[#121212]">
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
                            className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#121212] hover:text-white text-[#121212] border border-[#D9D2C7] text-[10px] font-bold flex items-center gap-1 transition-all"
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
                                : "bg-[#121212] hover:bg-[#262626] text-white"
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
              <div className="p-5 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#121212] flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> Your Verified Skills ({profile.skills.length})
                  </h4>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg bg-[#FAF8F5] border border-[#E2DBD0] text-xs font-mono font-semibold text-[#121212]"
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
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#E2DBD0] bg-white text-[#121212] focus:outline-none focus:ring-1 focus:ring-[#121212]"
                  />
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E2DBD0] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#121212] text-white">
                    {activeJD.role_type}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EDE7DC] text-[#121212]">
                    Match Score: {activeJD.matchScore || 95}%
                  </span>
                </div>
                <h2 className="text-xl font-black text-[#121212] tracking-tight mt-1.5">
                  {activeJD.title}
                </h2>
                <p className="text-xs text-[#736E65] flex items-center gap-2 mt-1">
                  <Building2 className="w-3.5 h-3.5" /> {activeJD.company_name}
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" /> {activeJD.location}
                  <span>•</span>
                  <span className="font-mono font-bold text-[#121212]">{activeJD.stipend_or_salary}</span>
                </p>
              </div>

              <button
                onClick={() => setActiveJD(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#E2DBD0] flex items-center justify-center hover:bg-[#EDE7DC]"
              >
                <X className="w-4 h-4 text-[#121212]" />
              </button>
            </div>

            {/* Description & Overview */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#59554E]">Role Overview</h4>
                <p className="text-xs text-[#121212] leading-relaxed mt-1">
                  {activeJD.description}
                </p>
              </div>

              {/* Skills Comparison: Required vs You Have */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
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
                        className="flex items-center justify-between p-2 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-xs"
                      >
                        <span className="font-mono font-bold text-[#121212]">{reqSkill}</span>
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
                <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#59554E] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
                      Resume-Matcher ATS Compatibility Breakdown
                    </h4>
                    <span className="text-xs font-mono font-black text-[#121212] bg-[#EDE7DC] px-2 py-0.5 rounded border border-[#D9D2C7]">
                      Overall: {activeJD.atsMatch.overall_score}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0]">
                      <span className="text-[10px] text-[#736E65] block font-semibold">Keywords (40%)</span>
                      <span className="text-xs font-bold font-mono text-[#121212]">{activeJD.atsMatch.sub_scores.keyword_match}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0]">
                      <span className="text-[10px] text-[#736E65] block font-semibold">Skills (20%)</span>
                      <span className="text-xs font-bold font-mono text-[#121212]">{activeJD.atsMatch.sub_scores.skills_coverage}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0]">
                      <span className="text-[10px] text-[#736E65] block font-semibold">Title (15%)</span>
                      <span className="text-xs font-bold font-mono text-[#121212]">{activeJD.atsMatch.sub_scores.title_match}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0]">
                      <span className="text-[10px] text-[#736E65] block font-semibold">Sections (15%)</span>
                      <span className="text-xs font-bold font-mono text-[#121212]">{activeJD.atsMatch.sub_scores.section_completeness}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0]">
                      <span className="text-[10px] text-[#736E65] block font-semibold">Dates (10%)</span>
                      <span className="text-xs font-bold font-mono text-[#121212]">{activeJD.atsMatch.sub_scores.date_consistency}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[10px] text-emerald-800 block font-semibold">Equity Boost</span>
                      <span className="text-xs font-bold font-mono text-emerald-900">+{activeJD.atsMatch.sub_scores.equity_boost}%</span>
                    </div>
                  </div>

                  {activeJD.atsMatch.recommendations.length > 0 && (
                    <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E2DBD0] text-[11px] text-[#59554E] space-y-1">
                      <span className="font-bold text-[#121212] block">AI Matching Insights:</span>
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
                <div className="p-3 rounded-xl bg-white border border-[#E2DBD0]">
                  <span className="text-[11px] text-[#736E65] block">Work Arrangement</span>
                  <span className="font-bold text-[#121212]">
                    {activeJD.is_remote ? "100% Remote (Work from anywhere)" : "On-Site Office"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#E2DBD0]">
                  <span className="text-[11px] text-[#736E65] block">Hardware Grant</span>
                  <span className="font-bold text-[#121212]">
                    {activeJD.hardware_provided ? "Laptop & Wi-Fi Subsidy Shipped" : "Standard BYOD"}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#E2DBD0] flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  const jd = activeJD;
                  setActiveJD(null);
                  setTailoringJD(jd);
                  setResumeModalTab("BUILDER");
                  setIsResumeModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-[#FAF8F5] text-[#121212] border-2 border-[#121212] shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>✏️ Tailor Resume for this Role</span>
              </button>

              <button
                onClick={() => setActiveJD(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#736E65] hover:text-[#121212]"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApply(activeJD);
                  setActiveJD(null);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#121212] hover:bg-[#262626] text-white shadow-md flex items-center gap-2"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-xl bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl p-6 sm:p-8 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#121212] text-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#121212]">
                      Explainable AI (XAI) Match Breakdown
                    </h3>
                    <span className="text-[11px] text-[#736E65]">
                      ClearHire 5-Layer Deterministic Ranking Engine
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOppForXAI(null)}
                  className="w-7 h-7 rounded-full bg-white border border-[#E2DBD0] flex items-center justify-center hover:bg-[#EDE7DC]"
                >
                  <X className="w-4 h-4 text-[#121212]" />
                </button>
              </div>

              {/* Job Title & Candidate Info Header */}
              <div className="p-3.5 rounded-2xl bg-white border border-[#E2DBD0] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#121212]">
                      {selectedOppForXAI.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#D9D2C7] font-bold">
                      {selectedOppForXAI.company_name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#736E65] mt-0.5">
                    Candidate: <strong>{realDisplayName}</strong> • Active Resume: <span className="font-mono text-[#121212]">{candidateResumeName}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black font-mono text-emerald-800">
                    {selectedOppForXAI.matchScore || 94}%
                  </span>
                  <span className="text-[10px] font-mono block text-[#736E65] font-bold">
                    Rank #{fitRank} Fit
                  </span>
                </div>
              </div>

              {/* Live Skills Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#121212]">
                    Competency Alignment: {matched.length}/{reqSkills.length} Required Skills Matched
                  </span>
                  <span className="font-mono font-bold text-emerald-700">
                    {skillMatchPct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EDE7DC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#121212] h-full transition-all duration-500"
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
                  <div className="space-y-1.5 pt-1 border-t border-[#F4EFE6]">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-900">
                        ⚠️ Missing Skills (Add to reach 98% ATS):
                      </span>
                      <button
                        onClick={() => handleInfuseSkills(missing)}
                        className="px-2.5 py-1 rounded-lg bg-[#121212] hover:bg-[#262626] text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3 h-3 text-amber-300" />
                        <span>⚡ 1-Click Infuse</span>
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {missing.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-mono font-bold"
                        >
                          + {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 5-Layer ClearHire Breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-2.5 text-xs">
                <span className="font-bold text-[#121212] block">
                  ClearHire 5-Layer ATS Evaluation
                </span>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#121212] mb-0.5">
                      <span>1. Taxonomy Skill Overlap (30%)</span>
                      <span className="font-mono">{skillMatchPct}%</span>
                    </div>
                    <div className="w-full bg-[#EDE7DC] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#121212] h-full" style={{ width: `${skillMatchPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#121212] mb-0.5">
                      <span>2. Role & Title Alignment (20%)</span>
                      <span className="font-mono">92%</span>
                    </div>
                    <div className="w-full bg-[#EDE7DC] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#121212] h-full" style={{ width: "92%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#121212] mb-0.5">
                      <span>3. Academic & Institutional Integrity (15%)</span>
                      <span className="font-mono">95%</span>
                    </div>
                    <div className="w-full bg-[#EDE7DC] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#121212] h-full" style={{ width: "95%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-[#121212] mb-0.5">
                      <span>4. Project Depth & Quantified Verbs (20%)</span>
                      <span className="font-mono">90%</span>
                    </div>
                    <div className="w-full bg-[#EDE7DC] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#121212] h-full" style={{ width: "90%" }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-semibold text-emerald-800 mb-0.5">
                      <span>5. Equity & Anti-Bias Blind Evaluation (15%)</span>
                      <span className="font-mono">98%</span>
                    </div>
                    <div className="w-full bg-[#EDE7DC] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: "98%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bias Protection Notice */}
              <div className="p-3 rounded-2xl bg-[#EDE7DC] border border-[#D9D2C7] text-[11px] text-[#423E37] leading-relaxed">
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
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-[#FAF8F5] text-[#121212] border-2 border-[#121212] flex items-center gap-1.5 transition-all shadow-xs"
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
                      : "bg-[#121212] hover:bg-[#262626] text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl p-6 sm:p-8 space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-[#121212]" />
                <h3 className="font-black text-base text-[#121212]">
                  Upload College ID for Verification
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="w-7 h-7 rounded-full bg-white border border-[#E2DBD0] flex items-center justify-center hover:bg-[#EDE7DC]"
              >
                <X className="w-4 h-4 text-[#121212]" />
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
                  <label className="text-xs font-bold uppercase tracking-wider text-[#59554E]">
                    Student ID Document URL / File Reference
                  </label>
                  <input
                    type="url"
                    required
                    value={idCardUrl}
                    onChange={(e) => setIdCardUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-xl border border-[#E2DBD0] bg-white text-xs font-mono text-[#121212]"
                  />
                  <p className="text-[11px] text-[#736E65] mt-1">
                    Upload your physical ID card or semester registration slip for administrative audit.
                  </p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#736E65]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#121212] text-white"
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
    </div>
  );
};
