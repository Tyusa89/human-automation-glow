import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Template } from "@/pages/Templates";

interface TemplatesGridProps {
  templates: Template[];
  onPreview: (templateId: string) => void;
  onScaffoldMessage: (message: string) => void;
}

export function TemplatesGrid({ templates, onPreview, onScaffoldMessage }: TemplatesGridProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUseTemplate = async (id: string) => {
    setLoadingId(id);
    onScaffoldMessage("");
    
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    try {
      if (template.actions?.behavior === "wizard" && template.actions.path) {
        // Navigate to setup with templateId
        const url = new URL(template.actions.path, window.location.origin);
        url.searchParams.set("templateId", template.id);
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
        onScaffoldMessage("Project created successfully. Redirecting…");
        // optional: redirect if API returns a route
        if (data.next) window.location.href = data.next;
      }
    } catch (e: any) {
      onScaffoldMessage(e?.message || "Scaffold failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((t) => (
        <motion.div key={t.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="template-card bg-zinc-900/60 border-zinc-800 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="relative h-40 w-full bg-muted">
              {t.hero ? (
                <img src={t.hero} alt={t.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-muted-foreground">No image</div>
              )}
              <div className="absolute left-2 top-2 flex gap-2">
                {t.badges?.map((b) => (
                  <Badge key={b} variant="secondary" className="backdrop-blur chip">
                    {b}
                  </Badge>
                ))}
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between gap-2 title">
                <span>{t.title}</span>
                <Badge variant="outline" className={`text-[10px] ${
                  t.difficulty === "Beginner" ? "pill-easy" : 
                  t.difficulty === "Intermediate" ? "pill-inter" : 
                  "pill-advanced"
                }`}>
                  {t.difficulty || ""}
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">{t.tagline}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Technology tags */}
              {t.technologies && t.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {t.technologies.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="text-xs bg-blue-500/20 text-blue-300 border-blue-500/30">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Setup time and buttons */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  {t.setupTime && `Setup: ${t.setupTime}`}
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onPreview(t.id)}
                    className="text-xs px-3 py-1 h-8 text-white bg-blue-900 border-blue-800 hover:bg-blue-800 hover:border-blue-700 hover:text-white"
                  >
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleUseTemplate(t.id); }} 
                    disabled={loadingId === t.id}
                    className="btn-primary text-xs px-3 py-1 h-8"
                  >
                    {loadingId === t.id ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" /> Working…
                      </>
                    ) : (
                      <>
                        <Play className="mr-1 h-3 w-3" /> Use template
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}