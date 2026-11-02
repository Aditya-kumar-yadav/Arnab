"use client";

import React, { useState } from "react";
import { BadgeInfo } from "../lib/types";
import { CheckCircle2, AlertCircle, Clock, ShieldCheck, Building2, UserCheck, Mail } from "lucide-react";

interface TrustBadgeProps {
  badge: BadgeInfo;
  size?: "sm" | "md" | "lg";
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ badge, size = "md" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getColorClasses = (color: string, verified: boolean) => {
    if (!verified) {
      return "bg-zinc-800/80 text-zinc-400 border-zinc-700/80 hover:border-zinc-600";
    }
    switch (color) {
      case "emerald":
        return "bg-emerald-950/60 text-emerald-300 border-emerald-600/50 hover:border-emerald-500 shadow-sm shadow-emerald-900/20";
      case "indigo":
        return "bg-indigo-950/60 text-indigo-300 border-indigo-600/50 hover:border-indigo-500 shadow-sm shadow-indigo-900/20";
      case "blue":
        return "bg-blue-950/60 text-blue-300 border-blue-600/50 hover:border-blue-500 shadow-sm shadow-blue-900/20";
      case "purple":
        return "bg-purple-950/60 text-purple-300 border-purple-600/50 hover:border-purple-500 shadow-sm shadow-purple-900/20";
      case "amber":
        return "bg-amber-950/60 text-amber-300 border-amber-600/50 hover:border-amber-500 shadow-sm shadow-amber-900/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const getIcon = () => {
    const name = badge.name.toLowerCase();
    if (!badge.verified) {
      return <Clock className="w-3.5 h-3.5 opacity-70 animate-pulse text-amber-400" />;
    }
    if (name.includes("email")) {
      return <Mail className="w-3.5 h-3.5 text-emerald-400" />;
    }
    if (name.includes("company")) {
      return <Building2 className="w-3.5 h-3.5 text-blue-400" />;
    }
    if (name.includes("recruiter")) {
      return <UserCheck className="w-3.5 h-3.5 text-purple-400" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />;
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium cursor-help transition-all duration-200 ${getColorClasses(
          badge.color,
          badge.verified
        )}`}
      >
        {getIcon()}
        <span>{badge.name}</span>
        {badge.verified && <CheckCircle2 className="w-3 h-3 text-current opacity-80" />}
      </div>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-lg shadow-xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-100 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>{badge.name}</span>
            <span
              className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono ${
                badge.verified ? "bg-emerald-900/80 text-emerald-300" : "bg-amber-900/80 text-amber-300"
              }`}
            >
              {badge.verified ? "CONFIRMED" : "PENDING"}
            </span>
          </div>
          <p className="text-[11px] text-zinc-300 leading-relaxed">{badge.description}</p>
          <div className="mt-1.5 pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-400 font-mono">
            Cryptographically signed by PATHFINDER Verification Engine
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-800" />
        </div>
      )}
    </div>
  );
};
