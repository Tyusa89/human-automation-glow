import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { stewardApprove, stewardReject } from '@/lib/stewardClient';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';

type PendingApproval = {
  id: string;
  owner_id: string;
  actor_role: string;
  actor_id: string | null;
  action_type: string;
  zone: number;
  resource: string;
  status: string;
  risk_level: string | null;
  reason: string | null;
  created_at: string | null;
  updated_at: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_reason: string | null;
  metadata: Record<string, unknown> | null;
};

export default function OwnerApprovalsPage() {
  const [items, setItems] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadApprovals() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('pending_approvals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setItems((data || []) as PendingApproval[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadApprovals();
  }, []);

  async function handleResolve(
    item: PendingApproval,
    action: 'approve' | 'reject',
  ) {
    try {
      setBusyId(item.id);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Not signed in');
      }

      const payload = {
        approvalId: item.id,
        ownerId: item.owner_id,
        resolutionReason:
          action === 'approve'
            ? 'Approved via Owner UI'
            : 'Rejected via Owner UI',
      };

      if (action === 'approve') {
        await stewardApprove(payload);
      } else {
        await stewardReject(payload);
      }

      await loadApprovals();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error(err);
      setError(message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pending Approvals</h1>
          <p className="text-sm text-muted-foreground">
            Steward decisions that require your review.
          </p>
        </div>
        <Button variant="outline" onClick={() => void loadApprovals()}>
          Refresh
        </Button>
      </header>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          <span>Loading approvals…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-md border px-4 py-10 text-center text-sm text-muted-foreground">
          No pending approvals right now.
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Created</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="whitespace-nowrap text-xs">
                    {item.created_at ? new Date(item.created_at).toLocaleString() : '—'}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="font-medium">{item.actor_role}</div>
                    <div className="text-muted-foreground">
                      {item.actor_id || '—'}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">{item.action_type}</TableCell>
                  <TableCell className="text-xs">
                    zone {item.zone} · {item.resource}
                  </TableCell>
                  <TableCell className="text-xs max-w-xs">
                    <div className="line-clamp-2">{item.reason || '—'}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    {item.risk_level || '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === item.id}
                        onClick={() => handleResolve(item, 'reject')}
                      >
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        disabled={busyId === item.id}
                        onClick={() => handleResolve(item, 'approve')}
                      >
                        {busyId === item.id ? (
                          <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        ) : null}
                        Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
