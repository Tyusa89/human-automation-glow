import { useEffect, useState } from 'react';
import { fetchLatestDailyKpi, runTask } from '@/lib/api';

function TaskHeader() {
  const [kpi, setKpi] = useState<Awaited<ReturnType<typeof fetchLatestDailyKpi>>>(null);
  const [running, setRunning] = useState(false);

  async function refresh() {
    const s = await fetchLatestDailyKpi();
    setKpi(s);
  }

  useEffect(() => { refresh(); }, []);

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
      </div>
    </div>
  );
}

export default TaskHeader;