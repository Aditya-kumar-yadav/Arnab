"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Sparkles,
  FileText,
  Plus,
  Check,
  Save,
  Building2,
  MapPin,
  ExternalLink
} from "lucide-react";

export interface ProfileSettingsData {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  branch: string;
  preferredDomain: string;
  skills: string[];
  resumeName?: string;
}

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: ProfileSettingsData;
  onSave: (data: ProfileSettingsData) => void;
  onOpenResumeEditor: () => void;
  onUploadNewResume: () => void;
}

const POPULAR_SKILLS = [
  "Python",
  "React",
  "Java",
  "C++",
  "SQL",
  "FastAPI",
  "Node.js",
  "Docker",
  "Git",
  "Machine Learning",
  "UI/UX",
  "TypeScript",
  "Next.js",
  "AWS",
  "PostgreSQL",
  "Tailwind CSS",
  "MongoDB",
];

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  onOpenResumeEditor,
  onUploadNewResume,
}) => {
  const [formData, setFormData] = useState<ProfileSettingsData>(initialData);
  const [customSkill, setCustomSkill] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData);
      setSaveSuccess(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const toggleSkill = (skill: string) => {
    const exists = formData.skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase()
    );
    if (exists) {
      setFormData({
        ...formData,
        skills: formData.skills.filter(
          (s) => s.toLowerCase() !== skill.toLowerCase()
        ),
      });
    } else {
      setFormData({
        ...formData,
        skills: [...formData.skills, skill],
      });
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    const exists = formData.skills.some(
      (s) => s.toLowerCase() === trimmed.toLowerCase()
    );
    if (!exists) {
      setFormData({
        ...formData,
        skills: [...formData.skills, trimmed],
      });
    }
    setCustomSkill("");
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  const handleSave = () => {
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/60 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl border border-[#E2DBD0] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-auto text-[#121212]"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#E2DBD0]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#121212] text-white text-[10px] font-mono font-bold mb-1">
              <User className="w-3 h-3 text-white" /> Candidate Profile & Resume Settings
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#121212] tracking-tight">
              Manage Profile, Skills & Resume
            </h2>
            <p className="text-xs text-[#736E65] mt-0.5">
              Updates here instantly sync with OpenResume live builder and job matching algorithms.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#736E65] hover:text-[#121212] hover:bg-[#EDE7DC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Profile settings & skills saved successfully! Match scores recomputed.</span>
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#121212]">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#736E65] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  placeholder="e.g. Aditya Yadav"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#736E65] absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="e.g. student@bitmesra.ac.in"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#736E65] absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                Preferred Domain
              </label>
              <input
                type="text"
                value={formData.preferredDomain}
                onChange={(e) =>
                  setFormData({ ...formData, preferredDomain: e.target.value })
                }
                placeholder="e.g. Full Stack Development"
                className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#121212] mb-1">
                College / University
              </label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
                placeholder="Birla Institute of Technology, Mesra"
                className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#121212] mb-1">
                Degree & Branch
              </label>
              <input
                type="text"
                value={`${formData.degree} - ${formData.branch}`}
                onChange={(e) => {
                  const parts = e.target.value.split("-");
                  setFormData({
                    ...formData,
                    degree: parts[0]?.trim() || formData.degree,
                    branch: parts[1]?.trim() || formData.branch,
                  });
                }}
                placeholder="B.Tech - CSE"
                className="w-full px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Skills Selection (Internshala Style) */}
        <div className="space-y-3 pt-3 border-t border-[#E2DBD0]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#121212]">
                Your Verified Skills (Internshala-Style Tag Selector)
              </h3>
              <p className="text-[11px] text-[#736E65]">
                Click popular tags to toggle, or type any skill below and hit Add.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#EDE7DC] text-[#121212]">
              {formData.skills.length} skills added
            </span>
          </div>

          {/* Quick-add pills */}
          <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white border border-[#E2DBD0]">
            {POPULAR_SKILLS.map((sk) => {
              const isSelected = formData.skills.some(
                (s) => s.toLowerCase() === sk.toLowerCase()
              );
              return (
                <button
                  key={sk}
                  type="button"
                  onClick={() => toggleSkill(sk)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#121212] text-white border-[#121212]"
                      : "bg-[#FAF8F5] text-[#59554E] border-[#E2DBD0] hover:border-[#121212] hover:text-[#121212]"
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 text-white" /> : <Plus className="w-3 h-3 text-[#736E65]" />}
                  <span>{sk}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Skill Input */}
          <form onSubmit={handleAddCustomSkill} className="flex gap-2">
            <input
              type="text"
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Add other skill (e.g. GraphQL, Flutter, Redis)..."
              className="flex-1 px-3 py-2 bg-white border border-[#E2DBD0] rounded-xl text-xs font-semibold text-[#121212] focus:outline-none focus:border-[#121212]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#121212] text-white text-xs font-bold rounded-xl hover:bg-[#262626] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {/* Selected Skills Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EDE7DC] text-[#121212] text-xs font-mono font-bold border border-[#D9D2C7]"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Resume & OpenResume Integration */}
        <div className="p-4 rounded-2xl bg-white border border-[#E2DBD0] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#736E65] block">
                OpenResume Technique Active
              </span>
              <h4 className="text-sm font-black text-[#121212] mt-0.5">
                Current Resume: {formData.resumeName || "Aditya_Yadav_Resume.pdf"}
              </h4>
              <p className="text-xs text-[#736E65] mt-0.5">
                Freely customize, tailor, or edit all sections via the live OpenResume single-column studio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResumeEditor();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-white" />
                <span>✏️ Edit in OpenResume</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onUploadNewResume();
                }}
                className="px-3 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#121212] font-semibold text-xs border border-[#E2DBD0] transition-colors"
              >
                <span>Upload New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2DBD0]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-[#E2DBD0] text-[#736E65] hover:text-[#121212] font-semibold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#121212] hover:bg-[#262626] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Save Profile & Sync Skills</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

