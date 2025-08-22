import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Lead = {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  status: string | null;
  created_at: string;
};

export default function LeadsTable() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error) setLeads((data as Lead[]) || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading leads…</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Name</th>
            <th className="py-2 pr-4">Email</th>
            <th className="py-2 pr-4">Company</th>
            <th className="py-2 pr-4">Status</th>
            <th className="py-2 pr-4">Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} className="border-b hover:bg-accent/10">
              <td className="py-2 pr-4">{l.name ?? '—'}</td>
              <td className="py-2 pr-4">{l.email}</td>
              <td className="py-2 pr-4">{l.company ?? '—'}</td>
              <td className="py-2 pr-4">
                <span className="px-2 py-1 rounded bg-muted text-foreground">
                  {l.status ?? 'new'}
                </span>
              </td>
              <td className="py-2 pr-4">{new Date(l.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}