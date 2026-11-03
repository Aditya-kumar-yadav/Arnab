"use client";

import React, { useState } from "react";
import { BadgeInfo } from "../lib/types";
import { CheckCircle2, Clock, ShieldCheck, Building2, UserCheck, Mail, Sparkles } from "lucide-react";

interface TrustBadgeProps {
  badge: BadgeInfo;
  size?: "sm" | "md" | "lg";
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ badge }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStyleClasses = (verified: boolean) => {
    if (!verified) {
      return "bg-[#E6E0FF]/40 text-[#77758F] border-[#DDD6FE] hover:border-[#A78BFA]";
    }
    return "bg-white text-[#0D0B2D] border-[#DDD6FE] shadow-sm hover:border-[#5B4BFF] hover:shadow-[0_4px_16px_rgba(91,75,255,0.12)]";
  };

  const getIcon = () => {
    const name = badge.name.toLowerCase();
    if (!badge.verified) {
      return <Clock className="w-3.5 h-3.5 text-[#77758F]" />;
    }
    if (name.includes("email")) {
      return <Mail className="w-3.5 h-3.5 text-[#5B4BFF]" />;
    }
    if (name.includes("company")) {
      return <Building2 className="w-3.5 h-3.5 text-[#5B4BFF]" />;
    }
    if (name.includes("recruiter")) {
      return <UserCheck className="w-3.5 h-3.5 text-[#16A36A]" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-[#16A36A]" />;
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
        {badge.verified ? (
          <span className="w-1.5 h-1.5 rounded-full bg-[#16A36A]" />
        ) : (
          <span className="text-[10px] text-[#77758F] font-normal">(Pending)</span>
        )}
      </div>

      {showTooltip && (
        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-[#0D0B2D] text-white text-[11px] rounded-xl shadow-2xl pointer-events-none animate-in fade-in zoom-in-95 duration-150 border border-[#A78BFA]/30">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-[#E6E0FF]">
            {badge.verified ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16A36A]" />
                <span>Verified Authority</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Pending Verification</span>
              </>
            )}
          </div>
          <p className="text-gray-200 leading-relaxed font-normal">{badge.description}</p>
          <div className="mt-2 pt-1.5 border-t border-white/10 text-[9px] text-[#A78BFA] flex items-center justify-between font-mono">
            <span>Cryptographic Proof</span>
            <span className="text-white/60">SHA-256</span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0D0B2D]" />
        </div>
      )}
    </div>
  );
};
