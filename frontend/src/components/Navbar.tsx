"use client";

import React from "react";
import { UserResponse } from "../lib/types";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Compass,
  LogOut,
  FileText,
  User,
  Settings,
  UserCheck,
  Plus
} from "lucide-react";

interface NavbarProps {
  user: UserResponse | null;
  onLogout: () => void;
  onOpenProfileSettings?: () => void;
  onOpenResumeEditor?: () => void;
  // Optional backwards compatibility
  onOpenTestModal?: () => void;
  lowBandwidthMode?: boolean;
  onToggleLowBandwidth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenProfileSettings,
  onOpenResumeEditor,
}) => {
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  const handleEditResumeClick = () => {
    if (onOpenResumeEditor) {
      onOpenResumeEditor();
    } else {
      window.location.href = "/resume";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2DBD0] bg-[#FAF8F5]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#121212] text-white shadow-sm">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-[#121212]">
                PATHFINDER <span className="font-light text-[#59554E]">AI</span>
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#736E65] font-medium tracking-wide">
              Talent Has No Location. Opportunity Shouldn&apos;t Either.
            </p>
          </div>
        </div>

        {/* Action Controls: Profile & Resume Edit Options Only */}
        <div className="flex items-center gap-2.5">
          {/* Clerk Auth Avatar (No Clerk Verified Tag) */}
          <div className="flex items-center">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-[#E2DBD0] shadow-xs">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-6 h-6",
                    },
                  }}
                />
                <span className="hidden lg:inline text-xs text-[#121212] font-semibold">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#121212] hover:bg-[#262626] text-white transition-all shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            )}
          </div>

          {/* 1. Resume Edit Option (Clean Top + Edit Resume Button) */}
          <button
            onClick={handleEditResumeClick}
            title="Edit resume or update skills in OpenResume ATS Studio"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#121212] hover:bg-[#262626] text-white transition-all shadow-sm group"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-90 transition-transform" />
            <span>+ Edit Resume</span>
          </button>

          {/* 2. Profile Settings Option (Skills, Name, Mail, Number, etc.) */}
          {onOpenProfileSettings && (
            <button
              onClick={onOpenProfileSettings}
              title="Manage your profile, skills, phone number & career preferences"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#E2DBD0] hover:border-[#121212] text-[#121212] transition-colors shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-[#121212]" />
              <span>Profile & Skills</span>
            </button>
          )}

          {/* User Status & Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E2DBD0]">
              <div className="hidden sm:flex flex-col text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <span className="text-xs font-bold text-[#121212]">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#121212]">
                    {user.role}
                  </span>
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Log out of current account"
                className="p-2 rounded-xl text-[#736E65] hover:text-[#121212] hover:bg-[#EDE7DC] transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
