import { EcoNestOwnerDashboard } from '@/components/EcoNestOwnerDashboard';
import RequireAuth from '@/components/RequireAuth';
import { SiteLayout } from '@/components/SiteLayout';

export default function OwnerDashboardPage() {
  return (
    <RequireAuth>
      <SiteLayout>
        <EcoNestOwnerDashboard />
      </SiteLayout>
    </RequireAuth>
  );
}
