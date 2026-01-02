import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-gray-700/30 flex items-center justify-center">
          <div className="text-3xl">🚀</div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-4">Coming Soon</h1>
        
        <p className="text-slate-300 mb-8">
          This feature is under development. We're building something amazing for you.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => navigate("/")}
            className="rounded-2xl bg-white text-slate-950 px-5 py-3 text-sm font-medium shadow-lg shadow-white/10 hover:opacity-95"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 hover:bg-white/10"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}