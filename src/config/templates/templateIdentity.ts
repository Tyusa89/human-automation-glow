export type TemplateCategory = "time" | "money" | "leads" | "automation" | "ai";

export type TemplateId =
  | "appointment_booker"
  | "availability_manager"
  | "calendar_sync"
  | "income_tracker"
  | "payments_checkout"
  | "revenue_analytics"
  | "invoicing"
  | "lead_capture"
  | "contact_manager"
  | "follow_up_system"
  | "crm_pipeline"
  | "workflow_automation"
  | "task_automation"
  | "system_monitor"
  | "ai_assistant"
  | "business_insights"
  | "recommendation_engine";

export type PrimaryActionId =
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
  | "view_recommendations";

export interface TemplateIdentity {
  id: TemplateId;
  name: string; // display name
  category: TemplateCategory;

  // The one-liner meaning
  primaryJob: string;

  // What the user should do first to feel value
  primaryAction: {
    id: PrimaryActionId;
    label: string; // button label
    // optional: route you can wire later
    href?: string;
  };

  // Optional short description (for template cards/list)
  description?: string;
}

export const TEMPLATE_IDENTITIES: Record<TemplateId, TemplateIdentity> = {
  // TIME / SCHEDULING
  appointment_booker: {
    id: "appointment_booker",
    name: "Appointment Booker",
    category: "time",
    primaryJob: "Get clients booked automatically",
    primaryAction: { id: "test_booking", label: "Test a booking" },
    description: "Let clients book time with you without back-and-forth.",
  },
  availability_manager: {
    id: "availability_manager",
    name: "Availability Manager",
    category: "time",
    primaryJob: "Control when and how clients can book time",
    primaryAction: { id: "set_availability", label: "Set availability" },
    description: "Define your schedule rules and booking windows.",
  },
  calendar_sync: {
    id: "calendar_sync",
    name: "Calendar Sync",
    category: "time",
    primaryJob: "Keep all calendars in sync automatically",
    primaryAction: { id: "connect_calendar", label: "Connect a calendar" },
    description: "Sync events across calendars to avoid conflicts.",
  },

  // MONEY
  income_tracker: {
    id: "income_tracker",
    name: "Income Tracker",
    category: "money",
    primaryJob: "Track and understand your income",
    primaryAction: { id: "record_income", label: "Record income" },
    description: "Log income and see weekly/monthly totals.",
  },
  payments_checkout: {
    id: "payments_checkout",
    name: "Payments / Checkout",
    category: "money",
    primaryJob: "Accept payments from clients",
    primaryAction: { id: "create_payment_link", label: "Create a payment link" },
    description: "Generate checkout links and track payments.",
  },
  revenue_analytics: {
    id: "revenue_analytics",
    name: "Revenue Analytics",
    category: "money",
    primaryJob: "Understand revenue trends and performance",
    primaryAction: { id: "view_revenue_breakdown", label: "View revenue breakdown" },
    description: "See trends, distribution, and performance over time.",
  },
  invoicing: {
    id: "invoicing",
    name: "Invoicing",
    category: "money",
    primaryJob: "Bill clients professionally and on time",
    primaryAction: { id: "create_invoice", label: "Create an invoice" },
    description: "Create invoices and track what's paid or overdue.",
  },

  // LEADS / CRM
  lead_capture: {
    id: "lead_capture",
    name: "Lead Capture",
    category: "leads",
    primaryJob: "Capture new leads automatically",
    primaryAction: { id: "add_lead", label: "Add a lead" },
    description: "Collect leads and start building your pipeline.",
  },
  contact_manager: {
    id: "contact_manager",
    name: "Contact Manager",
    category: "leads",
    primaryJob: "Organize and manage client contacts",
    primaryAction: { id: "review_contacts", label: "Review contacts" },
    description: "Keep contacts organized with notes and tags.",
  },
  follow_up_system: {
    id: "follow_up_system",
    name: "Follow-Up System",
    category: "leads",
    primaryJob: "Stay in touch with leads and clients automatically",
    primaryAction: { id: "send_follow_up", label: "Send a follow-up" },
    description: "Automate reminders and follow-up messages.",
  },
  crm_pipeline: {
    id: "crm_pipeline",
    name: "CRM Pipeline",
    category: "leads",
    primaryJob: "Track leads from first contact to conversion",
    primaryAction: { id: "move_pipeline_stage", label: "Update pipeline stage" },
    description: "Manage stages and keep deals moving forward.",
  },

  // AUTOMATION / OPS
  workflow_automation: {
    id: "workflow_automation",
    name: "Workflow Automation",
    category: "automation",
    primaryJob: "Automate repetitive business tasks",
    primaryAction: { id: "run_automation", label: "Run an automation" },
    description: "Connect actions and triggers into repeatable workflows.",
  },
  task_automation: {
    id: "task_automation",
    name: "Task Automation",
    category: "automation",
    primaryJob: "Automatically manage recurring tasks",
    primaryAction: { id: "create_task_rule", label: "Create a task rule" },
    description: "Generate tasks based on schedules or events.",
  },
  system_monitor: {
    id: "system_monitor",
    name: "System Monitor",
    category: "automation",
    primaryJob: "Monitor automations and catch issues early",
    primaryAction: { id: "review_recent_runs", label: "Review recent runs" },
    description: "See errors, warnings, and run history in one place.",
  },

  // AI
  ai_assistant: {
    id: "ai_assistant",
    name: "AI Assistant",
    category: "ai",
    primaryJob: "Ask questions and get intelligent guidance",
    primaryAction: { id: "ask_first_question", label: "Ask your first question" },
    description: "Get help planning, deciding, and automating.",
  },
  business_insights: {
    id: "business_insights",
    name: "Business Insights",
    category: "ai",
    primaryJob: "Get insights about what to improve next",
    primaryAction: { id: "review_insights", label: "Review insights" },
    description: "See actionable insights based on your activity.",
  },
  recommendation_engine: {
    id: "recommendation_engine",
    name: "Recommendation Engine",
    category: "ai",
    primaryJob: "Receive personalized recommendations automatically",
    primaryAction: { id: "view_recommendations", label: "View recommendations" },
    description: "Suggestions tailored to your workflow and goals.",
  },
};

/**
 * Safe getter if you ever receive unknown IDs.
 * (Keeps UI from crashing if backend sends a template you haven't mapped yet.)
 */
export function getTemplateIdentity(id: string): TemplateIdentity | null {
  return (TEMPLATE_IDENTITIES as Record<string, TemplateIdentity>)[id] ?? null;
}

/**
 * One hero widget per category (for later dashboard emphasis).
 * You can change these names to match your widget keys.
 */
export const CATEGORY_HERO_WIDGET: Record<TemplateCategory, string> = {
  time: "appointments",
  money: "income",
  leads: "leads",
  automation: "runs",
  ai: "assistant",
};
