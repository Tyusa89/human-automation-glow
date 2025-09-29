import { normalizeId } from "@/lib/utils/ids";

export type StepField =
  | { kind: "text";  key: string; label: string; default?: string }
  | { kind: "select"; key: string; label: string; options: string[]; default?: string }
  | { kind: "checkboxes"; key: string; label: string; options: string[]; default?: string[] }
  | { kind: "review" };

export type SetupStep = { title: string; fields: StepField[] };

export type TemplateMeta = {
  id: string;            // route id (e.g., "analytics-dashboard")
  name: string;
  type: "analytics" | "data-sync" | "report" | "integration" | "marketing" | "campaigns";
  steps: SetupStep[];    // 👈 per-template steps
};

// --- Analytics Dashboard ---
const analyticsDashboard: TemplateMeta = {
  id: "analytics-dashboard",
  name: "Analytics Dashboard",
  type: "analytics",
  steps: [
    { title: "Basics", fields: [
      { kind: "text",   key: "projectName", label: "Project name", default: "EcoNest Analytics" },
      { kind: "select", key: "environment", label: "Environment",
        options: ["Development","Staging","Production"], default: "Development" },
    ]},
    { title: "Data Source", fields: [
      { kind: "select", key: "database", label: "Database",
        options: ["Postgres (Supabase)","MySQL","SQLite"], default: "Postgres (Supabase)" },
      { kind: "checkboxes", key: "charts", label: "Charts",
        options: ["KPI Cards","Line","Bar","Pie"], default: ["KPI Cards","Line"] },
    ]},
    { title: "Auth", fields: [
      { kind: "checkboxes", key: "authProviders", label: "Providers",
        options: ["Email+Password","Magic link","SMS"], default: ["Email+Password"] },
    ]},
    { title: "Review", fields: [ { kind: "review" } ]},
  ],
};

// --- Inventory Manager ---
const inventoryManager: TemplateMeta = {
  id: "inventory-manager",
  name: "Inventory Manager",
  type: "data-sync",
  steps: [
    { title: "Basics", fields: [
      { kind: "text",   key: "projectName", label: "Project name", default: "EcoNest Inventory" },
      { kind: "select", key: "environment", label: "Environment",
        options: ["Development","Staging","Production"], default: "Development" },
    ]},
    { title: "Storage", fields: [
      { kind: "select", key: "db", label: "Database",
        options: ["Postgres/Supabase","MySQL"], default: "Postgres/Supabase" },
      { kind: "checkboxes", key: "tables", label: "Include tables",
        options: ["products","locations","stock_levels","transactions"], default: ["products","stock_levels"] },
    ]},
    { title: "Alerts", fields: [
      { kind: "select", key: "notifyVia", label: "Notification channel",
        options: ["Email","Slack","Both"], default: "Email" },
      { kind: "select", key: "reorderRule", label: "Reorder rule",
        options: ["Below threshold","7-day forecast"], default: "Below threshold" },
    ]},
    { title: "Review", fields: [ { kind: "review" } ]},
  ],
};

export const registry: TemplateMeta[] = [
  {
    id: "social-media-scheduler",
    name: "Social Media Scheduler",
    type: "marketing",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Project" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
        { kind: "select", key: "accounts", label: "Accounts", options: ["X / Twitter","Instagram","Facebook","LinkedIn"], default: "X / Twitter" },
        { kind: "select", key: "defaultTimezone", label: "Default timezone", options: ["UTC","EST","PST","GMT"], default: "UTC" },
        { kind: "text", key: "postingWindowStart", label: "Posting window start (HH:MM)", default: "09:00" },
        { kind: "text", key: "postingWindowEnd", label: "Posting window end (HH:MM)", default: "18:00" },
      ]},
      { title: "Integrations", fields: [
        { kind: "checkboxes", key: "integrations", label: "Integrations", options: ["Twitter/X","Instagram/Facebook","LinkedIn","Scheduler (cron)"], default: ["Twitter/X"] },
      ]},
      { title: "Channels", fields: [
        { kind: "checkboxes", key: "channels", label: "Channels", options: ["Web","Email","Slack"], default: ["Web"] },
      ]},
      { title: "Review", fields: [{ kind: "review" }] },
    ],
  },
  {
    id: "email-campaign-builder",
    name: "Email Campaign Builder",
    type: "campaigns",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Campaigns" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Audience", fields: [
        { kind: "select", key: "audienceSource", label: "Audience source", options: ["CSV Upload","Supabase Table","HubSpot List"], default: "Supabase Table" },
      ]},
      { title: "Composer", fields: [
        { kind: "checkboxes", key: "features", label: "Features", options: ["AI subject lines","A/B test","Track opens","Track clicks"], default: ["Track opens","Track clicks"] },
      ]},
      { title: "Review", fields: [{ kind: "review" }] },
    ],
  },
  analyticsDashboard,
  {
    id: "data-sync-tool",
    name: "Data Sync Tool",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Sync" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Connectors", fields: [
        { kind: "checkboxes", key: "connectors", label: "Systems", options: ["Salesforce","HubSpot","Stripe","Supabase"] },
      ]},
      { title: "Schedule", fields: [
        { kind: "select", key: "cron", label: "Frequency", options: ["@hourly","@daily","@weekly"], default: "@daily" },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "report-generator",
    name: "Report Generator",
    type: "report",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Reports" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Report", fields: [
        { kind: "select", key: "template", label: "Report template", options: ["KPI Snapshot","Cohort Analysis","Revenue Trend"] },
        { kind: "select", key: "format", label: "Format", options: ["PDF","CSV"], default: "PDF" },
      ]},
      { title: "Delivery", fields: [
        { kind: "select", key: "cadence", label: "Cadence", options: ["Manual","Daily","Weekly"], default: "Weekly" },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "zapier-intercom-integration",
    name: "Zapier × Intercom Integration",
    type: "integration",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Project" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
        { kind: "select", key: "variantId", label: "Template variant", options: ["Zapier × Intercom","Slack × Zendesk","Shopify × Klaviyo"], default: "Zapier × Intercom" },
      ]},
      { title: "Integrations", fields: [
        { kind: "checkboxes", key: "integrations", label: "Integrations", options: ["Zapier","Intercom","Zendesk","Slack"] },
      ]},
      { title: "Channels", fields: [
        { kind: "checkboxes", key: "channels", label: "Channels", options: ["Web","Email","Slack"], default: ["Web"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "integration",
    name: "Integration",
    type: "integration",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Project" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
        { kind: "select", key: "variantId", label: "Template variant", options: ["Zapier × Intercom","Slack × Zendesk","Shopify × Klaviyo"], default: "Zapier × Intercom" },
      ]},
      { title: "Integrations", fields: [
        { kind: "checkboxes", key: "integrations", label: "Integrations", options: ["Zapier","Intercom","Zendesk","Slack"] },
      ]},
      { title: "Channels", fields: [
        { kind: "checkboxes", key: "channels", label: "Channels", options: ["Web","Email","Slack"], default: ["Web"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  inventoryManager,
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Workflows" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Triggers", fields: [
        { kind: "checkboxes", key: "triggers", label: "Trigger types", options: ["Webhook","Schedule","Database Change","Email"], default: ["Webhook"] },
      ]},
      { title: "Actions", fields: [
        { kind: "checkboxes", key: "actions", label: "Available actions", options: ["Send Email","Update Database","Call API","Create Task"], default: ["Send Email","Update Database"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Expenses" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Features", fields: [
        { kind: "checkboxes", key: "features", label: "Features", options: ["Receipt Scanning","Expense Categories","Monthly Reports","Mileage Tracking"], default: ["Receipt Scanning","Expense Categories"] },
      ]},
      { title: "Integrations", fields: [
        { kind: "checkboxes", key: "integrations", label: "Integrations", options: ["QuickBooks","Xero","Google Drive","Dropbox"], default: ["Google Drive"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "appointment-booker",
    name: "Appointment Booker",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Appointments" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Calendar", fields: [
        { kind: "select", key: "calendar", label: "Calendar Integration", options: ["Google Calendar","Outlook","CalDAV"], default: "Google Calendar" },
        { kind: "select", key: "timezone", label: "Default Timezone", options: ["UTC","EST","PST","CST"], default: "UTC" },
      ]},
      { title: "Notifications", fields: [
        { kind: "checkboxes", key: "notifications", label: "Notification Methods", options: ["Email Reminders","SMS Alerts","Push Notifications"], default: ["Email Reminders"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "customer-support-widget",
    name: "Customer Support Widget",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Support" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Configuration", fields: [
        { kind: "checkboxes", key: "features", label: "Features", options: ["AI Chat","Ticket Management","Live Chat","FAQ Search"], default: ["AI Chat","FAQ Search"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Leads" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Scoring", fields: [
        { kind: "checkboxes", key: "criteria", label: "Qualification Criteria", options: ["Budget","Authority","Need","Timeline","Company Size"], default: ["Budget","Need","Timeline"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "customer-support-bot",
    name: "Customer Support Bot",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Support Bot" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Knowledge Base", fields: [
        { kind: "select", key: "knowledgeSource", label: "Knowledge Source", options: ["Manual FAQ","Notion","Google Docs"], default: "Manual FAQ" },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "agent-support-bot",
    name: "Agent + Support Bot",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Agent Bot" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Features", fields: [
        { kind: "checkboxes", key: "features", label: "Features", options: ["Memory","Tool Integration","Human Escalation","Transcript Logging"], default: ["Memory","Human Escalation","Transcript Logging"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "bio-lead-qualifier",
    name: "Flow + Lead Qualifier",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Lead Qualifier" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "CRM", fields: [
        { kind: "select", key: "crm", label: "CRM Integration", options: ["HubSpot","Salesforce","Pipedrive"], default: "HubSpot" },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "data-doc-sync",
    name: "Data + Docs Sync",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Docs Sync" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Sources", fields: [
        { kind: "checkboxes", key: "sources", label: "Data Sources", options: ["GitHub","GitLab","Notion","Google Docs"], default: ["GitHub","Notion"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return registry.find(template => template.id === id);
}