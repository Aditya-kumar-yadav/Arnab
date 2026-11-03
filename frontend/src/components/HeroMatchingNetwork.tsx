"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Cpu, ArrowUpRight, CheckCircle2, Zap, Target } from "lucide-react";

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
    x: 10,
    y: 22,
    color: "#5B4BFF",
    activeMatch: 97,
    explanation: "4/4 verified skills match RuralTech Social Impact Fellowship. 0% college prestige penalty applied.",
  },
  {
    id: "std-2",
    type: "student",
    label: "Rahul Kumar",
    sub: "Tier-3 Rural Scholar • Python",
    badge: "Affirmative Boost +10%",
    x: 8,
    y: 52,
    color: "#16A36A",
    activeMatch: 94,
    explanation: "First-generation learner affirmative weight applied (+10%). Python & FastAPI match requirements.",
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
    color: "#A78BFA",
  },
  {
    id: "sk-2",
    type: "skill",
    label: "React & Next.js",
    sub: "Frontend Vector",
    x: 34,
    y: 68,
    color: "#A78BFA",
  },

  // Skills middle-right
  {
    id: "sk-3",
    type: "skill",
    label: "Distributed Systems",
    sub: "Systems Vector",
    x: 66,
    y: 32,
    color: "#A78BFA",
  },
  {
    id: "sk-4",
    type: "skill",
    label: "Machine Learning",
    sub: "AI Vector",
    x: 68,
    y: 66,
    color: "#A78BFA",
  },

  // Company / Opportunity nodes (Right column)
  {
    id: "opp-1",
    type: "opportunity",
    label: "RuralTech Labs",
    sub: "Impact Software Fellow",
    badge: "Verified Employer",
    x: 90,
    y: 20,
    color: "#5B4BFF",
    activeMatch: 97,
    explanation: "Blind Mode candidate review active. Skill-verified offer pipeline ready.",
  },
  {
    id: "opp-2",
    type: "opportunity",
    label: "Microsoft Research",
    sub: "Distributed Systems Intern",
    badge: "Enterprise Verified",
    x: 92,
    y: 50,
    color: "#0D0B2D",
    activeMatch: 93,
    explanation: "Multi-cluster synchronization & SQL competencies exceed threshold.",
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
  activeFor?: string[];
}

const CONNECTIONS: Connection[] = [
  // Student to skills
  { from: "std-1", to: "sk-1", strength: 0.9, activeFor: ["std-1", "opp-1"] },
  { from: "std-1", to: "sk-2", strength: 0.95, activeFor: ["std-1", "opp-1"] },
  { from: "std-2", to: "sk-1", strength: 0.92, activeFor: ["std-2", "opp-1", "opp-2"] },
  { from: "std-3", to: "sk-4", strength: 0.98, activeFor: ["std-3", "opp-3"] },
  { from: "std-3", to: "sk-3", strength: 0.85, activeFor: ["std-3", "opp-2"] },

  // Skills to center (center is x:50, y:50)
  { from: "sk-1", to: "center", strength: 0.9, activeFor: ["std-1", "std-2", "opp-1"] },
  { from: "sk-2", to: "center", strength: 0.85, activeFor: ["std-1", "opp-1"] },
  { from: "sk-3", to: "center", strength: 0.9, activeFor: ["std-3", "opp-2"] },
  { from: "sk-4", to: "center", strength: 0.95, activeFor: ["std-3", "opp-3"] },

  // Center to right skills
  { from: "center", to: "sk-3", strength: 0.9, activeFor: ["std-3", "opp-2"] },
  { from: "center", to: "sk-4", strength: 0.95, activeFor: ["std-3", "opp-3"] },
  { from: "center", to: "opp-1", strength: 0.97, activeFor: ["std-1", "std-2", "opp-1"] },
  { from: "sk-3", to: "opp-2", strength: 0.93, activeFor: ["std-3", "opp-2"] },
  { from: "sk-4", to: "opp-3", strength: 0.95, activeFor: ["std-3", "opp-3"] },
];

export const HeroMatchingNetwork: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>("std-1");
  const [pulseTick, setPulseTick] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const selectedNode = NODES.find((n) => n.id === selectedNodeId) || NODES[0];

  return (
    <div className="relative w-full rounded-3xl bg-white/95 border border-[#DDD6FE] shadow-[0_12px_44px_rgba(91,75,255,0.08)] p-4 sm:p-6 lg:p-7 overflow-hidden">
      {/* Background Subtle Tech Grid & Radial Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(to_right,#E6E0FF_1px,transparent_1px),linear-gradient(to_bottom,#E6E0FF_1px,transparent_1px)] bg-[size:28px_28px]" />
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#A78BFA]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#5B4BFF]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Telemetry Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DDD6FE]/70">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded-lg bg-[#5B4BFF]/10 text-[#5B4BFF]">
            <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-ping" />
            <span className="absolute w-2 h-2 rounded-full bg-[#16A36A]" />
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
            LATENCY: <strong className="text-[#0D0B2D]">28ms</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F7F8FF] border border-[#DDD6FE] hidden md:inline-block">
            BIAS NEUTRALIZATION: <strong className="text-[#16A36A]">ACTIVE</strong>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#F7F8FF] border border-[#DDD6FE]">
            ACCURACY: <strong className="text-[#5B4BFF]">99.4%</strong>
          </span>
        </div>
      </div>

      {/* Interactive Selection Filter Bar */}
      <div className="relative z-10 flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none">
        <span className="text-[11px] font-bold text-[#77758F] mr-1 shrink-0">Inspect Cluster:</span>
        {NODES.filter((n) => n.type === "student").map((std) => (
          <button
            key={std.id}
            onClick={() => setSelectedNodeId(std.id)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedNodeId === std.id
                ? "bg-[#5B4BFF] text-white shadow-md shadow-[#5B4BFF]/25 scale-[1.02]"
                : "bg-[#F7F8FF] hover:bg-[#E6E0FF] text-[#0D0B2D] border border-[#DDD6FE]"
            }`}
          >
            <span>{std.label}</span>
            <span
              className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedNodeId === std.id ? "bg-white/20 text-white" : "bg-[#E6E0FF] text-[#5B4BFF]"
              }`}
            >
              {std.activeMatch}%
            </span>
          </button>
        ))}
      </div>

      {/* SVG Canvas and Interactive Nodes Visualization */}
      <div className="relative z-10 w-full h-[360px] sm:h-[400px] mt-2 rounded-2xl bg-[#F7F8FF]/80 border border-[#DDD6FE]/80 overflow-hidden select-none">
        {/* SVG Bezier Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5B4BFF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#5B4BFF" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="inactiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Render Connections */}
          {CONNECTIONS.map((c, i) => {
            const fromNode = NODES.find((n) => n.id === c.from);
            const toNode =
              c.to === "center"
                ? { x: 50, y: 50 }
                : NODES.find((n) => n.id === c.to);

            if (!fromNode || !toNode) return null;

            const isActive = c.activeFor?.includes(selectedNodeId);

            // Calculate bezier control points for elegant curves
            const sx = `${fromNode.x}%`;
            const sy = `${fromNode.y}%`;
            const tx = `${toNode.x}%`;
            const ty = `${toNode.y}%`;
            const mx = `${(fromNode.x + toNode.x) / 2}%`;

            return (
              <g key={i}>
                {/* Background Line */}
                <path
                  d={`M ${fromNode.x * 4} ${fromNode.y * 3.6} C ${
                    ((fromNode.x + toNode.x) / 2) * 4
                  } ${fromNode.y * 3.6}, ${
                    ((fromNode.x + toNode.x) / 2) * 4
                  } ${toNode.y * 3.6}, ${toNode.x * 4} ${toNode.y * 3.6}`}
                  fill="none"
                  stroke={isActive ? "url(#activeGrad)" : "url(#inactiveGrad)"}
                  strokeWidth={isActive ? 2.5 : 1}
                  strokeDasharray={isActive ? "none" : "4,4"}
                  className="transition-all duration-500"
                />

                {/* Animated Flow Packet for Active Paths */}
                {isActive && (
                  <circle
                    r="3.5"
                    fill="#5B4BFF"
                    className="filter drop-shadow-[0_0_6px_#5B4BFF]"
                  >
                    <animateMotion
                      path={`M ${fromNode.x * 4} ${fromNode.y * 3.6} C ${
                        ((fromNode.x + toNode.x) / 2) * 4
                      } ${fromNode.y * 3.6}, ${
                        ((fromNode.x + toNode.x) / 2) * 4
                      } ${toNode.y * 3.6}, ${toNode.x * 4} ${toNode.y * 3.6}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            );
          })}
        </svg>

        {/* Central AI Matching Core Node */}
        <div
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group"
          onClick={() => setSelectedNodeId("std-1")}
        >
          {/* Animated Quantum Rings */}
          <div className="absolute w-28 h-28 rounded-full border border-[#5B4BFF]/30 animate-spin-slow pointer-events-none" />
          <div className="absolute w-20 h-20 rounded-full border border-[#A78BFA]/50 border-dashed animate-reverse-spin pointer-events-none" />

          {/* Central Glowing Orb */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D0B2D] via-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(91,75,255,0.4)] group-hover:scale-110 transition-transform">
            <Cpu className="w-7 h-7 text-white animate-pulse" />
          </div>

          <div className="mt-2 text-center bg-white/95 px-2.5 py-1 rounded-xl border border-[#DDD6FE] shadow-sm">
            <span className="text-[10px] font-black text-[#0D0B2D] tracking-tight block">
              AI MATCH CORE
            </span>
            <span className="text-[9px] font-mono text-[#5B4BFF] font-bold">ClearHire XAI</span>
          </div>
        </div>

        {/* Render Interactive Nodes */}
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
                        <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A] shrink-0" />
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
                      ? "bg-white border-[#5B4BFF] shadow-[0_8px_20px_rgba(91,75,255,0.18)] ring-2 ring-[#5B4BFF]/20"
                      : "bg-white/95 border-[#DDD6FE] hover:border-[#5B4BFF]"
                  }`}
                >
                  <div className="w-7 h-7 rounded-xl bg-[#0D0B2D] text-white flex items-center justify-center font-black text-xs">
                    {node.label[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-xs text-[#0D0B2D] leading-none">
                        {node.label}
                      </span>
                      {node.activeMatch && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[#E6E0FF] text-[#5B4BFF]">
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

      {/* Real-time Explainability Card at Bottom */}
      <div className="relative z-10 mt-3 p-3.5 rounded-2xl bg-[#E6E0FF]/40 border border-[#DDD6FE] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#5B4BFF] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#0D0B2D]">
                ClearHire Explainability Factor:
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white text-[#5B4BFF] border border-[#DDD6FE]">
                {selectedNode.activeMatch ? `${selectedNode.activeMatch}% Compatibility` : "Vector Synchronized"}
              </span>
            </div>
            <p className="text-xs text-[#0D0B2D]/85 mt-0.5 leading-relaxed font-medium">
              {selectedNode.explanation ||
                "Neural vector matches validated skills directly with employer technical criteria without prestige bias."}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            const el = document.getElementById("ai-matching-simulator");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#F7F8FF] text-[#0D0B2D] border border-[#DDD6FE] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <span>Run Custom Simulation</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-[#5B4BFF]" />
        </button>
      </div>
    </div>
  );
};

