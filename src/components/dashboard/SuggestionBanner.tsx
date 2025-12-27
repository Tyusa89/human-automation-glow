import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, X, Check } from "lucide-react";
import type { DashboardSuggestion } from "@/hooks/useDashboardSuggestions";

interface SuggestionBannerProps {
  suggestion: DashboardSuggestion;
  onAccept: () => void;
  onDismiss: () => void;
}

export function SuggestionBanner({ suggestion, onAccept, onDismiss }: SuggestionBannerProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
            <Lightbulb className="h-5 w-5 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              EcoNest Suggestion
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {suggestion.payload.message}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              onClick={onAccept}
              className="gap-1"
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onDismiss}
              className="gap-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Not now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
