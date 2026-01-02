import React from "react";
import { useNavigate } from "react-router-dom";

export function AgentHeader({ isOwner }: { isOwner: boolean }) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <div>
            <div className="text-sm font-semibold text-slate-100">
              EcoNest Agent
            </div>
            <div className="text-xs text-slate-300">
              Online • Calm intelligence layer
            </div>
          </div>
          <div className="ml-2 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-200">
            Client
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="rounded-2xl px-3 py-2 text-sm text-slate-300 hover:text-slate-100"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Dashboard
          </button>
          {isOwner && (
            <button
              onClick={() => navigate("/owner-dashboard")}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
            >
              Owner
            </button>
          )}
        </div>
      </div>
    </div>
  );
}