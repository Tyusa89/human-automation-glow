import EmptyState from "@/components/EmptyState";

export default function Appointments() {
  return (
    <EmptyState
      title="Appointments"
      description="No appointments scheduled yet. When bookings come in, they'll show up here automatically."
      primaryCta={{ label: "Go to Dashboard", to: "/dashboard" }}
      secondaryCta={{ label: "Back to Home", to: "/" }}
      icon={<span className="text-2xl">📅</span>}
    />
  );
}