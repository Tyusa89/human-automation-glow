import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { useState } from "react";

const suggestions = [
  {
    id: 1,
    title: "Set up automated follow-ups",
    description: "You have 3 clients who haven't heard from you in over a week. Want me to draft follow-up emails?",
    action: "Draft emails",
  },
  {
    id: 2,
    title: "Track this week's income",
    description: "You've received 2 payments but haven't logged them yet.",
    action: "Log income",
  },
];

export function AssistantSuggestions() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const visibleSuggestions = suggestions.filter(s => !dismissed.includes(s.id));
  
  if (visibleSuggestions.length === 0) return null;
  
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-[hsl(220,91%,18%)] to-[hsl(220,91%,12%)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-primary" />
          Suggestions for you
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleSuggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className="p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-medium text-white">{suggestion.title}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-white/10"
                  onClick={() => setDismissed([...dismissed, suggestion.id])}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-slate-400 mb-3">{suggestion.description}</p>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1 border-white/20 text-white hover:bg-white/10">
                {suggestion.action}
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
