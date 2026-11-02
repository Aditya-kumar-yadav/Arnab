"use client";

import React, { useState } from "react";
import { BadgeInfo } from "../lib/types";
import { CheckCircle2, Clock, ShieldCheck, Building2, UserCheck, Mail } from "lucide-react";

interface TrustBadgeProps {
  badge: BadgeInfo;
  size?: "sm" | "md" | "lg";
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ badge }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStyleClasses = (verified: boolean) => {
    if (!verified) {
      return "bg-[#F4EFE6] text-[#736E65] border-[#D9D2C7] hover:border-[#121212]";
    }
    return "bg-white text-[#121212] border-[#121212] shadow-sm";
  };

  const getIcon = () => {
    const name = badge.name.toLowerCase();
    if (!badge.verified) {
      return <Clock className="w-3.5 h-3.5 opacity-70 text-[#736E65]" />;
    }
    if (name.includes("email")) {
      return <Mail className="w-3.5 h-3.5 text-[#121212]" />;
    }
    if (name.includes("company")) {
      return <Building2 className="w-3.5 h-3.5 text-[#121212]" />;
    }
    if (name.includes("recruiter")) {
      return <UserCheck className="w-3.5 h-3.5 text-[#121212]" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-[#121212]" />;
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold cursor-help transition-all duration-200 ${getStyleClasses(
          badge.verified
        )}`}
      >
        {getIcon()}
        <span>{badge.name}</span>
        {badge.verified && <CheckCircle2 className="w-3 h-3 text-[#121212]" />}
      </div>

      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-[#CEBFAD] rounded-xl shadow-xl text-left pointer-events-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#121212] mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#121212]" />
            <span>{badge.name}</span>
            <span
              className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                badge.verified ? "bg-[#121212] text-white" : "bg-[#EDE7DC] text-[#736E65]"
              }`}
            >
              {badge.verified ? "VERIFIED" : "PENDING"}
            </span>
          </div>
          <p className="text-[11px] text-[#59554E] leading-relaxed">{badge.description}</p>
          <div className="mt-1.5 pt-1.5 border-t border-[#F4EFE6] text-[10px] text-[#8C877D] font-mono">
            Signed by PATHFINDER Verification Engine
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#CEBFAD]" />
        </div>
      )}
    </div>
  );
};
