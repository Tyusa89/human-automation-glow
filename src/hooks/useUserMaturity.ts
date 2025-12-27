import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserMode = 'new' | 'power' | 'reactivation' | 'loading';

export interface MaturitySignals {
  // Core activation signals
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulAutomationRun: boolean;
  hasFirstValueEvent: boolean; // appointment, lead, or payment
  
  // Detailed signals
  hasLeads: boolean;
  hasAppointments: boolean;
  hasPayments: boolean;
  automationErrorsCount: number;
  appointmentsEnabled: boolean;
  upcomingAppointmentsCount: number;
  
  // Activity signals
  lastActivityAt: Date | null;
  daysSinceLastActivity: number | null;
}

interface UseUserMaturityResult {
  mode: UserMode;
  signals: MaturitySignals;
  loading: boolean;
  userId: string | null;
  refresh: () => Promise<void>;
}

const defaultSignals: MaturitySignals = {
  profileCompleted: false,
  activeTemplatesCount: 0,
  hasSuccessfulAutomationRun: false,
  hasFirstValueEvent: false,
  hasLeads: false,
  hasAppointments: false,
  hasPayments: false,
  automationErrorsCount: 0,
  appointmentsEnabled: false,
  upcomingAppointmentsCount: 0,
  lastActivityAt: null,
  daysSinceLastActivity: null,
};

export function useUserMaturity(): UseUserMaturityResult {
  const [signals, setSignals] = useState<MaturitySignals>(defaultSignals);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const checkMaturity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Fetch all maturity signals in parallel
      const [
        profileResult,
        templatesResult,
        successfulRunsResult,
        failedRunsResult,
        leadsResult,
        appointmentsResult,
        upcomingAppointmentsResult,
        paymentsResult,
        lastActivityResult,
        servicesResult,
      ] = await Promise.all([
        // Profile completion check
        supabase
          .from('profiles')
          .select('full_name, company, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle(),
        // Active templates count
        supabase
          .from('user_templates')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .eq('is_active', true),
        // Successful automation runs
        supabase
          .from('workflow_runs')
          .select('id')
          .eq('owner_id', user.id)
          .eq('status', 'completed')
          .limit(1),
        // Failed automation runs (for power user alerts)
        supabase
          .from('workflow_runs')
          .select('id', { count: 'exact' })
          .eq('owner_id', user.id)
          .eq('status', 'failed'),
        // Leads count
        supabase
          .from('leads')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1),
        // Any appointments (first value event)
        supabase
          .from('appointments')
          .select('id')
          .limit(1),
        // Upcoming appointments
        supabase
          .from('appointments')
          .select('id', { count: 'exact' })
          .gte('start_time', new Date().toISOString())
          .eq('status', 'booked'),
        // Payments received (owned_products as proxy)
        supabase
          .from('owned_products')
          .select('id')
          .eq('user_id', user.id)
          .limit(1),
        // Last activity (agent_events)
        supabase
          .from('agent_events')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1),
        // Check if appointment services are enabled
        supabase
          .from('appointment_services')
          .select('id')
          .eq('active', true)
          .limit(1),
      ]);

      const profile = profileResult.data;
      const profileCompleted = !!(
        profile?.full_name && 
        profile?.company && 
        profile?.onboarding_completed
      );

      const activeTemplatesCount = templatesResult.count ?? 0;
      const hasSuccessfulAutomationRun = (successfulRunsResult.data?.length ?? 0) > 0;
      const automationErrorsCount = failedRunsResult.count ?? 0;
      const hasLeads = (leadsResult.data?.length ?? 0) > 0;
      const hasAppointments = (appointmentsResult.data?.length ?? 0) > 0;
      const hasPayments = (paymentsResult.data?.length ?? 0) > 0;
      const upcomingAppointmentsCount = upcomingAppointmentsResult.count ?? 0;
      const appointmentsEnabled = (servicesResult.data?.length ?? 0) > 0;

      // First value event = any of: appointment, lead, payment, successful run
      const hasFirstValueEvent = hasLeads || hasAppointments || hasPayments || hasSuccessfulAutomationRun;

      // Calculate days since last activity
      let lastActivityAt: Date | null = null;
      let daysSinceLastActivity: number | null = null;
      if (lastActivityResult.data?.[0]?.created_at) {
        lastActivityAt = new Date(lastActivityResult.data[0].created_at);
        const now = new Date();
        daysSinceLastActivity = Math.floor((now.getTime() - lastActivityAt.getTime()) / (1000 * 60 * 60 * 24));
      }

      const newSignals: MaturitySignals = {
        profileCompleted,
        activeTemplatesCount,
        hasSuccessfulAutomationRun,
        hasFirstValueEvent,
        hasLeads,
        hasAppointments,
        hasPayments,
        automationErrorsCount,
        appointmentsEnabled,
        upcomingAppointmentsCount,
        lastActivityAt,
        daysSinceLastActivity,
      };

      setSignals(newSignals);
    } catch (error) {
      console.error('Error checking user maturity:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMaturity();
  }, []);

  // Determine mode based on explicit conditions
  const determineMode = (): UserMode => {
    if (loading) return 'loading';

    // NEW USER MODE: Any of these conditions
    const isNewUser = 
      !signals.profileCompleted ||
      signals.activeTemplatesCount === 0 ||
      !signals.hasSuccessfulAutomationRun ||
      !signals.hasFirstValueEvent;

    if (isNewUser) return 'new';

    // REACTIVATION MODE: Power user who's been inactive > 30 days
    if (signals.daysSinceLastActivity !== null && signals.daysSinceLastActivity > 30) {
      return 'reactivation';
    }

    // POWER USER MODE: All conditions met and active within 14 days
    // (If they're between 14-30 days, still power user but might show subtle nudges)
    return 'power';
  };

  return {
    mode: determineMode(),
    signals,
    loading,
    userId,
    refresh: checkMaturity,
  };
}
