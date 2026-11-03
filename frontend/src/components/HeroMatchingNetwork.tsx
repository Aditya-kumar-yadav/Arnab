"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Cpu, ArrowUpRight, Zap, Layers, Network, Activity } from "lucide-react";

interface NodeItem {
  id: string;
  type: "student" | "skill" | "company" | "opportunity";
  label: string;
  sub: string;
  badge?: string;
  color: string;
  activeMatch?: number;
  explanation?: string;
}

const CANDIDATES: NodeItem[] = [
  {
    id: "std-1",
    type: "student",
    label: "Aarav Verma",
    sub: "BIT Mesra • B.Tech CSE",
    badge: "Institutional Verified",
    color: "#5B4BFF",
    activeMatch: 97,
    explanation: "4/4 verified skills match RuralTech Social Impact Fellowship. 0% college prestige penalty applied. Top 3% ClearHire match.",
  },
  {
    id: "std-2",
    type: "student",
    label: "Rahul Kumar",
    sub: "Tier-3 Rural Scholar • Python",
    badge: "Affirmative Boost +10%",
    color: "#10B981",
    activeMatch: 96,
    explanation: "First-generation rural scholar affirmative equity boost applied (+10%). Direct Python & FastAPI microservices vector alignment with RuralTech Labs.",
  },
  {
    id: "std-3",
    type: "student",
    label: "Priya Sharma",
    sub: "IIT Delhi • Machine Learning",
    badge: "Institutional Verified",
    color: "#5B4BFF",
    activeMatch: 95,
    explanation: "PyTorch & Transformers direct vector alignment with Google DeepMind Research Lab.",
  },
];

const LEFT_SKILLS: NodeItem[] = [
  {
    id: "sk-1",
    type: "skill",
    label: "Python & FastAPI",
    sub: "Backend Vector",
    color: "#8B5CF6",
  },
  {
    id: "sk-2",
    type: "skill",
    label: "React & Next.js",
    sub: "Frontend Vector",
    color: "#8B5CF6",
  },
];

const RIGHT_SKILLS: NodeItem[] = [
  {
    id: "sk-3",
    type: "skill",
    label: "Distributed Systems",
    sub: "Systems Vector",
    color: "#06B6D4",
  },
  {
    id: "sk-4",
    type: "skill",
    label: "Machine Learning",
    sub: "AI Vector",
    color: "#EC4899",
  },
];

const EMPLOYERS: NodeItem[] = [
  {
    id: "opp-1",
    type: "opportunity",
    label: "RuralTech Labs",
    sub: "Impact Software Fellow",
    badge: "Verified Employer",
    color: "#10B981",
    activeMatch: 97,
    explanation: "Blind Mode review active. Skill-verified offer pipeline ready with 97% ClearHire compatibility and +10% rural parity boost.",
  },
  {
    id: "opp-2",
    type: "opportunity",
    label: "Microsoft Research",
    sub: "Distributed Systems Intern",
    badge: "Enterprise Verified",
    color: "#0D0B2D",
    activeMatch: 93,
    explanation: "Multi-cluster synchronization & SQL competencies exceed enterprise hiring threshold.",
  },
  {
    id: "opp-3",
    type: "opportunity",
    label: "Google DeepMind",
    sub: "AI Engineering Fellow",
    badge: "Enterprise Verified",
    color: "#5B4BFF",
    activeMatch: 95,
    explanation: "Direct match against natural language & embedding retrieval benchmarks.",
  },
];

interface PathConnection {
  id: string;
  d: string;
  colorType: "rural" | "purple" | "cyan" | "pink" | "inactive";
  activeFor: string[];
  dur: string;
}

// Exactly-calculated Bezier paths connecting port-to-port in 100x100 viewBox
const NETWORK_PATHS: PathConnection[] = [
  // 1. Aarav Verma (right port: 24, 20) -> Python & FastAPI (left port: 28, 32)
  {
    id: "std1-sk1",
    d: "M 24 20 C 26 20, 26 32, 28 32",
    colorType: "purple",
    activeFor: ["std-1", "opp-1"],
    dur: "2.4s",
  },
  // Python & FastAPI (right port: 43, 32) -> AI Match Core (left top port: 44, 42)
  {
    id: "sk1-core",
    d: "M 43 32 C 43.5 32, 43.5 42, 44 42",
    colorType: "purple",
    activeFor: ["std-1", "std-2", "opp-1"],
    dur: "2.2s",
  },

  // 2. Rahul Kumar (right port: 24, 50) -> AI Match Core (left middle port: 44, 50) - Direct Horizontal Parity Bridge
  {
    id: "std2-core-direct",
    d: "M 24 50 C 34 50, 34 50, 44 50",
    colorType: "rural",
    activeFor: ["std-2", "opp-1", "opp-2"],
    dur: "2.0s",
  },
  // Rahul Kumar (right port: 24, 48) -> Python & FastAPI (left port: 28, 32)
  {
    id: "std2-sk1",
    d: "M 24 48 C 26 48, 26 32, 28 32",
    colorType: "rural",
    activeFor: ["std-2", "opp-1"],
    dur: "2.3s",
  },

  // 3. Priya Sharma (right port: 24, 80) -> React & Next.js (left port: 28, 68)
  {
    id: "std3-sk2",
    d: "M 24 80 C 26 80, 26 68, 28 68",
    colorType: "pink",
    activeFor: ["std-3", "opp-3"],
    dur: "2.6s",
  },
  // React & Next.js (right port: 43, 68) -> AI Match Core (left bottom port: 44, 58)
  {
    id: "sk2-core",
    d: "M 43 68 C 43.5 68, 43.5 58, 44 58",
    colorType: "purple",
    activeFor: ["std-3", "opp-3"],
    dur: "2.4s",
  },

  // ============================================================
  // AI MATCH CORE TO RURALTECH LABS (Multi-Lane High-Tech Streams)
  // ============================================================
  // Lane A: Primary ClearHire Neural Vector (97% Match)
  // Core (right port: 56, 42) -> RuralTech Labs (left port: 76, 20)
  {
    id: "core-rural-primary",
    d: "M 56 42 C 66 42, 66 20, 76 20",
    colorType: "purple",
    activeFor: ["std-1", "std-2", "opp-1"],
    dur: "2.2s",
  },
  // Lane B: RuralTech Affirmative Equity Stream (Arced upward in Glowing Emerald)
  // Core (right port: 56, 38) -> RuralTech Labs (left port: 76, 17)
  {
    id: "core-rural-affirmative",
    d: "M 56 38 C 64 24, 68 17, 76 17",
    colorType: "rural",
    activeFor: ["std-1", "std-2", "opp-1"],
    dur: "1.9s",
  },
  // Lane C: Core (right port: 56, 46) -> Distributed Systems (left port: 59, 32)
  {
    id: "core-sk3",
    d: "M 56 46 C 57.5 46, 57.5 32, 59 32",
    colorType: "cyan",
    activeFor: ["std-1", "std-2", "opp-1", "opp-2"],
    dur: "2.1s",
  },
  // Distributed Systems (right port: 74, 32) -> RuralTech Labs (left port: 76, 23)
  {
    id: "sk3-rural",
    d: "M 74 32 C 75 32, 75 23, 76 23",
    colorType: "cyan",
    activeFor: ["std-1", "std-2", "opp-1"],
    dur: "2.3s",
  },

  // ============================================================
  // AI MATCH CORE TO MICROSOFT RESEARCH & GOOGLE DEEPMIND
  // ============================================================
  // Core (right port: 56, 50) -> Microsoft Research (left port: 76, 50) - Clean Horizontal Stream
  {
    id: "core-msft",
    d: "M 56 50 C 66 50, 66 50, 76 50",
    colorType: "cyan",
    activeFor: ["std-2", "std-3", "opp-2"],
    dur: "2.5s",
  },
  // Distributed Systems (right port: 74, 32) -> Microsoft Research (left port: 76, 48)
  {
    id: "sk3-msft",
    d: "M 74 32 C 75 32, 75 48, 76 48",
    colorType: "cyan",
    activeFor: ["std-3", "opp-2"],
    dur: "2.4s",
  },

  // Core (right port: 56, 58) -> Google DeepMind (left port: 76, 80)
  {
    id: "core-deepmind",
    d: "M 56 58 C 66 58, 66 80, 76 80",
    colorType: "pink",
    activeFor: ["std-3", "opp-3"],
    dur: "2.3s",
  },
  // Core (right port: 56, 62) -> Machine Learning (left port: 59, 68)
  {
    id: "core-sk4",
    d: "M 56 62 C 57.5 62, 57.5 68, 59 68",
    colorType: "pink",
    activeFor: ["std-3", "opp-3"],
    dur: "2.5s",
  },
  // Machine Learning (right port: 74, 68) -> Google DeepMind (left port: 76, 78)
  {
    id: "sk4-deepmind",
    d: "M 74 68 C 75 68, 75 78, 76 78",
    colorType: "pink",
    activeFor: ["std-3", "opp-3"],
    dur: "2.2s",
  },
];

export const HeroMatchingNetwork: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("std-2");
  const [, setPulseTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const allNodes = [...CANDIDATES, ...LEFT_SKILLS, ...RIGHT_SKILLS, ...EMPLOYERS];
  const selectedNode = allNodes.find((n) => n.id === selectedNodeId) || CANDIDATES[1];

  return (
    <div className="relative w-full rounded-3xl bg-white/95 border border-[#DDD6FE] shadow-[0_12px_44px_rgba(91,75,255,0.08)] p-4 sm:p-6 lg:p-7 overflow-hidden">
      {/* Background Subtle Tech Grid & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#E6E0FF_1px,transparent_1px),linear-gradient(to_bottom,#E6E0FF_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#A78BFA]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#5B4BFF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Telemetry Bar (Clean & Professional, No Redundant Cluster Bar) */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#DDD6FE]/70">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-[#5B4BFF]/10 text-[#5B4BFF]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="absolute w-2 h-2 rounded-full bg-[#10B981]" />
          </div>
          <div>
            <span className="text-xs font-mono font-black text-[#0D0B2D] tracking-wider uppercase">
              ClearHire™ Neural Matching Engine
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E6E0FF] text-[#5B4BFF]">
              REAL-TIME VECTOR MATCHING
            </span>
          </div>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#77758F]">
          <span className="px-2 py-0.5 rounded-md bg-[#F7F8FF] border border-[#DDD6FE]">
            LATENCY: <strong className="text-[#0D0B2D]">18ms</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] font-bold">
            RURAL PARITY: <strong className="text-[#059669]">+10% BOOST</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F7F8FF] border border-[#DDD6FE]">
            ACCURACY: <strong className="text-[#5B4BFF]">99.4%</strong>
          </span>
        </div>
      </div>

      {/* 5-Column High-Tech Visualizer Canvas with Pixel-Exact Port-to-Port Connections */}
      <div className="relative z-10 w-full h-[390px] sm:h-[430px] mt-3 rounded-2xl bg-[#F7F8FF]/85 border border-[#DDD6FE]/80 overflow-hidden select-none">
        {/* SVG Bezier Connection Lines (viewBox 0 0 100 100 perfectly matches CSS % layout) */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        >
          <defs>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#5B4BFF" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ruralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#5B4BFF" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="inactiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Render All Geometric Network Paths */}
          {NETWORK_PATHS.map((p) => {
            const isActive = p.activeFor.includes(selectedNodeId);

            const strokeColor =
              !isActive
                ? "url(#inactiveGrad)"
                : p.colorType === "rural"
                ? "url(#ruralGrad)"
                : p.colorType === "cyan"
                ? "url(#cyanGrad)"
                : p.colorType === "pink"
                ? "url(#pinkGrad)"
                : "url(#purpleGrad)";

            const particleFill =
              p.colorType === "rural"
                ? "#10B981"
                : p.colorType === "cyan"
                ? "#06B6D4"
                : p.colorType === "pink"
                ? "#EC4899"
                : "#5B4BFF";

            return (
              <g key={p.id}>
                {/* Clean Path Stroke */}
                <path
                  d={p.d}
                  fill="none"
                  stroke={strokeColor}
                  vectorEffect="non-scaling-stroke"
                  strokeWidth={isActive ? (p.colorType === "rural" ? 3 : 2.5) : 1}
                  strokeDasharray={isActive ? "none" : "3,3"}
                  className="transition-all duration-300"
                />

                {/* Flow Packet Animated on Active Streams */}
                {isActive && (
                  <circle
                    r="1.2"
                    fill={particleFill}
                    className="filter drop-shadow-[0_0_6px_currentColor]"
                  >
                    <animateMotion path={p.d} dur={p.dur} repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* ============================================================ */}
        {/* COLUMN 1: CANDIDATES (Left 2% to 24%, Out Port at 24%)      */}
        {/* ============================================================ */}
        {CANDIDATES.map((cand, idx) => {
          const isSelected = selectedNodeId === cand.id;
          const topPercent = idx === 0 ? "20%" : idx === 1 ? "50%" : "80%";

          return (
            <div
              key={cand.id}
              onClick={() => setSelectedNodeId(cand.id)}
              style={{ left: "2%", width: "22%", top: topPercent, transform: "translateY(-50%)" }}
              className={`absolute z-20 cursor-pointer transition-all duration-200 select-none ${
                isSelected ? "scale-[1.02] z-30" : "hover:scale-[1.01] opacity-90 hover:opacity-100"
              }`}
            >
              <div
                className={`relative px-2.5 sm:px-3 py-2 rounded-2xl border shadow-sm transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-white border-[#5B4BFF] shadow-[0_6px_18px_rgba(91,75,255,0.18)] ring-2 ring-[#5B4BFF]/25"
                    : "bg-white/95 border-[#DDD6FE] hover:border-[#5B4BFF]"
                }`}
              >
                {/* Physical Output Port Socket (Exact X: 24%) */}
                <span className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#5B4BFF] border-2 border-white shadow-xs z-30" />

                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                    cand.id === "std-2" ? "bg-emerald-100 text-emerald-800" : "bg-[#E6E0FF] text-[#5B4BFF]"
                  }`}
                >
                  {cand.label[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-xs text-[#0D0B2D] truncate leading-tight">
                      {cand.label}
                    </span>
                    <ShieldCheck
                      className={`w-3.5 h-3.5 shrink-0 ${
                        cand.id === "std-2" ? "text-[#10B981]" : "text-[#5B4BFF]"
                      }`}
                    />
                  </div>
                  <span className="text-[9px] text-[#77758F] font-medium block truncate leading-tight mt-0.5">
                    {cand.sub}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* ============================================================ */}
        {/* COLUMN 2: CANDIDATE SKILLS (Left 28% to 43%, Ports: 28% & 43%) */}
        {/* ============================================================ */}
        {LEFT_SKILLS.map((sk, idx) => {
          const isSelected = selectedNodeId === "std-1" || selectedNodeId === "std-2";
          const topPercent = idx === 0 ? "32%" : "68%";

          return (
            <div
              key={sk.id}
              onClick={() => setSelectedNodeId(idx === 0 ? "std-2" : "std-3")}
              style={{ left: "28%", width: "15%", top: topPercent, transform: "translateY(-50%)" }}
              className="absolute z-20 cursor-pointer select-none"
            >
              <div
                className={`relative px-2 py-1.5 rounded-xl border text-[9.5px] font-bold font-mono transition-all flex items-center justify-center gap-1 shadow-2xs ${
                  isSelected
                    ? "bg-[#5B4BFF] text-white border-[#5B4BFF] shadow-xs"
                    : "bg-white/95 text-[#0D0B2D] border-[#DDD6FE] hover:bg-[#E6E0FF]"
                }`}
              >
                {/* Input Socket (Exact X: 28%) */}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B5CF6] border border-white" />
                {/* Output Socket (Exact X: 43%) */}
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B5CF6] border border-white" />

                <Zap className="w-2.5 h-2.5 shrink-0 text-amber-300" />
                <span className="truncate">{sk.label}</span>
              </div>
            </div>
          );
        })}

        {/* ============================================================ */}
        {/* COLUMN 3: CENTRAL AI MATCH CORE (Left 44% to 56%, Center 50) */}
        {/* ============================================================ */}
        <div
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          className="absolute z-30 flex flex-col items-center justify-center cursor-pointer group select-none"
          onClick={() => setSelectedNodeId("opp-1")}
        >
          {/* Animated Quantum Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-[#5B4BFF]/30 animate-spin-slow pointer-events-none" />
          <div className="absolute w-20 h-20 rounded-full border border-[#10B981]/40 border-dashed animate-reverse-spin pointer-events-none" />

          {/* Core Hub Frame with Hardware Sockets */}
          <div className="relative">
            {/* Left Input Sockets */}
            <span className="absolute -left-1.5 top-[25%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#5B4BFF] border-2 border-white shadow-xs z-40" />
            <span className="absolute -left-1.5 top-[50%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white shadow-xs z-40" />
            <span className="absolute -left-1.5 top-[75%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#EC4899] border-2 border-white shadow-xs z-40" />

            {/* Right Output Sockets */}
            <span className="absolute -right-1.5 top-[25%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white shadow-xs z-40" />
            <span className="absolute -right-1.5 top-[50%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#5B4BFF] border-2 border-white shadow-xs z-40" />
            <span className="absolute -right-1.5 top-[75%] -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#EC4899] border-2 border-white shadow-xs z-40" />

            {/* Central Glowing Orb */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D0B2D] via-[#5B4BFF] to-[#10B981] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(91,75,255,0.4)] group-hover:scale-105 transition-transform">
              <Cpu className="w-7 h-7 text-white animate-pulse" />
            </div>
          </div>

          <div className="mt-1.5 text-center bg-white/95 px-2.5 py-0.5 rounded-xl border border-[#DDD6FE] shadow-sm">
            <span className="text-[9.5px] font-black text-[#0D0B2D] tracking-tight block">
              AI MATCH CORE
            </span>
            <span className="text-[8.5px] font-mono text-[#5B4BFF] font-bold">ClearHire XAI</span>
          </div>
        </div>

        {/* Floating Telemetry Micro-Pills in the Open Channel (Never Collides with Cards) */}
        <div className="absolute left-[65%] top-[11%] -translate-x-1/2 -translate-y-1/2 z-20 px-2 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981]/50 text-[#047857] text-[8.5px] font-mono font-bold shadow-xs flex items-center gap-1 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span>⚡ Affirmative: +10% Boost</span>
        </div>
        <div className="absolute left-[65%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 px-2 py-0.5 rounded-full bg-[#F5F3FF] border border-[#5B4BFF]/40 text-[#4338CA] text-[8.5px] font-mono font-bold shadow-xs flex items-center gap-1 pointer-events-none">
          <span>◈ ClearHire: 97% Direct</span>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 4: TARGET SKILLS (Left 59% to 74%, Ports: 59% & 74%)   */}
        {/* ============================================================ */}
        {RIGHT_SKILLS.map((sk, idx) => {
          const isSelected = selectedNodeId === "std-1" || selectedNodeId === "std-2" || selectedNodeId === "opp-1";
          const topPercent = idx === 0 ? "32%" : "68%";

          return (
            <div
              key={sk.id}
              onClick={() => setSelectedNodeId(idx === 0 ? "opp-1" : "opp-3")}
              style={{ left: "59%", width: "15%", top: topPercent, transform: "translateY(-50%)" }}
              className="absolute z-20 cursor-pointer select-none"
            >
              <div
                className={`relative px-2 py-1.5 rounded-xl border text-[9.5px] font-bold font-mono transition-all flex items-center justify-center gap-1 shadow-2xs ${
                  isSelected
                    ? "bg-[#06B6D4] text-white border-[#06B6D4] shadow-xs"
                    : "bg-white/95 text-[#0D0B2D] border-[#DDD6FE] hover:bg-[#E6E0FF]"
                }`}
              >
                {/* Input Socket (Exact X: 59%) */}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#06B6D4] border border-white" />
                {/* Output Socket (Exact X: 74%) */}
                <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#06B6D4] border border-white" />

                <Zap className="w-2.5 h-2.5 shrink-0 text-white" />
                <span className="truncate">{sk.label}</span>
              </div>
            </div>
          );
        })}

        {/* ============================================================ */}
        {/* COLUMN 5: EMPLOYERS (Left 76% to 98%, In Port at 76%)        */}
        {/* ============================================================ */}
        {EMPLOYERS.map((emp, idx) => {
          const isSelected = selectedNodeId === emp.id || (selectedNodeId === "std-2" && emp.id === "opp-1");
          const topPercent = idx === 0 ? "20%" : idx === 1 ? "50%" : "80%";

          return (
            <div
              key={emp.id}
              onClick={() => setSelectedNodeId(emp.id)}
              style={{ left: "76%", width: "22%", top: topPercent, transform: "translateY(-50%)" }}
              className={`absolute z-20 cursor-pointer transition-all duration-200 select-none ${
                isSelected ? "scale-[1.02] z-30" : "hover:scale-[1.01] opacity-90 hover:opacity-100"
              }`}
            >
              <div
                className={`relative px-2.5 sm:px-3 py-2 rounded-2xl border shadow-sm transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-white border-[#10B981] shadow-[0_6px_18px_rgba(16,185,129,0.22)] ring-2 ring-[#10B981]/25"
                    : "bg-white/95 border-[#DDD6FE] hover:border-[#10B981]"
                }`}
              >
                {/* Physical Input Port Socket (Exact X: 76%) */}
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#10B981] border-2 border-white shadow-xs z-30" />

                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 text-white ${
                    emp.id === "opp-1" ? "bg-gradient-to-br from-[#059669] to-[#10B981]" : "bg-[#0D0B2D]"
                  }`}
                >
                  {emp.label[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-extrabold text-xs text-[#0D0B2D] truncate leading-tight">
                      {emp.label}
                    </span>
                    {emp.activeMatch && (
                      <span
                        className={`text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-md shrink-0 ${
                          emp.id === "opp-1" ? "bg-emerald-100 text-emerald-800" : "bg-[#E6E0FF] text-[#5B4BFF]"
                        }`}
                      >
                        {emp.activeMatch}%
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-[#77758F] font-medium block truncate leading-tight mt-0.5">
                    {emp.sub}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Explainability & Technical Diagnostics Bar (AI Match to RuralTech) */}
      <div className="relative z-10 mt-3 p-4 rounded-2xl bg-gradient-to-br from-[#F7F8FF] via-white to-[#EDE9FE]/40 border border-[#DDD6FE] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#5B4BFF] to-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-[#0D0B2D]">
                  ClearHire™ Real-Time Neural Explainability Diagnostics
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {selectedNode.activeMatch
                    ? `${selectedNode.activeMatch}% Match to ${selectedNode.type === "student" ? "RuralTech Labs" : selectedNode.label}`
                    : "Vector Active"}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E6E0FF] text-[#5B4BFF] border border-[#DDD6FE]">
                  AFFIRMATIVE EQUITY: +10% VERIFIED
                </span>
              </div>
              <p className="text-xs text-[#0D0B2D]/85 mt-1 leading-relaxed font-medium">
                {selectedNode.explanation ||
                  "ClearHire 5-Layer neural engine validates candidate repositories, Python & FastAPI endpoints, and grants a verified affirmative equity boost for Tier-3 rural scholars without pedigree bias."}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById("ai-matching-simulator");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-4 py-2 rounded-xl bg-[#5B4BFF] hover:bg-[#4B3BF0] text-white border border-[#5B4BFF] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm shrink-0 self-start sm:self-auto"
          >
            <span>Run Custom Simulation</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Technical Vector Pipelines Indicator Grid: AI Match -> RuralTech */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#DDD6FE]/70 text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-white border border-[#DDD6FE]/80 space-y-0.5">
            <div className="text-[9.5px] uppercase font-bold text-[#77758F] flex items-center gap-1">
              <Network className="w-3 h-3 text-[#5B4BFF]" />
              <span>1. Semantic Vector</span>
            </div>
            <div className="font-extrabold text-[#0D0B2D] flex items-center justify-between">
              <span>Cosine Sim: 0.974</span>
              <span className="text-emerald-600 text-[10px]">✓ 97% Match</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white border border-[#DDD6FE]/80 space-y-0.5">
            <div className="text-[9.5px] uppercase font-bold text-[#77758F] flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#8B5CF6]" />
              <span>2. Skill Taxonomy</span>
            </div>
            <div className="font-extrabold text-[#0D0B2D] flex items-center justify-between">
              <span>140+ Aliases</span>
              <span className="text-[#5B4BFF] text-[10px]">FastAPI / Py</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white border border-[#DDD6FE]/80 space-y-0.5">
            <div className="text-[9.5px] uppercase font-bold text-[#77758F] flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              <span>3. RuralTech Boost</span>
            </div>
            <div className="font-extrabold text-emerald-700 flex items-center justify-between">
              <span>+10% Affirmative</span>
              <span className="text-emerald-700 text-[10px]">Active</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-white border border-[#DDD6FE]/80 space-y-0.5">
            <div className="text-[9.5px] uppercase font-bold text-[#77758F] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>4. Proof-of-Work</span>
            </div>
            <div className="font-extrabold text-[#0D0B2D] flex items-center justify-between">
              <span>4/4 Repos Clean</span>
              <span className="text-emerald-600 text-[10px]">100% Merit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
