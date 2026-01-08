import EmptyState from "@/components/EmptyState";

export default function Expenses() {
  return (
    <EmptyState
      title="Expenses"
      description="No expenses yet. Add your first expense from the dashboard—or tell the EcoNest Agent to log it for you."
      icon={<span className="text-2xl">💳</span>}
    />
  );
}