import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'owner' | 'admin' | 'user' | null;

export async function fetchRole(): Promise<Role> {
  const { data: u, error: e0 } = await supabase.auth.getUser();
  const uid = u?.user?.id;
  if (!uid || e0) return null;

  // try user_id first, then id (covers both schema styles)
  let { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', uid)
    .maybeSingle();

  if ((error || !data) as any) {
    const fallback = await supabase
      .from('profiles')
      .select('role')
      .eq('id', uid)
      .maybeSingle();
    data = fallback.data;
    error = fallback.error;
  }

  if (error || !data?.role) return null;   // don't fake 'user' on error
  return data.role as Role;
}

export function useRole(): { role: Role; loading: boolean } {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetchRole().then(r => { if (mounted) { setRole(r); setLoading(false); } });
    return () => { mounted = false; };
  }, []);
  return { role, loading };
}

export function isAdminLike(role: Role) {
  return role === 'owner' || role === 'admin';
}