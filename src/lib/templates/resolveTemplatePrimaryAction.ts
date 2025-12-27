import { getTemplateIdentity } from "@/config/templates/templateIdentity";
import type { NextStep } from "@/lib/maturity/resolveNextStep";

export function resolveTemplatePrimaryAction(activeTemplateSlug: string | null): NextStep | null {
  if (!activeTemplateSlug) return null;

  const t = getTemplateIdentity(activeTemplateSlug);
  if (!t) return null;

  const ctaLabel = t.primaryAction?.label?.trim();
  if (!ctaLabel) return null;

  const href = t.primaryAction?.href ?? fallbackHrefForSlug(activeTemplateSlug);

  return {
    kind: "nothing", // Don't expand maturity kinds - behavior comes from title/cta/href
    title: "Next step",
    description: t.primaryJob,
    ctaLabel,
    href,
    priority: 60, // Template intent priority
  };
}

function fallbackHrefForSlug(slug: string): string {
  switch (slug) {
    case "analytics-dashboard":
      return "/dashboard";
    case "data-sync-tool":
    case "data-sync-warehouse":
    case "data-doc-sync":
      return "/integrations";
    case "lead-qualification-bot":
    case "bio-lead-qualifier":
      return "/leads";
    case "appointment-booker":
      return "/appointments";
    case "workflow-automation":
      return "/automations";
    case "expense-tracker":
      return "/expenses";
    case "report-generator":
      return "/reports";
    case "customer-support-widget":
    case "customer-support-bot":
    case "agent-support-bot":
      return "/support";
    case "social-media-scheduler":
      return "/social";
    case "email-campaign-builder":
      return "/campaigns";
    case "inventory-manager":
      return "/inventory";
    case "zapier-intercom-integration":
      return "/integrations";
    default:
      return "/dashboard";
  }
}
