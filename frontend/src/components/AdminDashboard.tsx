"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import {
  AdminOverviewStats,
  AdminStudentItem,
  AdminRecruiterItem,
  AdminInstitutionItem,
  AuditLogItem
} from "../lib/types";
import {
  ShieldAlert,
  Users,
  Briefcase,
  Building2,
  Clock,
  Ban,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  FileText,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

interface AdminDashboardProps {
  onOpenTestModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenTestModal }) => {
  const [activeTab, setActiveTab] = useState<"STUDENTS" | "RECRUITERS" | "INSTITUTIONS" | "AUDIT">("STUDENTS");
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [students, setStudents] = useState<AdminStudentItem[]>([]);
  const [recruiters, setRecruiters] = useState<AdminRecruiterItem[]>([]);
  const [institutions, setInstitutions] = useState<AdminInstitutionItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Add Institution Modal
  const [showAddInstModal, setShowAddInstModal] = useState(false);
  const [newInstName, setNewInstName] = useState("");
  const [newInstWebsite, setNewInstWebsite] = useState("");
  const [newInstDomains, setNewInstDomains] = useState("");

  const loadAll = async () => {
    try {
      setLoading(true);
      const [s, st, rc, inst, logs] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminStudents(searchQuery),
        api.getAdminRecruiters(),
        api.getAdminInstitutions(),
        api.getAuditLogs(40),
      ]);
      setStats(s);
      setStudents(st);
      setRecruiters(rc);
      setInstitutions(inst);
      setAuditLogs(logs);
    } catch (err: any) {
      alert("Admin Load Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [searchQuery]);

  const handleApproveStudent = async (studentId: number) => {
    try {
      await api.verifyStudent(studentId, "VERIFIED", "Institutional enrollment verified by administrator");
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRejectStudent = async (studentId: number) => {
    try {
      await api.verifyStudent(studentId, "REJECTED", "Institutional documentation incomplete or invalid");
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApproveRecruiter = async (recruiterId: number, companyId: number) => {
    try {
      // First verify company, then verify recruiter
      await api.verifyCompany(companyId, "VERIFIED", "Corporate legitimacy approved");
      await api.verifyRecruiter(recruiterId, "VERIFIED", "Authorized recruiter status approved");
      alert("Company & Recruiter successfully approved! Permissions updated.");
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSuspendUser = async (userId: number, currentStatus: string) => {
    const targetStatus = currentStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
    try {
      await api.updateUserStatus(userId, targetStatus, `Administrator toggle to ${targetStatus}`);
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const domainsList = newInstDomains.split(",").map((d) => d.trim().toLowerCase()).filter(Boolean);
      await api.addInstitution({
        institution_name: newInstName,
        official_website: newInstWebsite,
        domains: domainsList,
      });
      setShowAddInstModal(false);
      setNewInstName("");
      setNewInstWebsite("");
      setNewInstDomains("");
      alert("New institution and exact verified domain registered!");
      loadAll();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading && !stats) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-zinc-400 text-sm">Authenticating Chief Administrator session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-zinc-100">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              Administration & Governance Console
            </h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-700/60 font-bold">
              Root Authority
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Institutional domain governance, corporate authorization audits, and immutable logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTestModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Judge Test Runner</span>
          </button>
          <button
            onClick={loadAll}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700"
            title="Refresh System State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 OVERVIEW STATS CARDS (Section 11 requirement) */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" /> Total Students
            </span>
            <div className="text-2xl font-black font-mono text-zinc-100">{stats.total_students}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Total Recruiters
            </span>
            <div className="text-2xl font-black font-mono text-zinc-100">{stats.total_recruiters}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Verified Companies
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400">{stats.verified_companies}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Pending Recruiters
            </span>
            <div className="text-2xl font-black font-mono text-amber-400">{stats.pending_recruiters}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Pending Inst. Verifs
            </span>
            <div className="text-2xl font-black font-mono text-indigo-400">{stats.pending_institution_verifications}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Ban className="w-3.5 h-3.5 text-red-400" /> Suspended Accounts
            </span>
            <div className="text-2xl font-black font-mono text-red-400">{stats.suspended_accounts}</div>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-zinc-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("STUDENTS")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "STUDENTS"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          A. Student Management ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("RECRUITERS")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "RECRUITERS"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          B. Recruiter & Company Review ({recruiters.length})
        </button>
        <button
          onClick={() => setActiveTab("INSTITUTIONS")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "INSTITUTIONS"
              ? "text-emerald-400 border-b-2 border-emerald-400"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          C. Institution & Exact Domain Engine ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "AUDIT"
              ? "text-red-400 border-b-2 border-red-400"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          D. Immutable Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* =========================================================================
          TAB A: STUDENT MANAGEMENT
         ========================================================================= */}
      {activeTab === "STUDENTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name or email..."
                className="w-full px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-100 pl-9 outline-none focus:border-cyan-500"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/90 text-zinc-400 font-mono text-[11px] border-b border-zinc-800 uppercase">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Affiliation Status</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{s.full_name}</div>
                      <div className="font-mono text-[10px] text-zinc-500">{s.email}</div>
                      {s.is_first_generation && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 mr-1">
                          First-Gen
                        </span>
                      )}
                      {s.is_rural_or_disadvantaged && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300">
                          Rural
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-zinc-300">
                      {s.institution_name || <span className="text-zinc-500 italic">Self-Directed</span>}
                    </td>
                    <td className="py-3 px-4">
                      {s.email_verified ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-400 font-mono text-[11px]">Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.verification_status === "VERIFIED"
                            ? "bg-emerald-950 text-emerald-300"
                            : s.verification_status === "PENDING"
                            ? "bg-amber-950 text-amber-300"
                            : "bg-zinc-800 text-zinc-300"
                        }`}
                      >
                        {s.verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          s.account_status === "ACTIVE"
                            ? "bg-emerald-950 text-emerald-300"
                            : "bg-red-950 text-red-300"
                        }`}
                      >
                        {s.account_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {s.verification_status !== "VERIFIED" && (
                        <button
                          onClick={() => handleApproveStudent(s.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded text-[11px]"
                        >
                          Approve ID
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendUser(s.user_id, s.account_status)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                          s.account_status === "SUSPENDED"
                            ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                            : "border-red-800 text-red-400 hover:bg-red-950"
                        }`}
                      >
                        {s.account_status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB B: RECRUITER & COMPANY REVIEW
         ========================================================================= */}
      {activeTab === "RECRUITERS" && (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/90 text-zinc-400 font-mono text-[11px] border-b border-zinc-800 uppercase">
              <tr>
                <th className="py-3 px-4">Recruiter</th>
                <th className="py-3 px-4">Company & Website</th>
                <th className="py-3 px-4">Company Status</th>
                <th className="py-3 px-4">Recruiter Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {recruiters.map((r) => {
                const isApproved =
                  r.recruiter_verification_status === "VERIFIED" &&
                  r.company_verification_status === "VERIFIED";

                return (
                  <tr key={r.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-zinc-100">{r.full_name}</div>
                      <div className="text-[11px] text-zinc-400">{r.designation}</div>
                      <div className="font-mono text-[10px] text-zinc-500">{r.work_email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-zinc-200">{r.company_name}</div>
                      <a
                        href={r.company_website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] font-mono"
                      >
                        {r.company_website} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.company_verification_status === "VERIFIED"
                            ? "bg-emerald-950 text-emerald-300"
                            : "bg-amber-950 text-amber-300"
                        }`}
                      >
                        {r.company_verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          r.recruiter_verification_status === "VERIFIED"
                            ? "bg-purple-950 text-purple-300"
                            : "bg-amber-950 text-amber-300"
                        }`}
                      >
                        {r.recruiter_verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {!isApproved && (
                        <button
                          onClick={() => handleApproveRecruiter(r.id, r.company_id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded text-[11px]"
                        >
                          Approve Recruiter & Company
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendUser(r.user_id, r.account_status)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                          r.account_status === "SUSPENDED"
                            ? "bg-zinc-800 border-zinc-700 text-zinc-200"
                            : "border-red-800 text-red-400 hover:bg-red-950"
                        }`}
                      >
                        {r.account_status === "SUSPENDED" ? "Reactivate" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          TAB C: INSTITUTION & EXACT DOMAIN ENGINE
         ========================================================================= */}
      {activeTab === "INSTITUTIONS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-400">
              Exact domain validation prevents spoofing. Substring domains like <code>fakebitmesra.ac.in</code> are strictly prohibited.
            </div>
            <button
              onClick={() => setShowAddInstModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified College</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutions.map((inst) => (
              <div
                key={inst.id}
                className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-zinc-100 text-sm">{inst.institution_name}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold">
                    VERIFIED
                  </span>
                </div>
                <div className="text-xs text-cyan-400 font-mono">{inst.official_website}</div>
                <div className="pt-2 border-t border-zinc-800 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-zinc-500 font-mono">Exact Authorized Domains:</span>
                  {inst.domains.map((dom, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-700/60 text-indigo-300 font-mono text-[11px]"
                    >
                      @{dom}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB D: IMMUTABLE AUDIT LOGS
         ========================================================================= */}
      {activeTab === "AUDIT" && (
        <div className="space-y-3">
          <div className="text-xs text-zinc-400">
            Real-time, cryptographically linked security and administrative audit trail.
          </div>
          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/60">
            <table className="w-full text-left text-xs text-zinc-300 font-mono">
              <thead className="bg-zinc-900/90 text-zinc-400 text-[10px] border-b border-zinc-800 uppercase">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action Event</th>
                  <th className="py-2.5 px-4">Admin Actor</th>
                  <th className="py-2.5 px-4">Target User</th>
                  <th className="py-2.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/40">
                    <td className="py-2 px-4 text-zinc-500">{new Date(log.created_at).toLocaleTimeString()}</td>
                    <td className="py-2 px-4 text-cyan-400 font-bold">{log.action}</td>
                    <td className="py-2 px-4 text-zinc-300">{log.admin_id ? `Admin #${log.admin_id}` : "System"}</td>
                    <td className="py-2 px-4 text-zinc-400">{log.target_user_id ? `User #${log.target_user_id}` : "—"}</td>
                    <td className="py-2 px-4 text-zinc-400 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD NEW INSTITUTION (Section 6 Requirement)
         ========================================================================= */}
      {showAddInstModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddInstitution}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-zinc-100">Add Recognized College</h3>
                <p className="text-xs text-zinc-400">Configure exact verified email domains</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddInstModal(false)}
                className="text-zinc-400 hover:text-zinc-100"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={newInstName}
                onChange={(e) => setNewInstName(e.target.value)}
                placeholder="e.g. National Institute of Technology, Rourkela"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">Official Website</label>
              <input
                type="url"
                required
                value={newInstWebsite}
                onChange={(e) => setNewInstWebsite(e.target.value)}
                placeholder="https://www.nitrkl.ac.in"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Authorized Domains (Comma separated)
              </label>
              <input
                type="text"
                required
                value={newInstDomains}
                onChange={(e) => setNewInstDomains(e.target.value)}
                placeholder="nitrkl.ac.in, alumni.nitrkl.ac.in"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-mono"
              />
              <p className="text-[10px] text-zinc-500 mt-1">Exact match only. Do not include @ symbol.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddInstModal(false)}
                className="w-1/3 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs"
              >
                Register & Verify Domain
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
