import { getTemplateIdentity } from "@/config/templates/templateIdentity";

export type TemplateNextStep = {
  title: string;
  description?: string;
  ctaLabel: string;
  href: string;
  source: "template";
};

export function resolveTemplatePrimaryAction(activeTemplateSlug: string | null): TemplateNextStep | null {
  if (!activeTemplateSlug) return null;

  const t = getTemplateIdentity(activeTemplateSlug);
  if (!t?.primaryAction?.label) return null;

  // If templateIdentity has an href, use it. Otherwise, provide fallback.
  const href = t.primaryAction.href ?? fallbackHrefForSlug(activeTemplateSlug);

  return {
    title: t.primaryJob,
    description: t.description ?? "Recommended next action based on the system you activated.",
    ctaLabel: t.primaryAction.label,
    href,
    source: "template",
  };
}

function fallbackHrefForSlug(slug: string): string {
  // Conservative defaults by category/slug
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
