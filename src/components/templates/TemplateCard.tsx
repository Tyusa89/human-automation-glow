import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Template } from '@/lib/templates';

export type Difficulty = "Easy" | "Medium" | "Advanced";

interface TemplateCardProps {
  template: Template;
}

const diffTone: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300",
  Medium: "bg-amber-100 text-amber-700 ring-1 ring-amber-300",
  Advanced: "bg-blue-100 text-blue-700 ring-1 ring-blue-300",
};

export const TemplateCard: React.FC<TemplateCardProps> = ({ template }) => {
  const bullets = template.features?.slice(0, 3) || [template.description];
  const chips = template.features?.slice(3) || [];
  
  return (
    <Card className="bg-white border-zinc-200 text-zinc-900 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6 md:p-7">
        {/* Top row: category + difficulty pill */}
        <div className="flex items-center gap-2">
          <Badge className="bg-zinc-100 text-zinc-700">{template.category}</Badge>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${diffTone[template.difficulty] || diffTone.Easy}`}>
            {template.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
          {template.name}
        </h3>

        {/* Bullets */}
        <ul className="mt-4 space-y-2 text-zinc-700">
          {bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-400" />
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
                className="px-2.5 py-1 text-xs rounded-full bg-zinc-100 text-zinc-700 ring-1 ring-zinc-300"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* Footer: setup + actions */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-zinc-500">Setup: 20–30 min</span>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Link to={`/templates/${template.id}`}>
                Preview <ChevronRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};