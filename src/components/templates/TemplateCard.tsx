import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Template } from '@/lib/templates';
import { normalizeId } from '@/lib/utils/ids';

export type Difficulty = "Easy" | "Medium" | "Advanced";

interface TemplateCardProps {
  template: Template;
}

const diffTone = {
  Easy:          "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30",
  Intermediate:  "bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/30",
  Advanced:      "bg-fuchsia-500/20 text-fuchsia-300 ring-1 ring-fuchsia-500/30",
} as const;

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const navigate = useNavigate();
  const bullets = template.bullets?.slice(0, 3) || [template.description || ''];
  const chips = template.technologies?.slice(0, 3) || [];

  const templateId = (template.id && template.id.length > 0) ? template.id : normalizeId(template.title);

  const openSetup = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.debug("Template button click", { id: template.id, title: template.title, computed: templateId });
    navigate(`/templates/${encodeURIComponent(templateId)}/setup`);
  };

  const openPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/templates/${encodeURIComponent(templateId)}/preview`);
  };
  
  return (
    <Card className="bg-zinc-900/60 border-zinc-800 hover:border-indigo-500/40 transition-all duration-300 rounded-2xl shadow-lg">
      <CardContent className="p-6 md:p-7">
        {/* Top row: category + difficulty pill */}
        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-800 text-zinc-300">{template.category}</Badge>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${diffTone[template.difficulty as keyof typeof diffTone] || diffTone.Easy}`}>
            {template.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
          {template.title}
        </h3>

        {/* Bullets */}
        <ul className="mt-4 space-y-2 text-zinc-300">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Chips */}
        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-2.5 py-1 text-xs rounded-full bg-zinc-800/80 text-zinc-300 ring-1 ring-zinc-700"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Footer: setup + actions */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-zinc-400">Setup: 20–30 min</span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={openPreview}
              className="text-zinc-300 border-zinc-700 hover:bg-zinc-800"
            >
              Preview
            </Button>
            <Button
              onClick={openSetup}
              className="bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              Use template <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};