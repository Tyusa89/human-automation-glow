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
      <h1 className="text-3xl font-semibold">Integrations</h1>
      <p className="mt-2 text-muted-foreground max-w-2xl">
        Connect EcoNest to the tools you already use.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {integrations.map((tool) => (
          <div key={tool} className="rounded-xl border p-4 bg-background">
            {tool}
          </div>
        ))}
      </div>
    </main>
  );
}
