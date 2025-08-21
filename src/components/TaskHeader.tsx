import { useEffect, useState } from 'react';
import { fetchLatestDailyKpi, runTask } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';

function TaskHeader() {
  const [kpi, setKpi] = useState<Awaited<ReturnType<typeof fetchLatestDailyKpi>>>(null);
  const [running, setRunning] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  async function refresh() {
    console.log('Refreshing KPI data...');
    try {
      const s = await fetchLatestDailyKpi();
      console.log('KPI data:', s);
      setKpi(s);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    }
  }

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    console.log('Setting up real-time subscription...');
    const ch = supabase
      .channel('results-kpi')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'results', filter: "task=eq.daily_kpi" },
        (payload) => {
          console.log('Real-time event received:', payload);
          refresh();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });
    return () => { 
      console.log('Cleaning up subscription...');
      supabase.removeChannel(ch); 
    };
  }, []);

  async function handleRunDaily() {
    setRunning(true);
    try {
      await runTask('daily_kpi', { since: 'yesterday' });
      await refresh(); // <-- update the "Last:" line right after success
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleRunDaily}
        disabled={running}
        className="px-4 py-2 rounded-md bg-emerald-800 text-white"
      >
        {running ? 'Running…' : 'Run Daily Summary'}
      </button>

      <div className="text-sm text-muted-foreground">
        {kpi
          ? <>Last: {new Date(kpi.created_at).toLocaleString()} · Leads {kpi.leads_today ?? '-'} · Tasks {kpi.tasks_run ?? '-'} · Avg resp {kpi.avg_response_min ?? '-'}m</>
          : <>No KPI run yet</>}
        <div className="text-xs opacity-60">
          Refreshed: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default TaskHeader;