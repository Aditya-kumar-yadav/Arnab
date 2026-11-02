"use client";

import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { UserResponse, UserRole } from "../lib/types";
import { Navbar } from "../components/Navbar";
import { AuthLanding } from "../components/AuthLanding";
import { StudentDashboard } from "../components/StudentDashboard";
import { RecruiterDashboard } from "../components/RecruiterDashboard";
import { AdminDashboard } from "../components/AdminDashboard";
import { AcceptanceTestRunnerModal } from "../components/AcceptanceTestRunnerModal";
import { CandidateOnboardingCarousel } from "../components/CandidateOnboardingCarousel";
import { RecruiterIntentModal } from "../components/RecruiterIntentModal";
import { RoleSelectionModal } from "../components/RoleSelectionModal";
import { ProfileSettingsModal } from "../components/ProfileSettingsModal";
import { ResumeStudioModal } from "../components/ResumeStudioModal";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUser();
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);

  // Dynamic Onboarding Modals State
  const [showRoleSelectModal, setShowRoleSelectModal] = useState<boolean>(false);
  const [showCandidateOnboarding, setShowCandidateOnboarding] = useState<boolean>(false);
  const [showRecruiterIntent, setShowRecruiterIntent] = useState<boolean>(false);

  // Global Profile & Resume Modals State
  const [isGlobalProfileSettingsOpen, setIsGlobalProfileSettingsOpen] = useState<boolean>(false);
  const [isGlobalResumeModalOpen, setIsGlobalResumeModalOpen] = useState<boolean>(false);

  // Check stored session or Clerk sync on mount/change
  useEffect(() => {
    const initSession = async () => {
      try {
        const token = api.getToken();
        if (token) {
          const user = await api.getMe();
          setCurrentUser(user);
        }
      } catch (err) {
        console.warn("Session check fallback:", err);
      } finally {
        setLoading(false);
      }
    };
    initSession();
  }, []);

  // Handle Clerk Login Synchronization
  useEffect(() => {
    if (!clerkLoaded) return;

    if (!clerkSignedIn) {
      if (currentUser?.clerk_user_id) {
        setCurrentUser(null);
        api.logout();
      }
      return;
    }

    if (clerkSignedIn && clerkUser) {
      const clerkEmail = clerkUser.primaryEmailAddress?.emailAddress || "";
      const storedRole = (localStorage.getItem("pathfinder_user_role") as UserRole) || null;
      const candidateOnboarded = localStorage.getItem("pathfinder_candidate_onboarding_completed") === "true";
      const recruiterIntentDone = localStorage.getItem("pathfinder_recruiter_intent_completed") === "true";

      // If user has not chosen their role yet, show role selection
      if (!storedRole) {
        setShowRoleSelectModal(true);
        return;
      }

      // If Student
      if (storedRole === "STUDENT") {
        if (!candidateOnboarded) {
          setShowCandidateOnboarding(true);
        } else if (!currentUser) {
          syncStudentLogin(clerkEmail, clerkUser);
        }
      } else if (storedRole === "RECRUITER") {
        if (!recruiterIntentDone) {
          setShowRecruiterIntent(true);
        } else if (!currentUser) {
          syncRecruiterLogin(clerkEmail, clerkUser);
        }
      }
    }
  }, [clerkUser, clerkLoaded, clerkSignedIn, currentUser]);

  const syncStudentLogin = async (email: string, cUser: any) => {
    const realName =
      (typeof window !== "undefined" ? localStorage.getItem("pathfinder_candidate_name") : null) ||
      cUser?.fullName ||
      `${cUser?.firstName || ""} ${cUser?.lastName || ""}`.trim() ||
      cUser?.username ||
      "Aditya Yadav";
    try {
      const res = await api.syncClerkUser({
        clerk_user_id: cUser?.id || "clerk_std_id",
        email: email || "student@bitmesra.ac.in",
        full_name: realName,
        role: "STUDENT",
        student_details: {
          college_name: email.includes("bitmesra") ? "Birla Institute of Technology, Mesra" : "Birla Institute of Technology, Mesra",
          degree: "B.Tech",
          branch: "Computer Science & Engineering",
          academic_year: "3rd Year",
          graduation_year: 2027,
          college_location: "Ranchi, Jharkhand",
          preferred_domain: "Full Stack Development",
          is_first_generation: true,
          is_rural_or_disadvantaged: true,
          skills: ["Python", "React", "FastAPI", "SQL", "Git"],
        },
      });
      setCurrentUser(res.user);
    } catch (err) {
      console.warn("Student sync error:", err);
    }
  };

  const syncRecruiterLogin = async (email: string, cUser: any) => {
    const realName =
      cUser?.fullName ||
      `${cUser?.firstName || ""} ${cUser?.lastName || ""}`.trim() ||
      cUser?.username ||
      "Inclusive Hiring Partner";
    try {
      const res = await api.syncClerkUser({
        clerk_user_id: cUser?.id || "clerk_rec_id",
        email: email || "talent@ruraltechlabs.io",
        full_name: realName,
        role: "RECRUITER",
        recruiter_details: {
          company_name: "RuralTech Labs & Systems",
          official_website: "https://ruraltechlabs.io",
          designation: "Head of Talent Acquisition",
          industry: "Social Technology",
          location: "Bengaluru, Karnataka",
        },
      });
      setCurrentUser(res.user);
    } catch (err) {
      console.warn("Recruiter sync error:", err);
    }
  };

  const handleSelectRoleFromModal = (role: "STUDENT" | "RECRUITER") => {
    setShowRoleSelectModal(false);
    localStorage.setItem("pathfinder_user_role", role);

    if (role === "STUDENT") {
      setShowCandidateOnboarding(true);
    } else {
      setShowRecruiterIntent(true);
    }
  };

  const handleCandidateOnboardingComplete = async (data: any) => {
    setShowCandidateOnboarding(false);
    localStorage.setItem("pathfinder_candidate_onboarding_completed", "true");
    localStorage.setItem("pathfinder_user_role", "STUDENT");

    const email = clerkUser?.primaryEmailAddress?.emailAddress || "yraj15927@gmail.com";
    const fullName =
      data.fullName ||
      clerkUser?.fullName ||
      `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() ||
      clerkUser?.username ||
      "Aditya Yadav";
    localStorage.setItem("pathfinder_candidate_name", fullName);

    try {
      const res = await api.syncClerkUser({
        clerk_user_id: clerkUser?.id || "clerk_std_id",
        email,
        full_name: fullName,
        role: "STUDENT",
        student_details: {
          college_name: data.collegeName,
          degree: data.degree,
          branch: data.branch,
          academic_year: data.academicYear,
          graduation_year: data.graduationYear,
          college_location: data.collegeLocation,
          preferred_domain: data.preferredDomain,
          is_first_generation: data.isFirstGen,
          is_rural_or_disadvantaged: data.isRural,
          skills: data.skills,
        },
      });
      setCurrentUser(res.user);
    } catch (err) {
      console.error("Onboarding register error:", err);
    }
  };

  const handleRecruiterIntentComplete = async (data: any) => {
    setShowRecruiterIntent(false);
    localStorage.setItem("pathfinder_recruiter_intent_completed", "true");
    localStorage.setItem("pathfinder_user_role", "RECRUITER");

    const email = clerkUser?.primaryEmailAddress?.emailAddress || "talent@ruraltechlabs.io";
    const fullName =
      clerkUser?.fullName ||
      `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim() ||
      clerkUser?.username ||
      "Inclusive Hiring Partner";

    try {
      const res = await api.syncClerkUser({
        clerk_user_id: clerkUser?.id || "clerk_rec_id",
        email,
        full_name: fullName,
        role: "RECRUITER",
        recruiter_details: {
          company_name: data.companyName,
          official_website: data.officialWebsite,
          designation: data.designation,
          industry: "Social Technology",
          location: "Bengaluru, Karnataka",
        },
      });
      setCurrentUser(res.user);
    } catch (err) {
      console.error("Recruiter intent register error:", err);
    }
  };

  const handleAuthSuccess = (tokenData: any) => {
    setCurrentUser(tokenData.user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    localStorage.removeItem("pathfinder_user_role");
    localStorage.removeItem("pathfinder_candidate_onboarding_completed");
    localStorage.removeItem("pathfinder_recruiter_intent_completed");
  };

  // Instant Persona Switcher for Hackathon Live Demo
  const handleSwitchPersona = async (personaKey: string) => {
    setLoading(true);
    try {
      if (personaKey === "student_inst") {
        const res = await api.login("student@bitmesra.ac.in", "StudentPass2026!");
        setCurrentUser(res.user);
        localStorage.setItem("pathfinder_user_role", "STUDENT");
      } else if (personaKey === "student_rural") {
        const res = await api.login("rahul.learner@gmail.com", "StudentPass2026!");
        setCurrentUser(res.user);
        localStorage.setItem("pathfinder_user_role", "STUDENT");
      } else if (personaKey === "recruiter_verified") {
        const res = await api.login("talent@ruraltechlabs.io", "RecruiterPass2026!");
        setCurrentUser(res.user);
        localStorage.setItem("pathfinder_user_role", "RECRUITER");
      } else if (personaKey === "recruiter_pending") {
        try {
          const res = await api.login("pending.recruiter@demo.org", "RecruiterPass2026!");
          setCurrentUser(res.user);
          localStorage.setItem("pathfinder_user_role", "RECRUITER");
        } catch {
          const res = await api.registerRecruiter({
            full_name: "Vikram Singhania",
            work_email: "pending.recruiter@demo.org",
            designation: "Talent Associate",
            password: "RecruiterPass2026!",
            company_name: "Global Scale Labs",
            official_website: "https://globalscalelabs.io",
          });
          setCurrentUser(res.user);
          localStorage.setItem("pathfinder_user_role", "RECRUITER");
        }
      } else if (personaKey === "admin") {
        const res = await api.login("admin@pathfinder.ai", "AdminSecurePassword2026!");
        setCurrentUser(res.user);
        localStorage.setItem("pathfinder_user_role", "ADMIN");
      }
    } catch (err: any) {
      alert("Failed to switch persona: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center text-[#121212]">
        <div className="w-10 h-10 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-[#736E65] font-mono tracking-wide font-bold">
          PATHFINDER AI • Synchronizing Verified Opportunity Graph...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[#FAF8F5] text-[#121212] selection:bg-[#121212] selection:text-white font-sans ${
        lowBandwidthMode ? "rural-data-saver" : ""
      }`}
    >
      {/* Navigation Header */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onOpenProfileSettings={() => setIsGlobalProfileSettingsOpen(true)}
        onOpenResumeEditor={() => setIsGlobalResumeModalOpen(true)}
      />

      {/* Main Content Router */}
      <main>
        {!currentUser ? (
          <AuthLanding
            onAuthSuccess={handleAuthSuccess}
            onOpenTestModal={() => setIsTestModalOpen(true)}
          />
        ) : currentUser.role === "STUDENT" ? (
          <StudentDashboard onOpenTestModal={() => setIsTestModalOpen(true)} />
        ) : currentUser.role === "RECRUITER" ? (
          <RecruiterDashboard onOpenTestModal={() => setIsTestModalOpen(true)} />
        ) : currentUser.role === "ADMIN" ? (
          <AdminDashboard onOpenTestModal={() => setIsTestModalOpen(true)} />
        ) : (
          <div className="p-12 text-center text-[#736E65]">Unknown role context</div>
        )}
      </main>

      {/* Global Profile & Skills Settings Modal (accessible from Navbar) */}
      <ProfileSettingsModal
        isOpen={isGlobalProfileSettingsOpen}
        onClose={() => setIsGlobalProfileSettingsOpen(false)}
        initialData={{
          fullName:
            (typeof window !== "undefined" ? localStorage.getItem("pathfinder_candidate_name") : null) ||
            clerkUser?.fullName ||
            currentUser?.full_name ||
            "Aditya Yadav",
          email: clerkUser?.primaryEmailAddress?.emailAddress || currentUser?.email || "yraj15927@gmail.com",
          phone:
            (typeof window !== "undefined" ? localStorage.getItem("pathfinder_candidate_phone") : null) ||
            "+91-9876543210",
          college: "Birla Institute of Technology, Mesra",
          degree: "B.Tech",
          branch: "Computer Science & Engineering",
          preferredDomain: "Full Stack Development",
          skills: ["Python", "React", "FastAPI", "SQL", "Git"],
          resumeName: "Aditya_Yadav_Resume.pdf",
        }}
        onSave={(data) => {
          if (typeof window !== "undefined") {
            localStorage.setItem("pathfinder_candidate_name", data.fullName);
            localStorage.setItem("pathfinder_candidate_phone", data.phone);
          }
          if (currentUser) {
            setCurrentUser({ ...currentUser, full_name: data.fullName });
          }
        }}
        onOpenResumeEditor={() => {
          setIsGlobalProfileSettingsOpen(false);
          setIsGlobalResumeModalOpen(true);
        }}
        onUploadNewResume={() => {
          setIsGlobalProfileSettingsOpen(false);
          setIsGlobalResumeModalOpen(true);
        }}
      />

      {/* Global OpenResume ATS Studio Modal (accessible from Navbar) */}
      <ResumeStudioModal
        isOpen={isGlobalResumeModalOpen}
        onClose={() => setIsGlobalResumeModalOpen(false)}
        candidateName={
          (typeof window !== "undefined" ? localStorage.getItem("pathfinder_candidate_name") : null) ||
          clerkUser?.fullName ||
          currentUser?.full_name ||
          "Aditya Yadav"
        }
        candidateEmail={clerkUser?.primaryEmailAddress?.emailAddress || currentUser?.email || "yraj15927@gmail.com"}
        initialTab="BUILDER"
      />

      {/* Post-Clerk Role Selection Modal */}
      {showRoleSelectModal && (
        <RoleSelectionModal
          userName={clerkUser?.firstName || clerkUser?.username || "Learner"}
          onSelectRole={handleSelectRoleFromModal}
        />
      )}

      {/* Candidate 3-Step Sliding Onboarding Carousel */}
      {showCandidateOnboarding && (
        <CandidateOnboardingCarousel
          initialName={clerkUser?.firstName || "Candidate"}
          initialEmail={clerkUser?.primaryEmailAddress?.emailAddress || ""}
          onComplete={handleCandidateOnboardingComplete}
          onSkip={() => {
            setShowCandidateOnboarding(false);
            localStorage.setItem("pathfinder_candidate_onboarding_completed", "true");
            syncStudentLogin(clerkUser?.primaryEmailAddress?.emailAddress || "student@bitmesra.ac.in", clerkUser || {});
          }}
        />
      )}

      {/* Recruiter Intent Onboarding Modal */}
      {showRecruiterIntent && (
        <RecruiterIntentModal
          initialName={clerkUser?.firstName || "Recruiter"}
          initialEmail={clerkUser?.primaryEmailAddress?.emailAddress || ""}
          onComplete={handleRecruiterIntentComplete}
          onClose={() => {
            setShowRecruiterIntent(false);
            localStorage.setItem("pathfinder_recruiter_intent_completed", "true");
            syncRecruiterLogin(clerkUser?.primaryEmailAddress?.emailAddress || "talent@ruraltechlabs.io", clerkUser || {});
          }}
        />
      )}

      {/* Interactive Acceptance Test Modal for Judges */}
      <AcceptanceTestRunnerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
