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
  type: "analytics" | "data-sync" | "report" | "integration" | "marketing";
  steps: SetupStep[];    // 👈 per-template steps
};

export const registry: TemplateMeta[] = [
  {
    id: normalizeId("Email Campaign Builder"), // "email-campaign-builder"
    name: "Email Campaign Builder",
    type: "marketing",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "Email Campaign Builder" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Campaign", fields: [
        { kind: "select", key: "campaignType", label: "Campaign Type", options: ["Newsletter","Promotional","Welcome Series","Drip Campaign"], default: "Newsletter" },
        { kind: "select", key: "template", label: "Email Template", options: ["Modern","Classic","Minimal","Bold"], default: "Modern" },
      ]},
      { title: "Audience", fields: [
        { kind: "checkboxes", key: "segmentation", label: "Audience Segments", options: ["New Subscribers","Active Users","Inactive Users","VIP Customers"], default: ["New Subscribers"] },
        { kind: "select", key: "frequency", label: "Send Frequency", options: ["Daily","Weekly","Bi-weekly","Monthly"], default: "Weekly" },
      ]},
      { title: "Integration", fields: [
        { kind: "checkboxes", key: "providers", label: "Email Providers", options: ["Mailchimp","SendGrid","Klaviyo","ConvertKit"], default: ["SendGrid"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    type: "analytics",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Project" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Data source", fields: [
        { kind: "select", key: "db", label: "Database", options: ["Postgres","MySQL","SQLite"], default: "Postgres" },
        { kind: "checkboxes", key: "charts", label: "Charts", options: ["Line","Bar","Pie"] , default: ["Line"] },
      ]},
      { title: "Auth", fields: [
        { kind: "checkboxes", key: "auth", label: "Providers", options: ["Email","Magic link","SMS"], default: ["Email"] },
      ]},
      { title: "Review", fields: [ { kind: "review" } ]},
    ],
  },
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
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return registry.find(template => template.id === id);
}