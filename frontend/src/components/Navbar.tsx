"use client";

import React, { useState } from "react";
import { UserResponse } from "../lib/types";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Compass,
  LogOut,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Layers,
  ChevronDown,
  Sparkles,
  FlaskConical,
  Wifi,
  WifiOff,
  UserCheck
} from "lucide-react";

interface NavbarProps {
  user: UserResponse | null;
  onLogout: () => void;
  onSwitchPersona: (personaKey: string) => void;
  onOpenTestModal: () => void;
  lowBandwidthMode: boolean;
  onToggleLowBandwidth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onSwitchPersona,
  onOpenTestModal,
  lowBandwidthMode,
  onToggleLowBandwidth,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const { user: clerkUser, isSignedIn, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2DBD0] bg-[#FAF8F5]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#121212] text-white shadow-sm">
            <Compass className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-[#121212]">
                PATHFINDER <span className="font-light text-[#59554E]">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#EDE7DC] text-[#423E37] border border-[#D9D2C7]">
                <Sparkles className="w-3 h-3 text-[#121212]" /> PS-22
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-[#736E65] font-medium tracking-wide">
              Talent Has No Location. Opportunity Shouldn&apos;t Either.
            </p>
          </div>
        </div>

        {/* Action Controls & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Clerk Auth Integration Widget (Zero Core-3 component errors) */}
          <div className="flex items-center">
            {isLoaded && isSignedIn ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-[#E2DBD0] shadow-sm">
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
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EDE7DC] text-[#121212] font-bold border border-[#D9D2C7]">
                  Clerk Verified
                </span>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#121212] hover:bg-[#262626] text-white transition-all shadow-sm">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Clerk Sign In</span>
                </button>
              </SignInButton>
            )}
          </div>

          {/* Low Bandwidth / Rural Mode Toggle */}
          <button
            onClick={onToggleLowBandwidth}
            title="Toggle Low-Bandwidth Mode for Rural Connectivity"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              lowBandwidthMode
                ? "bg-[#EDE7DC] border-[#121212] text-[#121212]"
                : "bg-white border-[#E2DBD0] text-[#59554E] hover:border-[#121212] hover:text-[#121212]"
            }`}
          >
            {lowBandwidthMode ? <WifiOff className="w-3.5 h-3.5 text-[#121212]" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{lowBandwidthMode ? "Data Saver: ON" : "Rural Mode"}</span>
          </button>

          {/* Judge Test Suite Launcher Button */}
          <button
            onClick={onOpenTestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-[#CEBFAD] hover:border-[#121212] text-[#121212] transition-all shadow-sm"
          >
            <FlaskConical className="w-3.5 h-3.5 text-[#121212]" />
            <span>Judge Test Suite</span>
          </button>

          {/* Quick Persona Switcher for Hackathon Demonstrations */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4EFE6] border border-[#D9D2C7] hover:border-[#121212] text-[#121212] transition-colors shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-[#121212]" />
              <span className="hidden md:inline">Demo Persona:</span>
              <span className="font-extrabold underline underline-offset-2">
                {user ? user.role : "Guest"}
              </span>
              <ChevronDown className="w-3 h-3 text-[#59554E]" />
            </button>

            {showPersonaMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-white border border-[#D9D2C7] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowPersonaMenu(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-[#736E65] border-b border-[#F4EFE6] mb-1">
                  Instant Role Demonstration
                </div>

                <button
                  onClick={() => {
                    onSwitchPersona("student_inst");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-start gap-2.5"
                >
                  <GraduationCap className="w-4 h-4 text-[#121212] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      Student (Institutional)
                      <span className="text-[10px] px-1 bg-[#EDE7DC] text-[#121212] rounded font-mono font-semibold">BIT Mesra</span>
                    </div>
                    <div className="text-[11px] text-[#736E65]">Verified college domain, institutional badge</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchPersona("student_rural");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-start gap-2.5"
                >
                  <GraduationCap className="w-4 h-4 text-[#736E65] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      Student (Personal / Rural)
                      <span className="text-[10px] px-1 bg-[#F4EFE6] text-[#59554E] rounded font-mono font-semibold">Gmail</span>
                    </div>
                    <div className="text-[11px] text-[#736E65]">First-gen learner, ID verification pending</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchPersona("recruiter_pending");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-start gap-2.5"
                >
                  <Briefcase className="w-4 h-4 text-[#736E65] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      Recruiter (Pending)
                      <span className="text-[10px] px-1 bg-[#F4EFE6] text-[#736E65] rounded font-mono font-semibold">Gated</span>
                    </div>
                    <div className="text-[11px] text-[#736E65]">Cannot publish jobs until admin approves</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchPersona("recruiter_verified");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-start gap-2.5"
                >
                  <Briefcase className="w-4 h-4 text-[#121212] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      Recruiter (Verified)
                      <span className="text-[10px] px-1 bg-[#121212] text-white rounded font-mono font-semibold">Approved</span>
                    </div>
                    <div className="text-[11px] text-[#736E65]">Full job publishing & blind candidate review</div>
                  </div>
                </button>

                <div className="my-1 border-t border-[#F4EFE6]" />

                <button
                  onClick={() => {
                    onSwitchPersona("admin");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-[#FAF8F5] transition-colors flex items-start gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 text-[#121212] mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#121212] flex items-center gap-1.5">
                      Chief Administrator
                      <span className="text-[10px] px-1 bg-[#EDE7DC] text-[#121212] rounded font-mono font-semibold">Admin Only</span>
                    </div>
                    <div className="text-[11px] text-[#736E65]">Approvals, domain control, audit logs</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Status / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-[#E2DBD0]">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-bold text-[#121212]">{user.full_name}</span>
                <span className="text-[10px] font-mono text-[#736E65]">{user.email}</span>
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
