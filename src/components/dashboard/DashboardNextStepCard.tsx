import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { resolveMaturityTier } from "@/lib/maturity/resolveMaturity";
import { resolveNextStep } from "@/lib/maturity/resolveNextStep";
import { useUserMaturity } from "@/hooks/useUserMaturity";

export function DashboardNextStepCard() {
  const { signals, loading } = useUserMaturity();

  if (loading || !signals) return null;

  const tier = resolveMaturityTier(signals);
  const step = resolveNextStep(signals);

  // Power users: hide entirely (keeps it Baseframe-clean)
  if (tier === "power" || step.kind === "nothing") return null;

  return (
    <Card className="border border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent backdrop-blur">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wide mb-0.5">
              Next step
            </p>
            <h3 className="text-base font-semibold text-primary-foreground">
              {step.title}
            </h3>
            <p className="text-sm text-primary-foreground/80">
              {step.description}
            </p>
          </div>

          {step.href && (
            <Button asChild size="sm" className="gap-1.5 flex-shrink-0">
              <Link to={step.href}>
                {step.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
