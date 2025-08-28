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
  }
];

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find(template => template.slug === slug);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return templates.filter(template => template.category === category);
}