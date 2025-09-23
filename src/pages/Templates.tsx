import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles, Eye, Play, CheckCircle2, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "../styles/templates.css";

// ---- Types ---------------------------------------------------------------
export type Template = {
  templateId: string; // must match backend registry
  name: string;
  tagline?: string;
  category: "Bots" | "Dashboards" | "E‑commerce" | "Ops" | "Auth" | "Other";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  badges?: string[]; // e.g., ["New", "Popular"]
  hero?: string; // img url
  gallery?: string[]; // more screenshots
  description?: string;
  features?: string[];
  actions?: {
    behavior: "wizard" | "scaffold"; // where the CTA should go
    path?: string; // e.g., "/setup"
    api?: string; // e.g., "/api/scaffold"
  };
};

// ---- Local fallback registry (keep in sync with server) -----------------
const fallbackRegistry: Template[] = [
  {
    templateId: "analytics-dashboard",
    name: "Analytics Dashboard",
    tagline: "Real-time business analytics with custom KPIs and tracking.",
    category: "Dashboards",
    difficulty: "Advanced",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png", "/assets/template-card-design.png"],
    description: "Real-time data visualization with custom KPIs, charting library, and interactive charts.",
    features: ["Real-time data", "Custom KPIs", "Interactive charts"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "data-sync-tool",
    name: "Data Sync Tool",
    tagline: "Synchronize data between multiple systems automatically.",
    category: "Ops",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Multi-platform sync, conflict resolution, and scheduled syncing for seamless data flow.",
    features: ["Multi-platform sync", "Conflict resolution", "Scheduled syncing"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "report-generator",
    name: "Report Generator",
    tagline: "Generate custom reports from your data sources.",
    category: "Dashboards",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Template library, PDF generation, and data visualization for comprehensive reporting.",
    features: ["Template library", "PDF generation", "Data visualization"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "workflow-automation",
    name: "Workflow Automation",
    tagline: "Automate business processes with custom triggers and actions.",
    category: "Ops",
    difficulty: "Advanced",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Visual workflow builder, custom triggers, and multi-step automation for streamlined operations.",
    features: ["Visual workflow builder", "Custom triggers", "Multi-step automation"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "expense-tracker",
    name: "Expense Tracker",
    tagline: "Track business expenses with receipt scanning and reporting.",
    category: "Ops",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Receipt scanning, expense categorization, and monthly reports for financial management.",
    features: ["Receipt scanning", "Expense categorization", "Monthly reports"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "appointment-booker",
    name: "Appointment Booker",
    tagline: "Book meetings, handle reschedules and reminders.",
    category: "Bots",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Calendar integration, automated reminders, and reschedule handling for seamless booking.",
    features: ["Calendar integration", "Automated reminders", "Reschedule handling"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "customer-support-widget",
    name: "Customer Support Widget",
    tagline: "AI-powered customer support with ticket escalation.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "AI chat assistant, ticket management, and real-time support for customer satisfaction.",
    features: ["AI chat assistant", "Ticket management", "Real-time support"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    tagline: "Qualifies leads through intelligent conversations and scoring.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Conversational AI, lead scoring, and CRM integration for effective lead qualification.",
    features: ["Conversational AI", "Lead scoring", "CRM integration"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "customer-support-bot",
    name: "Customer Support Bot",
    tagline: "AI-powered support agent for FAQs and escalation.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "FAQ handling, escalation, and transcript logging for comprehensive support.",
    features: ["FAQ handling", "Escalation", "Transcript logging"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "agent-support-bot",
    name: "Agent + Support Bot",
    tagline: "Customer-facing AI with memory, tools, and clean escalation.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Advanced"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Production-ready support agent with memory, context, and seamless human handoff.",
    features: ["Knowledge base (Notion/Docs)", "Slack", "Email"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "bio-lead-qualifier",
    name: "Bio + Lead Qualifier",
    tagline: "Capture, score, and route leads to the right members.",
    category: "Bots",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Conversational intake that scores intent and routes to appropriate team members or sends handoff.",
    features: ["CRM (HubSpot/Salesforce)", "Calendar", "Email"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "data-doc-sync",
    name: "Data + Doc Sync",
    tagline: "Keep your docs and answers in sync with a repo or DB.",
    category: "Ops",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Includes markdown/Notion and keeps embeddings fresh on a schedule. Ships with pruning + re-crawl policies.",
    features: ["Github/GitLab", "Postgres/Supabase"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "zapier-intercom-integration",
    name: "Integration - Zapier + Intercom vibe",
    tagline: "Preload actions for contact creation, text sync, and alerting.",
    category: "Other",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Ships with example zaps and Intercom snippets for easy integration setup.",
    features: ["Zapier", "Intercom"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "social-media-scheduler",
    name: "Social Media Scheduler",
    tagline: "Schedule and manage posts across multiple platforms.",
    category: "E‑commerce",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Multi-platform posting, content calendar, and analytics tracking for social media management.",
    features: ["Multi-platform posting", "Content calendar", "Analytics tracking"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "email-campaign-builder",
    name: "Email Campaign Builder",
    tagline: "Create and send personalized email campaigns with A/B testing.",
    category: "E‑commerce",
    difficulty: "Advanced",
    badges: ["Advanced"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Drag & drop editor, A/B testing, and segmentation for effective email marketing.",
    features: ["Drag & drop editor", "A/B testing", "Segmentation"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "inventory-manager",
    name: "Inventory Manager",
    tagline: "Track inventory levels with automated reorder alerts.",
    category: "Ops",
    difficulty: "Beginner",
    badges: ["Easy"],
    hero: "/assets/template-card-design.png",
    gallery: ["/assets/template-card-design.png"],
    description: "Stock tracking, low stock alerts, and supplier management for efficient inventory control.",
    features: ["Stock tracking", "Low stock alerts", "Supplier management"],
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
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const [preview, setPreview] = useState<Template | null>(null);
  const [scaffolding, setScaffolding] = useState(false);
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
      const hay = `${t.name} ${t.tagline} ${t.description} ${t.features?.join(" ")}`.toLowerCase();
      return inCat && hay.includes(needle);
    });
  }, [templates, q, cat]);

  const handleUseTemplate = async (id: string) => {
    setLoadingId(id);
    setScaffoldMsg(null);
    
    const template = templates.find(t => t.templateId === id);
    if (!template) return;
    
    try {
      if (template.actions?.behavior === "wizard" && template.actions.path) {
        // Navigate to setup with templateId
        const url = new URL(template.actions.path, window.location.origin);
        url.searchParams.set("templateId", template.templateId);
        window.location.href = url.toString();
        return;
      }

      if (template.actions?.behavior === "scaffold" && template.actions.api) {
        const res = await fetch("/api/templates/use", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: id }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || `Template usage failed (${res.status})`);
        }
        setScaffoldMsg("Project created successfully. Redirecting…");
        // optional: redirect if API returns a route
        if (data.next) window.location.href = data.next;
      }
    } catch (e: any) {
      setScaffoldMsg(e?.message || "Scaffold failed");
    } finally {
      setLoadingId(null);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <motion.div key={t.templateId} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="template-card bg-zinc-900/60 border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <div className="relative h-40 w-full bg-muted">
                {t.hero ? (
                  <img src={t.hero} alt={t.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full grid place-items-center text-muted-foreground">No image</div>
                )}
                <div className="absolute left-2 top-2 flex gap-2">
                  {t.badges?.map((b) => (
                    <Badge key={b} variant="secondary" className="backdrop-blur">
                      {b}
                    </Badge>
                  ))}
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span>{t.name}</span>
                  <Badge variant="outline" className="text-[10px]">
                    {t.difficulty || ""}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{t.tagline}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setPreview(t)}
                  className="text-white bg-blue-900 border-blue-800 hover:bg-blue-800 hover:border-blue-700 hover:text-white"
                >
                  <Eye className="mr-1 h-4 w-4" /> Preview
                </Button>
                <Button 
                  size="sm" 
                  onClick={(e) => { e.stopPropagation(); handleUseTemplate(t.templateId); }} 
                  disabled={scaffolding}
                  className="text-white bg-blue-900 border-blue-800 hover:bg-blue-800 hover:border-blue-700 hover:text-white"
                >
                  {scaffolding ? (
                    <>
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Working…
                    </>
                  ) : (
                    <>
                      <Play className="mr-1 h-4 w-4" /> Use template
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {scaffoldMsg && (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4" /> {scaffoldMsg}
        </div>
      )}

      {/* Preview Modal */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{preview?.name}</DialogTitle>
            <DialogDescription>{preview?.tagline}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {preview?.gallery?.map((src, i) => (
                <img key={i} src={src} alt={`Screenshot ${i + 1}`} className="rounded-md border w-full h-32 object-cover" />
              ))}
            </div>
            {preview?.description && <p className="text-sm text-muted-foreground">{preview.description}</p>}
            {preview?.features && preview.features.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {preview.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setPreview(null)}>
                <X className="mr-1 h-4 w-4" /> Close
              </Button>
              {preview && (
                <Button onClick={() => handleUseTemplate(preview.templateId)}>
                  <Play className="mr-1 h-4 w-4" /> Use this template
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
