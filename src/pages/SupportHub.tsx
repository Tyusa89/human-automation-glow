import { Link } from "react-router-dom";
import { 
  Rocket, LayoutTemplate, Workflow, Plug, AlertCircle, 
  ArrowRight, MessageCircle 
} from "lucide-react";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Support</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Help when you need it — out of the way when you don't.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Everything here is designed to get you unstuck quickly and back to work.
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
            New to EcoNest or setting something up for the first time.
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground ml-4 mb-4">
            <li>• account basics</li>
            <li>• connecting tools</li>
            <li>• understanding the dashboard</li>
          </ul>
          <Link
            to="/support/getting-started"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Start here
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Core guides */}
      <section className="mb-12">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-4">
          Core guides
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Templates */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <LayoutTemplate className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">Templates</h3>
            <p className="text-sm text-muted-foreground mb-1">
              How templates work and how to customize them.
            </p>
            <ul className="space-y-0.5 text-xs text-muted-foreground ml-3 mb-3">
              <li>• installation</li>
              <li>• configuration</li>
              <li>• common adjustments</li>
            </ul>
            <Link
              to="/support/templates"
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
            <p className="text-sm text-muted-foreground mb-1">
              Understand workflows, triggers, and background behavior.
            </p>
            <ul className="space-y-0.5 text-xs text-muted-foreground ml-3 mb-3">
              <li>• how automations run</li>
              <li>• delays and retries</li>
              <li>• expected behavior</li>
            </ul>
            <Link
              to="/support/solutions"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Automation guides
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Integrations */}
          <div className="rounded-xl border border-border/50 bg-card/50 p-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
              <Plug className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-white mb-2">Integrations</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Connect EcoNest to the tools you already use.
            </p>
            <ul className="space-y-0.5 text-xs text-muted-foreground ml-3 mb-3">
              <li>• calendars</li>
              <li>• forms</li>
              <li>• CRMs</li>
              <li>• messaging tools</li>
            </ul>
            <Link
              to="/support/integrations"
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
            Quick fixes for common issues.
          </p>
          <ul className="space-y-1 text-sm text-muted-foreground ml-4 mb-3">
            <li>• integrations not syncing</li>
            <li>• missing data</li>
            <li>• automation delays</li>
          </ul>
          <p className="text-xs text-muted-foreground mb-4">
            Most issues can be resolved in a few minutes.
          </p>
          <Link
            to="/support/troubleshooting"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Troubleshooting
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Still need help */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-white">Still need help?</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          If you have checked the guides and things still are not clear:
        </p>
        <ul className="space-y-1 text-sm text-muted-foreground ml-4 mb-4">
          <li>• contact support</li>
          <li>• include what you were trying to do</li>
          <li>• screenshots help</li>
        </ul>
        <p className="text-xs text-muted-foreground mb-4">
          We will help you get back on track.
        </p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Contact support
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Footer micro-line */}
      <div className="pt-8 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          EcoNest is designed to work quietly in the background. Most users will not need support often.
        </p>
      </div>
    </main>
  );
}
