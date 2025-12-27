import { Link } from "react-router-dom";
import { 
  Rocket, LayoutTemplate, Workflow, Plug, AlertCircle, 
  ArrowRight, HelpCircle 
} from "lucide-react";

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Docs</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need — when you need it.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Clear guides for setting up templates, automations, and dashboards.
        </p>
      </div>

      {/* Start here */}
      <section className="mb-12">
        <p className="text-xs font-medium text-primary uppercase tracking-wide mb-4">
          Start here
        </p>
        <div className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold text-white">Getting Started</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Install your first template and launch quickly.
          </p>
          <p className="text-sm text-muted-foreground mb-2">Short guides to:</p>
          <ul className="space-y-1 text-sm text-muted-foreground ml-4 mb-4">
            <li>• account setup</li>
            <li>• connecting tools</li>
            <li>• understanding the dashboard</li>
          </ul>
          <Link
            to="/docs/getting-started"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Start setup
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Core concepts */}
      <section className="mb-12">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Core concepts
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Templates */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <LayoutTemplate className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">Templates</h3>
            <p className="text-sm text-muted-foreground mb-3">
              How templates work, how to customize them, and when to use them.
            </p>
            <Link
              to="/docs/templates"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Template guides
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Automations */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <Workflow className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">Automations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Understand workflows, triggers, and background processes. No deep scripting required.
            </p>
            <Link
              to="/docs/solutions"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Automation basics
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Integrations */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <Plug className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">Integrations</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Connect EcoNest to calendars, forms, CRMs, and messaging tools.
            </p>
            <Link
              to="/docs/integrations"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Integration guides
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* When something doesn't work */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
          When something does not work
        </p>
        <div className="rounded-xl border border-border/50 bg-card/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-lg font-semibold text-white">Troubleshooting</h2>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Common issues and how to fix them quickly.
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground ml-4 mb-4">
            <li>• connection errors</li>
            <li>• missing data</li>
            <li>• automation delays</li>
          </ul>
          <Link
            to="/docs/troubleshooting"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Troubleshooting
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Need help */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-white">Need help?</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">If you are stuck:</p>
        <ul className="space-y-1 text-sm text-muted-foreground ml-4">
          <li>• check the relevant guide</li>
          <li>• review template settings</li>
          <li>• contact support</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Docs are here to support the product — not slow you down.
        </p>
      </section>

      {/* Soft CTA */}
      <div className="rounded-lg bg-muted/30 p-4 text-center mb-8">
        <p className="text-sm text-muted-foreground">
          Not sure where to start?{" "}
          <Link to="/templates" className="text-primary hover:underline">Templates</Link>
          {" are the fastest way to get value."}
        </p>
      </div>

      {/* Footer micro-line */}
      <div className="pt-8 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          Most users will not need the docs every day. EcoNest is designed to work quietly in the background.
        </p>
      </div>
    </main>
  );
}
