import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F8FF] text-[#0D0B2D] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#5B4BFF] to-[#A78BFA] text-white flex items-center justify-center shadow-lg shadow-[#5B4BFF]/25 mb-6">
        <Compass className="w-8 h-8 text-white" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6E0FF] text-[#5B4BFF] text-xs font-mono font-bold mb-4 border border-[#DDD6FE]">
        HTTP 404 &bull; Page Routed
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-[#0D0B2D] tracking-tight">
        Redirecting to PATHFINDER AI
      </h1>
      <p className="text-sm text-[#77758F] max-w-md mt-2 mb-8 leading-relaxed">
        The requested pathway has been consolidated into the unified candidate and recruiter portal.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#5B4BFF] hover:bg-[#4D3DF5] text-white text-sm font-bold shadow-md shadow-[#5B4BFF]/25 hover:-translate-y-0.5 transition-all"
      >
        <span>Enter Pathfinder Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
