import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { 
  Bot, Workflow, LayoutTemplate, ArrowRight, CheckCircle2, 
  Briefcase, Lightbulb, Users, Building2, Sparkles, Zap
} from "lucide-react";

/** EcoNest – Landing Page with Target Audience Positioning */
type Template = {
  id: string;
  name: string;
  category: "agent" | "flow" | "data" | "integration" | "channel" | "policy";
  description: string;
  requiredIntegrations: string[];
  steps: string[];
  estimatedSetup: string;
};

const TEMPLATES: Record<Template["category"], Template> = {
  agent: {
    id: "agent-support-bot",
    name: "Agent • Support Bot",
    category: "agent",
    description:
      "Customer-facing AI agent with tools, memory, and guardrails. Handles FAQs, gathers context, and escalates cleanly.",
    requiredIntegrations: ["Knowledge Base (Notion/Docs)", "Slack"],
    steps: [
      "Import FAQs / knowledge base",
      "Configure guardrails & tone",
      "Connect escalation channel",
      "Embed on site / chat",
    ],
    estimatedSetup: "~8 min",
  },
  flow: {
    id: "flow-triage-escalate",
    name: "Flow • Triage + Escalate",
    category: "flow",
    description:
      "Multi-step workflow with triggers, branches, retries, and human-in-the-loop approval.",
    requiredIntegrations: ["Webhook", "Slack"],
    steps: ["Define trigger", "Add routing rules", "Set approvals", "Publish"],
    estimatedSetup: "~10 min",
  },
  data: {
    id: "data-sync-warehouse",
    name: "Data • Sync to Warehouse",
    category: "data",
    description:
      "Validate, normalize, and sync structured data to your sheet/DB/warehouse.",
    requiredIntegrations: ["Google Sheets", "Postgres"],
    steps: ["Define schema", "Add validation", "Map destinations", "Schedule sync"],
    estimatedSetup: "~7 min",
  },
  integration: {
    id: "integration-zendesk",
    name: "Integration • Zendesk + Slack",
    category: "integration",
    description:
      "Wire Zendesk events into flows. Notify Slack channels and create tickets from agents.",
    requiredIntegrations: ["Zendesk", "Slack"],
    steps: ["Auth Zendesk", "Auth Slack", "Pick events", "Test + enable"],
    estimatedSetup: "~6 min",
  },
  channel: {
    id: "channel-web-widget",
    name: "Channel • Web Widget",
    category: "channel",
    description:
      "Deploy your agent or flow to a web widget with brand styling and auth.",
    requiredIntegrations: ["Website Embed"],
    steps: ["Customize theme", "Set auth rules", "Copy embed code", "Go live"],
    estimatedSetup: "~5 min",
  },
  policy: {
    id: "policy-guardrails",
    name: "Policy • Guardrails",
    category: "policy",
    description:
      "Define safety, data handling, and escalation rules applied across agents and flows.",
    requiredIntegrations: ["—"],
    steps: ["Select ruleset", "Add PII controls", "Set escalation", "Apply to assets"],
    estimatedSetup: "~4 min",
  },
};

const audiences = [
  { icon: Briefcase, label: "Service businesses", description: "Consultants, coaches, agencies" },
  { icon: Lightbulb, label: "Solo founders & creators", description: "Independent operators" },
  { icon: Users, label: "Small teams & startups", description: "Growing businesses" },
  { icon: Building2, label: "Operations-heavy businesses", description: "Process-driven orgs" },
];

const popularTemplates = [
  { name: "Appointment Booking", tag: "Popular with consultants" },
  { name: "Analytics Dashboard", tag: "Great for agencies" },
  { name: "Lead Qualification Bot", tag: "Common for solo founders" },
  { name: "Customer Support Widget", tag: "Essential for teams" },
  { name: "Workflow Automation", tag: "Operations favorite" },
];

export default function Index() {
  const navigate = useNavigate();
  const [preview, setPreview] = useState<Template | null>(null);

  return (
    <AppShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Automation Platform
            </div>

            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              Automations that run your business
              <span className="block text-primary">— without the complexity</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              EcoNest is an AI-powered automation platform designed for service businesses, 
              solo founders, and small teams who want real results, not technical headaches.
            </p>

            <p className="mt-4 text-base text-muted-foreground">
              Build workflows, deploy AI agents, and connect your tools — all from one place.
            </p>

            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                to="/auth?mode=signup"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Start free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-base font-semibold text-white hover:bg-accent transition-colors"
              >
                View templates
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who EcoNest Is For */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Built for real businesses — not just developers
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              EcoNest is designed for people who want automation to work, not become another project.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((audience) => (
              <div
                key={audience.label}
                className="rounded-xl border border-border/50 bg-card p-5 text-center hover:border-primary/30 transition-colors"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <audience.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-white">{audience.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{audience.description}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don't see yourself listed? <span className="text-primary">EcoNest adapts to your workflow.</span>
          </p>
        </div>
      </section>

      {/* What You Can Do */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              What you can do with EcoNest
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="AI Agents"
              desc="Autonomous assistants that think, plan, and act — handling tasks like scheduling, lead qualification, and support."
              icon={<Bot className="h-6 w-6" />}
              onClick={() => navigate('/solutions')}
            />
            <FeatureCard
              title="Automations"
              desc="Reliable workflows powered by n8n + Supabase to connect your tools and eliminate manual work."
              icon={<Workflow className="h-6 w-6" />}
              onClick={() => navigate('/templates')}
            />
            <FeatureCard
              title="Templates"
              desc="Production-ready systems you can install, customize, and launch in minutes."
              icon={<LayoutTemplate className="h-6 w-6" />}
              onClick={() => navigate('/templates')}
            />
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Start fast with ready-to-use templates
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Skip setup fatigue. Choose a template and let EcoNest guide the rest.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popularTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => navigate('/templates')}
                className="group flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 text-left hover:border-primary/30 hover:bg-accent/50 transition-all"
              >
                <div>
                  <h3 className="font-medium text-white">{template.name}</h3>
                  <p className="text-xs text-primary/80">{template.tag}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Each template includes guided setup, best-practice defaults, and optional customization.
          </p>

          <div className="mt-6 text-center">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              Browse all templates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Personalization */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                A dashboard that adapts to you
              </h2>
              <p className="mt-4 text-muted-foreground">
                EcoNest personalizes your experience based on your business type, 
                goals, and how you actually use the platform.
              </p>
              
              <ul className="mt-6 space-y-3">
                {[
                  "Focused suggestions based on your work",
                  "Relevant widgets — not everything at once",
                  "Less noise over time",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm font-medium text-white">
                No clutter. No wasted clicks.
              </p>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Focus Today</div>
                    <div className="text-xs text-muted-foreground">3 tasks prioritized for you</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Follow-up Queue</div>
                    <div className="text-xs text-muted-foreground">2 clients need your attention</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">Smart Suggestion</div>
                    <div className="text-xs text-muted-foreground">"Connect your calendar"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Without Overwhelm */}
      <section className="border-t border-border/50 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Powerful — without the overwhelm
          </h2>
          
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Clarity over complexity
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Automation without lock-in
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Growth without rebuilding
            </div>
          </div>

          <p className="mt-6 text-muted-foreground max-w-xl mx-auto">
            Whether you're just getting started or scaling operations, EcoNest grows with you.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Get started in minutes
          </h2>
          <p className="mt-3 text-muted-foreground">
            Create an account, answer a few questions once, and launch your first automation.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/auth?mode=signup"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Start free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/contact?type=demo"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-6 py-3.5 text-base font-semibold text-white hover:bg-accent transition-colors"
            >
              Book a demo
            </Link>
          </div>

          <p className="mt-10 text-sm text-muted-foreground">
            EcoNest AI — flexible automation for modern businesses.
          </p>
        </div>
      </section>

      {/* Modal */}
      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </AppShell>
  );
}

/* ------------------------------ Primitives ------------------------------- */
function FeatureCard({ 
  title, 
  desc, 
  icon, 
  onClick 
}: { 
  title: string; 
  desc: string; 
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 text-left"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        {title}
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </h3>
      <p className="mt-2 text-muted-foreground">{desc}</p>
    </button>
  );
}

/* ------------------------------ Modal ------------------------------------ */
function TemplatePreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const navigate = useNavigate();
  
  const handleUseTemplate = () => {
    navigate(`/templates/${template.id}/setup`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tpl-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 id="tpl-title" className="text-xl font-bold tracking-tight">{template.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{template.description}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-muted-foreground hover:bg-accent">✕</button>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold">Required integrations</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {template.requiredIntegrations.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold">Steps</h4>
          <ol className="mt-2 list-inside list-decimal text-sm text-muted-foreground">
            {template.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estimated setup: {template.estimatedSetup}</span>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-accent">Close</button>
            <button onClick={handleUseTemplate} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Use template</button>
          </div>
        </div>
      </div>
    </div>
  );
}
