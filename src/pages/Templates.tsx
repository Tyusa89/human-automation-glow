import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, ArrowLeft, Play, CheckCircle2 } from "lucide-react";

type Level = "Beginner" | "Intermediate";
type Template = {
  id: string;
  title: string;
  description: string;
  level: Level;
  category: string; // e.g. "Dashboards", "Operations", ...
  active?: boolean;
};

const TEMPLATES: Template[] = [
  // Dashboards
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Visual dashboard showing key performance indicators. Connect your data sources to see real-time signals.",
    level: "Beginner",
    category: "Dashboards",
  },
  {
    id: "report-generator",
    title: "Report Generator",
    description: "Generate PDFs and summaries from your business data. Perfect for client updates and internal reviews.",
    level: "Beginner",
    category: "Dashboards",
  },

  // Operations
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    description: "Log expenses, categorize spending, and see where your money goes. Simple tracking for solopreneurs.",
    level: "Beginner",
    category: "Operations",
  },
  {
    id: "inventory-manager",
    title: "Inventory Manager",
    description: "Simple inventory tracking for physical products. Know what's running low before it's a problem.",
    level: "Beginner",
    category: "Operations",
  },
  {
    id: "social-scheduler",
    title: "Social Media Scheduler",
    description: "Queue up social media content for the week. Less scrambling, more consistency.",
    level: "Beginner",
    category: "Operations",
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    description: "Build multi-step workflows that run on triggers. Connect your tools and let automation do the work.",
    level: "Beginner",
    category: "Operations",
    active: true,
  },

  // Bots & Agents
  {
    id: "appointment-booker",
    title: "Appointment Booker",
    description: "Public booking page for your clients. Set availability, they pick a slot, everyone gets confirmations.",
    level: "Beginner",
    category: "Bots & Agents",
  },
  {
    id: "support-widget",
    title: "Customer Support Widget",
    description: "Embed an AI assistant on your site that answers customer questions using your knowledge base.",
    level: "Beginner",
    category: "Bots & Agents",
  },
  {
    id: "email-campaign",
    title: "Email Campaign Builder",
    description: "Build email sequences that nurture leads and keep customers engaged. Simple drag-and-drop builder.",
    level: "Beginner",
    category: "Bots & Agents",
  },
  {
    id: "agent-support-bot",
    title: "Agent Support Bot",
    description: "Helps your humans agents respond faster with suggested replies and knowledge lookups.",
    level: "Intermediate",
    category: "Bots & Agents",
  },
  {
    id: "bio-lead-qualifier",
    title: "Bio Lead Qualifier",
    description: "Enrich leads with public data and auto-score based on fit. Works with LinkedIn, websites, and more.",
    level: "Intermediate",
    category: "Bots & Agents",
  },
  {
    id: "customer-support-bot",
    title: "Customer Support Bot",
    description: "Train an AI on your FAQs and docs. It handles common questions so you can focus on the tricky ones.",
    level: "Intermediate",
    category: "Bots & Agents",
  },
  {
    id: "lead-qualification-bot",
    title: "Lead Qualification Bot",
    description: "AI that asks the right questions and scores leads before they hit your inbox. Focus on the hot ones.",
    level: "Intermediate",
    category: "Bots & Agents",
  },

  // Other
  {
    id: "data-sync-tool",
    title: "Data Sync Tool",
    description: "Connect your apps and keep data flowing. Sync contacts, leads, and orders across systems.",
    level: "Beginner",
    category: "Other",
  },
  {
    id: "zapier-intercom",
    title: "Zapier + Intercom Integration",
    description: "Bridge Intercom conversations with your Zapier automations. Auto-create tasks, update CRMs, and more.",
    level: "Beginner",
    category: "Other",
  },
  {
    id: "data-doc-sync",
    title: "Data Doc Sync",
    description: "Auto-update Google Docs, Notion pages, or Airtable bases when your data changes.",
    level: "Intermediate",
    category: "Other",
  },
  {
    id: "data-sync-warehouse",
    title: "Data Sync Warehouse",
    description: "Sync data across sources into a central warehouse. Query everything in one place.",
    level: "Intermediate",
    category: "Other",
  },
];

const LEVEL_STYLES: Record<Level, string> = {
  Beginner: "bg-emerald-500/15 text-emerald-200 border-emerald-500/20",
  Intermediate: "bg-amber-500/15 text-amber-200 border-amber-500/20",
};

export default function Templates() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>("All categories");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(TEMPLATES.map((t) => t.category)));
    return ["All categories", ...unique];
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const matchesQ =
        !query ||
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query);
      const matchesCat = category === "All categories" || t.category === category;
      return matchesQ && matchesCat;
    });
  }, [q, category]);

  const grouped = useMemo(() => {
    const map = new Map<string, Template[]>();
    for (const t of filtered) {
      map.set(t.category, [...(map.get(t.category) ?? []), t]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-5 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Templates</h1>
            <p className="mt-1 text-slate-300">
              Start faster with production-ready blueprints.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            Ready to use
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates..."
              className="w-full rounded-2xl border border-white/10 bg-slate-950/30 px-10 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-400/30 focus:ring-1 focus:ring-emerald-400/20"
            />
          </div>

          <div className="relative w-full md:w-[260px]">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-slate-950/30 px-10 py-3 text-slate-100 outline-none focus:border-emerald-400/30 focus:ring-1 focus:ring-emerald-400/20"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {grouped.map(([groupName, items]) => (
            <section key={groupName}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
                  <h2 className="text-lg font-semibold">{groupName}</h2>
                </div>
                <div className="text-xs text-slate-400">{items.length} templates</div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <div
                    key={t.id}
                    className={`
                      rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur
                      ${t.active ? "ring-1 ring-emerald-500/25" : ""}
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-white">{t.title}</div>
                        <div className="mt-1 text-sm text-slate-300">{t.description}</div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${LEVEL_STYLES[t.level]}`}
                        >
                          {t.level}
                        </span>

                        {t.active && (
                          <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-200">
                            ✓ Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => alert(`Preview: ${t.title}`)}
                        className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 hover:bg-white/10"
                      >
                        Preview
                      </button>

                      <button
                        onClick={() => alert(`Activate: ${t.title}`)}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/15 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-500/20"
                      >
                        <Play className="h-4 w-4" />
                        {t.active ? "Go to Dashboard" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-slate-300">
              No templates match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}