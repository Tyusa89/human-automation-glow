import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useEnsureProfile() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const user = u?.user;
      if (!user) return;

      const { data: existing, error: selErr } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!existing && !selErr && !cancelled) {
        await supabase.from('profiles').insert({
          user_id: user.id,
          email: user.email ?? ''
        });
      }
    })();
    return () => { cancelled = true; };
  }, []);
}