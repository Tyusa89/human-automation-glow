export type TemplateCategory = "dashboards" | "ops" | "bots" | "ecommerce" | "other";
export type PlanTier = "free" | "pro" | "business";
export type Difficulty = "beginner" | "intermediate" | "advanced";

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
  difficulty: Difficulty;

  // the one-liner meaning
  primaryJob: string;

  // first value action
  primaryAction: {
    id: PrimaryActionId;
    label: string;
    href?: string;
  };

  // optional for cards/subtext
  description?: string;

  // Preview page content
  previewBullets?: string[];
  setupSteps?: string[];
}

export const TEMPLATE_IDENTITIES: Record<TemplateSlug, TemplateIdentity> = {
  // ═══════════════════════════════════════════════════════════════
  // DASHBOARDS
  // ═══════════════════════════════════════════════════════════════
  "analytics-dashboard": {
    slug: "analytics-dashboard",
    name: "Analytics Dashboard",
    category: "dashboards",
    requiredPlan: "business",
    difficulty: "advanced",
    primaryJob: "Understand revenue trends and performance",
    primaryAction: { id: "view_analytics", label: "View analytics", href: "/dashboard" },
    description: "Real-time business analytics with custom KPIs and tracking.",
    previewBullets: [
      "See revenue, activity, and operational health at a glance",
      "Track week/month performance and trends automatically",
      "Spot what needs attention before it becomes a problem",
    ],
    setupSteps: [
      "Choose the KPIs you want to track",
      "Connect your income and activity sources",
      "Review your dashboard and set weekly targets",
    ],
  },
  "data-sync-warehouse": {
    slug: "data-sync-warehouse",
    name: "Data Sync Warehouse",
    category: "dashboards",
    requiredPlan: "business",
    difficulty: "advanced",
    primaryJob: "Sync data to your warehouse with automated ETL pipelines",
    primaryAction: { id: "connect_warehouse", label: "Connect warehouse", href: "/settings/integrations" },
    description: "Enterprise-grade pipelines for warehouse sync and monitoring.",
    previewBullets: [
      "Sync data to your warehouse with automated pipelines",
      "Reduce manual exports with scheduled ETL runs",
      "Monitor sync status and catch failures early",
    ],
    setupSteps: [
      "Select your warehouse destination",
      "Connect source systems",
      "Enable schedules and run a test sync",
    ],
  },
  "report-generator": {
    slug: "report-generator",
    name: "Report Generator",
    category: "dashboards",
    requiredPlan: "pro",
    difficulty: "beginner",
    primaryJob: "Generate clean business reports from your data",
    primaryAction: { id: "generate_report", label: "Generate a report", href: "/reports" },
    description: "Create shareable reports with summaries and key metrics.",
    previewBullets: [
      "Generate clean reports from your business data",
      "Produce summaries with key metrics and highlights",
      "Export/share reports in a consistent format",
    ],
    setupSteps: [
      "Pick a report type (weekly, monthly, KPI summary)",
      "Choose inputs (income, leads, appointments, etc.)",
      "Generate and review your first report",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // OPS
  // ═══════════════════════════════════════════════════════════════
  "data-sync-tool": {
    slug: "data-sync-tool",
    name: "Data Sync Tool",
    category: "ops",
    requiredPlan: "pro",
    difficulty: "intermediate",
    primaryJob: "Synchronize data between multiple systems automatically",
    primaryAction: { id: "connect_data_source", label: "Connect a data source", href: "/settings/integrations" },
    description: "Keep your tools aligned without manual exports.",
    previewBullets: [
      "Keep tools aligned without manual exports",
      "Sync records between apps on a schedule",
      "Handle updates and avoid duplicates",
    ],
    setupSteps: [
      "Choose source and destination tools",
      "Map fields and matching rules",
      "Run a test sync and enable the schedule",
    ],
  },
  "workflow-automation": {
    slug: "workflow-automation",
    name: "Workflow Automation",
    category: "ops",
    requiredPlan: "pro",
    difficulty: "intermediate",
    primaryJob: "Automate repetitive business tasks end-to-end",
    primaryAction: { id: "run_automation", label: "Run an automation", href: "/automations" },
    description: "Build workflows that trigger actions automatically.",
    previewBullets: [
      "Automate repetitive tasks end-to-end",
      "Trigger actions from events (new lead, booking, payment)",
      "Standardize workflows so nothing falls through the cracks",
    ],
    setupSteps: [
      "Pick a workflow blueprint",
      "Configure triggers and actions",
      "Run a test and turn it on",
    ],
  },
  "expense-tracker": {
    slug: "expense-tracker",
    name: "Expense Tracker",
    category: "ops",
    requiredPlan: "free",
    difficulty: "beginner",
    primaryJob: "Track business expenses and stay organized",
    primaryAction: { id: "add_expense", label: "Add an expense", href: "/expenses" },
    description: "Log expenses and keep spending under control.",
    previewBullets: [
      "Track business expenses quickly and consistently",
      "Keep spending organized by category",
      "Get clean totals for weekly/monthly review",
    ],
    setupSteps: [
      "Add your first expense",
      "Choose categories that match your business",
      "Review this week's total and adjust habits",
    ],
  },
  "data-doc-sync": {
    slug: "data-doc-sync",
    name: "Data + Docs Sync",
    category: "ops",
    requiredPlan: "pro",
    difficulty: "intermediate",
    primaryJob: "Keep your documents updated with live data automatically",
    primaryAction: { id: "connect_docs", label: "Connect docs", href: "/settings/integrations" },
    description: "Sync data into docs for always-current client deliverables.",
    previewBullets: [
      "Keep documents updated with live data automatically",
      "Sync values into docs for client deliverables",
      "Reduce copy/paste and outdated numbers",
    ],
    setupSteps: [
      "Connect your doc tool",
      "Choose what data to sync into documents",
      "Run a test update and enable auto-sync",
    ],
  },
  "inventory-manager": {
    slug: "inventory-manager",
    name: "Inventory Manager",
    category: "ops",
    requiredPlan: "free",
    difficulty: "beginner",
    primaryJob: "Track inventory levels and prevent stockouts",
    primaryAction: { id: "view_inventory", label: "View inventory", href: "/inventory" },
    description: "Automated reorder alerts and inventory tracking.",
    previewBullets: [
      "Track inventory levels and prevent stockouts",
      "Get reorder alerts before you run out",
      "Keep item counts accurate with a simple workflow",
    ],
    setupSteps: [
      "Add items you track",
      "Set minimum levels and reorder thresholds",
      "Review alerts and update counts weekly",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // BOTS
  // ═══════════════════════════════════════════════════════════════
  "appointment-booker": {
    slug: "appointment-booker",
    name: "Appointment Booker",
    category: "bots",
    requiredPlan: "free",
    difficulty: "beginner",
    primaryJob: "Get clients booked automatically",
    primaryAction: { id: "test_booking", label: "Test a booking", href: "/appointments" },
    description: "Let clients book time with you without back-and-forth.",
    previewBullets: [
      "Let clients book time without back-and-forth",
      "Send confirmations and reminders automatically",
      "Reduce no-shows with a clean booking flow",
    ],
    setupSteps: [
      "Set your availability",
      "Connect your calendar",
      "Run a test booking and go live",
    ],
  },
  "customer-support-widget": {
    slug: "customer-support-widget",
    name: "Customer Support Widget",
    category: "bots",
    requiredPlan: "pro",
    difficulty: "intermediate",
    primaryJob: "Add AI-powered support to your site with escalation",
    primaryAction: { id: "embed_widget", label: "Get embed code", href: "/support/widget" },
    description: "Customer support widget for FAQs and ticket escalation.",
    previewBullets: [
      "Add AI support to your site with escalation",
      "Answer FAQs instantly and route complex issues",
      "Reduce tickets while staying responsive",
    ],
    setupSteps: [
      "Customize your FAQ and tone",
      "Copy the embed code to your site",
      "Test escalation and go live",
    ],
  },
  "lead-qualification-bot": {
    slug: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    category: "bots",
    requiredPlan: "pro",
    difficulty: "intermediate",
    primaryJob: "Qualify leads automatically so you focus on the best ones",
    primaryAction: { id: "test_lead_qualification", label: "Test qualification", href: "/leads" },
    description: "Qualifies leads through intelligent conversations and scoring.",
    previewBullets: [
      "Qualify leads automatically through conversation and scoring",
      "Route high-intent leads to the right pipeline stage",
      "Reduce time spent on low-quality inquiries",
    ],
    setupSteps: [
      "Define what a \"qualified lead\" means for you",
      "Set scoring rules and routing",
      "Test qualification on a sample lead",
    ],
  },
  "customer-support-bot": {
    slug: "customer-support-bot",
    name: "Customer Support Bot",
    category: "bots",
    requiredPlan: "pro",
    difficulty: "intermediate",
    primaryJob: "Handle FAQs and escalation with an AI support agent",
    primaryAction: { id: "view_support_inbox", label: "View support inbox", href: "/support" },
    description: "AI-powered support agent for FAQs and escalation.",
    previewBullets: [
      "Handle FAQs with an AI-powered support agent",
      "Escalate issues that need a human response",
      "Maintain consistent answers and faster response times",
    ],
    setupSteps: [
      "Add your FAQ/knowledge base content",
      "Configure escalation rules",
      "Test support responses and launch",
    ],
  },
  "agent-support-bot": {
    slug: "agent-support-bot",
    name: "Agent + Support Bot",
    category: "bots",
    requiredPlan: "business",
    difficulty: "advanced",
    primaryJob: "Run a customer-facing agent with memory, tools, and escalation",
    primaryAction: { id: "open_agent_console", label: "Open agent console", href: "/agent" },
    description: "Advanced support with tools, memory, and clean escalation paths.",
    previewBullets: [
      "Run an advanced agent with tools, memory, and escalation",
      "Handle complex support requests end-to-end",
      "Keep context across interactions for better outcomes",
    ],
    setupSteps: [
      "Enable agent tools and permissions",
      "Define escalation boundaries",
      "Run a full end-to-end test conversation",
    ],
  },
  "bio-lead-qualifier": {
    slug: "bio-lead-qualifier",
    name: "Flow + Lead Qualifier",
    category: "bots",
    requiredPlan: "business",
    difficulty: "advanced",
    primaryJob: "Automate lead qualification with a full intake flow",
    primaryAction: { id: "run_flow", label: "Run intake flow", href: "/leads" },
    description: "Combines guided intake + lead scoring for high-signal leads.",
    previewBullets: [
      "Capture, score, and route leads with a guided intake flow",
      "Collect the right info before you ever respond",
      "Automatically push leads into the correct pipeline path",
    ],
    setupSteps: [
      "Choose intake questions",
      "Set routing rules and score thresholds",
      "Test the flow and publish it",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // ECOMMERCE
  // ═══════════════════════════════════════════════════════════════
  "social-media-scheduler": {
    slug: "social-media-scheduler",
    name: "Social Media Scheduler",
    category: "ecommerce",
    requiredPlan: "pro",
    difficulty: "beginner",
    primaryJob: "Plan and schedule posts consistently across platforms",
    primaryAction: { id: "create_post_schedule", label: "Create a schedule", href: "/social" },
    description: "Schedule content so you stay consistent without manual posting.",
    previewBullets: [
      "Plan and schedule posts across platforms",
      "Stay consistent without manual posting",
      "Track what's scheduled and what performed best",
    ],
    setupSteps: [
      "Connect your social accounts",
      "Create your posting schedule",
      "Queue your first week of posts",
    ],
  },
  "email-campaign-builder": {
    slug: "email-campaign-builder",
    name: "Email Campaign Builder",
    category: "ecommerce",
    requiredPlan: "pro",
    difficulty: "beginner",
    primaryJob: "Build and send email campaigns that convert",
    primaryAction: { id: "create_email_campaign", label: "Create a campaign", href: "/email" },
    description: "Create campaigns, audiences, and sequences.",
    previewBullets: [
      "Build campaigns, audiences, and sequences",
      "Send consistent messages without extra effort",
      "Track opens/clicks and improve over time",
    ],
    setupSteps: [
      "Create an audience list",
      "Write your first campaign",
      "Send a test email and launch",
    ],
  },

  // ═══════════════════════════════════════════════════════════════
  // OTHER
  // ═══════════════════════════════════════════════════════════════
  "zapier-intercom-integration": {
    slug: "zapier-intercom-integration",
    name: "Zapier x Intercom",
    category: "other",
    requiredPlan: "free",
    difficulty: "beginner",
    primaryJob: "Connect Zapier and Intercom to automate support workflows",
    primaryAction: { id: "open_integration", label: "Open integration", href: "/settings/integrations" },
    description: "Wire events between Zapier and Intercom for streamlined support.",
    previewBullets: [
      "Connect Zapier and Intercom to streamline support workflows",
      "Trigger automations from Intercom events",
      "Reduce manual follow-up and routing",
    ],
    setupSteps: [
      "Connect Zapier and Intercom",
      "Choose triggers (new conversation, tag, assignment)",
      "Test the flow and enable it",
    ],
  },
};

export function getTemplateIdentity(slug: string): TemplateIdentity | null {
  return (TEMPLATE_IDENTITIES as Record<string, TemplateIdentity>)[slug] ?? null;
}

export function getUpgradeLabel(plan: PlanTier): string {
  switch (plan) {
    case "pro":
      return "Upgrade to Pro";
    case "business":
      return "Upgrade to Business";
    default:
      return "Upgrade";
  }
}

export function getUpgradeHref(plan: PlanTier): string {
  switch (plan) {
    case "pro":
      return "/pricing?plan=pro";
    case "business":
      return "/pricing?plan=business";
    default:
      return "/pricing";
  }
}

export function isTemplateLocked(requiredPlan: PlanTier, userPlan: PlanTier): boolean {
  const rank: Record<PlanTier, number> = { free: 0, pro: 1, business: 2 };
  return rank[userPlan] < rank[requiredPlan];
}

// Difficulty display labels
export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

// Sorting ranks
const PLAN_RANK: Record<PlanTier, number> = { free: 0, pro: 1, business: 2 };
const DIFFICULTY_RANK: Record<Difficulty, number> = { beginner: 0, intermediate: 1, advanced: 2 };

/**
 * Sort templates for display in the grid.
 * Order: Unlocked first, then by locked tier (pro before business), then difficulty, then name.
 */
export function sortTemplatesForGrid(
  templateIds: string[],
  userPlan: PlanTier
): string[] {
  return [...templateIds].sort((a, b) => {
    const identityA = getTemplateIdentity(a);
    const identityB = getTemplateIdentity(b);
    
    if (!identityA || !identityB) return 0;

    const lockedA = isTemplateLocked(identityA.requiredPlan, userPlan);
    const lockedB = isTemplateLocked(identityB.requiredPlan, userPlan);

    // 1. Unlocked before locked
    if (lockedA !== lockedB) return lockedA ? 1 : -1;

    // 2. If both locked, sort by tier (pro before business)
    if (lockedA && lockedB) {
      const tierDiff = PLAN_RANK[identityA.requiredPlan] - PLAN_RANK[identityB.requiredPlan];
      if (tierDiff !== 0) return tierDiff;
    }

    // 3. Sort by difficulty (beginner → intermediate → advanced)
    const diffDiff = DIFFICULTY_RANK[identityA.difficulty] - DIFFICULTY_RANK[identityB.difficulty];
    if (diffDiff !== 0) return diffDiff;

    // 4. Alphabetical by name
    return identityA.name.localeCompare(identityB.name);
  });
}

