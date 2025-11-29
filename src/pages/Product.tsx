import React from "react";

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold">EcoNest Platform</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        EcoNest is an AI-powered automation platform that combines intelligent agents,
        workflows, and integrations to run your business operations with minimal manual effort.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {[
          { title: 'AI Agents', desc: 'Autonomous workers that think, plan, and act.' },
          { title: 'Automations', desc: 'Reliable workflows powered by n8n + Supabase.' },
          { title: 'Templates', desc: 'Pre-built systems you can install instantly.' },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border p-5 bg-background">
            <h2 className="font-medium">{item.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  );
}