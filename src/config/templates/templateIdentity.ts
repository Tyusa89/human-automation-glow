export type TemplateCategory = "dashboards" | "ops" | "bots" | "ecommerce" | "other";

export type PrimaryActionId =
  | "view_analytics"
  | "run_sync"
  | "generate_report"
  | "run_automation"
  | "log_expense"
  | "test_booking"
  | "chat_demo"
  | "test_qualification"
  | "configure_integration"
  | "schedule_post"
  | "create_campaign"
  | "view_inventory"
  | "nothing";

export type RequiredPlan = "free" | "pro" | "business" | "enterprise";

/**
 * Get the upgrade button label for a given plan tier.
 */
export function getUpgradeLabel(plan: RequiredPlan): string {
  switch (plan) {
    case "pro":
      return "Upgrade to Pro";
    case "business":
      return "Upgrade to Business";
    case "enterprise":
      return "Contact Sales";
    default:
      return "Upgrade";
  }
}

/**
 * Check if a template is locked for a user based on their plan.
 */
export function isTemplateLocked(requiredPlan: RequiredPlan, userPlan: RequiredPlan): boolean {
  const rank: Record<RequiredPlan, number> = { free: 0, pro: 1, business: 2, enterprise: 3 };
  return rank[userPlan] < rank[requiredPlan];
}

export interface TemplateIdentity {
  slug: string;
  name: string;
  category: TemplateCategory;
  primaryJob: string;
  primaryAction: {
    id: PrimaryActionId;
    label: string;
    href?: string;
  };
  description?: string;
  requiredPlan?: RequiredPlan;
}

/**
 * Canonical map: keys MUST match edge function / DB slugs exactly.
 */
export const TEMPLATE_IDENTITIES = {
  // ═══════════════════════════════════════════════════════════════
  // DASHBOARDS
  // ═══════════════════════════════════════════════════════════════
  "analytics-dashboard": {
    slug: "analytics-dashboard",
    name: "Analytics Dashboard",
    category: "dashboards",
    primaryJob: "Understand your business at a glance",
    primaryAction: { id: "view_analytics", label: "View analytics" },
    description: "Real-time data visualization with custom KPIs and interactive charts.",
    requiredPlan: "business",
  },
  "data-sync-warehouse": {
    slug: "data-sync-warehouse",
    name: "Data Sync Warehouse",
    category: "dashboards",
    primaryJob: "Centralize data from all sources",
    primaryAction: { id: "run_sync", label: "Run sync" },
    description: "Enterprise-grade data warehouse synchronization with ETL pipelines.",
    requiredPlan: "business",
  },
  "report-generator": {
    slug: "report-generator",
    name: "Report Generator",
    category: "dashboards",
    primaryJob: "Generate polished reports in minutes",
    primaryAction: { id: "generate_report", label: "Generate a report" },
    description: "Template library, PDF generation, and data visualization.",
    requiredPlan: "pro",
  },

  // ═══════════════════════════════════════════════════════════════
  // OPS
  // ═══════════════════════════════════════════════════════════════
  "data-sync-tool": {
    slug: "data-sync-tool",
    name: "Data Sync Tool",
    category: "ops",
    primaryJob: "Keep your systems in sync automatically",
    primaryAction: { id: "run_sync", label: "Connect a source" },
    description: "Multi-platform sync with conflict resolution and scheduling.",
    requiredPlan: "pro",
  },
  "workflow-automation": {
    slug: "workflow-automation",
    name: "Workflow Automation",
    category: "ops",
    primaryJob: "Automate repetitive business tasks",
    primaryAction: { id: "run_automation", label: "Run an automation" },
    description: "Visual workflow builder with custom triggers and multi-step actions.",
    requiredPlan: "pro",
  },
  "expense-tracker": {
    slug: "expense-tracker",
    name: "Expense Tracker",
    category: "ops",
    primaryJob: "Track and categorize business expenses",
    primaryAction: { id: "log_expense", label: "Log an expense" },
    description: "Receipt scanning, expense categorization, and monthly reports.",
    requiredPlan: "free",
  },
  "data-doc-sync": {
    slug: "data-doc-sync",
    name: "Data + Docs Sync",
    category: "ops",
    primaryJob: "Keep docs in sync with your repo or database",
    primaryAction: { id: "run_sync", label: "Sync now" },
    description: "Automatic sync between docs and your codebase or database.",
    requiredPlan: "pro",
  },
  "inventory-manager": {
    slug: "inventory-manager",
    name: "Inventory Manager",
    category: "ops",
    primaryJob: "Track inventory and avoid stockouts",
    primaryAction: { id: "view_inventory", label: "View inventory" },
    description: "Stock tracking, low stock alerts, and supplier management.",
    requiredPlan: "free",
  },

  // ═══════════════════════════════════════════════════════════════
  // BOTS
  // ═══════════════════════════════════════════════════════════════
  "appointment-booker": {
    slug: "appointment-booker",
    name: "Appointment Booker",
    category: "bots",
    primaryJob: "Get clients booked automatically",
    primaryAction: { id: "test_booking", label: "Test a booking" },
    description: "Calendar integration with automated reminders and reschedule handling.",
    requiredPlan: "free",
  },
  "customer-support-widget": {
    slug: "customer-support-widget",
    name: "Customer Support Widget",
    category: "bots",
    primaryJob: "Answer customer questions instantly",
    primaryAction: { id: "chat_demo", label: "Try a demo chat" },
    description: "AI chat assistant with ticket management and real-time support.",
    requiredPlan: "pro",
  },
  "lead-qualification-bot": {
    slug: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    category: "bots",
    primaryJob: "Qualify leads so you focus on the best ones",
    primaryAction: { id: "test_qualification", label: "Test qualification" },
    description: "Conversational AI with lead scoring and CRM integration.",
    requiredPlan: "pro",
  },
  "customer-support-bot": {
    slug: "customer-support-bot",
    name: "Customer Support Bot",
    category: "bots",
    primaryJob: "Handle FAQs and escalate when needed",
    primaryAction: { id: "chat_demo", label: "Chat demo" },
    description: "FAQ handling, escalation, and transcript logging.",
    requiredPlan: "pro",
  },
  "agent-support-bot": {
    slug: "agent-support-bot",
    name: "Agent + Support Bot",
    category: "bots",
    primaryJob: "AI support with memory and seamless handoff",
    primaryAction: { id: "chat_demo", label: "Start a conversation" },
    description: "Production-ready support agent with context and human handoff.",
    requiredPlan: "business",
  },
  "bio-lead-qualifier": {
    slug: "bio-lead-qualifier",
    name: "Flow + Lead Qualifier",
    category: "bots",
    primaryJob: "Capture, score, and route leads automatically",
    primaryAction: { id: "test_qualification", label: "Test the flow" },
    description: "Conversational intake that scores intent and books meetings.",
    requiredPlan: "business",
  },

  // ═══════════════════════════════════════════════════════════════
  // ECOMMERCE
  // ═══════════════════════════════════════════════════════════════
  "social-media-scheduler": {
    slug: "social-media-scheduler",
    name: "Social Media Scheduler",
    category: "ecommerce",
    primaryJob: "Schedule posts across all platforms",
    primaryAction: { id: "schedule_post", label: "Schedule a post" },
    description: "Multi-platform posting with content calendar and analytics.",
    requiredPlan: "pro",
  },
  "email-campaign-builder": {
    slug: "email-campaign-builder",
    name: "Email Campaign Builder",
    category: "ecommerce",
    primaryJob: "Send personalized email campaigns",
    primaryAction: { id: "create_campaign", label: "Create a campaign" },
    description: "Drag & drop editor with A/B testing and segmentation.",
    requiredPlan: "pro",
  },

  // ═══════════════════════════════════════════════════════════════
  // OTHER
  // ═══════════════════════════════════════════════════════════════
  "zapier-intercom-integration": {
    slug: "zapier-intercom-integration",
    name: "Zapier x Intercom Integration",
    category: "other",
    primaryJob: "Connect Zapier and Intercom in minutes",
    primaryAction: { id: "configure_integration", label: "Configure integration" },
    description: "Example zaps and Intercom snippets for easy setup.",
    requiredPlan: "free",
  },
} as const satisfies Record<string, TemplateIdentity>;

export type TemplateSlug = keyof typeof TEMPLATE_IDENTITIES;

export function getTemplateIdentity(slug: string): TemplateIdentity | null {
  return (TEMPLATE_IDENTITIES as Record<string, TemplateIdentity>)[slug] ?? null;
}

export const CATEGORY_HERO_WIDGET: Record<TemplateCategory, string> = {
  dashboards: "analytics",
  ops: "automation",
  bots: "assistant",
  ecommerce: "campaigns",
  other: "integrations",
};
