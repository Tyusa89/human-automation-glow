import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setAuthed(!!data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return;
      setAuthed(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return <div className="p-6 text-sm text-muted-foreground">Signing you in…</div>;
  }
  return authed ? children : <Navigate to="/auth" replace />;
}