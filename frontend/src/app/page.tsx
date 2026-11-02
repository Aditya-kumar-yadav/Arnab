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

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState<boolean>(false);
  const [lowBandwidthMode, setLowBandwidthMode] = useState<boolean>(false);

  // Load user on mount
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = api.getToken();
        if (token) {
          const user = await api.getMe();
          setCurrentUser(user);
        }
      } catch (err) {
        console.warn("Session check error (clearing local token):", err);
        api.setToken(null);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleAuthSuccess = (tokenData: any) => {
    setCurrentUser(tokenData.user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  // Instant Persona Switcher for Hackathon Live Demo
  const handleSwitchPersona = async (personaKey: string) => {
    setLoading(true);
    try {
      if (personaKey === "student_inst") {
        const res = await api.login("student@bitmesra.ac.in", "StudentPass2026!");
        setCurrentUser(res.user);
      } else if (personaKey === "student_rural") {
        const res = await api.login("rahul.learner@gmail.com", "StudentPass2026!");
        setCurrentUser(res.user);
      } else if (personaKey === "recruiter_verified") {
        const res = await api.login("talent@ruraltechlabs.io", "RecruiterPass2026!");
        setCurrentUser(res.user);
      } else if (personaKey === "recruiter_pending") {
        // Register or login a pending recruiter
        try {
          const res = await api.login("pending.recruiter@demo.org", "RecruiterPass2026!");
          setCurrentUser(res.user);
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
        }
      } else if (personaKey === "admin") {
        const res = await api.login("admin@pathfinder.ai", "AdminSecurePassword2026!");
        setCurrentUser(res.user);
      }
    } catch (err: any) {
      alert("Failed to switch persona: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-zinc-400 font-mono tracking-wide">
          PATHFINDER AI • Initializing Secure Environment...
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-zinc-950 text-zinc-100 selection:bg-cyan-500 selection:text-zinc-950 font-sans ${
        lowBandwidthMode ? "rural-data-saver" : ""
      }`}
    >
      {/* Navigation Header */}
      <Navbar
        user={currentUser}
        onLogout={handleLogout}
        onSwitchPersona={handleSwitchPersona}
        onOpenTestModal={() => setIsTestModalOpen(true)}
        lowBandwidthMode={lowBandwidthMode}
        onToggleLowBandwidth={() => setLowBandwidthMode(!lowBandwidthMode)}
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
          <div className="p-12 text-center text-zinc-400">Unknown role context</div>
        )}
      </main>

      {/* Interactive Acceptance Test Modal for Judges */}
      <AcceptanceTestRunnerModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
