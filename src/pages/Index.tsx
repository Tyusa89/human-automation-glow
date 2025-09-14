import { Link } from "react-router-dom";
import { useState } from "react";

/** EcoNest – New Landing with Template Preview modal */
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

export default function Index() {
  const [preview, setPreview] = useState<Template | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* Left block */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded-full bg-secondary/70 px-2.5 py-1 font-medium text-secondary-foreground">Home</span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">Beta</span>
                <span className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">Zapier × Intercom vibe</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
                Build AI agents and automations — visually
              </h1>

              <p className="mt-4 text-lg text-muted-foreground">
                EcoNest is your Zapier-meets-Intercom workspace: design automations, launch customer-facing agents,
                and wire them to your data — all in one place.
              </p>

              <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row">
                <Link
                  to="/auth?mode=signup"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow hover:bg-primary/90"
                >
                  Start free
                </Link>
                <Link
                  to="/contact?type=demo"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-background px-5 py-3 text-base font-semibold text-primary hover:bg-accent"
                >
                  Book a demo
                </Link>

                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Visual Studio • Templates • Integrations
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
                <span>GDPR-ready</span>
                <span>RLS/Row Security</span>
                <span>Self-host option</span>
              </div>
            </div>

            {/* Right card: Visual Automation Studio */}
            <div className="mx-auto w-full max-w-xl">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-elegant">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold">Visual Automation Studio</h3>
                  <span className="text-xs text-muted-foreground">Drag, connect, and publish without code.</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <StudioTile label="Agent" icon={<IconAgent />} onClick={() => setPreview(TEMPLATES.agent)} />
                  <StudioTile label="Flow" icon={<IconFlow />} onClick={() => setPreview(TEMPLATES.flow)} />
                  <StudioTile label="Data" icon={<IconData />} onClick={() => setPreview(TEMPLATES.data)} />
                  <StudioTile label="Integration" icon={<IconPlug />} onClick={() => setPreview(TEMPLATES.integration)} />
                  <StudioTile label="Channel" icon={<IconChannel />} onClick={() => setPreview(TEMPLATES.channel)} />
                  <StudioTile label="Policy" icon={<IconShield />} onClick={() => setPreview(TEMPLATES.policy)} />
                </div>
              </div>
            </div>
          </div>

          {/* Feature cards row */}
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Automations"
              desc="Multi-step workflows with triggers, branches, retries, and human-in-the-loop steps."
              icon={<IconNodes />}
            />
            <FeatureCard
              title="Agents"
              desc="LLM-powered agents with tools, memory, and guardrails — deploy to web, chat, or voice."
              icon={<IconAgent />}
            />
            <FeatureCard
              title="Integrations"
              desc="Directory + generic API/Webhook & DB connectors for anything custom."
              icon={<IconPlug />}
            />
          </div>
        </div>
      </section>

      {/* Modal */}
      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
        />
      )}

      <Footer />
    </div>
  );
}

/* ------------------------------- Footer ---------------------------------- */
function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm">© {new Date().getFullYear()} EcoNest. All rights reserved.</p>
          <nav aria-label="Footer" className="text-sm">
            <ul className="flex items-center gap-4">
              <li><Link to="/trust" className="hover:text-foreground">Trust</Link></li>
              <li><Link to="/docs" className="hover:text-foreground">Docs</Link></li>
              <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ Primitives ------------------------------- */
function StudioTile({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl border border-border bg-muted px-4 py-3 text-left text-foreground hover:bg-accent transition-colors"
    >
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background text-muted-foreground">
        {icon}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-muted-foreground">{desc}</p>
    </div>
  );
}

/* ------------------------------ Modal ------------------------------------ */
function TemplatePreviewModal({ template, onClose }: { template: Template; onClose: () => void }) {
  const link = `/templates?cat=${template.category}&id=${template.id}`;
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
            <Link to={link} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Use template</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Icons ---------------------------------- */
function IconAgent() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="8" width="18" height="10" rx="2" />
      <path d="M12 2v4" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
    </svg>
  );
}
function IconFlow() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 3h12M6 21h12" />
      <rect x="4" y="6" width="6" height="6" rx="2" />
      <rect x="14" y="12" width="6" height="6" rx="2" />
      <path d="M10 9h4m-8 6h4" />
    </svg>
  );
}
function IconData() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v10c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
    </svg>
  );
}
function IconPlug() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 7V3m6 4V3" />
      <path d="M7 13l10-2" />
      <rect x="3" y="9" width="8" height="8" rx="2" />
      <rect x="13" y="7" width="8" height="8" rx="2" />
    </svg>
  );
}
function IconChannel() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="7" cy="12" r="3" />
      <circle cx="17" cy="12" r="3" />
      <path d="M10 12h4" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 3l7 4v5c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V7l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconNodes() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="5" r="2" />
      <circle cx="12" cy="19" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h10M12 7v10" />
    </svg>
  );
}