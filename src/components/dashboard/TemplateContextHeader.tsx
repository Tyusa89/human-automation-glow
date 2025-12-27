import { Link } from "react-router-dom";
import { ArrowRight, AlertCircle, Repeat } from "lucide-react";
import { getTemplateIdentity, type TemplateIdentity } from "@/config/templates/templateIdentity";
import { resolveNextStep, type NextStepKind } from "@/lib/maturity/resolveNextStep";
import { useUserMaturity } from "@/hooks/useUserMaturity";
import { Button } from "@/components/ui/button";

type Props = {
  activeTemplateSlug?: string | null;
};

// Map NextStepKind → blocker info for the template context panel
function getBlocker(kind: NextStepKind): { reason: string; ctaLabel: string; href: string } | null {
  switch (kind) {
    case "complete_profile":
      return {
        reason: "Complete your profile to unlock this action.",
        ctaLabel: "Finish setup",
        href: "/create-profile",
      };
    case "add_first_template":
      return {
        reason: "Activate a template to get started.",
        ctaLabel: "Browse templates",
        href: "/templates",
      };
    case "enable_appointments":
      return {
        reason: "Enable appointments to use this feature.",
        ctaLabel: "Enable appointments",
        href: "/appointments/settings",
      };
    case "fix_automation_errors":
      return {
        reason: "Fix automation errors before running workflows.",
        ctaLabel: "View errors",
        href: "/automations/runs",
      };
    case "run_first_automation":
      return {
        reason: "Run your first automation to unlock results.",
        ctaLabel: "Run automation",
        href: "/automations",
      };
    default:
      return null;
  }
}

// Get secondary actions based on template category
function getSecondaryActions(template: TemplateIdentity): { label: string; href: string }[] {
  switch (template.category) {
    case "dashboards":
      return [
        { label: "Configure KPIs", href: "/dashboard/settings" },
      ];
    case "ops":
      return [
        { label: "View integrations", href: "/integrations" },
      ];
    case "bots":
      return [
        { label: "View events", href: "/automations/runs" },
      ];
    case "ecommerce":
      return [
        { label: "Manage inventory", href: "/inventory" },
      ];
    default:
      return [];
  }
}

export default function TemplateContextHeader({ activeTemplateSlug }: Props) {
  const { signals } = useUserMaturity();

  if (!activeTemplateSlug) return null;

  const template = getTemplateIdentity(activeTemplateSlug);
  if (!template) return null;

  // Check if user has a blocker
  const nextStep = resolveNextStep(signals);
  const blocker = getBlocker(nextStep.kind);
  const isBlocked = !!blocker;

  const secondaryActions = getSecondaryActions(template);

  return (
    <div className="rounded-xl border border-primary/20 bg-slate-900/50 backdrop-blur p-5">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Template info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">
              Active
            </span>
            <h2 className="text-base font-semibold text-white truncate">
              {template.name}
            </h2>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {template.primaryJob}
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          {/* Secondary actions */}
          {secondaryActions.length > 0 && !isBlocked && (
            <div className="hidden sm:flex items-center gap-2">
              {secondaryActions.map((action) => (
                <Button
                  key={action.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-slate-400 hover:text-white"
                >
                  <Link to={action.href}>{action.label}</Link>
                </Button>
              ))}
            </div>
          )}

          {/* Primary action or blocker */}
          {isBlocked ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled
                className="opacity-50 cursor-not-allowed gap-2"
              >
                {template.primaryAction?.label || "Get started"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="default"
                size="sm"
                asChild
                className="gap-2"
              >
                <Link to={blocker.href}>
                  <AlertCircle className="h-3.5 w-3.5" />
                  {blocker.ctaLabel}
                </Link>
              </Button>
            </div>
          ) : template.primaryAction?.href ? (
            <Button
              variant="default"
              size="sm"
              asChild
              className="gap-2"
            >
              <Link to={template.primaryAction.href}>
                {template.primaryAction.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          ) : null}

          {/* Change template link */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-slate-500 hover:text-white gap-1.5"
          >
            <Link to="/templates">
              <Repeat className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Change</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Blocker reason caption */}
      {isBlocked && (
        <p className="mt-3 text-xs text-amber-400/80 flex items-center gap-1.5">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {blocker.reason}
        </p>
      )}
    </div>
  );
}
