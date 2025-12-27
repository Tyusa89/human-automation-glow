import React from "react";

export default function SolutionsPage() {
  const solutions = [
    'Lead Intake & Qualification',
    'Customer Onboarding Automation',
    'AI Support Widgets',
    'Revenue Operations',
    'Agent + Workflow Hybrids',
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">Solutions</h1>
      <p className="mt-2 text-white/70 max-w-2xl">
        Proven automation systems designed for real business problems.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {solutions.map((s) => (
          <li key={s} className="rounded-xl border border-white/10 p-4 bg-white/5 text-white hover:bg-white/10 transition-colors">
            {s}
          </li>
        ))}
      </ul>
    </main>
  );
}
