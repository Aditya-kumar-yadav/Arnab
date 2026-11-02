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
  Users,
  Briefcase,
  Building2,
  Clock,
  Ban,
  CheckCircle2,
  Plus,
  Search,
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

  const handleApproveRecruiter = async (recruiterId: number, companyId: number) => {
    try {
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
        <div className="inline-block w-8 h-8 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#736E65] text-sm font-medium">Authenticating Chief Administrator session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#121212]">
      {/* Admin Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E2DBD0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#121212] tracking-tight">
              Administration & Governance Console
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#121212] text-white">
              Root Authority
            </span>
          </div>
          <p className="text-xs text-[#736E65] mt-1 font-medium">
            Institutional domain governance, corporate authorization audits, and immutable logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenTestModal}
            className="px-4 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Judge Test Runner</span>
          </button>
          <button
            onClick={loadAll}
            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#121212] border border-[#D9D2C7]"
            title="Refresh System State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6 OVERVIEW STATS CARDS */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-1">
            <span className="text-[11px] text-[#736E65] font-semibold flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#121212]" /> Total Students
            </span>
            <div className="text-2xl font-black font-mono text-[#121212]">{stats.total_students}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-1">
            <span className="text-[11px] text-[#736E65] font-semibold flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-[#121212]" /> Total Recruiters
            </span>
            <div className="text-2xl font-black font-mono text-[#121212]">{stats.total_recruiters}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-1">
            <span className="text-[11px] text-[#736E65] font-semibold flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#121212]" /> Verified Companies
            </span>
            <div className="text-2xl font-black font-mono text-[#121212]">{stats.verified_companies}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-1">
            <span className="text-[11px] text-[#736E65] font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#121212]" /> Pending Recruiters
            </span>
            <div className="text-2xl font-black font-mono text-[#121212]">{stats.pending_recruiters}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-1">
            <span className="text-[11px] text-[#736E65] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#121212]" /> Pending Inst. Verifs
            </span>
            <div className="text-2xl font-black font-mono text-[#121212]">{stats.pending_institution_verifications}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-1">
            <span className="text-[11px] text-[#736E65] font-semibold flex items-center gap-1">
              <Ban className="w-3.5 h-3.5 text-[#121212]" /> Suspended Accounts
            </span>
            <div className="text-2xl font-black font-mono text-[#121212]">{stats.suspended_accounts}</div>
          </div>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-[#E2DBD0] gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("STUDENTS")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "STUDENTS"
              ? "text-[#121212] border-b-2 border-[#121212]"
              : "text-[#736E65] hover:text-[#121212]"
          }`}
        >
          A. Student Management ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("RECRUITERS")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "RECRUITERS"
              ? "text-[#121212] border-b-2 border-[#121212]"
              : "text-[#736E65] hover:text-[#121212]"
          }`}
        >
          B. Recruiter & Company Review ({recruiters.length})
        </button>
        <button
          onClick={() => setActiveTab("INSTITUTIONS")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "INSTITUTIONS"
              ? "text-[#121212] border-b-2 border-[#121212]"
              : "text-[#736E65] hover:text-[#121212]"
          }`}
        >
          C. Institution & Exact Domain Engine ({institutions.length})
        </button>
        <button
          onClick={() => setActiveTab("AUDIT")}
          className={`pb-3 px-1 transition-all ${
            activeTab === "AUDIT"
              ? "text-[#121212] border-b-2 border-[#121212]"
              : "text-[#736E65] hover:text-[#121212]"
          }`}
        >
          D. Immutable Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB A: STUDENT MANAGEMENT */}
      {activeTab === "STUDENTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name or email..."
                className="w-full px-3.5 py-2 bg-white border border-[#D9D2C7] rounded-xl text-xs text-[#121212] pl-9 outline-none focus:border-[#121212]"
              />
              <Search className="w-4 h-4 text-[#736E65] absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#121212]">
              <thead className="bg-[#FAF8F5] text-[#59554E] font-mono text-[11px] border-b border-[#E2DBD0] uppercase">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">College</th>
                  <th className="py-3 px-4">Email Status</th>
                  <th className="py-3 px-4">Affiliation Status</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE6]">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#121212]">{s.full_name}</div>
                      <div className="font-mono text-[10px] text-[#736E65]">{s.email}</div>
                      {s.is_first_generation && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[#121212] font-semibold border border-[#D9D2C7] mr-1">
                          First-Gen
                        </span>
                      )}
                      {s.is_rural_or_disadvantaged && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[#121212] font-semibold border border-[#D9D2C7]">
                          Rural
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#423E37]">
                      {s.institution_name || <span className="text-[#8C877D] italic">Self-Directed</span>}
                    </td>
                    <td className="py-3 px-4">
                      {s.email_verified ? (
                        <span className="text-[#121212] font-bold flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="text-[#736E65] font-mono text-[11px]">Unverified</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.verification_status === "VERIFIED"
                            ? "bg-[#121212] text-white"
                            : "bg-[#F4EFE6] text-[#736E65]"
                        }`}
                      >
                        {s.verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          s.account_status === "ACTIVE"
                            ? "bg-[#FAF8F5] text-[#121212] border border-[#D9D2C7]"
                            : "bg-[#FDF2F2] text-[#991B1B]"
                        }`}
                      >
                        {s.account_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {s.verification_status !== "VERIFIED" && (
                        <button
                          onClick={() => handleApproveStudent(s.id)}
                          className="px-2.5 py-1 bg-[#121212] hover:bg-[#262626] text-white font-bold rounded-lg text-[11px]"
                        >
                          Approve ID
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendUser(s.user_id, s.account_status)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border ${
                          s.account_status === "SUSPENDED"
                            ? "bg-[#121212] text-white"
                            : "border-[#D9D2C7] text-[#736E65] hover:border-[#121212]"
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

      {/* TAB B: RECRUITER & COMPANY REVIEW */}
      {activeTab === "RECRUITERS" && (
        <div className="overflow-x-auto rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
          <table className="w-full text-left text-xs text-[#121212]">
            <thead className="bg-[#FAF8F5] text-[#59554E] font-mono text-[11px] border-b border-[#E2DBD0] uppercase">
              <tr>
                <th className="py-3 px-4">Recruiter</th>
                <th className="py-3 px-4">Company & Website</th>
                <th className="py-3 px-4">Company Status</th>
                <th className="py-3 px-4">Recruiter Status</th>
                <th className="py-3 px-4 text-right">Verification Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6]">
              {recruiters.map((r) => {
                const isApproved =
                  r.recruiter_verification_status === "VERIFIED" &&
                  r.company_verification_status === "VERIFIED";

                return (
                  <tr key={r.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#121212]">{r.full_name}</div>
                      <div className="text-[11px] text-[#736E65]">{r.designation}</div>
                      <div className="font-mono text-[10px] text-[#8C877D]">{r.work_email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#121212]">{r.company_name}</div>
                      <a
                        href={r.company_website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#121212] underline underline-offset-2 flex items-center gap-1 text-[11px] font-mono font-bold"
                      >
                        {r.company_website} <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.company_verification_status === "VERIFIED"
                            ? "bg-[#121212] text-white"
                            : "bg-[#F4EFE6] text-[#736E65]"
                        }`}
                      >
                        {r.company_verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.recruiter_verification_status === "VERIFIED"
                            ? "bg-[#121212] text-white"
                            : "bg-[#F4EFE6] text-[#736E65]"
                        }`}
                      >
                        {r.recruiter_verification_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5">
                      {!isApproved && (
                        <button
                          onClick={() => handleApproveRecruiter(r.id, r.company_id)}
                          className="px-2.5 py-1 bg-[#121212] hover:bg-[#262626] text-white font-bold rounded-lg text-[11px]"
                        >
                          Approve Recruiter & Company
                        </button>
                      )}
                      <button
                        onClick={() => handleSuspendUser(r.user_id, r.account_status)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-bold border ${
                          r.account_status === "SUSPENDED"
                            ? "bg-[#121212] text-white"
                            : "border-[#D9D2C7] text-[#736E65] hover:border-[#121212]"
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

      {/* TAB C: INSTITUTION & DOMAINS */}
      {activeTab === "INSTITUTIONS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#736E65] font-medium">
              Exact domain validation prevents spoofing. Substring domains like <code>fakebitmesra.ac.in</code> are strictly prohibited.
            </div>
            <button
              onClick={() => setShowAddInstModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Verified College</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutions.map((inst) => (
              <div
                key={inst.id}
                className="p-5 rounded-2xl bg-white border border-[#E2DBD0] shadow-sm space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div className="font-black text-[#121212] text-sm">{inst.institution_name}</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#121212] text-white font-bold">
                    VERIFIED
                  </span>
                </div>
                <div className="text-xs text-[#736E65] font-mono font-medium">{inst.official_website}</div>
                <div className="pt-2 border-t border-[#F4EFE6] flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-[#8C877D] font-mono font-semibold">Authorized Domains:</span>
                  {inst.domains.map((dom, dIdx) => (
                    <span
                      key={dIdx}
                      className="px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#D9D2C7] text-[#121212] font-mono font-bold text-[11px]"
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

      {/* TAB D: IMMUTABLE AUDIT LOGS */}
      {activeTab === "AUDIT" && (
        <div className="space-y-3">
          <div className="text-xs text-[#736E65] font-medium">
            Real-time, cryptographically linked security and administrative audit trail.
          </div>
          <div className="overflow-x-auto rounded-3xl border border-[#E2DBD0] bg-white shadow-sm">
            <table className="w-full text-left text-xs text-[#121212] font-mono">
              <thead className="bg-[#FAF8F5] text-[#59554E] text-[10px] border-b border-[#E2DBD0] uppercase">
                <tr>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4">Action Event</th>
                  <th className="py-2.5 px-4">Admin Actor</th>
                  <th className="py-2.5 px-4">Target User</th>
                  <th className="py-2.5 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EFE6] text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAF8F5]">
                    <td className="py-2 px-4 text-[#8C877D]">{new Date(log.created_at).toLocaleTimeString()}</td>
                    <td className="py-2 px-4 font-bold text-[#121212]">{log.action}</td>
                    <td className="py-2 px-4 text-[#423E37]">{log.admin_id ? `Admin #${log.admin_id}` : "System"}</td>
                    <td className="py-2 px-4 text-[#736E65]">{log.target_user_id ? `User #${log.target_user_id}` : "—"}</td>
                    <td className="py-2 px-4 text-[#736E65] max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD INSTITUTION MODAL */}
      {showAddInstModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddInstitution}
            className="bg-white border border-[#CEBFAD] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-black text-[#121212]">Add Recognized College</h3>
                <p className="text-xs text-[#736E65]">Configure exact verified email domains</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddInstModal(false)}
                className="text-[#736E65] hover:text-[#121212]"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Institution Name</label>
              <input
                type="text"
                required
                value={newInstName}
                onChange={(e) => setNewInstName(e.target.value)}
                placeholder="e.g. National Institute of Technology, Rourkela"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">Official Website</label>
              <input
                type="url"
                required
                value={newInstWebsite}
                onChange={(e) => setNewInstWebsite(e.target.value)}
                placeholder="https://www.nitrkl.ac.in"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                Authorized Domains (Comma separated)
              </label>
              <input
                type="text"
                required
                value={newInstDomains}
                onChange={(e) => setNewInstDomains(e.target.value)}
                placeholder="nitrkl.ac.in, alumni.nitrkl.ac.in"
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#D9D2C7] rounded-xl text-xs text-[#121212] font-mono"
              />
              <p className="text-[10px] text-[#736E65] mt-1 font-medium">Exact match only. Do not include @ symbol.</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddInstModal(false)}
                className="w-1/3 py-2 rounded-xl bg-[#FAF8F5] text-[#59554E] font-bold text-xs border border-[#D9D2C7]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-black text-xs"
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
