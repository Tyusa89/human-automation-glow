export type Template = {
  id: string;
  name: string;
  category: "Support" | "Marketing" | "Ops" | "Data";
  difficulty: "Easy" | "Medium" | "Advanced";
  description: string;
  features: string[];
};

export const TEMPLATES: Template[] = [
  {
    id: "appointment-booker",
    name: "Appointment Booker",
    category: "Support",
    difficulty: "Easy",
    description: "Books meetings, handles reschedules and reminders.",
    features: ["Calendar integration", "Automated reminders", "Reschedule handling"],
  },
  {
    id: "customer-support-widget",
    name: "Customer Support Widget",
    category: "Support",
    difficulty: "Medium",
    description: "AI-powered customer support with ticket escalation.",
    features: ["AI chat assistant", "Ticket management", "Real-time support"],
  },
  {
    id: "lead-qualification-bot",
    name: "Lead Qualification Bot",
    category: "Marketing",
    difficulty: "Medium",
    description: "Qualifies leads through intelligent conversations and scoring.",
    features: ["Conversational AI", "Lead scoring", "CRM integration"],
  },
  {
    id: "social-media-scheduler",
    name: "Social Media Scheduler",
    category: "Marketing",
    difficulty: "Easy",
    description: "Schedule and manage posts across multiple platforms.",
    features: ["Multi-platform posting", "Content calendar", "Analytics tracking"],
  },
  {
    id: "email-campaign-builder",
    name: "Email Campaign Builder",
    category: "Marketing",
    difficulty: "Advanced",
    description: "Create and send personalized email campaigns with A/B testing.",
    features: ["Drag & drop editor", "A/B testing", "Segmentation"],
  },
  {
    id: "inventory-manager",
    name: "Inventory Manager",
    category: "Ops",
    difficulty: "Easy",
    description: "Track inventory levels with automated reorder alerts.",
    features: ["Stock tracking", "Low stock alerts", "Supplier management"],
  },
  {
    id: "workflow-automation",
    name: "Workflow Automation",
    category: "Ops",
    difficulty: "Advanced",
    description: "Automate business processes with custom triggers and actions.",
    features: ["Visual workflow builder", "Custom triggers", "Multi-step automation"],
  },
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    category: "Ops",
    difficulty: "Medium",
    description: "Track business expenses with receipt scanning and reporting.",
    features: ["Receipt scanning", "Expense categorization", "Monthly reports"],
  },
  {
    id: "analytics-dashboard",
    name: "Analytics Dashboard",
    category: "Data",
    difficulty: "Advanced",
    description: "Real-time business analytics with custom KPI tracking.",
    features: ["Real-time data", "Custom KPIs", "Interactive charts"],
  },
  {
    id: "data-sync-tool",
    name: "Data Sync Tool",
    category: "Data",
    difficulty: "Medium",
    description: "Synchronize data between multiple systems automatically.",
    features: ["Multi-platform sync", "Conflict resolution", "Scheduled syncing"],
  },
  {
    id: "report-generator",
    name: "Report Generator",
    category: "Data",
    difficulty: "Easy",
    description: "Generate custom reports from your data sources.",
    features: ["Template library", "PDF generation", "Data visualization"],
  }
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return TEMPLATES.filter(template => template.category === category);
}