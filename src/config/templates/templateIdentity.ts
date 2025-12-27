export type TemplateCategory = "money" | "automation" | "leads" | "ai" | "time";

export type PrimaryActionId =
  | "view_analytics"
  | "connect_data_source"
  | "run_sync"
  | "review_leads"
  | "test_qualification"
  | "view_dashboard"
  | "test_booking"
  | "set_availability"
  | "connect_calendar"
  | "record_income"
  | "create_payment_link"
  | "view_revenue_breakdown"
  | "create_invoice"
  | "add_lead"
  | "review_contacts"
  | "send_follow_up"
  | "move_pipeline_stage"
  | "run_automation"
  | "create_task_rule"
  | "review_recent_runs"
  | "ask_first_question"
  | "review_insights"
  | "view_recommendations"
  | "nothing";

export interface TemplateIdentity {
  slug: string;         // MUST match DB slug
  name: string;         // display name
  category: TemplateCategory;

  primaryJob: string;

  primaryAction: {
    id: PrimaryActionId;
    label: string;
    href?: string;
  };

  description?: string;
}

/**
 * Canonical map: keys MUST match DB slugs (kebab-case).
 * Add the rest of the 17 later by appending to this object.
 */
export const TEMPLATE_IDENTITIES = {
  // ═══════════════════════════════════════════════════════════════
  // EXISTING DB TEMPLATES
  // ═══════════════════════════════════════════════════════════════
  "analytics-dashboard": {
    slug: "analytics-dashboard",
    name: "Analytics Dashboard",
    category: "money",
    primaryJob: "Understand revenue trends and performance",
    primaryAction: { id: "view_analytics", label: "View analytics", href: "/dashboard" },
    description: "See trends, breakdowns, and performance over time.",
  },

  "data-sync-tool": {
    slug: "data-sync-tool",
    name: "Data Sync Tool",
    category: "automation",
    primaryJob: "Keep your systems in sync automatically",
    primaryAction: { id: "connect_data_source", label: "Connect a data source", href: "/settings/integrations" },
    description: "Sync data across tools to reduce manual work.",
  },

  "lead-qual-bot": {
    slug: "lead-qual-bot",
    name: "Lead Qualification Bot",
    category: "leads",
    primaryJob: "Qualify leads automatically so you focus on the best ones",
    primaryAction: { id: "test_qualification", label: "Test lead qualification", href: "/leads" },
    description: "Score and prioritize leads based on your criteria.",
  },

  // ═══════════════════════════════════════════════════════════════
  // TIME / SCHEDULING
  // ═══════════════════════════════════════════════════════════════
  "appointment-booker": {
    slug: "appointment-booker",
    name: "Appointment Booker",
    category: "time",
    primaryJob: "Get clients booked automatically",
    primaryAction: { id: "test_booking", label: "Test a booking" },
    description: "Let clients book time with you without back-and-forth.",
  },

  "availability-manager": {
    slug: "availability-manager",
    name: "Availability Manager",
    category: "time",
    primaryJob: "Control when and how clients can book time",
    primaryAction: { id: "set_availability", label: "Set availability" },
    description: "Define your schedule rules and booking windows.",
  },

  "calendar-sync": {
    slug: "calendar-sync",
    name: "Calendar Sync",
    category: "time",
    primaryJob: "Keep all calendars in sync automatically",
    primaryAction: { id: "connect_calendar", label: "Connect a calendar" },
    description: "Sync events across calendars to avoid conflicts.",
  },

  // ═══════════════════════════════════════════════════════════════
  // MONEY
  // ═══════════════════════════════════════════════════════════════
  "income-tracker": {
    slug: "income-tracker",
    name: "Income Tracker",
    category: "money",
    primaryJob: "Track and understand your income",
    primaryAction: { id: "record_income", label: "Record income" },
    description: "Log income and see weekly/monthly totals.",
  },

  "payments-checkout": {
    slug: "payments-checkout",
    name: "Payments / Checkout",
    category: "money",
    primaryJob: "Accept payments from clients",
    primaryAction: { id: "create_payment_link", label: "Create a payment link" },
    description: "Generate checkout links and track payments.",
  },

  "revenue-analytics": {
    slug: "revenue-analytics",
    name: "Revenue Analytics",
    category: "money",
    primaryJob: "Understand revenue trends and performance",
    primaryAction: { id: "view_revenue_breakdown", label: "View revenue breakdown" },
    description: "See trends, distribution, and performance over time.",
  },

  "invoicing": {
    slug: "invoicing",
    name: "Invoicing",
    category: "money",
    primaryJob: "Bill clients professionally and on time",
    primaryAction: { id: "create_invoice", label: "Create an invoice" },
    description: "Create invoices and track what's paid or overdue.",
  },

  // ═══════════════════════════════════════════════════════════════
  // LEADS / CRM
  // ═══════════════════════════════════════════════════════════════
  "lead-capture": {
    slug: "lead-capture",
    name: "Lead Capture",
    category: "leads",
    primaryJob: "Capture new leads automatically",
    primaryAction: { id: "add_lead", label: "Add a lead" },
    description: "Collect leads and start building your pipeline.",
  },

  "contact-manager": {
    slug: "contact-manager",
    name: "Contact Manager",
    category: "leads",
    primaryJob: "Organize and manage client contacts",
    primaryAction: { id: "review_contacts", label: "Review contacts" },
    description: "Keep contacts organized with notes and tags.",
  },

  "follow-up-system": {
    slug: "follow-up-system",
    name: "Follow-Up System",
    category: "leads",
    primaryJob: "Stay in touch with leads and clients automatically",
    primaryAction: { id: "send_follow_up", label: "Send a follow-up" },
    description: "Automate reminders and follow-up messages.",
  },

  "crm-pipeline": {
    slug: "crm-pipeline",
    name: "CRM Pipeline",
    category: "leads",
    primaryJob: "Track leads from first contact to conversion",
    primaryAction: { id: "move_pipeline_stage", label: "Update pipeline stage" },
    description: "Manage stages and keep deals moving forward.",
  },

  // ═══════════════════════════════════════════════════════════════
  // AUTOMATION / OPS
  // ═══════════════════════════════════════════════════════════════
  "workflow-automation": {
    slug: "workflow-automation",
    name: "Workflow Automation",
    category: "automation",
    primaryJob: "Automate repetitive business tasks",
    primaryAction: { id: "run_automation", label: "Run an automation" },
    description: "Connect actions and triggers into repeatable workflows.",
  },

  "task-automation": {
    slug: "task-automation",
    name: "Task Automation",
    category: "automation",
    primaryJob: "Automatically manage recurring tasks",
    primaryAction: { id: "create_task_rule", label: "Create a task rule" },
    description: "Generate tasks based on schedules or events.",
  },

  "system-monitor": {
    slug: "system-monitor",
    name: "System Monitor",
    category: "automation",
    primaryJob: "Monitor automations and catch issues early",
    primaryAction: { id: "review_recent_runs", label: "Review recent runs" },
    description: "See errors, warnings, and run history in one place.",
  },

  // ═══════════════════════════════════════════════════════════════
  // AI
  // ═══════════════════════════════════════════════════════════════
  "ai-assistant": {
    slug: "ai-assistant",
    name: "AI Assistant",
    category: "ai",
    primaryJob: "Ask questions and get intelligent guidance",
    primaryAction: { id: "ask_first_question", label: "Ask your first question" },
    description: "Get help planning, deciding, and automating.",
  },

  "business-insights": {
    slug: "business-insights",
    name: "Business Insights",
    category: "ai",
    primaryJob: "Get insights about what to improve next",
    primaryAction: { id: "review_insights", label: "Review insights" },
    description: "See actionable insights based on your activity.",
  },

  "recommendation-engine": {
    slug: "recommendation-engine",
    name: "Recommendation Engine",
    category: "ai",
    primaryJob: "Receive personalized recommendations automatically",
    primaryAction: { id: "view_recommendations", label: "View recommendations" },
    description: "Suggestions tailored to your workflow and goals.",
  },
} as const satisfies Record<string, TemplateIdentity>;

// Strong type = union of all slugs
export type TemplateSlug = keyof typeof TEMPLATE_IDENTITIES;

/**
 * Safe getter - returns null if slug not found.
 */
export function getTemplateIdentity(slug: string): TemplateIdentity | null {
  return (TEMPLATE_IDENTITIES as Record<string, TemplateIdentity>)[slug] ?? null;
}

/**
 * One hero widget per category (for later dashboard emphasis).
 */
export const CATEGORY_HERO_WIDGET: Record<TemplateCategory, string> = {
  time: "appointments",
  money: "income",
  leads: "leads",
  automation: "runs",
  ai: "assistant",
};
