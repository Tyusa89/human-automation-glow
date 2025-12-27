import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { NextBestAction } from "@/dashboard/nextBestAction";

interface NextBestActionCardProps {
  action: NextBestAction;
  onDismiss: () => void;
}

export default function NextBestActionCard({ action, onDismiss }: NextBestActionCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent backdrop-blur">
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Next best action
        </p>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {action.title}
        </h3>
        {action.description && (
          <p className="text-sm text-muted-foreground mb-3">
            {action.description}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => navigate(action.to)}
          >
            {action.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            Not now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
