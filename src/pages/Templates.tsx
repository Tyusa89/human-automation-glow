import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TemplatesGrid } from "@/components/templates/TemplatesGrid";
import { supabase } from "@/integrations/supabase/client";

import { Template, fallbackRegistry, getAllCategories, TemplateCategory } from '@/lib/templates';

const categories: TemplateCategory[] = getAllCategories();

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>(fallbackRegistry);

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = templates.find(t => t.id === selectedId) ?? null;
  const [scaffoldMsg, setScaffoldMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
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
    return () => { alive = false; };
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
    // Navigate to instant activation (not wizard)
    navigate(`/templates/${templateId}/activate`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white">Templates</h1>
          <p className="mt-2 text-white/70">Start faster with production-ready blueprints.</p>
        </div>
        <Badge className="rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm text-white/80">
          <Sparkles className="mr-1.5 h-4 w-4" /> Ready to use
        </Badge>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="col-span-2">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search templates..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pl-11 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>
        <div className="rounded-xl bg-white/5 border border-white/10">
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <select
              className="w-full appearance-none rounded-xl bg-transparent py-3 pl-11 pr-8 text-sm text-white focus:outline-none cursor-pointer"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              <option value="All" className="bg-[hsl(220,91%,12%)] text-white">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[hsl(220,91%,12%)] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-sm text-white/70 mb-6">
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
        <div className="flex items-center gap-2 text-sm text-white mt-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {scaffoldMsg}
        </div>
      )}

      {/* Preview Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-50">
          <div className="w-[min(900px,92vw)] rounded-2xl p-6 bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold text-white">{selected.title}</h2>
              <button onClick={() => setSelectedId(null)} className="text-xl text-white/70 hover:text-white transition-colors">✕</button>
            </div>

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
                className="inline-flex items-center rounded-xl bg-white/10 border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/15 transition-colors"
              >
                Close
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 transition-colors"
                onClick={async () => {
                  await handleModalUseTemplate(selected.id);
                  setSelectedId(null);
                }}
              >
                Activate this system
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
