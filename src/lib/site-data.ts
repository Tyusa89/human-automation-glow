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
    name: "Free",
    displayName: "Beginner",
    blurb: "For getting started",
    monthlyPrice: "0",
    yearlyPrice: "0",
    dotColor: "green",
    includes: [
      "Beginner templates",
      "Basic dashboards",
      "Manual tracking",
      "Learning mode"
    ],
    unlockedTemplates: [
      "Appointment Booker",
      "Report Generator",
      "All Beginner templates"
    ],
    limits: [
      "No automation-heavy tools",
      "No advanced analytics"
    ],
    buttonText: "Get started free",
    buttonVariant: "outline",
    helperText: "No credit card required.",
    popular: false
  },
  { 
    name: "Pro",
    displayName: "Intermediate",
    blurb: "For automation & operations",
    monthlyPrice: "29",
    yearlyPrice: "290",
    yearlyMonthly: "24",
    dotColor: "orange",
    includes: [
      "Everything in Free",
      "Cross-tool syncing",
      "Operational tracking",
      "Intermediate workflows"
    ],
    unlockedTemplates: [
      "Data Sync Tool",
      "Expense Tracker",
      "Customer Support Widget",
      "All Beginner + Intermediate"
    ],
    limits: [],
    buttonText: "Upgrade to Pro",
    buttonVariant: "orange",
    helperText: "Pro is the most popular plan for automation and operations.",
    popular: true
  },
  { 
    name: "Business",
    displayName: "Advanced",
    blurb: "For scale, analytics, and insight",
    monthlyPrice: "99",
    yearlyPrice: "990",
    yearlyMonthly: "82",
    dotColor: "purple",
    includes: [
      "Everything in Pro",
      "Advanced dashboards",
      "KPIs & trend analysis",
      "Complex automations"
    ],
    unlockedTemplates: [
      "Analytics Dashboard",
      "Workflow Automation",
      "Data Sync Warehouse",
      "Lead Qualification Bot",
      "All templates"
    ],
    limits: [],
    buttonText: "Upgrade to Business",
    buttonVariant: "purple",
    helperText: "Most teams start on Pro and upgrade when analytics become mission-critical.",
    popular: false
  },
  { 
    name: "Enterprise",
    displayName: "Operator",
    blurb: "High-volume ops",
    monthlyPrice: "199",
    yearlyPrice: "1990",
    yearlyMonthly: "166",
    dotColor: "cyan",
    includes: [
      "Everything in Business",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantees",
      "Priority processing"
    ],
    unlockedTemplates: [
      "All templates",
      "Custom template builds",
      "White-label options"
    ],
    limits: [],
    buttonText: "Contact Sales",
    buttonVariant: "cyan",
    helperText: "For teams with high-volume operations and enterprise needs.",
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