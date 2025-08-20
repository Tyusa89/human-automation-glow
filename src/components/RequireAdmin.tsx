import { isAdminLike, useRole } from '@/hooks/useRole';

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { role, loading } = useRole();
  if (loading) return <div className="p-6 text-sm text-muted-foreground">Checking permissions…</div>;
  if (!isAdminLike(role)) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">No permission</h2>
        <p className="text-sm text-muted-foreground">Ask an admin to grant access.</p>
      </div>
    );
  }
  return <>{children}</>;
}