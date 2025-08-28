export const templateCards = [
  { title: "Lead‑Qual Agent", desc: "Captures site visitors, scores leads, syncs to CRM, and books meetings." },
  { title: "Support Triage", desc: "Resolves FAQs with AI, routes edge cases to human agents, logs in Helpdesk." },
  { title: "Onboarding Flow", desc: "Guided signup with form + agent combo; triggers workspace + welcome emails." },
  { title: "Data Enrichment", desc: "Research agent enriches prospects from domain to CRM." },
];

export const integrations = [
  "Slack", "Gmail", "Google Sheets", "HubSpot", "Salesforce", "Zendesk", "Twilio", "Notion", "Postgres", "Webhook",
];

export const pricing = [
  { name: "Starter", price: "$0", blurb: "Explore & test", features: ["1 workspace", "2 agents · 1,000 msgs/mo", "10 templates", "Community support"] },
  { name: "Pro", price: "$39", blurb: "Solo & small teams", features: ["Unlimited templates", "5 agents · 10k msgs/mo", "Integrations directory", "Email support"] },
  { name: "Business", price: "Custom", blurb: "Scale ops", features: ["SSO, Roles & RLS", "VPC / self‑host options", "Audit logs & SLA", "Dedicated success"] },
];