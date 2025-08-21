import RequireAdmin from '@/components/RequireAdmin';

export default function AdminPage() {
  return (
    <RequireAdmin>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-sm text-muted-foreground">
          Owner/Admin-only tools & settings
        </p>

        {/* Put admin widgets here */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl border">
            <h3 className="font-semibold mb-2">Results</h3>
            <p className="text-sm text-muted-foreground">
              Business analytics are admin-only. View via the Results tab.
            </p>
          </div>
          <div className="p-4 rounded-xl border">
            <h3 className="font-semibold mb-2">Traces</h3>
            <p className="text-sm text-muted-foreground">
              System logs are admin-only. View via the Traces tab.
            </p>
          </div>
        </div>
      </div>
    </RequireAdmin>
  );
}