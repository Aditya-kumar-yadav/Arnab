"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Cpu, ArrowUpRight, Zap, Layers, Network, Activity } from "lucide-react";

interface NodeItem {
  id: string;
  type: "student" | "skill" | "company" | "opportunity";
  label: string;
  sub: string;
  badge?: string;
  x: number; // percentage
  y: number; // percentage
  color: string;
  activeMatch?: number;
  explanation?: string;
}

const NODES: NodeItem[] = [
  // Student nodes (Left column)
  {
    id: "std-1",
    type: "student",
    label: "Aarav Verma",
    sub: "BIT Mesra • B.Tech CSE",
    badge: "Verified Institutional",
    x: 12,
    y: 22,
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
    x: 10,
    y: 52,
    color: "#10B981",
    activeMatch: 96,
    explanation: "First-generation rural scholar affirmative equity boost applied (+10%). Direct Python & FastAPI microservices vector alignment with RuralTech Labs.",
  },
  {
    id: "std-3",
    type: "student",
    label: "Priya Sharma",
    sub: "IIT Delhi • Machine Learning",
    badge: "Verified Institutional",
    x: 12,
    y: 80,
    color: "#5B4BFF",
    activeMatch: 95,
    explanation: "PyTorch & Transformers direct vector alignment with Google DeepMind Research Lab.",
  },

  // Skills middle-left
  {
    id: "sk-1",
    type: "skill",
    label: "Python & FastAPI",
    sub: "Backend Vector",
    x: 32,
    y: 34,
    color: "#8B5CF6",
  },
  {
    id: "sk-2",
    type: "skill",
    label: "React & Next.js",
    sub: "Frontend Vector",
    x: 34,
    y: 68,
    color: "#8B5CF6",
  },

  // Skills middle-right
  {
    id: "sk-3",
    type: "skill",
    label: "Distributed Systems",
    sub: "Systems Vector",
    x: 66,
    y: 32,
    color: "#06B6D4",
  },
  {
    id: "sk-4",
    type: "skill",
    label: "Machine Learning",
    sub: "AI Vector",
    x: 68,
    y: 66,
    color: "#EC4899",
  },

  // Company / Opportunity nodes (Right column)
  {
    id: "opp-1",
    type: "opportunity",
    label: "RuralTech Labs",
    sub: "Impact Software Fellow",
    badge: "Verified Employer",
    x: 88,
    y: 20,
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
    x: 90,
    y: 50,
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
    x: 88,
    y: 82,
    color: "#5B4BFF",
    activeMatch: 95,
    explanation: "Direct match against natural language & embedding retrieval benchmarks.",
  },
];

interface Connection {
  from: string;
  to: string;
  strength: number;
  curveOffset?: number;
  color?: "default" | "rural" | "systems" | "ai";
  label?: string;
  activeFor?: string[];
}

const CONNECTIONS: Connection[] = [
  // 1. Students to skills
  { from: "std-1", to: "sk-1", strength: 0.92, activeFor: ["std-1", "opp-1"] },
  { from: "std-1", to: "sk-2", strength: 0.95, activeFor: ["std-1", "opp-1"] },
  { from: "std-2", to: "sk-1", strength: 0.94, activeFor: ["std-2", "opp-1", "opp-2"] },
  { from: "std-2", to: "center", strength: 0.98, curveOffset: -25, color: "rural", label: "Affirmative Rural Boost +10%", activeFor: ["std-2", "opp-1"] },
  { from: "std-3", to: "sk-4", strength: 0.98, activeFor: ["std-3", "opp-3"] },
  { from: "std-3", to: "sk-3", strength: 0.85, activeFor: ["std-3", "opp-2"] },

  // 2. Skills to AI Match Core (center)
  { from: "sk-1", to: "center", strength: 0.92, activeFor: ["std-1", "std-2", "opp-1"] },
  { from: "sk-2", to: "center", strength: 0.88, activeFor: ["std-1", "opp-1"] },
  { from: "sk-3", to: "center", strength: 0.91, activeFor: ["std-3", "opp-2"] },
  { from: "sk-4", to: "center", strength: 0.96, activeFor: ["std-3", "opp-3"] },

  // 3. AI MATCH CORE TO RURALTECH LABS (Multi-Lane High-Tech Streams)
  // Lane 1: Primary ClearHire Neural Match Vector (97% Match)
  { from: "center", to: "opp-1", strength: 0.97, curveOffset: 0, color: "default", label: "97% ClearHire Primary Match", activeFor: ["std-1", "std-2", "opp-1"] },
  // Lane 2: RuralTech Affirmative Equity Stream (Arced upward in Glowing Emerald)
  { from: "center", to: "opp-1", strength: 0.96, curveOffset: -40, color: "rural", label: "Affirmative Equity Stream (Rural Parity)", activeFor: ["std-1", "std-2", "opp-1"] },
  // Lane 3: Code Quality & Proof-of-Work Verification Stream (Arced downward in Cyan/Indigo)
  { from: "center", to: "opp-1", strength: 0.93, curveOffset: 40, color: "systems", label: "Verified Code & Proof-of-Work Vector", activeFor: ["std-1", "std-2", "opp-1"] },
  // Lane 4: Direct Skill Bridge from Python & FastAPI to RuralTech Labs
  { from: "sk-1", to: "opp-1", strength: 0.92, curveOffset: -18, color: "rural", activeFor: ["std-1", "std-2", "opp-1"] },
  // Lane 5: Systems Architecture Pipeline to RuralTech Labs
  { from: "sk-3", to: "opp-1", strength: 0.89, curveOffset: 18, color: "systems", activeFor: ["std-1", "std-2", "opp-1"] },

  // 4. AI MATCH CORE TO ENTERPRISE PARTNERS
  { from: "center", to: "opp-2", strength: 0.93, curveOffset: 0, color: "systems", activeFor: ["std-3", "opp-2"] },
  { from: "sk-3", to: "opp-2", strength: 0.93, activeFor: ["std-3", "opp-2"] },
  { from: "center", to: "opp-3", strength: 0.95, curveOffset: 0, color: "ai", activeFor: ["std-3", "opp-3"] },
  { from: "sk-4", to: "opp-3", strength: 0.95, activeFor: ["std-3", "opp-3"] },
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

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[1];

  const getNodeCoord = (id: string) => {
    if (id === "center") return { x: 50, y: 50 };
    const n = NODES.find((node) => node.id === id);
    return n ? { x: n.x, y: n.y } : { x: 50, y: 50 };
  };

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

      {/* SVG Canvas and Interactive Nodes Visualization */}
      <div className="relative z-10 w-full h-[370px] sm:h-[410px] mt-3 rounded-2xl bg-[#F7F8FF]/85 border border-[#DDD6FE]/80 overflow-hidden select-none">
        {/* SVG Bezier Connection Lines */}
        <svg
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#5B4BFF" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ruralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#059669" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#5B4BFF" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="systemsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="aiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="inactiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Render Connections */}
          {CONNECTIONS.map((c, i) => {
            const fromCoord = getNodeCoord(c.from);
            const toCoord = getNodeCoord(c.to);

            const x1 = fromCoord.x * 10;
            const y1 = fromCoord.y * 4;
            const x2 = toCoord.x * 10;
            const y2 = toCoord.y * 4;

            const mx = (x1 + x2) / 2;
            const offset = (c.curveOffset || 0) * 1.5;

            const d = `M ${x1} ${y1} C ${mx} ${y1 + offset}, ${mx} ${y2 + offset}, ${x2} ${y2}`;

            const isActive = c.activeFor?.includes(selectedNodeId);

            const strokeGrad =
              c.color === "rural"
                ? "url(#ruralGrad)"
                : c.color === "systems"
                ? "url(#systemsGrad)"
                : c.color === "ai"
                ? "url(#aiGrad)"
                : "url(#activeGrad)";

            const particleColor =
              c.color === "rural"
                ? "#10B981"
                : c.color === "systems"
                ? "#06B6D4"
                : c.color === "ai"
                ? "#EC4899"
                : "#5B4BFF";

            return (
              <g key={i}>
                {/* Background Connection Path */}
                <path
                  d={d}
                  fill="none"
                  stroke={isActive ? strokeGrad : "url(#inactiveGrad)"}
                  strokeWidth={isActive ? (c.color === "rural" ? 3 : 2.5) : 1}
                  strokeDasharray={isActive ? "none" : "4,4"}
                  className="transition-all duration-500"
                />

                {/* Animated Glowing Flow Packets on Active Paths */}
                {isActive && (
                  <circle
                    r={c.color === "rural" ? "4.5" : "3.5"}
                    fill={particleColor}
                    className="filter drop-shadow-[0_0_8px_currentColor]"
                  >
                    <animateMotion
                      path={d}
                      dur={c.color === "rural" ? "2.2s" : c.color === "systems" ? "2.8s" : "2.5s"}
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Professional Technical Telemetry Flow Badges on the AI to RuralTech Lines */}
          <g className="transition-opacity duration-300">
            {/* RuralTech Parity Stream Tag */}
            <rect
              x="620"
              y="68"
              width="180"
              height="20"
              rx="6"
              fill="#ECFDF5"
              fillOpacity="0.9"
              stroke="#10B981"
              strokeWidth="0.8"
            />
            <text x="626" y="82" fill="#047857" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              ⚡ Affirmative Vector: +10% Boost
            </text>

            {/* Neural Primary Match Vector Tag */}
            <rect
              x="620"
              y="144"
              width="175"
              height="20"
              rx="6"
              fill="#F5F3FF"
              fillOpacity="0.9"
              stroke="#8B5CF6"
              strokeWidth="0.8"
            />
            <text x="626" y="158" fill="#5B4BFF" fontSize="8.5" fontFamily="monospace" fontWeight="bold">
              ◈ ClearHire Match: 97% Direct
            </text>
          </g>
        </svg>

        {/* Central AI Matching Core Node */}
        <div
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group"
          onClick={() => setSelectedNodeId("opp-1")}
        >
          {/* Animated Quantum Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-[#5B4BFF]/30 animate-spin-slow pointer-events-none" />
          <div className="absolute w-20 h-20 rounded-full border border-[#10B981]/40 border-dashed animate-reverse-spin pointer-events-none" />

          {/* Central Glowing Orb */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D0B2D] via-[#5B4BFF] to-[#10B981] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(91,75,255,0.4)] group-hover:scale-110 transition-transform">
            <Cpu className="w-7 h-7 text-white animate-pulse" />
          </div>

          <div className="mt-2 text-center bg-white/95 px-2.5 py-1 rounded-xl border border-[#DDD6FE] shadow-sm">
            <span className="text-[10px] font-black text-[#0D0B2D] tracking-tight block">
              AI MATCH CORE
            </span>
            <span className="text-[9px] font-mono text-[#5B4BFF] font-bold">ClearHire XAI</span>
          </div>
        </div>

        {/* Render Interactive Nodes (Students, Skills, Opportunities) */}
        {NODES.map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isOpp = node.type === "opportunity";
          const isStudent = node.type === "student";
          const isSkill = node.type === "skill";

          return (
            <div
              key={node.id}
              onClick={() => setSelectedNodeId(node.id)}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className={`absolute z-20 cursor-pointer transition-all duration-300 ${
                isSelected ? "scale-105 z-30" : "hover:scale-105 opacity-90 hover:opacity-100"
              }`}
            >
              {isStudent && (
                <div
                  className={`px-3 py-2 rounded-2xl border shadow-sm transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-white border-[#5B4BFF] shadow-[0_8px_20px_rgba(91,75,255,0.18)] ring-2 ring-[#5B4BFF]/20"
                      : "bg-white/95 border-[#DDD6FE] hover:border-[#5B4BFF]"
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-[#E6E0FF] text-[#5B4BFF] flex items-center justify-center font-black text-xs">
                    {node.label[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-[#0D0B2D] leading-none">
                        {node.label}
                      </span>
                      {node.badge && (
                        <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                      )}
                    </div>
                    <span className="text-[9.5px] text-[#77758F] font-medium block mt-0.5 leading-none">
                      {node.sub}
                    </span>
                  </div>
                </div>
              )}

              {isSkill && (
                <div
                  className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold font-mono transition-all flex items-center gap-1 ${
                    isSelected
                      ? "bg-[#5B4BFF] text-white border-[#5B4BFF] shadow-sm"
                      : "bg-white/90 text-[#0D0B2D] border-[#DDD6FE] hover:bg-[#E6E0FF]"
                  }`}
                >
                  <Zap className="w-2.5 h-2.5 text-[#5B4BFF]" />
                  <span>{node.label}</span>
                </div>
              )}

              {isOpp && (
                <div
                  className={`px-3 py-2 rounded-2xl border shadow-sm transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? "bg-white border-[#10B981] shadow-[0_8px_20px_rgba(16,185,129,0.2)] ring-2 ring-[#10B981]/25"
                      : "bg-white/95 border-[#DDD6FE] hover:border-[#10B981]"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                      node.id === "opp-1"
                        ? "bg-gradient-to-br from-[#059669] to-[#10B981]"
                        : "bg-[#0D0B2D]"
                    }`}
                  >
                    {node.label[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-[#0D0B2D] leading-none">
                        {node.label}
                      </span>
                      {node.activeMatch && (
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                            node.id === "opp-1"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-[#E6E0FF] text-[#5B4BFF]"
                          }`}
                        >
                          {node.activeMatch}% Match
                        </span>
                      )}
                    </div>
                    <span className="text-[9.5px] text-[#77758F] font-medium block mt-0.5 leading-none">
                      {node.sub}
                    </span>
                  </div>
                </div>
              )}
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
                  {selectedNode.activeMatch ? `${selectedNode.activeMatch}% Match to ${selectedNode.type === "student" ? "RuralTech Labs" : selectedNode.label}` : "Vector Active"}
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
