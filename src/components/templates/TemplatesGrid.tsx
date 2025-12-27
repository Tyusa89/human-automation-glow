import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Play, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Template } from '@/lib/templates';

interface TemplatesGridProps {
  templates: Template[];
  onPreview: (templateId: string) => void;
  onScaffoldMessage: (message: string) => void;
}

export function TemplatesGrid({ templates, onPreview, onScaffoldMessage }: TemplatesGridProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((t) => (
        <motion.div key={t.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur hover:bg-white/[0.07] transition-all duration-300 hover:scale-[1.02]">
            {/* Header with badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex gap-2">
                {t.badges?.map((b, index) => (
                  <span 
                    key={`${t.id}-${b}-${index}`} 
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-white/80"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                t.difficulty === "Beginner" 
                  ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/30" 
                  : t.difficulty === "Intermediate" 
                  ? "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/30" 
                  : "bg-sky-500/20 text-sky-300 ring-1 ring-sky-500/30"
              }`}>
                {t.difficulty || ""}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
            
            {/* Description */}
            <p className="text-sm text-white/70 line-clamp-2 mb-4">{t.tagline}</p>

            {/* Technology tags */}
            {t.technologies && t.technologies.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {t.technologies.map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/70 ring-1 ring-white/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
            
            {/* Footer */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <span className="text-xs text-white/50">
                {t.setupTime && `Setup: ${t.setupTime}`}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => onPreview(t.id)}
                  className="inline-flex items-center rounded-xl bg-white/10 border border-white/10 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 transition-colors"
                >
                  Preview
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/templates/${encodeURIComponent(t.id)}/setup`); }} 
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-400 transition-colors"
                >
                  <Play className="h-3 w-3" /> Use template
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
