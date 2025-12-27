import { Link, useNavigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import { 
  Bot, Workflow, LayoutTemplate, ArrowRight, 
  Calendar, UserCheck, BarChart3, Repeat, Sparkles
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  return (
    <AppShell>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:py-28 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl tracking-tight">
          Automations that run your business.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground">
          AI agents, workflows, and templates — without the complexity.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/auth?mode=signup"
            className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Start free
          </Link>
          <Link
            to="/templates"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-colors"
          >
            View templates
          </Link>
        </div>
      </section>

      {/* Built for real work */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-white text-center mb-8">
            Built for real work
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Calendar, text: "Book clients automatically" },
              { icon: UserCheck, text: "Qualify leads while you sleep" },
              { icon: BarChart3, text: "Track revenue in real time" },
              { icon: Repeat, text: "Eliminate repetitive tasks" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3">
                <item.icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            EcoNest adapts to how you work — not the other way around.
          </p>
        </div>
      </section>

      {/* Three ways to build */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-white text-center mb-8">
            Three ways to build
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="AI Agents"
              desc="Autonomous assistants that think, decide, and act on your behalf."
              icon={<Bot className="h-5 w-5" />}
              onClick={() => navigate('/solutions')}
            />
            <FeatureCard
              title="Automations"
              desc="Reliable workflows that connect your tools and keep work moving."
              icon={<Workflow className="h-5 w-5" />}
              onClick={() => navigate('/templates')}
            />
            <FeatureCard
              title="Templates"
              desc="Production-ready systems you can launch in minutes."
              icon={<LayoutTemplate className="h-5 w-5" />}
              onClick={() => navigate('/templates')}
            />
          </div>
        </div>
      </section>

      {/* Start with a template */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-white text-center">
            Start with a template
          </h2>
          <p className="mt-2 text-center text-muted-foreground text-sm">
            Choose a template. Connect your tools. Go live.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Appointment booking", "Lead qualification", "Analytics dashboards", "Customer support widgets"].map((name) => (
              <button
                key={name}
                onClick={() => navigate('/templates')}
                className="rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 hover:text-white transition-colors"
              >
                {name}
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            No long setup. No guesswork.
          </p>

          <div className="mt-4 text-center">
            <Link
              to="/templates"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Browse templates
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* A dashboard that adapts */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h2 className="text-xl font-semibold text-white text-center">
            A dashboard that adapts
          </h2>
          <p className="mt-4 text-center text-muted-foreground text-sm max-w-md mx-auto">
            Your dashboard changes based on how you use EcoNest, what you focus on, and what matters next.
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Less noise. More signal.
          </p>
        </div>
      </section>

      {/* Simple to start */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
          <h2 className="text-xl font-semibold text-white">
            Simple to start. Powerful as you grow.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            EcoNest works for solo founders, service businesses, small teams, and operators who want automation without overhead.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            No rebuilding. No lock-in.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-border/40 bg-muted/10">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 text-center">
          <h2 className="text-xl font-semibold text-white">
            Get started
          </h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Create an account. Answer a few questions once. Launch your first automation.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/auth?mode=signup"
              className="inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start free
            </Link>
            <Link
              to="/contact?type=demo"
              className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent transition-colors"
            >
              Book a demo
            </Link>
          </div>
        </div>
      </section>

      {/* Micro-footer */}
      <div className="border-t border-border/40 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          EcoNest — flexible automation for modern businesses.
        </p>
      </div>
    </AppShell>
  );
}

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
      className="group rounded-xl border border-border/50 bg-card/50 p-5 text-left hover:border-primary/30 transition-colors"
    >
      <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </button>
  );
}
