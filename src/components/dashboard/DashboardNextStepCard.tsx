import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { resolveMaturityTier } from "@/lib/maturity/resolveMaturity";
import { resolveNextStep } from "@/lib/maturity/resolveNextStep";
import { useUserMaturity } from "@/hooks/useUserMaturity";
import { resolveTemplatePrimaryAction, type TemplateNextStep } from "@/lib/templates/resolveTemplatePrimaryAction";

type Props = {
  activeTemplateSlug?: string | null;
};

export function DashboardNextStepCard({ activeTemplateSlug }: Props = {}) {
  const { signals, loading } = useUserMaturity();

  if (loading || !signals) return null;

  const tier = resolveMaturityTier(signals);
  const maturityStep = resolveNextStep(signals);
  const templateNext = resolveTemplatePrimaryAction(activeTemplateSlug ?? null);

  // Determine which step to show:
  // - If user is NOT activated yet (profile incomplete / no first value), maturity wins
  // - Otherwise, show the template next step (it's more specific)
  const shouldUseTemplateNext =
    !!templateNext &&
    signals.profileCompleted &&
    (signals.hasFirstValueEvent || (signals.activeTemplatesCount ?? 0) > 0);

  const step = shouldUseTemplateNext
    ? templateNext
    : maturityStep;

  // Power users: hide entirely (keeps it Baseframe-clean)
  if (tier === "power" || maturityStep.kind === "nothing" && !shouldUseTemplateNext) return null;

  const isTemplateStep = shouldUseTemplateNext && templateNext;

  return (
    <Card className={`border ${isTemplateStep ? 'border-accent/40 bg-gradient-to-r from-accent/15 via-accent/5 to-transparent' : 'border-primary/30 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent'} backdrop-blur`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wide mb-0.5 flex items-center gap-1.5">
              {isTemplateStep && <Sparkles className="h-3 w-3" />}
              {isTemplateStep ? "Template action" : "Next step"}
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
