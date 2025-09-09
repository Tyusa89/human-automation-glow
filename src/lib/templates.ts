export interface Template {
  slug: string;
  title: string;
  category: "Support" | "Marketing" | "Ops" | "Data";
  description: string;
  complexity: "Easy" | "Medium" | "Advanced";
  thumbnail: string;
  features?: string[];
  techStack?: string[];
  demoUrl?: string;
}

export const templates: Template[] = [
  {
    slug: "appointment-booker",
    title: "Appointment Booker",
    category: "Support",
    description: "Books meetings, handles reschedules and reminders.",
    complexity: "Easy",
    thumbnail: "/thumbs/booker.png",
    features: [
      "Calendar integration",
      "Automated reminders", 
      "Reschedule handling",
      "Time zone support"
    ],
    techStack: ["React", "TypeScript", "Supabase", "Calendar API"]
  },
  {
    slug: "customer-support-widget",
    title: "Customer Support Widget", 
    category: "Support",
    description: "AI-powered customer support with ticket escalation.",
    complexity: "Medium",
    thumbnail: "/thumbs/support.png",
    features: [
      "AI chat assistant",
      "Ticket management",
      "Real-time support",
      "Admin dashboard"
    ],
    techStack: ["React", "OpenAI API", "Supabase", "WebSockets"]
  },
  {
    slug: "lead-qualification-bot",
    title: "Lead Qualification Bot",
    category: "Marketing",
    description: "Qualifies leads through intelligent conversations and scoring.",
    complexity: "Medium",
    thumbnail: "/thumbs/lead-qual.png",
    features: [
      "Conversational AI",
      "Lead scoring",
      "CRM integration",
      "Email automation"
    ],
    techStack: ["React", "OpenAI API", "Supabase", "Webhook API"],
    demoUrl: "https://demo.leadbot.com"
  },
  {
    slug: "social-media-scheduler",
    title: "Social Media Scheduler",
    category: "Marketing",
    description: "Schedule and manage posts across multiple platforms.",
    complexity: "Easy",
    thumbnail: "/thumbs/social.png",
    features: [
      "Multi-platform posting",
      "Content calendar",
      "Analytics tracking",
      "Bulk scheduling"
    ],
    techStack: ["React", "TypeScript", "Supabase", "Social APIs"]
  },
  {
    slug: "email-campaign-builder",
    title: "Email Campaign Builder",
    category: "Marketing",
    description: "Create and send personalized email campaigns with A/B testing.",
    complexity: "Advanced",
    thumbnail: "/thumbs/email.png",
    features: [
      "Drag & drop editor",
      "A/B testing",
      "Segmentation",
      "Analytics dashboard",
      "Automation workflows"
    ],
    techStack: ["React", "TypeScript", "Supabase", "SendGrid", "Chart.js"]
  },
  {
    slug: "inventory-manager",
    title: "Inventory Manager",
    category: "Ops",
    description: "Track inventory levels with automated reorder alerts.",
    complexity: "Easy",
    thumbnail: "/thumbs/inventory.png",
    features: [
      "Stock tracking",
      "Low stock alerts",
      "Supplier management",
      "Barcode scanning"
    ],
    techStack: ["React", "TypeScript", "Supabase", "Scanner API"]
  },
  {
    slug: "workflow-automation",
    title: "Workflow Automation",
    category: "Ops",
    description: "Automate business processes with custom triggers and actions.",
    complexity: "Advanced",
    thumbnail: "/thumbs/workflow.png",
    features: [
      "Visual workflow builder",
      "Custom triggers",
      "Multi-step automation",
      "Integration hub",
      "Error handling"
    ],
    techStack: ["React", "TypeScript", "Supabase", "Zapier API", "Node.js"],
    demoUrl: "https://demo.workflow.com"
  },
  {
    slug: "expense-tracker",
    title: "Expense Tracker",
    category: "Ops",
    description: "Track business expenses with receipt scanning and reporting.",
    complexity: "Medium",
    thumbnail: "/thumbs/expense.png",
    features: [
      "Receipt scanning",
      "Expense categorization",
      "Monthly reports",
      "Budget alerts"
    ],
    techStack: ["React", "TypeScript", "Supabase", "OCR API"]
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    category: "Data",
    description: "Real-time business analytics with custom KPI tracking.",
    complexity: "Advanced",
    thumbnail: "/thumbs/analytics.png",
    features: [
      "Real-time data",
      "Custom KPIs",
      "Interactive charts",
      "Export reports",
      "Data connectors"
    ],
    techStack: ["React", "TypeScript", "Supabase", "Chart.js", "D3.js"],
    demoUrl: "https://demo.analytics.com"
  },
  {
    slug: "data-sync-tool",
    title: "Data Sync Tool",
    category: "Data",
    description: "Synchronize data between multiple systems automatically.",
    complexity: "Medium",
    thumbnail: "/thumbs/sync.png",
    features: [
      "Multi-platform sync",
      "Conflict resolution",
      "Scheduled syncing",
      "Error logging"
    ],
    techStack: ["React", "TypeScript", "Supabase", "API Connectors"]
  },
  {
    slug: "report-generator",
    title: "Report Generator",
    category: "Data",
    description: "Generate custom reports from your data sources.",
    complexity: "Easy",
    thumbnail: "/thumbs/reports.png",
    features: [
      "Template library",
      "PDF generation",
      "Data visualization",
      "Scheduled reports"
    ],
    techStack: ["React", "TypeScript", "Supabase", "PDF.js"]
  }
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find(template => template.slug === slug);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter(template => template.category === category);
}