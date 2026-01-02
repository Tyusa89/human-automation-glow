export default function Dashboard() {
  const cards = [
    { label: "Weekly Income", value: "$0", hint: "Connect data later" },
    { label: "Monthly Expenses", value: "$0", hint: "Connect data later" },
    { label: "Active Clients", value: "0", hint: "CRM coming online" },
    { label: "Automations", value: "0", hint: "n8n hooks soon" },
  ];

  return (
    <main className="min-h-screen bg-[#050a15] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-white/70">
          This is your EcoNest command center. We'll reconnect real data next.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="text-xs text-white/60">{c.label}</div>
              <div className="mt-2 text-2xl font-semibold">{c.value}</div>
              <div className="mt-2 text-xs text-white/60">{c.hint}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-sm font-semibold">Activity</div>
          <div className="mt-2 text-sm text-white/70">
            No activity yet — once we hook Supabase back in, you'll see events
            here.
          </div>
        </div>
      </div>
    </main>
  );
}
