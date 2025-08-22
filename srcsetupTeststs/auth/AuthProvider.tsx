import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type AuthCtx = { loading: boolean };
const AuthContext = createContext<AuthCtx>({ loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: ses } = await supabase.auth.getSession();
      const session = ses?.session;

      if (session) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!existing && !cancelled) {
          await supabase.from('profiles').insert({
            user_id: session.user.id,
            email: session.user.email ?? ''
          });
        }
      }
      if (!cancelled) setLoading(false);
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) return;
      // could re-run ensure-profile here if you want
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ loading }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);