"use client";

import React, { useState } from "react";
import { UserResponse } from "../lib/types";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser
} from "@clerk/nextjs";
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
  const { user: clerkUser, isLoaded } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                PATHFINDER <span className="text-cyan-400">AI</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-indigo-950/60 text-indigo-300 border border-indigo-700/50">
                <Sparkles className="w-3 h-3 text-cyan-400" /> PS-22
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-zinc-400 tracking-wide">
              Talent Has No Location. Opportunity Shouldn&apos;t Either.
            </p>
          </div>
        </div>

        {/* Action Controls & Persona Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Clerk Auth Integration Widget */}
          <div className="flex items-center">
            <SignedIn>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-6 h-6",
                    },
                  }}
                />
                <span className="hidden lg:inline text-xs text-zinc-300 font-medium">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800/40">
                  Clerk Active
                </span>
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 transition-colors">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Clerk Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Low Bandwidth / Rural Mode Toggle */}
          <button
            onClick={onToggleLowBandwidth}
            title="Toggle Low-Bandwidth Mode for Rural Connectivity"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              lowBandwidthMode
                ? "bg-amber-950/70 border-amber-600/60 text-amber-300"
                : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {lowBandwidthMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{lowBandwidthMode ? "Data Saver: ON" : "Rural Mode"}</span>
          </button>

          {/* Judge Test Suite Launcher Button */}
          <button
            onClick={onOpenTestModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition-all shadow-sm shadow-cyan-900/20"
          >
            <FlaskConical className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Judge Test Suite</span>
          </button>

          {/* Quick Persona Switcher for Hackathon Demonstrations */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-200 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Demo Persona:</span>
              <span className="text-cyan-400 font-bold">
                {user ? user.role : "Guest"}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {showPersonaMenu && (
              <div
                className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-700/90 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setShowPersonaMenu(false)}
              >
                <div className="px-2.5 py-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-zinc-400 border-b border-zinc-800 mb-1">
                  Instant Role Demonstration
                </div>

                <button
                  onClick={() => {
                    onSwitchPersona("student_inst");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 transition-colors flex items-start gap-2.5"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-zinc-100 flex items-center gap-1.5">
                      Student (Institutional)
                      <span className="text-[10px] px-1 bg-emerald-950 text-emerald-300 rounded font-mono">BIT Mesra</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">Verified college domain, institutional badge</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchPersona("student_rural");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 transition-colors flex items-start gap-2.5"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-zinc-100 flex items-center gap-1.5">
                      Student (Personal / Rural)
                      <span className="text-[10px] px-1 bg-amber-950 text-amber-300 rounded font-mono">Gmail</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">First-gen learner, ID verification pending</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchPersona("recruiter_pending");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 transition-colors flex items-start gap-2.5"
                >
                  <Briefcase className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-zinc-100 flex items-center gap-1.5">
                      Recruiter (Pending)
                      <span className="text-[10px] px-1 bg-zinc-800 text-zinc-300 rounded font-mono">Gated</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">Cannot publish jobs until admin approves</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onSwitchPersona("recruiter_verified");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 transition-colors flex items-start gap-2.5"
                >
                  <Briefcase className="w-4 h-4 text-purple-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-zinc-100 flex items-center gap-1.5">
                      Recruiter (Verified)
                      <span className="text-[10px] px-1 bg-purple-950 text-purple-300 rounded font-mono">Approved</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">Full job publishing & blind candidate review</div>
                  </div>
                </button>

                <div className="my-1 border-t border-zinc-800" />

                <button
                  onClick={() => {
                    onSwitchPersona("admin");
                    setShowPersonaMenu(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-800/80 transition-colors flex items-start gap-2.5"
                >
                  <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-zinc-100 flex items-center gap-1.5">
                      Chief Administrator
                      <span className="text-[10px] px-1 bg-red-950 text-red-300 rounded font-mono">Admin Only</span>
                    </div>
                    <div className="text-[11px] text-zinc-400">Approvals, domain control, audit logs</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* User Status / Logout */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800">
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-zinc-200">{user.full_name}</span>
                <span className="text-[10px] font-mono text-zinc-400">{user.email}</span>
              </div>
              <button
                onClick={onLogout}
                title="Log out of current account"
                className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
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
