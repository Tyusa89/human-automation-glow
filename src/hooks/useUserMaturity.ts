import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserMode = 'new' | 'power' | 'loading';

interface MaturitySignals {
  checklistComplete: boolean;
  hasTemplates: boolean;
  hasAutomationRuns: boolean;
  hasLeads: boolean;
  hasAppointments: boolean;
  hasRecentActivity: boolean;
}

interface UseUserMaturityResult {
  mode: UserMode;
  signals: MaturitySignals;
  loading: boolean;
  refresh: () => Promise<void>;
}

const defaultSignals: MaturitySignals = {
  checklistComplete: false,
  hasTemplates: false,
  hasAutomationRuns: false,
  hasLeads: false,
  hasAppointments: false,
  hasRecentActivity: false,
};

export function useUserMaturity(): UseUserMaturityResult {
  const [signals, setSignals] = useState<MaturitySignals>(defaultSignals);
  const [loading, setLoading] = useState(true);

  const checkMaturity = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch all maturity signals in parallel
      const [
        profileResult,
        templatesResult,
        automationsResult,
        leadsResult,
        appointmentsResult,
        activityResult,
      ] = await Promise.all([
        // Check profile completion (part of checklist)
        supabase
          .from('profiles')
          .select('full_name, company, onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle(),
        // Check if user has any templates
        supabase
          .from('user_templates')
          .select('id')
          .eq('user_id', user.id)
          .limit(1),
        // Check if any automations have run
        supabase
          .from('workflow_runs')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1),
        // Check if user has leads
        supabase
          .from('leads')
          .select('id')
          .eq('owner_id', user.id)
          .limit(1),
        // Check if user has appointments
        supabase
          .from('appointments')
          .select('id')
          .limit(1),
        // Check for recent activity (last 7 days)
        supabase
          .from('agent_events')
          .select('id')
          .eq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
          .limit(1),
      ]);

      const profile = profileResult.data;
      const checklistComplete = !!(
        profile?.full_name && 
        profile?.company && 
        profile?.onboarding_completed
      );

      const newSignals: MaturitySignals = {
        checklistComplete,
        hasTemplates: (templatesResult.data?.length ?? 0) > 0,
        hasAutomationRuns: (automationsResult.data?.length ?? 0) > 0,
        hasLeads: (leadsResult.data?.length ?? 0) > 0,
        hasAppointments: (appointmentsResult.data?.length ?? 0) > 0,
        hasRecentActivity: (activityResult.data?.length ?? 0) > 0,
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

  // Determine mode based on signals
  // Power user: checklist done + has templates + (has automations OR has leads/appointments)
  const isPowerUser = 
    signals.checklistComplete && 
    signals.hasTemplates && 
    (signals.hasAutomationRuns || signals.hasLeads || signals.hasAppointments);

  const mode: UserMode = loading ? 'loading' : (isPowerUser ? 'power' : 'new');

  return {
    mode,
    signals,
    loading,
    refresh: checkMaturity,
  };
}
