// Template types and utilities

export type TemplateCategory = 
  | "Time / Scheduling" 
  | "Money" 
  | "Leads / CRM" 
  | "Automation / Ops" 
  | "Intelligence / AI";

export type Template = {
  id: string;
  title: string;
  tagline?: string;
  category: TemplateCategory;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  badges?: string[];
  hero?: string;
  gallery?: string[];
  description?: string;
  bullets?: string[];
  technologies?: string[];
  setupTime?: string;
  // New locked-in fields
  primaryJob: string;
  firstSuccessAction: string;
  actions?: {
    behavior: "wizard" | "scaffold";
    path?: string;
    api?: string;
  };
};

// 17 Templates - Final locked-in mapping
const fallbackRegistry: Template[] = [
  // ═══════════════════════════════════════════════════════════════
  // 🟢 CATEGORY 1: TIME / SCHEDULING
  // Job theme: Get booked automatically
  // ═══════════════════════════════════════════════════════════════
  {
    id: "appointment-booker",
    title: "Appointment Booker",
    tagline: "Get clients booked automatically",
    category: "Time / Scheduling",
    difficulty: "Beginner",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    description: "Automate your booking process so clients can schedule themselves without back-and-forth.",
    bullets: ["Self-service booking", "Automated reminders", "Reschedule handling"],
    technologies: ["Calendar API", "Email"],
    setupTime: "~10 seconds",
    primaryJob: "Get clients booked automatically",
    firstSuccessAction: "Test a booking",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "availability-manager",
    title: "Availability Manager",
    tagline: "Control when and how clients can book time",
    category: "Time / Scheduling",
    difficulty: "Beginner",
    badges: [],
    hero: "/assets/template-card-design.png",
    description: "Set your working hours, block off time, and control exactly when clients can book with you.",
    bullets: ["Working hours setup", "Buffer time between bookings", "Blackout dates"],
    technologies: ["Calendar sync"],
    setupTime: "~10 seconds",
    primaryJob: "Control when and how clients can book time",
    firstSuccessAction: "Set availability",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "calendar-sync",
    title: "Calendar Sync",
    tagline: "Keep all calendars in sync automatically",
    category: "Time / Scheduling",
    difficulty: "Beginner",
    badges: [],
    hero: "/assets/template-card-design.png",
    description: "Connect your calendars so availability is always accurate across all platforms.",
    bullets: ["Multi-calendar sync", "Conflict detection", "Real-time updates"],
    technologies: ["Google Calendar", "Outlook", "iCal"],
    setupTime: "~10 seconds",
    primaryJob: "Keep all calendars in sync automatically",
    firstSuccessAction: "Connect a calendar",
    actions: { behavior: "wizard", path: "/setup" },
  },

  // ═══════════════════════════════════════════════════════════════
  // 💰 CATEGORY 2: MONEY
  // Job theme: Track and grow revenue
  // ═══════════════════════════════════════════════════════════════
  {
    id: "income-tracker",
    title: "Income Tracker",
    tagline: "Track and understand your income",
    category: "Money",
    difficulty: "Beginner",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    description: "See exactly where your money is coming from and track income trends over time.",
    bullets: ["Income logging", "Source tracking", "Monthly summaries"],
    technologies: ["Database", "Charts"],
    setupTime: "~10 seconds",
    primaryJob: "Track and understand your income",
    firstSuccessAction: "Record income",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "payments-checkout",
    title: "Payments / Checkout",
    tagline: "Accept payments from clients",
    category: "Money",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "Create payment links and accept payments from clients quickly and securely.",
    bullets: ["Payment links", "Multiple payment methods", "Automatic receipts"],
    technologies: ["Stripe", "Payment gateway"],
    setupTime: "~10 seconds",
    primaryJob: "Accept payments from clients",
    firstSuccessAction: "Create a payment link",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "revenue-analytics",
    title: "Revenue Analytics",
    tagline: "Understand revenue trends and performance",
    category: "Money",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "Get clear visibility into your revenue performance with charts and breakdowns.",
    bullets: ["Revenue trends", "Client breakdown", "Goal tracking"],
    technologies: ["Analytics", "Charts"],
    setupTime: "~10 seconds",
    primaryJob: "Understand revenue trends and performance",
    firstSuccessAction: "View revenue breakdown",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "invoicing",
    title: "Invoicing",
    tagline: "Bill clients professionally and on time",
    category: "Money",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "Create and send professional invoices to clients with payment tracking.",
    bullets: ["Invoice templates", "Payment reminders", "Status tracking"],
    technologies: ["PDF generation", "Email"],
    setupTime: "~10 seconds",
    primaryJob: "Bill clients professionally and on time",
    firstSuccessAction: "Create an invoice",
    actions: { behavior: "wizard", path: "/setup" },
  },

  // ═══════════════════════════════════════════════════════════════
  // 🧲 CATEGORY 3: LEADS / CRM
  // Job theme: Capture and convert leads
  // ═══════════════════════════════════════════════════════════════
  {
    id: "lead-capture",
    title: "Lead Capture",
    tagline: "Capture new leads automatically",
    category: "Leads / CRM",
    difficulty: "Beginner",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    description: "Automatically capture and organize leads from your website and other sources.",
    bullets: ["Form capture", "Lead enrichment", "Source tracking"],
    technologies: ["Forms", "Database"],
    setupTime: "~10 seconds",
    primaryJob: "Capture new leads automatically",
    firstSuccessAction: "Add a lead",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "contact-manager",
    title: "Contact Manager",
    tagline: "Organize and manage client contacts",
    category: "Leads / CRM",
    difficulty: "Beginner",
    badges: [],
    hero: "/assets/template-card-design.png",
    description: "Keep all your client contacts organized and accessible in one place.",
    bullets: ["Contact database", "Tags and segments", "Notes and history"],
    technologies: ["Database"],
    setupTime: "~10 seconds",
    primaryJob: "Organize and manage client contacts",
    firstSuccessAction: "Review contacts",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "follow-up-system",
    title: "Follow-Up System",
    tagline: "Stay in touch with leads and clients automatically",
    category: "Leads / CRM",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "Never forget to follow up. Automated reminders and sequences keep you connected.",
    bullets: ["Follow-up reminders", "Email sequences", "Touch tracking"],
    technologies: ["Email", "Automation"],
    setupTime: "~10 seconds",
    primaryJob: "Stay in touch with leads and clients automatically",
    firstSuccessAction: "Send a follow-up",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "crm-pipeline",
    title: "CRM Pipeline",
    tagline: "Track leads from first contact to conversion",
    category: "Leads / CRM",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "Visualize your sales pipeline and track every lead's journey to becoming a client.",
    bullets: ["Pipeline stages", "Deal tracking", "Conversion metrics"],
    technologies: ["CRM", "Database"],
    setupTime: "~10 seconds",
    primaryJob: "Track leads from first contact to conversion",
    firstSuccessAction: "Move a lead to the next stage",
    actions: { behavior: "wizard", path: "/setup" },
  },

  // ═══════════════════════════════════════════════════════════════
  // ⚙️ CATEGORY 4: AUTOMATION / OPS
  // Job theme: Eliminate repetitive work
  // ═══════════════════════════════════════════════════════════════
  {
    id: "workflow-automation",
    title: "Workflow Automation",
    tagline: "Automate repetitive business tasks",
    category: "Automation / Ops",
    difficulty: "Advanced",
    badges: ["Business"],
    hero: "/assets/template-card-design.png",
    description: "Set up automated workflows that handle repetitive tasks without your intervention.",
    bullets: ["Trigger-based automation", "Multi-step workflows", "Integration support"],
    technologies: ["Workflow engine", "APIs"],
    setupTime: "~10 seconds",
    primaryJob: "Automate repetitive business tasks",
    firstSuccessAction: "Run an automation",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "task-automation",
    title: "Task Automation",
    tagline: "Automatically manage recurring tasks",
    category: "Automation / Ops",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "Create rules that automatically create, assign, and manage recurring tasks.",
    bullets: ["Recurring task rules", "Auto-assignment", "Due date automation"],
    technologies: ["Task engine", "Rules"],
    setupTime: "~10 seconds",
    primaryJob: "Automatically manage recurring tasks",
    firstSuccessAction: "Create a task rule",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "system-monitor",
    title: "System Monitor",
    tagline: "Monitor automations and catch issues early",
    category: "Automation / Ops",
    difficulty: "Advanced",
    badges: ["Business"],
    hero: "/assets/template-card-design.png",
    description: "Keep an eye on all your automations and get alerted when something goes wrong.",
    bullets: ["Run history", "Error alerts", "Performance metrics"],
    technologies: ["Monitoring", "Alerts"],
    setupTime: "~10 seconds",
    primaryJob: "Monitor automations and catch issues early",
    firstSuccessAction: "Review recent runs",
    actions: { behavior: "wizard", path: "/setup" },
  },

  // ═══════════════════════════════════════════════════════════════
  // 🧠 CATEGORY 5: INTELLIGENCE / AI
  // Job theme: Get guidance and automation
  // ═══════════════════════════════════════════════════════════════
  {
    id: "ai-assistant",
    title: "AI Assistant",
    tagline: "Ask questions and get intelligent guidance",
    category: "Intelligence / AI",
    difficulty: "Beginner",
    badges: ["Popular"],
    hero: "/assets/template-card-design.png",
    description: "Your personal AI assistant that answers questions and helps you make better decisions.",
    bullets: ["Natural language Q&A", "Business context aware", "24/7 availability"],
    technologies: ["AI API", "Knowledge base"],
    setupTime: "~10 seconds",
    primaryJob: "Ask questions and get intelligent guidance",
    firstSuccessAction: "Ask your first question",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "business-insights",
    title: "Business Insights",
    tagline: "Get insights about what to improve next",
    category: "Intelligence / AI",
    difficulty: "Intermediate",
    badges: ["Pro"],
    hero: "/assets/template-card-design.png",
    description: "AI-powered insights that analyze your business and suggest improvements.",
    bullets: ["Performance analysis", "Opportunity detection", "Actionable suggestions"],
    technologies: ["AI API", "Analytics"],
    setupTime: "~10 seconds",
    primaryJob: "Get insights about what to improve next",
    firstSuccessAction: "Review insights",
    actions: { behavior: "wizard", path: "/setup" },
  },
  {
    id: "recommendation-engine",
    title: "Recommendation Engine",
    tagline: "Receive personalized recommendations automatically",
    category: "Intelligence / AI",
    difficulty: "Advanced",
    badges: ["Business"],
    hero: "/assets/template-card-design.png",
    description: "Get personalized recommendations based on your business data and goals.",
    bullets: ["Personalized suggestions", "Goal-based recommendations", "Learning system"],
    technologies: ["AI API", "Machine learning"],
    setupTime: "~10 seconds",
    primaryJob: "Receive personalized recommendations automatically",
    firstSuccessAction: "View recommendations",
    actions: { behavior: "wizard", path: "/setup" },
  },
];

export function getTemplateById(id: string): Template | undefined {
  return fallbackRegistry.find(template => template.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return fallbackRegistry.filter(template => template.category === category);
}

export function getAllCategories(): TemplateCategory[] {
  return [
    "Time / Scheduling",
    "Money",
    "Leads / CRM",
    "Automation / Ops",
    "Intelligence / AI",
  ];
}

export { fallbackRegistry };
