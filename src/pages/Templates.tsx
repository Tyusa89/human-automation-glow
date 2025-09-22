import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Sparkles, Eye, Play, CheckCircle2, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    templateId: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    tagline: "Filter, score, and route leads with an AI agent.",
    category: "Bots",
    difficulty: "Beginner",
    badges: ["New"],
    hero: "/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png",
    gallery: [
      "/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png",
      "/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png",
    ],
    description:
      "An inbound lead triage flow with forms, validations, scoring, and CRM-ready outputs.",
    features: [
      "Multi-step intake form",
      "AI scoring & notes",
      "CRM export hook",
      "Supabase + RLS defaults",
    ],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "inventory-manager",
    name: "Inventory Manager",
    tagline: "Track stock levels with alerts and simple analytics.",
    category: "Dashboards",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png",
    gallery: [
      "/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png",
      "/lovable-uploads/5fd0e2db-d0a1-4acb-b206-80402fcc72fd.png",
    ],
    description: "SKU CRUD, low-stock alerts, and sales trends.",
    features: ["CRUD pages", "Low-stock alerts", "CSV import/export"],
    actions: { behavior: "scaffold", api: "/api/scaffold" },
  },
  {
    templateId: "support-triage",
    name: "Support Triage",
    tagline: "Resolves FAQs with AI, routes edge cases to human agents.",
    category: "Bots",
    difficulty: "Intermediate",
    badges: ["Popular"],
    hero: "/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png",
    gallery: ["/lovable-uploads/22c32c18-97ea-4d61-b7cc-513f8c8daa5e.png"],
    description: "AI-powered support bot that handles common questions and escalates complex issues.",
    features: ["AI FAQ resolution", "Human handoff", "Helpdesk integration"],
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    templateId: "data-enrichment",
    name: "Data Enrichment",
    tagline: "Research agent enriches prospects from domain to CRM.",
    category: "Ops",
    difficulty: "Advanced",
    badges: ["New"],
    hero: "/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png",
    gallery: ["/lovable-uploads/8cea8862-2c9a-4eeb-b53a-eba08632ca5f.png"],
    description: "Automatically enrich lead data with company information and contact details.",
    features: ["Domain lookup", "CRM integration", "Automated research"],
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

  async function onUseTemplate(t: Template) {
    setScaffoldMsg(null);
    if (t.actions?.behavior === "wizard" && t.actions.path) {
      // Navigate to setup with templateId
      const url = new URL(t.actions.path, window.location.origin);
      url.searchParams.set("templateId", t.templateId);
      window.location.href = url.toString();
      return;
    }

    if (t.actions?.behavior === "scaffold" && t.actions.api) {
      try {
        setScaffolding(true);
        const res = await fetch(t.actions.api, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ templateId: t.templateId }),
        });
        const data = await res.json();
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || `Scaffold failed (${res.status})`);
        }
        setScaffoldMsg("Project scaffolded successfully. Redirecting…");
        // optional: redirect if API returns a route
        if (data.next) window.location.href = data.next;
      } catch (e: any) {
        setScaffoldMsg(e?.message || "Scaffold failed");
      } finally {
        setScaffolding(false);
      }
    }
  }

  return (
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
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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
                <Button size="sm" variant="outline" onClick={() => setPreview(t)}>
                  <Eye className="mr-1 h-4 w-4" /> Preview
                </Button>
                <Button size="sm" onClick={() => onUseTemplate(t)} disabled={scaffolding}>
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
                <Button onClick={() => onUseTemplate(preview)}>
                  <Play className="mr-1 h-4 w-4" /> Use this template
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}