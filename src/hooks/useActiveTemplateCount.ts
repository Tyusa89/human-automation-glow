import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ActiveTemplateCountState {
  count: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to get the count of active templates for the current user.
 * Used for gating activation on Beginner/Free plan (limit of 1).
 */
export function useActiveTemplateCount(): ActiveTemplateCountState {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setCount(0);
      setLoading(false);
      return;
    }

    const { count: activeCount, error } = await supabase
      .from('user_templates')
      .select('*', { head: true, count: 'exact' })
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching active template count:', error);
      setCount(0);
    } else {
      setCount(activeCount ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return { count, loading, refetch: fetchCount };
}
