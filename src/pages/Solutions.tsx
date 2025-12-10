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
      <h1 className="text-3xl font-semibold">Solutions</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Proven automation systems designed for real business problems.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {solutions.map((s) => (
          <li key={s} className="rounded-xl border p-4 bg-background text-foreground">
            {s}
          </li>
        ))}
      </ul>
    </main>
  );
}