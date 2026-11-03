"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserResponse } from "../lib/types";
import { UserButton, useUser } from "@clerk/nextjs";
import {
  Compass,
  LogOut,
  FileText,
  User,
  Settings,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Sparkles
} from "lucide-react";

interface NavbarProps {
  user: UserResponse | null;
  onLogout: () => void;
  onOpenAuthModal?: (role?: "STUDENT" | "RECRUITER", mode?: "LOGIN" | "REGISTER") => void;
  onOpenProfileSettings?: () => void;
  onOpenResumeEditor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenAuthModal,
  onOpenProfileSettings,
  onOpenResumeEditor,
}) => {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DDD6FE]/70 bg-white/85 backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(91,75,255,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white shadow-md shadow-[#5B4BFF]/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-[#0D0B2D]">
                PATHFINDER
              </span>
              <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-[#E6E0FF] text-[#5B4BFF] tracking-wider">
                AI
              </span>
            </div>
          </Link>
        </div>

        {/* Center Editorial Navigation Links (Desktop) */}
        {!user ? (
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-[#77758F]">
            <button
              onClick={() => scrollToSection("explore-opportunities")}
              className="hover:text-[#5B4BFF] transition-colors"
            >
              Explore Opportunities
            </button>
            <button
              onClick={() => scrollToSection("tpo-cell")}
              className="hover:text-[#5B4BFF] transition-colors flex items-center gap-1 text-[#0D0B2D]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B4BFF]" />
              <span>TPO Cell</span>
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="hover:text-[#5B4BFF] transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("for-students")}
              className="hover:text-[#5B4BFF] transition-colors"
            >
              For Students
            </button>
            <button
              onClick={() => {
                if (onOpenAuthModal) onOpenAuthModal("RECRUITER", "LOGIN");
                else scrollToSection("how-it-works");
              }}
              className="hover:text-[#5B4BFF] transition-colors"
            >
              For Recruiters
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-[#77758F]">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF]">
              {user.role} WORKSPACE
            </span>
            {user.role === "STUDENT" && onOpenResumeEditor && (
              <button
                onClick={onOpenResumeEditor}
                className="hover:text-[#5B4BFF] flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>OpenResume Studio</span>
              </button>
            )}
            {user.role === "STUDENT" && onOpenProfileSettings && (
              <button
                onClick={onOpenProfileSettings}
                className="hover:text-[#5B4BFF] flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Profile & Skills</span>
              </button>
            )}
          </nav>
        )}

        {/* Right Side: Auth / User Controls */}
        <div className="flex items-center gap-2.5">
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuthModal?.("STUDENT", "LOGIN")}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#0D0B2D] hover:text-[#5B4BFF] hover:bg-[#F7F8FF] transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuthModal?.("STUDENT", "REGISTER")}
                className="px-4 py-2 rounded-xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-xs font-bold shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="font-extrabold text-xs text-[#0D0B2D] leading-tight">
                  {user.full_name}
                </span>
                <span className="text-[10px] text-[#77758F] font-mono leading-none mt-0.5">
                  {user.email}
                </span>
              </div>

              {isSignedIn ? (
                <UserButton />
              ) : (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl border border-[#DDD6FE] hover:bg-red-50 hover:border-red-200 text-xs font-bold text-[#77758F] hover:text-red-600 transition-all flex items-center gap-1"
                  title="Sign out of current workspace"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-xl bg-[#F7F8FF] border border-[#DDD6FE] flex items-center justify-center text-[#0D0B2D]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DDD6FE] bg-white px-4 py-4 space-y-3 shadow-xl animate-fade-in">
          {!user ? (
            <>
              <button
                onClick={() => scrollToSection("explore-opportunities")}
                className="w-full text-left py-2 text-xs font-bold text-[#0D0B2D] hover:text-[#5B4BFF]"
              >
                Explore Opportunities
              </button>
              <button
                onClick={() => scrollToSection("tpo-cell")}
                className="w-full text-left py-2 text-xs font-bold text-[#5B4BFF] hover:underline"
              >
                BIT Mesra T&P Cell
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="w-full text-left py-2 text-xs font-bold text-[#0D0B2D] hover:text-[#5B4BFF]"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("for-students")}
                className="w-full text-left py-2 text-xs font-bold text-[#0D0B2D] hover:text-[#5B4BFF]"
              >
                For Students
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal?.("RECRUITER", "LOGIN");
                }}
                className="w-full text-left py-2 text-xs font-bold text-[#0D0B2D] hover:text-[#5B4BFF]"
              >
                For Recruiters
              </button>
              <div className="pt-2 border-t border-[#DDD6FE] flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal?.("STUDENT", "LOGIN");
                  }}
                  className="w-1/2 py-2.5 rounded-xl border border-[#DDD6FE] text-xs font-bold text-[#0D0B2D] text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuthModal?.("STUDENT", "REGISTER");
                  }}
                  className="w-1/2 py-2.5 rounded-xl bg-[#5B4BFF] text-white text-xs font-bold text-center"
                >
                  Get Started
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#0D0B2D] pb-1 border-b border-[#DDD6FE]">
                {user.full_name} ({user.role})
              </div>
              {user.role === "STUDENT" && onOpenResumeEditor && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenResumeEditor();
                  }}
                  className="w-full text-left py-1.5 text-xs text-[#0D0B2D] font-medium"
                >
                  OpenResume ATS Studio
                </button>
              )}
              {user.role === "STUDENT" && onOpenProfileSettings && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfileSettings();
                  }}
                  className="w-full text-left py-1.5 text-xs text-[#0D0B2D] font-medium"
                >
                  Profile & Skills
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left py-1.5 text-xs text-red-600 font-bold"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
