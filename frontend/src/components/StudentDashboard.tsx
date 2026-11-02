"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { StudentProfileData, OpportunityData } from "../lib/types";
import { TrustBadge } from "./TrustBadge";
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
  Code2
} from "lucide-react";

interface StudentDashboardProps {
  onOpenTestModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenTestModal }) => {
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals
  const [selectedOppForXAI, setSelectedOppForXAI] = useState<OpportunityData | null>(null);
  const [selectedOppForGap, setSelectedOppForGap] = useState<OpportunityData | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [idCardUrl, setIdCardUrl] = useState("https://storage.pathfinder.edu/ids/student_id_card_verified.pdf");
  const [uploadSuccess, setUploadSuccess] = useState("");

  // New skill input
  const [newSkill, setNewSkill] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, opps] = await Promise.all([
        api.getStudentProfile(),
        api.getOpportunities()
      ]);
      setProfile(p);
      setOpportunities(opps);
    } catch (err: any) {
      setError(err.message || "Failed to load student dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#736E65] text-sm font-medium">Loading your personalized opportunity matrix...</p>
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
      {/* Profile Header & Trust Badges Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
                {profile.full_name}
              </h1>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#121212] text-white">
                Student Profile
              </span>
            </div>

            <div className="text-xs text-[#59554E] flex flex-wrap items-center gap-3 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-[#121212]">
                <GraduationCap className="w-4 h-4 text-[#121212]" />
                {profile.institution_name || "Self-Directed Independent Learner"}
              </span>
              <span>•</span>
              <span>{profile.degree} in {profile.branch} ({profile.academic_year})</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#736E65]" /> {profile.college_location}
              </span>
            </div>

            {/* TRUST BADGES CONTAINER */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {profile.badges.map((badge, idx) => (
                <TrustBadge key={idx} badge={badge} />
              ))}
            </div>
          </div>

          {/* Action / ID Verification CTA for Case B Personal Email */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            {!profile.institution_verified && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload College ID for Verification</span>
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

        {/* First-Gen & Rural Affirmative Context Highlight */}
        {(profile.is_first_generation || profile.is_rural_or_disadvantaged) && (
          <div className="mt-6 pt-4 border-t border-[#F4EFE6] flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-[#121212] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#121212]" />
              Equity & Affirmative Protections Active:
            </span>
            {profile.is_first_generation && (
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#121212] font-semibold border border-[#D9D2C7]">
                🎓 First-Generation Learner Fast-Track
              </span>
            )}
            {profile.is_rural_or_disadvantaged && (
              <span className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#121212] font-semibold border border-[#D9D2C7]">
                🌾 Rural / Tier-2/3 District Representation
              </span>
            )}
            <span className="text-[#736E65] text-[11px] ml-auto font-medium">
              Institutional prestige bias is automatically neutralized in recruiter matching.
            </span>
          </div>
        )}
      </div>

      {/* Main Grid: Opportunities & Skills Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Matched Opportunities Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2DBD0]">
            <div>
              <h2 className="text-base font-black text-[#121212] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#121212]" />
                Recommended Opportunities (Explainable AI Ranking)
              </h2>
              <p className="text-xs text-[#736E65] font-medium">
                Ranked by competency overlap and affirmative inclusion. Blind to college brand names.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white text-[#121212] border border-[#D9D2C7]">
              {opportunities.length} Matches
            </span>
          </div>

          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-2xl bg-white border border-[#E2DBD0] hover:border-[#121212] transition-all space-y-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-black text-[#121212]">{opp.title}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7] font-bold">
                        {opp.role_type}
                      </span>
                    </div>
                    <div className="text-xs text-[#736E65] flex flex-wrap items-center gap-3 font-medium">
                      <span className="flex items-center gap-1 text-[#423E37]">
                        <Building2 className="w-3.5 h-3.5 text-[#736E65]" /> {opp.company_name}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#736E65]" /> {opp.location}
                      </span>
                      {opp.stipend_or_salary && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[#121212] font-bold">{opp.stipend_or_salary}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Smart Match Pill */}
                  <div className="text-right shrink-0">
                    <span className="text-sm font-black font-mono text-[#121212] bg-[#EDE7DC] px-2 py-0.5 rounded">
                      94% Match
                    </span>
                    <div className="text-[10px] text-[#736E65] font-semibold mt-0.5">High Potential</div>
                  </div>
                </div>

                <p className="text-xs text-[#59554E] leading-relaxed font-medium">{opp.description}</p>

                {/* Skills & Support Perks */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {opp.required_skills.map((skill, sIdx) => {
                    const isMatched = profile.skills.some((ps) => ps.toLowerCase() === skill.toLowerCase());
                    return (
                      <span
                        key={sIdx}
                        className={`text-[11px] px-2.5 py-0.5 rounded-md font-semibold border ${
                          isMatched
                            ? "bg-[#FAF8F5] text-[#121212] border-[#121212]"
                            : "bg-[#F4EFE6] text-[#736E65] border-[#D9D2C7]"
                        }`}
                      >
                        {skill} {isMatched ? "✓" : "• Missing"}
                      </span>
                    );
                  })}
                  {opp.hardware_provided && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7] font-bold font-mono">
                      💻 Laptop Provided
                    </span>
                  )}
                  {opp.is_remote && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7] font-bold font-mono">
                      🌐 Remote Friendly
                    </span>
                  )}
                </div>

                {/* Action Buttons: Explain Match (XAI) & Skill Gap Bridge */}
                <div className="pt-3 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedOppForXAI(opp)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#121212] text-xs font-bold border border-[#D9D2C7] transition-colors flex items-center gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-[#121212]" />
                      <span>Why This Match? (XAI)</span>
                    </button>
                    <button
                      onClick={() => setSelectedOppForGap(opp)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#121212] text-xs font-bold border border-[#D9D2C7] transition-colors flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#121212]" />
                      <span>Bridge Skill Gap</span>
                    </button>
                  </div>

                  <button
                    onClick={() => alert(`Application submitted for ${opp.title} with verified blind portfolio!`)}
                    className="px-4 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-black text-xs transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Instant Blind Apply</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Skills Portfolio & Verification Status */}
        <div className="space-y-6">
          {/* Skills Portfolio Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#E2DBD0] space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[#F4EFE6]">
              <div className="text-xs font-black text-[#121212] flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#121212]" />
                <span>Verified Skills Matrix</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#736E65]">{profile.skills.length} Skills</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {profile.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] text-[#121212] text-xs font-semibold border border-[#D9D2C7] flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-[#121212]" />
                  {skill}
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Docker, TypeScript"
                className="w-full px-3 py-1.5 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212] outline-none focus:border-[#121212]"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold rounded-xl shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Institutional Verification Status Card */}
          <div className="p-5 rounded-3xl bg-white border border-[#E2DBD0] space-y-3 shadow-sm">
            <div className="text-xs font-black text-[#121212] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#121212]" />
              <span>Enrollment & Affiliation</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#423E37]">
                <span className="text-[#736E65]">College:</span>
                <span className="font-bold text-[#121212]">{profile.institution_name || "Independent"}</span>
              </div>
              <div className="flex items-center justify-between text-[#423E37]">
                <span className="text-[#736E65]">Email Method:</span>
                <span className="font-bold text-[#121212]">
                  {profile.is_institutional_email ? "Official College Domain" : "Personal Email (Gmail)"}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#423E37]">
                <span className="text-[#736E65]">Institutional Review:</span>
                <span className="font-mono font-bold text-[#121212]">{profile.verification_status}</span>
              </div>
            </div>

            {!profile.institution_verified && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="w-full mt-2 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#121212] text-xs font-bold border border-[#D9D2C7] transition-colors flex items-center justify-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#121212]" />
                <span>Submit Student ID / Documents</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {selectedOppForXAI && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#CEBFAD] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E65] font-black">
                  Explainable AI (XAI) Inspector
                </span>
                <h3 className="text-lg font-black text-[#121212]">{selectedOppForXAI.title}</h3>
                <p className="text-xs text-[#736E65] font-medium">{selectedOppForXAI.company_name}</p>
              </div>
              <button
                onClick={() => setSelectedOppForXAI(null)}
                className="p-1.5 rounded-lg text-[#736E65] hover:text-[#121212] hover:bg-[#FAF8F5]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-[#121212]">
                  <span>1. Direct Competency Match:</span>
                  <span className="font-mono">45 / 50 pts (90%)</span>
                </div>
                <p className="text-[#59554E] text-[11px]">
                  Demonstrated capabilities in {profile.skills.slice(0, 3).join(", ")} align with core job requirements.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-[#121212]">
                  <span>2. Transferable Logic & Problem Solving:</span>
                  <span className="font-mono">25 / 30 pts (83%)</span>
                </div>
                <p className="text-[#59554E] text-[11px]">
                  Algorithmic foundations transfer directly to production frameworks.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-[#121212]">
                  <span>3. First-Gen / Rural Affirmative Weight:</span>
                  <span className="font-mono">+15 bonus pts (Applied)</span>
                </div>
                <p className="text-[#59554E] text-[11px]">
                  Neutralizes legacy prestige bias; surfaces self-taught persistence and high learning velocity.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] border border-[#D9D2C7] text-xs font-bold text-[#121212] flex items-center justify-between">
              <span>Overall Match Fit Score:</span>
              <span className="text-base font-black font-mono">94 / 100 (Strong Fit)</span>
            </div>

            <button
              onClick={() => setSelectedOppForXAI(null)}
              className="w-full py-2.5 rounded-xl bg-[#121212] text-white font-bold text-xs"
            >
              Close Inspector
            </button>
          </div>
        </div>
      )}

      {selectedOppForGap && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#CEBFAD] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#736E65] font-black">
                  Reverse Skill Gap Diagnostic
                </span>
                <h3 className="text-lg font-black text-[#121212]">{selectedOppForGap.title}</h3>
                <p className="text-xs text-[#736E65] font-medium">Step-by-step bridge to reach 100% qualification</p>
              </div>
              <button
                onClick={() => setSelectedOppForGap(null)}
                className="p-1.5 rounded-lg text-[#736E65] hover:text-[#121212] hover:bg-[#FAF8F5]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#121212]">
                  <span>NPTEL / Swayam: Modern Web Technologies</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#121212] text-white font-mono">Free Cert</span>
                </div>
                <p className="text-[11px] text-[#59554E]">Duration: 4 Weeks (4 hrs/week) • Hindi & English subtitles available</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E2DBD0] space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#121212]">
                  <span>freeCodeCamp: Relational Databases & SQL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#121212] text-white font-mono">Interactive</span>
                </div>
                <p className="text-[11px] text-[#59554E]">Browser coding • Zero hardware dependency</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedOppForGap(null)}
              className="w-full py-2.5 rounded-xl bg-[#121212] text-white font-bold text-xs"
            >
              Start Free Learning Roadmap
            </button>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleUploadId} className="bg-white border border-[#CEBFAD] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-[#121212]">Upload College Credentials</h3>
                <p className="text-xs text-[#736E65]">For students using personal email (Gmail/Outlook)</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-[#736E65] hover:text-[#121212]"
              >
                ✕
              </button>
            </div>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-[#F4EFE6] text-[#121212] border border-[#D9D2C7] text-xs font-bold">
                {uploadSuccess}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                College ID Card / Admission Letter Document URL
              </label>
              <input
                type="url"
                required
                value={idCardUrl}
                onChange={(e) => setIdCardUrl(e.target.value)}
                placeholder="https://example.com/student_id.pdf"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212] outline-none"
              />
              <p className="text-[11px] text-[#736E65] mt-1 font-medium">
                Upload image or PDF. College admin will review and issue the &quot;Institution Verified&quot; badge.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-1/3 py-2 rounded-xl bg-[#FAF8F5] text-[#59554E] font-bold text-xs border border-[#D9D2C7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 rounded-xl bg-[#121212] text-white font-black text-xs"
              >
                Submit for Verification
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
