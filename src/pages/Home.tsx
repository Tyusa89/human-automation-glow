import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthProvider";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const glassStyles = "rounded-2xl border border-white/10 bg-white/5";
const buttonStyles = "rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10";

const AGENT_METRICS = {
  timeWeek: "This week",
  timeToday: "Today",
  snapshot: "Snapshot",
  queue: "Queue",
};

const AGENTS = [
  {
    title: "Strategy Agent",
    status: "Active",
    blurb: "Detects growth opportunities and suggests next actions.",
    metricLabel: AGENT_METRICS.timeWeek,
    metricValue: "2 opportunities",
    cta: "Open EcoNest Agent",
    to: "/agent",
  },
  {
    title: "Automation Agent",
    status: "Running",
    blurb: "Monitors workflows and keeps operations moving.",
    metricLabel: AGENT_METRICS.timeToday,
    metricValue: "3 workflows",
    cta: "Owner Dashboard",
    to: "/owner-dashboard",
  },
  {
    title: "Insight Agent",
    status: "Online",
    blurb: "Turns your numbers into clarity and focus.",
    metricLabel: AGENT_METRICS.snapshot,
    metricValue: "KPIs updated",
    cta: "Open Insights",
    to: "/dashboard",
  },
  {
    title: "Operations Agent",
    status: "Needs review",
    blurb: "Flags tasks, follow-ups, and business friction.",
    metricLabel: AGENT_METRICS.queue,
    metricValue: "1 item",
    cta: "Review Queue",
    to: "/dashboard",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute top-44 left-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
        {/* HERO */}
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              EcoNest Intelligence Hub
            </div>

            <h1 className="mt-5 text-3xl font-semibold tracking-tight md:text-5xl">
              AI Agents. Business Clarity. Total Control.
            </h1>

            <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
              EcoNest connects your data, workflows, and decisions into one calm
              command center—so you operate the business system, not the chaos.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/agent")}
                className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950 shadow-lg shadow-white/10 hover:opacity-95"
              >
                Open EcoNest Agent
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-100 hover:bg-white/10"
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-slate-300">AI AGENTS</div>
                    <div className="mt-1 text-lg font-semibold tracking-wide">
                      EcoNest Console
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-500/80" />
                    <span className="h-2 w-2 rounded-full bg-slate-500/80" />
                    <span className="h-2 w-2 rounded-full bg-slate-500/80" />
                  </div>
                </div>

                <div className={`mt-6 grid grid-cols-2 gap-3`}>
                  <MiniPanel label="KPI" value="Revenue ↑" />
                  <MiniPanel label="Signals" value="Stable" />
                  <MiniPanel label="Automation" value="Running" />
                  <MiniPanel label="Queue" value="1 item" />
                </div>

                <div className={`mt-5 ${glassStyles} p-4`}>
                  <div className="text-xs text-slate-300">
                    Agent Orchestration
                  </div>
                  <div className="mt-2 h-20 rounded-xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-emerald-500/10" />
                  <div className="mt-2 text-xs text-slate-400">
                    Calm intelligence layer (static visual)
                  </div>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -inset-6 rounded-[2rem] border border-cyan-500/10 blur-[1px]" />
          </div>
        </div>

        {/* AGENT PANELS */}
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Your Agents</h2>
              <p className="mt-1 text-sm text-slate-300">
                Modular panels. Clear signals. No clutter.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className={buttonStyles}
            >
              Customize Panels
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {AGENTS.map((a) => (
              <button
                key={a.title}
                onClick={() => navigate(a.to)}
                className={cn(
                  "group text-left rounded-3xl border border-white/10 bg-white/5 p-5",
                  "shadow-xl shadow-black/30 backdrop-blur",
                  "hover:bg-white/10 hover:border-white/20 transition"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-base font-semibold">{a.title}</div>
                    <div className="mt-1 text-sm text-slate-300">{a.blurb}</div>
                  </div>

                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs border",
                      a.status === "Needs review"
                        ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                        : "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                    )}
                  >
                    {a.status}
                  </span>
                </div>

                <div className={`mt-4 flex items-center justify-between ${glassStyles} px-4 py-3`}>
                  <div className="text-xs text-slate-300">{a.metricLabel}</div>
                  <div className="text-sm font-medium">{a.metricValue}</div>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-100">
                  {a.cta}
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER NOTE */}
        <div className={`mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300`}>
          Tip: Keep the home screen calm. The dashboard is for detail. Home is
          for direction.
        </div>
      </div>
    </div>
  );
}

function MiniPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${glassStyles} p-4`}>
      <div className="text-xs text-slate-300">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
