import React, { useEffect, useMemo, useState } from "react";
import { Search, Filter, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import "../styles/templates.css";

// ---- Types ---------------------------------------------------------------
export type Template = {
  id: string; // must match backend registry
  title: string;
  tagline?: string;
  category: "Bots" | "Dashboards" | "E‑commerce" | "Ops" | "Auth" | "Other";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  badges?: string[]; // e.g., ["New", "Popular"]
  hero?: string; // img url
  gallery?: string[]; // more screenshots
  description?: string;
  bullets?: string[];
  actions?: {
    behavior: "wizard" | "scaffold"; // where the CTA should go
    path?: string; // e.g., "/setup"
    api?: string; // e.g., "/api/scaffold"
  };
};

// ---- Local fallback registry (keep in sync with server) -----------------
const fallbackRegistry: Template[] = [
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    tagline: "Real-time business analytics with custom KPIs and tracking.",
    category: "Dashboards",
    difficulty: "Advanced",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png", "/assets/template-card-design.png"],
    description: "Real-time data visualization with custom KPIs, charting library, and interactive charts.",
    bullets: ["Real-time data", "Custom KPIs", "Interactive charts"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    id: "data-sync-tool",
    title: "Data Sync Tool",
    tagline: "Synchronize data between multiple systems automatically.",
    category: "Ops",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Multi-platform sync, conflict resolution, and scheduled syncing for seamless data flow.",
    bullets: ["Multi-platform sync", "Conflict resolution", "Scheduled syncing"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    id: "report-generator",
    title: "Report Generator",
    tagline: "Generate custom reports from your data sources.",
    category: "Dashboards",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Template library, PDF generation, and data visualization for comprehensive reporting.",
    bullets: ["Template library", "PDF generation", "Data visualization"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    tagline: "Automate business processes with custom triggers and actions.",
    category: "Ops",
    difficulty: "Advanced",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Visual workflow builder, custom triggers, and multi-step automation for streamlined operations.",
    bullets: ["Visual workflow builder", "Custom triggers", "Multi-step automation"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    id: "expense-tracker",
    title: "Expense Tracker",
    tagline: "Track business expenses with receipt scanning and reporting.",
    category: "Ops",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Receipt scanning, expense categorization, and monthly reports for financial management.",
    bullets: ["Receipt scanning", "Expense categorization", "Monthly reports"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    id: "appointment-booker",
    title: "Appointment Booker",
    tagline: "Book meetings, handle reschedules and reminders.",
    category: "Bots",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Calendar integration, automated reminders, and reschedule handling for seamless booking.",
    bullets: ["Calendar integration", "Automated reminders", "Reschedule handling"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "customer-support-widget",
    title: "Customer Support Widget",
    tagline: "AI-powered customer support with ticket escalation.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "AI chat assistant, ticket management, and real-time support for customer satisfaction.",
    bullets: ["AI chat assistant", "Ticket management", "Real-time support"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "lead-qualification-bot",
    title: "Lead Qualification Bot",
    tagline: "Qualifies leads through intelligent conversations and scoring.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Conversational AI, lead scoring, and CRM integration for effective lead qualification.",
    bullets: ["Conversational AI", "Lead scoring", "CRM integration"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "customer-support-bot",
    title: "Customer Support Bot",
    tagline: "AI-powered support agent for FAQs and escalation.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "FAQ handling, escalation, and transcript logging for comprehensive support.",
    bullets: ["FAQ handling", "Escalation", "Transcript logging"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "agent-support-bot",
    title: "Agent + Support Bot",
    tagline: "Customer-facing AI with memory, tools, and clean escalation.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Advanced"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Production-ready support agent with memory, context, and seamless human handoff.",
    bullets: ["Knowledge base (Notion/Docs)", "Slack", "Email"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "bio-lead-qualifier",
    title: "Bio + Lead Qualifier",
    tagline: "Capture, score, and route leads to the right members.",
    category: "Bots",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Conversational intake that scores intent and routes to appropriate team members or sends handoff.",
    bullets: ["CRM (HubSpot/Salesforce)", "Calendar", "Email"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "data-doc-sync",
    title: "Data + Doc Sync",
    tagline: "Keep your docs and answers in sync with a repo or DB.",
    category: "Ops",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Includes markdown/Notion and keeps embeddings fresh on a schedule. Ships with pruning + re-crawl policies.",
    bullets: ["Github/GitLab", "Postgres/Supabase"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "zapier-intercom-integration",
    title: "Integration - Zapier + Intercom vibe",
    tagline: "Preload actions for contact creation, text sync, and alerting.",
    category: "Other",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Ships with example zaps and Intercom snippets for easy integration setup.",
    bullets: ["Zapier", "Intercom"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "social-media-scheduler",
    title: "Social Media Scheduler",
    tagline: "Schedule and manage posts across multiple platforms.",
    category: "E‑commerce",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Multi-platform posting, content calendar, and analytics tracking for social media management.",
    bullets: ["Multi-platform posting", "Content calendar", "Analytics tracking"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    id: "email-campaign-builder",
    title: "Email Campaign Builder",
    tagline: "Create and send personalized email campaigns with A/B testing.",
    category: "E‑commerce",
    difficulty: "Advanced",
    badges: ["Advanced"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Drag & drop editor, A/B testing, and segmentation for effective email marketing.",
    bullets: ["Drag & drop editor", "A/B testing", "Segmentation"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    id: "inventory-manager",
    title: "Inventory Manager",
    tagline: "Track inventory levels with automated reorder alerts.",
    category: "Ops",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Stock tracking, low stock alerts, and supplier management for efficient inventory control.",
    bullets: ["Stock tracking", "Low stock alerts", "Supplier management"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
];

// ---- Helpers -------------------------------------------------------------
function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const categories: Array<Template["category"]> = [
  "Bots",
  "Dashboards",
  "E‑commerce",
  "Ops",
  "Auth",
  "Other",
];

// ---- Component -----------------------------------------------------------
export default function TemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>(fallbackRegistry);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = templates.find(t => t.id === selectedId) ?? null;
  const [scaffoldMsg, setScaffoldMsg] = useState<string | null>(null);

  // Fetch from API (parity with VSCode data source)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error(`Failed to load templates: ${res.status}`);
        const data = (await res.json()) as { ok: boolean; data: Template[] };
        if (data?.ok && Array.isArray(data.data)) {
          if (alive) setTemplates(data.data);
        } else {
          throw new Error("Malformed template payload");
        }
      } catch (e: any) {
        setError(e?.message || "Unable to load templates");
        // keep fallback registry
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return templates.filter((t) => {
      const inCat = cat === "All" || t.category === cat;
      if (!needle) return inCat;
      const hay = `${t.title} ${t.tagline} ${t.description} ${t.bullets?.join(" ")}`.toLowerCase();
      return inCat && hay.includes(needle);
    });
  }, [templates, q, cat]);

  const handleModalUseTemplate = async (templateId: string) => {
    setScaffoldMsg("");
    
    const template = templates.find(t => t.id === templateId);
    if (!template) return;
    
    try {
      if (template.actions?.behavior === "wizard" && template.actions.path) {
        const url = new URL(template.actions.path, window.location.origin);
        url.searchParams.set("templateId", template.id);
        window.location.href = url.toString();
        return;
      }

      if (template.actions?.behavior === "scaffold" && template.actions.api) {
        const res = await fetch("/api/templates/use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || `Template usage failed (${res.status})`);
        }
        setScaffoldMsg("Project created successfully. Redirecting…");
        if (data.next) window.location.href = data.next;
      }
    } catch (e: any) {
      setScaffoldMsg(e?.message || "Scaffold failed");
    }
  };


  return (
    <div className="templates-theme">
      <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground">Start faster with production‑ready blueprints.</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Sparkles className="mr-1 h-4 w-4" /> Ready to use
        </Badge>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search templates…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <select
              className={classNames(
                "w-full appearance-none rounded-md border bg-background py-2 pl-9 pr-8 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring"
              )}
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              <option value="All">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading templates…
        </div>
      )}
      {error && (
        <div className="text-sm text-amber-600">
          {error} — showing fallback registry
        </div>
      )}

      {/* Grid */}
      <TemplatesGrid 
        templates={filtered} 
        onPreview={setSelectedId}
        onScaffoldMessage={setScaffoldMsg}
      />

      {scaffoldMsg && (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4" /> {scaffoldMsg}
        </div>
      )}

      {/* Custom Modal */}
      {selected && (
        <div className="template-modal fixed inset-0 bg-black/60 grid place-items-center z-50">
          <div className="w-[min(900px,92vw)] rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <h2 className="modal-title text-2xl font-semibold">{selected.title}</h2>
              <button onClick={() => setSelectedId(null)} className="text-xl hover:opacity-70">✕</button>
            </div>

            {/* Template Details */}
            <div className="mt-4 rounded-xl p-4 bg-black/20 border border-white/10">
              <p className="font-medium">{selected.description}</p>
              {selected.bullets && selected.bullets.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {selected.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="dot mt-2">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                className="btn-primary px-4 py-2 rounded-lg"
                onClick={async () => {
                  await handleModalUseTemplate(selected.id);
                  setSelectedId(null);
                }}
              >
                Use this template
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
