import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121212] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#121212] text-white flex items-center justify-center shadow-lg mb-6">
        <Compass className="w-8 h-8 text-white animate-spin-slow" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE7DC] text-[#121212] text-xs font-mono font-bold mb-4">
        HTTP 404 &bull; Page Routed
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-[#121212] tracking-tight">
        Redirecting to PATHFINDER AI
      </h1>
      <p className="text-sm text-[#736E65] max-w-md mt-2 mb-8 leading-relaxed">
        The requested pathway has been consolidated into the unified candidate and recruiter portal.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#121212] text-white text-sm font-bold shadow-md hover:bg-[#262626] transition-all"
      >
        <span>Enter Pathfinder Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

