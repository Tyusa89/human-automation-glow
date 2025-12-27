import { resolveNextStep, type NextStep } from "@/lib/maturity/resolveNextStep";
import { resolveTemplatePrimaryAction } from "@/lib/templates/resolveTemplatePrimaryAction";
import type { MaturitySignals } from "@/hooks/useUserMaturity";

export function resolveDashboardNextStep(
  signals: MaturitySignals,
  activeTemplateSlug: string | null
): NextStep {
  const maturity = resolveNextStep(signals);
  const template = resolveTemplatePrimaryAction(activeTemplateSlug);

  // Blockers = maturity wins (user genuinely not ready)
  const hasBlocker =
    maturity.kind === "fix_automation_errors" ||
    maturity.kind === "complete_profile" ||
    maturity.kind === "enable_appointments" ||
    maturity.kind === "add_first_template";

  if (hasBlocker) return maturity;

  // If template exists and user is operational, template wins
  if (template) return template;

  // Fallback to maturity
  return maturity;
}

/**
 * Determines if the setup checklist should be shown.
 * Hide checklist when Next Step is enough (template intent active).
 */
export function shouldShowChecklist(step: NextStep): boolean {
  return (
    step.kind === "complete_profile" ||
    step.kind === "enable_appointments" ||
    step.kind === "add_first_template"
  );
}
