import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type LeadStatusCounts = {
  total: number;
  new: number;
  warm: number;
  customer: number;
};

type TemplateStats = {
  totalTemplates: number;
  ownedTemplates: number;
};

type AgentEvent = {
  id: string;
  type: string;
  created_at: string;
  payload: any;
};

type DashboardState = {
  loading: boolean;
  error: string | null;
  userEmail: string | null;
  leadStats: LeadStatusCounts;
  templateStats: TemplateStats;
  recentEvents: AgentEvent[];
};

const initialState: DashboardState = {
  loading: true,
  error: null,
  userEmail: null,
  leadStats: {
    total: 0,
    new: 0,
    warm: 0,
    customer: 0,
  },
  templateStats: {
    totalTemplates: 0,
    ownedTemplates: 0,
  },
  recentEvents: [],
};

const formatDateTime = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

export const EcoNestOwnerDashboard: React.FC = () => {
  const [state, setState] = useState<DashboardState>(initialState);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // 1) Get current session / user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error(sessionError);
      }

      const user = session?.user ?? null;

      if (!user) {
        if (!cancelled) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'You must be signed in to view the owner dashboard.',
          }));
        }
        return;
      }

      const userId = user.id;
      const userEmail = user.email ?? 'Unknown';

      // 2) Fetch leads stats for this owner (owner_id = current user id)
      const [totalRes, newRes, warmRes, customerRes] = await Promise.all([
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', userId),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', userId)
          .eq('status', 'new'),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', userId)
          .eq('status', 'warm'),
        supabase
          .from('leads')
          .select('id', { count: 'exact', head: true })
          .eq('owner_id', userId)
          .eq('status', 'customer'),
      ]);

      const leadStats: LeadStatusCounts = {
        total: totalRes.count ?? 0,
        new: newRes.count ?? 0,
        warm: warmRes.count ?? 0,
        customer: customerRes.count ?? 0,
      };

      // 3) Template stats (global + owned)
      const [templatesRes, userTemplatesRes] = await Promise.all([
        supabase
          .from('templates')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
        supabase
          .from('user_templates')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', userId)
          .eq('is_active', true),
      ]);

      const templateStats: TemplateStats = {
        totalTemplates: templatesRes.count ?? 0,
        ownedTemplates: userTemplatesRes.count ?? 0,
      };

      // 4) Recent agent events (last 20)
      const { data: eventsData, error: eventsError } = await supabase
        .from('agent_events')
        .select('id, type, created_at, payload')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (eventsError) {
        console.error(eventsError);
      }

      const recentEvents: AgentEvent[] = (eventsData ?? []).map((e: any) => ({
        id: e.id,
        type: e.type,
        created_at: e.created_at,
        payload: e.payload,
      }));

      if (!cancelled) {
        setState({
          loading: false,
          error: null,
          userEmail,
          leadStats,
          templateStats,
          recentEvents,
        });
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading owner dashboard…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm">
        <h1 className="text-lg font-semibold mb-2">Owner dashboard</h1>
        <p>{state.error}</p>
      </div>
    );
  }

  const { leadStats, templateStats, recentEvents, userEmail } = state;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8">
      {/* Header */}
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            EcoNest Owner Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Private overview of leads, templates, and agent activity. Visible only to
            your signed-in owner account.
          </p>
        </div>
        <div className="rounded-full border px-4 py-1 text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{userEmail}</span>
        </div>
      </header>

      {/* Top stats cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Leads
          </p>
          <p className="mt-2 text-3xl font-semibold">{leadStats.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            New: {leadStats.new} • Warm: {leadStats.warm} • Customers: {leadStats.customer}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Templates
          </p>
          <p className="mt-2 text-3xl font-semibold">{templateStats.totalTemplates}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Owned by you: {templateStats.ownedTemplates}
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Agent Activity
          </p>
          <p className="mt-2 text-3xl font-semibold">
            {recentEvents.length}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Logged events (last 20)
          </p>
        </div>
      </section>

      {/* Leads breakdown */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Lead Funnel Snapshot</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Quick breakdown of where your leads are in the pipeline.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                New
              </p>
              <p className="mt-1 text-xl font-semibold">{leadStats.new}</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Warm
              </p>
              <p className="mt-1 text-xl font-semibold">{leadStats.warm}</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Customers
              </p>
              <p className="mt-1 text-xl font-semibold">{leadStats.customer}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold">Templates Overview</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Active marketplace templates vs what&apos;s already unlocked for your account.
          </p>
          <ul className="mt-4 space-y-2 text-xs">
            <li className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
              <span>Total active templates</span>
              <span className="font-semibold">{templateStats.totalTemplates}</span>
            </li>
            <li className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
              <span>Templates you own</span>
              <span className="font-semibold">{templateStats.ownedTemplates}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Recent agent events */}
      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Recent Agent Events</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Last 20 actions your EcoNest agent logged (tool calls, final outputs, etc.).
            </p>
          </div>
        </div>

        {recentEvents.length === 0 ? (
          <p className="mt-4 text-xs text-muted-foreground">
            No agent events logged yet. Once your EcoNest agent starts running tasks,
            they&apos;ll appear here.
          </p>
        ) : (
          <div className="mt-4 max-h-80 overflow-auto rounded-xl border text-xs">
            <table className="min-w-full text-left">
              <thead className="bg-muted/60">
                <tr>
                  <th className="px-3 py-2 font-medium">Time</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((ev) => (
                  <tr key={ev.id} className="border-t border-border/60 align-top">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatDateTime(ev.created_at)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                        {ev.type}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <pre className="max-h-24 overflow-auto whitespace-pre-wrap text-[11px] text-muted-foreground">
                        {JSON.stringify(ev.payload, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
