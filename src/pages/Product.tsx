import { Link } from "react-router-dom";
import { Bot, Workflow, LayoutTemplate, ArrowRight } from "lucide-react";

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Product</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Everything you need to automate real work.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          EcoNest is built around three core building blocks.<br />
          Use them together or on their own.
        </p>
      </div>

      {/* AI Agents */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">AI Agents</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Autonomous assistants that act on your behalf.
        </p>
        <p className="text-sm text-muted-foreground mb-3">They can:</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• respond to events</li>
          <li>• make decisions</li>
          <li>• trigger workflows</li>
          <li>• assist with daily operations</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Agents are configured and managed inside your dashboard.
        </p>
      </section>

      {/* Automations */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Workflow className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">Automations</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Reliable workflows that connect your tools.
        </p>
        <p className="text-sm text-muted-foreground mb-3">Automations:</p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• move data between systems</li>
          <li>• trigger actions automatically</li>
          <li>• reduce manual steps</li>
          <li>• run quietly in the background</li>
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Built on proven infrastructure. No brittle scripts.
        </p>
      </section>

      {/* Templates */}
      <section className="mb-12 pt-8 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <LayoutTemplate className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-white">Templates</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Prebuilt systems you can launch fast.
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          Templates combine agents + automations into ready-to-use solutions.<br />
          They are designed to be:
        </p>
        <ul className="space-y-1.5 text-sm text-muted-foreground ml-4">
          <li>• installed in minutes</li>
          <li>• customizable</li>
          <li>• production-ready</li>
        </ul>
        <p className="mt-4 text-sm text-muted-foreground">
          Most users start here.
        </p>
        <Link
          to="/templates"
          className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline"
        >
          Browse templates
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Footer micro-line */}
      <div className="pt-8 border-t border-border/40 text-center">
        <p className="text-xs text-muted-foreground">
          Product features are accessed through your dashboard and templates.
        </p>
      </div>
    </main>
  );
}
