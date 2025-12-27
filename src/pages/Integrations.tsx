import React from "react";

export default function IntegrationsPage() {
  const integrations = [
    'Gmail',
    'Slack',
    'Stripe',
    'Supabase',
    'Google Drive',
    'Twilio',
    'GitHub',
    'Zendesk',
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold text-white">Integrations</h1>
      <p className="mt-2 text-white/70 max-w-2xl">
        Connect EcoNest to the tools you already use.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {integrations.map((tool) => (
          <div key={tool} className="rounded-xl border border-white/10 p-4 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 transition-colors">
            {tool}
          </div>
        ))}
      </div>
    </main>
  );
}
