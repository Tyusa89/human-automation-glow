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

export const registry: TemplateMeta[] = [
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
  {
    id: "inventory-manager",
    name: "Inventory Manager",
    type: "data-sync",
    steps: [
      { title: "Basics", fields: [
        { kind: "text", key: "projectName", label: "Project name", default: "EcoNest Inventory" },
        { kind: "select", key: "environment", label: "Environment", options: ["Development","Staging","Production"], default: "Development" },
      ]},
      { title: "Inventory", fields: [
        { kind: "checkboxes", key: "features", label: "Features", options: ["Stock tracking","Low stock alerts","Barcode scanning","Multi-location"], default: ["Stock tracking","Low stock alerts"] },
        { kind: "select", key: "stockMethod", label: "Stock method", options: ["FIFO","LIFO","Average cost"], default: "FIFO" },
      ]},
      { title: "Integrations", fields: [
        { kind: "checkboxes", key: "integrations", label: "Integrations", options: ["Shopify","WooCommerce","QuickBooks","Xero"], default: [] },
      ]},
      { title: "Review", fields: [{ kind: "review" }] },
    ],
  },
];

export function getTemplateById(id: string): TemplateMeta | undefined {
  return registry.find(template => template.id === id);
}