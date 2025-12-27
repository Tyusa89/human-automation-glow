export type TemplateCategory = "dashboards" | "ops" | "bots" | "ecommerce" | "other";
export type PlanTier = "free" | "pro" | "business";

export type TemplateSlug =
  | "analytics-dashboard"
  | "data-sync-warehouse"
  | "report-generator"
  | "data-sync-tool"
  | "workflow-automation"
  | "expense-tracker"
  | "data-doc-sync"
  | "inventory-manager"
  | "appointment-booker"
  | "customer-support-widget"
  | "lead-qualification-bot"
  | "customer-support-bot"
  | "agent-support-bot"
  | "bio-lead-qualifier"
  | "social-media-scheduler"
  | "email-campaign-builder"
  | "zapier-intercom-integration";

export type PrimaryActionId =
  | "view_analytics"
  | "connect_warehouse"
  | "generate_report"
  | "connect_data_source"
  | "run_automation"
  | "add_expense"
  | "connect_docs"
  | "view_inventory"
  | "test_booking"
  | "embed_widget"
  | "test_lead_qualification"
  | "view_support_inbox"
  | "open_agent_console"
  | "run_flow"
  | "create_post_schedule"
  | "create_email_campaign"
  | "open_integration";

export interface TemplateIdentity {
  slug: TemplateSlug;
  name: string;
  category: TemplateCategory;
  requiredPlan: PlanTier;

  // the one-liner meaning
  primaryJob: string;

  // first value action
  primaryAction: {
    id: PrimaryActionId;
    label: string;
    href?: string; // optional, can be wired later
  };

  // optional for cards/subtext
  description?: string;
}

export const TEMPLATE_IDENTITIES: Record<TemplateSlug, TemplateIdentity> = {
  // DASHBOARDS (Business/Pro)
  "analytics-dashboard": {
    slug: "analytics-dashboard",
    name: "Analytics Dashboard",
    category: "dashboards",
    requiredPlan: "business",
    primaryJob: "Understand revenue trends and performance",
    primaryAction: { id: "view_analytics", label: "View analytics", href: "/dashboard" },
    description: "Real-time business analytics with custom KPIs and tracking.",
  },
  "data-sync-warehouse": {
    slug: "data-sync-warehouse",
    name: "Data Sync Warehouse",
    category: "dashboards",
    requiredPlan: "business",
    primaryJob: "Sync data to your warehouse with automated ETL pipelines",
    primaryAction: { id: "connect_warehouse", label: "Connect warehouse", href: "/settings/integrations" },
    description: "Enterprise-grade pipelines for warehouse sync and monitoring.",
  },
  "report-generator": {
    slug: "report-generator",
    name: "Report Generator",
    category: "dashboards",
    requiredPlan: "pro",
    primaryJob: "Generate clean business reports from your data",
    primaryAction: { id: "generate_report", label: "Generate a report", href: "/reports" },
    description: "Create shareable reports with summaries and key metrics.",
  },

  // OPS (Free/Pro)
  "data-sync-tool": {
    slug: "data-sync-tool",
    name: "Data Sync Tool",
    category: "ops",
    requiredPlan: "pro",
    primaryJob: "Synchronize data between multiple systems automatically",
    primaryAction: { id: "connect_data_source", label: "Connect a data source", href: "/settings/integrations" },
    description: "Keep your tools aligned without manual exports.",
  },
  "workflow-automation": {
    slug: "workflow-automation",
    name: "Workflow Automation",
    category: "ops",
    requiredPlan: "pro",
    primaryJob: "Automate repetitive business tasks end-to-end",
    primaryAction: { id: "run_automation", label: "Run an automation", href: "/automations" },
    description: "Build workflows that trigger actions automatically.",
  },
  "expense-tracker": {
    slug: "expense-tracker",
    name: "Expense Tracker",
    category: "ops",
    requiredPlan: "free",
    primaryJob: "Track business expenses and stay organized",
    primaryAction: { id: "add_expense", label: "Add an expense", href: "/expenses" },
    description: "Log expenses and keep spending under control.",
  },
  "data-doc-sync": {
    slug: "data-doc-sync",
    name: "Data + Docs Sync",
    category: "ops",
    requiredPlan: "pro",
    primaryJob: "Keep your documents updated with live data automatically",
    primaryAction: { id: "connect_docs", label: "Connect docs", href: "/settings/integrations" },
    description: "Sync data into docs for always-current client deliverables.",
  },
  "inventory-manager": {
    slug: "inventory-manager",
    name: "Inventory Manager",
    category: "ops",
    requiredPlan: "free",
    primaryJob: "Track inventory levels and prevent stockouts",
    primaryAction: { id: "view_inventory", label: "View inventory", href: "/inventory" },
    description: "Automated reorder alerts and inventory tracking.",
  },

  // BOTS (Free/Pro/Business)
  "appointment-booker": {
    slug: "appointment-booker",
    name: "Appointment Booker",
    category: "bots",
    requiredPlan: "free",
    primaryJob: "Get clients booked automatically",
    primaryAction: { id: "test_booking", label: "Test a booking", href: "/appointments" },
    description: "Let clients book time with you without back-and-forth.",
  },
  "customer-support-widget": {
    slug: "customer-support-widget",
    name: "Customer Support Widget",
    category: "bots",
    requiredPlan: "pro",
    primaryJob: "Add AI-powered support to your site with escalation",
    primaryAction: { id: "embed_widget", label: "Get embed code", href: "/support/widget" },
    description: "Customer support widget for FAQs and ticket escalation.",
  },
  "lead-qualification-bot": {
    slug: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    category: "bots",
    requiredPlan: "pro",
    primaryJob: "Qualify leads automatically so you focus on the best ones",
    primaryAction: { id: "test_lead_qualification", label: "Test qualification", href: "/leads" },
    description: "Qualifies leads through intelligent conversations and scoring.",
  },
  "customer-support-bot": {
    slug: "customer-support-bot",
    name: "Customer Support Bot",
    category: "bots",
    requiredPlan: "pro",
    primaryJob: "Handle FAQs and escalation with an AI support agent",
    primaryAction: { id: "view_support_inbox", label: "View support inbox", href: "/support" },
    description: "AI-powered support agent for FAQs and escalation.",
  },
  "agent-support-bot": {
    slug: "agent-support-bot",
    name: "Agent + Support Bot",
    category: "bots",
    requiredPlan: "business",
    primaryJob: "Run a customer-facing agent with memory, tools, and escalation",
    primaryAction: { id: "open_agent_console", label: "Open agent console", href: "/agent" },
    description: "Advanced support with tools, memory, and clean escalation paths.",
  },
  "bio-lead-qualifier": {
    slug: "bio-lead-qualifier",
    name: "Flow + Lead Qualifier",
    category: "bots",
    requiredPlan: "business",
    primaryJob: "Automate lead qualification with a full intake flow",
    primaryAction: { id: "run_flow", label: "Run intake flow", href: "/leads" },
    description: "Combines guided intake + lead scoring for high-signal leads.",
  },

  // ECOMMERCE (Pro)
  "social-media-scheduler": {
    slug: "social-media-scheduler",
    name: "Social Media Scheduler",
    category: "ecommerce",
    requiredPlan: "pro",
    primaryJob: "Plan and schedule posts consistently across platforms",
    primaryAction: { id: "create_post_schedule", label: "Create a schedule", href: "/social" },
    description: "Schedule content so you stay consistent without manual posting.",
  },
  "email-campaign-builder": {
    slug: "email-campaign-builder",
    name: "Email Campaign Builder",
    category: "ecommerce",
    requiredPlan: "pro",
    primaryJob: "Build and send email campaigns that convert",
    primaryAction: { id: "create_email_campaign", label: "Create a campaign", href: "/email" },
    description: "Create campaigns, audiences, and sequences.",
  },

  // OTHER (Free)
  "zapier-intercom-integration": {
    slug: "zapier-intercom-integration",
    name: "Zapier x Intercom",
    category: "other",
    requiredPlan: "free",
    primaryJob: "Connect Zapier and Intercom to automate support workflows",
    primaryAction: { id: "open_integration", label: "Open integration", href: "/settings/integrations" },
    description: "Wire events between Zapier and Intercom for streamlined support.",
  },
};

export function getTemplateIdentity(slug: string): TemplateIdentity | null {
  return (TEMPLATE_IDENTITIES as Record<string, TemplateIdentity>)[slug] ?? null;
}

export function getUpgradeLabel(plan: PlanTier) {
  switch (plan) {
    case "pro":
      return "Upgrade to Pro";
    case "business":
      return "Upgrade to Business";
    default:
      return "Upgrade";
  }
}

export function isTemplateLocked(requiredPlan: PlanTier, userPlan: PlanTier) {
  const rank: Record<PlanTier, number> = { free: 0, pro: 1, business: 2 };
  return rank[userPlan] < rank[requiredPlan];
}
