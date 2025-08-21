import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'owner' | 'admin' | 'user' | null;

export async function fetchRole(): Promise<Role> {
  const { data: u } = await supabase.auth.getUser();
  const uid = u?.user?.id;
  if (!uid) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', uid)            // using id column as primary key
    .maybeSingle();
  if (error) return null;
  return (data?.role as Role) ?? 'user';
}

export function useRole(): { role: Role; loading: boolean } {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    fetchRole().then(r => { 
      if (mounted) { 
        console.log('Role fetched:', r);
        setRole(r); 
        setLoading(false); 
      } 
    });
    return () => { mounted = false; };
  }, []);
  console.log('Current role state:', role, 'loading:', loading);
  return { role, loading };
}

export function isAdminLike(role: Role) {
  return role === 'owner' || role === 'admin';
}