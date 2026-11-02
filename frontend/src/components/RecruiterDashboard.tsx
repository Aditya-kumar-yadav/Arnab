"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { RecruiterProfileData } from "../lib/types";
import { TrustBadge } from "./TrustBadge";
import {
  Building2,
  Lock,
  Plus,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Users,
  Sparkles
} from "lucide-react";

interface RecruiterDashboardProps {
  onOpenTestModal: () => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ onOpenTestModal }) => {
  const [profile, setProfile] = useState<RecruiterProfileData | null>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [blindMode, setBlindMode] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Post Job Modal
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [jobTitle, setJobTitle] = useState("Junior Cloud & Backend Engineer");
  const [roleType, setRoleType] = useState("INTERNSHIP");
  const [location, setLocation] = useState("Remote (All India)");
  const [stipend, setStipend] = useState("₹35,000 / month");
  const [jobDesc, setJobDesc] = useState("Seeking curious engineers skilled in Python, FastAPI, and Git. We prioritize project portfolio and problem-solving over college pedigree.");
  const [requiredSkills, setRequiredSkills] = useState("Python, FastAPI, SQL, Docker");
  const [postSuccess, setPostSuccess] = useState<string>("");

  // Auth letter upload
  const [authDocUrl, setAuthDocUrl] = useState("https://ruraltechlabs.io/docs/recruiter_authorization_board.pdf");

  const loadData = async () => {
    try {
      setLoading(true);
      const prof = await api.getRecruiterProfile();
      setProfile(prof);

      if (prof.can_view_candidates) {
        const cands = await api.searchCandidates(blindMode);
        setCandidates(cands);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load recruiter portal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [blindMode]);

  const handlePostOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
      await api.publishOpportunity({
        title: jobTitle,
        role_type: roleType,
        location,
        is_remote: true,
        stipend_or_salary: stipend,
        description: jobDesc,
        required_skills: skillsArray,
        preferred_skills: ["Linux", "Git"],
        hardware_provided: true,
        relocation_assistance: false,
      });
      setPostSuccess("Opportunity published successfully to verified students!");
      setTimeout(() => {
        setShowPostModal(false);
        setPostSuccess("");
      }, 1500);
    } catch (err: any) {
      alert("Failed to publish: " + err.message);
    }
  };

  const handleSubmitAuthDoc = async () => {
    try {
      await api.submitRecruiterAuthDoc(authDocUrl);
      alert("Recruiter authorization documentation submitted for administrative review.");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#736E65] text-sm font-medium">Verifying recruiter authentication & company clearance...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
        <h2 className="text-lg font-bold text-[#121212]">Unable to load recruiter portal</h2>
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

  const isVerified = profile.can_publish_jobs && profile.can_view_candidates;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#121212]">
      {/* Recruiter Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
                {profile.full_name}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#121212] text-white">
                Recruiter Portal
              </span>
            </div>

            <div className="text-xs text-[#59554E] flex flex-wrap items-center gap-3 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-[#121212]">
                <Building2 className="w-4 h-4 text-[#121212]" />
                {profile.company_name}
              </span>
              <span>•</span>
              <span>{profile.designation}</span>
              <span>•</span>
              <span className="font-mono text-[#736E65]">{profile.email}</span>
            </div>

            {/* TRUST BADGES CONTAINER */}
            <div className="pt-1 flex flex-wrap items-center gap-2">
              {profile.badges.map((badge, idx) => (
                <TrustBadge key={idx} badge={badge} />
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            {isVerified ? (
              <button
                onClick={() => setShowPostModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Opportunity</span>
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2.5 rounded-xl bg-[#F4EFE6] border border-[#D9D2C7] text-[#8C877D] font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock className="w-4 h-4" />
                <span>Publishing Gated (Awaiting Approval)</span>
              </button>
            )}

            <button
              onClick={onOpenTestModal}
              className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#121212] text-xs font-bold border border-[#D9D2C7] transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#121212]" />
              <span>Surprise Test Bench</span>
            </button>
          </div>
        </div>
      </div>

      {/* UNVERIFIED STATE */}
      {!isVerified && (
        <div className="p-8 rounded-3xl bg-white border border-[#D9D2C7] text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#121212] flex items-center justify-center mx-auto text-[#121212]">
            <Lock className="w-7 h-7" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-lg font-black text-[#121212]">Recruiter Clearance Pending Verification</h2>
            <p className="text-xs text-[#59554E] leading-relaxed font-medium">
              In accordance with PATHFINDER AI security protocols (Acceptance Test 5), unverified recruiters cannot publish jobs or browse candidate resumes. An administrator is reviewing your company credentials.
            </p>
          </div>

          <div className="max-w-md mx-auto pt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={authDocUrl}
              onChange={(e) => setAuthDocUrl(e.target.value)}
              placeholder="https://company.com/board_resolution.pdf"
              className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212] outline-none"
            />
            <button
              onClick={handleSubmitAuthDoc}
              className="px-4 py-2 rounded-xl bg-[#121212] text-white font-bold text-xs shrink-0"
            >
              Submit Auth Proof
            </button>
          </div>
        </div>
      )}

      {/* VERIFIED STATE */}
      {isVerified && (
        <div className="space-y-6">
          {/* Anti-Bias Blind Mode Banner & Toggle */}
          <div className="p-5 rounded-2xl bg-[#F4EFE6] border border-[#D9D2C7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-[#121212] border border-[#D9D2C7]">
                <ShieldCheck className="w-5 h-5 text-[#121212]" />
              </div>
              <div>
                <div className="text-xs font-black text-[#121212] flex items-center gap-2">
                  <span>Anti-Bias &quot;Blind Talent&quot; Discovery Protocol</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121212] text-white font-bold">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-[#59554E] font-medium">
                  {blindMode
                    ? "Candidate names, photos, and college brand names are masked to eliminate prestige and socio-economic bias."
                    : "Standard recruiter view active. Institutional and demographic data is unmasked."}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setBlindMode(!blindMode)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                blindMode
                  ? "bg-[#121212] border-[#121212] text-white shadow-sm"
                  : "bg-white border-[#D9D2C7] text-[#121212]"
              }`}
            >
              {blindMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{blindMode ? "Blind Mode: ACTIVE" : "Blind Mode: OFF"}</span>
            </button>
          </div>

          {/* Candidate Pool Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E2DBD0]">
              <h2 className="text-sm font-black text-[#121212] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#121212]" />
                Verified Candidate Talent Matrix
              </h2>
              <span className="text-xs font-mono font-bold text-[#736E65]">{candidates.length} Profiles Found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((cand) => (
                <div
                  key={cand.id}
                  className="p-5 rounded-2xl bg-white border border-[#E2DBD0] hover:border-[#121212] transition-all space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-black text-[#121212] flex items-center gap-1.5">
                        {cand.full_name}
                      </h3>
                      <p className="text-xs text-[#736E65] mt-0.5 font-mono">{cand.institution_name}</p>
                    </div>
                    <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7]">
                      {cand.match_score}% Score
                    </span>
                  </div>

                  <div className="text-[11px] text-[#59554E] font-medium">
                    {cand.degree} • {cand.branch}
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {cand.skills.map((s: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#121212] border border-[#E2DBD0]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  {cand.is_first_generation && (
                    <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-[10px] text-[#121212] font-bold">
                      <span>🎓 First-Gen Fast Track</span>
                      <span className="text-[#736E65] font-mono">Verified Portfolio</span>
                    </div>
                  )}

                  <button
                    onClick={() => alert(`Interview invitation requested for ${cand.full_name}!`)}
                    className="w-full mt-2 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#121212] border border-[#D9D2C7] hover:border-[#121212] text-xs font-bold transition-colors"
                  >
                    Shortlist for Interview
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POST OPPORTUNITY MODAL */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handlePostOpportunity}
            className="bg-white border border-[#CEBFAD] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-[#121212]">Publish New Opportunity</h3>
                <p className="text-xs text-[#736E65]">Target campus learners with competency-first matching</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="text-[#736E65] hover:text-[#121212]"
              >
                ✕
              </button>
            </div>

            {postSuccess && (
              <div className="p-3 rounded-xl bg-[#F4EFE6] text-[#121212] border border-[#D9D2C7] text-xs font-bold">
                {postSuccess}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Opportunity Title</label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Role Type</label>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                >
                  <option value="INTERNSHIP">Internship</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="SKILL_PROGRAM">Subsidized Skill Program</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#121212] mb-1">Stipend / Salary</label>
                <input
                  type="text"
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Required Skills (Comma separated)</label>
              <input
                type="text"
                required
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPostModal(false)}
                className="w-1/3 py-2 rounded-xl bg-[#FAF8F5] text-[#59554E] font-bold text-xs border border-[#D9D2C7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-black text-xs"
              >
                Publish Live Opportunity
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
