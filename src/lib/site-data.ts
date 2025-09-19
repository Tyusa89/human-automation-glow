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
    blurb: "Kick the tires and ship a small pilot.", 
    features: [
      "1 templates",
      "500 events / mo", 
      "1 seats",
      "Yes",
      "Up to 25 docs",
      "Basic (1 cron job)",
      "Community email",
      "NLS + API keys"
    ],
    buttonText: "Get started free",
    buttonVariant: "outline",
    popular: false
  },
  { 
    name: "Growth", 
    price: "$29/mo", 
    monthlyPrice: "29",
    yearlyPrice: "290",
    blurb: "Launch real workflows with your team.", 
    features: [
      "Up to 3 templates",
      "10,000 events / mo", 
      "3 seats",
      "Yes",
      "Up to 250 docs", 
      "Advanced (5 cron jobs)",
      "Standard email",
      "NLS + secrets vault + audit basics"
    ],
    buttonText: "Choose Growth",
    buttonVariant: "outline",
    popular: false
  },
  { 
    name: "Business", 
    price: "$79/mo", 
    monthlyPrice: "79",
    yearlyPrice: "790",
    blurb: "Most popular. Scale automation across teams.", 
    features: [
      "Unlimited templates",
      "50,000 events / mo",
      "10 seats", 
      "Yes + custom webhooks",
      "Up to 2,000 docs",
      "Custom flows (15 cron jobs) + retries",
      "Priority email + Slack",
      "Audit logs, RBAC, data export"
    ],
    buttonText: "Choose Business",
    buttonVariant: "default",
    popular: true
  },
  { 
    name: "Pro", 
    price: "$199/mo", 
    monthlyPrice: "199",
    yearlyPrice: "1990",
    blurb: "For heavy usage & advanced controls.", 
    features: [
      "Unlimited templates",
      "200,000 events / mo",
      "25 seats",
      "All + API access", 
      "Unlimited",
      "Unlimited cron + queue workers",
      "Success manager + SLA",
      "SSO/SAML granular RBAC, SOC2-friendly"
    ],
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