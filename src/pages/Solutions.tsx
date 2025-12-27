import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Users, MessageSquare, TrendingUp, Cpu, ArrowRight } from "lucide-react";

export default function SolutionsPage() {
  const navigate = useNavigate();

  const solutions = [
    { title: 'Lead Intake & Qualification', icon: UserCheck, path: '/templates/lead-qualification-bot' },
    { title: 'Customer Onboarding Automation', icon: Users, path: '/templates/email-campaign-builder' },
    { title: 'AI Support Widgets', icon: MessageSquare, path: '/templates/zapier-intercom-integration' },
    { title: 'Revenue Operations', icon: TrendingUp, path: '/templates/analytics-dashboard' },
    { title: 'Agent + Workflow Hybrids', icon: Cpu, path: '/templates/data-sync-tool' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">Solutions</h1>
      <p className="mt-2 text-white/70 max-w-2xl">
        Proven automation systems designed for real business problems.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {solutions.map((s) => (
          <li key={s.title}>
            <button
              onClick={() => navigate(s.path)}
              className="group w-full rounded-xl border border-white/10 p-4 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 transition-all text-left flex items-center gap-3"
            >
              <s.icon className="h-5 w-5 text-primary shrink-0" />
              <span className="flex-1">{s.title}</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
