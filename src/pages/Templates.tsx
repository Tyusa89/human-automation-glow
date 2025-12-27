import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import { supabase } from "@/integrations/supabase/client";

import { Template, fallbackRegistry } from '@/lib/templates';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>(fallbackRegistry);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = templates.find(t => t.id === selectedId) ?? null;
  const [scaffoldMsg, setScaffoldMsg] = useState<string | null>(null);

  // Fetch from API using Supabase client
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase.functions.invoke('templates');
        
        if (error) throw error;
        
        if (data?.ok && Array.isArray(data.data)) {
          if (alive) setTemplates(data.data);
        } else {
          throw new Error("Malformed template payload");
        }
      } catch (e: any) {
        console.warn("Templates API unavailable, using fallback registry:", e?.message);
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
    
    navigate(`/templates/${templateId}/setup`);
  };


  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Templates</h1>
          <p className="text-white/70">Start faster with production‑ready blueprints.</p>
        </div>
        <Badge variant="secondary" className="text-sm bg-white/10 text-white border-white/10">
          <Sparkles className="mr-1 h-4 w-4" /> Ready to use
        </Badge>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search templates…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <select
              className={classNames(
                "w-full appearance-none rounded-md border border-white/10 bg-white/5 py-2 pl-9 pr-8 text-sm text-white",
                "focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              )}
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              <option value="All" className="bg-[hsl(220,91%,12%)]">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[hsl(220,91%,12%)]">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-white/70">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading templates…
        </div>
      )}

      {/* Grid */}
      <TemplatesGrid 
        templates={filtered} 
        onPreview={setSelectedId}
        onScaffoldMessage={setScaffoldMsg}
      />

      {scaffoldMsg && (
        <div className="flex items-center gap-2 text-sm text-white">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {scaffoldMsg}
        </div>
      )}

      {/* Custom Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50">
          <div className="w-[min(900px,92vw)] rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-white">{selected.title}</h2>
              <button onClick={() => setSelectedId(null)} className="text-xl text-white/70 hover:text-white">✕</button>
            </div>

            {/* Template Details */}
            <div className="mt-4 rounded-xl p-4 bg-black/20 border border-white/10">
              <p className="font-medium text-white">{selected.description}</p>
              {selected.bullets && selected.bullets.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {selected.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-white/80">
                      <span className="mt-2 text-emerald-400">•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button 
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
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
  );
}
