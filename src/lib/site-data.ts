export const templateCards = [
  { title: "Lead‑Qual Agent", desc: "Captures visitors, scores leads, syncs to CRM, books meetings." },
  { title: "Support Triage", desc: "Resolves FAQs with AI and routes edge cases to human agents." },
  { title: "Onboarding Flow", desc: "Guided signup; triggers workspace + welcomes + checklists." },
  { title: "Data Enrichment", desc: "Research agent enriches prospects from domain to CRM." },
];

export const integrations = [
  "Slack","Gmail","Google Sheets","HubSpot","Salesforce","Zendesk","Twilio","Notion","Postgres","Webhook",
];

export const pricing = [
  { 
    name: "Starter", 
    price: "Free", 
    monthlyPrice: "Free",
    yearlyPrice: "Free",
    blurb: "Kick the tires and get organized", 
    features: {
      templates: "1 starter template",
      actions: "Up to 500 per month",
      seats: "1 user",
      webhooks: "Included",
      docs: "Up to 25 documents",
      automation: "Basic workflows (1 scheduled automation)",
      dashboard: "Personalized setup & manual customization",
      support: "Community email",
      security: "API keys + basic encryption"
    },
    buttonText: "Get started free",
    buttonVariant: "outline",
    popular: false
  },
  { 
    name: "Growth", 
    price: "$29/mo", 
    monthlyPrice: "29",
    yearlyPrice: "290",
    blurb: "Launch real workflows and stay organized", 
    features: {
      templates: "Up to 3 templates",
      actions: "Up to 10,000 per month",
      seats: "Up to 3 users",
      webhooks: "Included",
      docs: "Up to 250 documents",
      automation: "Advanced workflows (up to 5 scheduled automations)",
      dashboard: "Personalized dashboard with customization controls",
      support: "Standard email",
      security: "Secrets vault + basic audit logging"
    },
    buttonText: "Choose Growth",
    buttonVariant: "outline",
    popular: false
  },
  { 
    name: "Business", 
    price: "$79/mo", 
    monthlyPrice: "79",
    yearlyPrice: "790",
    blurb: "Scale automation with intelligence across teams", 
    features: {
      templates: "Unlimited templates",
      actions: "Up to 50,000 per month",
      seats: "Up to 10 users",
      webhooks: "Custom webhooks included",
      docs: "Up to 2,000 documents",
      automation: "Custom workflows, retries, and up to 15 schedules",
      dashboard: "Adaptive dashboard with smart suggestions",
      insights: "Activity tracking & behavior-based recommendations",
      support: "Priority email + Slack",
      security: "Audit logs, role-based access, data export"
    },
    buttonText: "Choose Business",
    buttonVariant: "default",
    popular: true
  },
  { 
    name: "Pro", 
    price: "$199/mo", 
    monthlyPrice: "199",
    yearlyPrice: "1990",
    blurb: "Advanced control for high-volume operations", 
    features: {
      templates: "Unlimited templates",
      actions: "Up to 200,000 per month",
      seats: "Up to 25 users",
      webhooks: "All webhooks + API access",
      docs: "Unlimited documents",
      automation: "Unlimited workflows, schedules, and queue workers",
      dashboard: "Advanced intelligence & optimization suggestions",
      insights: "High-volume monitoring and operational visibility",
      support: "Dedicated success manager + SLA",
      security: "SSO / SAML, granular RBAC, SOC-2–friendly controls"
    },
    buttonText: "Talk to sales",
    buttonVariant: "outline",
    popular: false
  }
];

export const addOns = [
  { name: "Extra events", description: "+10,000 / mo", price: "$10/mo" },
  { name: "Extra seats", description: "+1 member", price: "$5/mo" },
  { name: "Security pack", description: "Extended logs & retention controls", price: "$49/mo" }
];

export const faqItems = [
  {
    question: "How do you count \"events\"?",
    answer: "Events are counted based on the number of interactions with your automation workflows, including triggers, actions, and data processing operations."
  },
  {
    question: "Can I switch plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "Are SMS/email costs included?",
    answer: "Basic email functionality is included in all plans. SMS and advanced email features may incur additional costs based on usage."
  },
  {
    question: "Do you offer discounts?",
    answer: "We offer annual billing discounts and special pricing for startups, nonprofits, and educational institutions. Contact our sales team for more information."
  }
];