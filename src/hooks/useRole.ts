import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'owner' | 'admin' | 'user' | null;

export async function fetchRole(): Promise<Role> {
  const { data: u, error: e0 } = await supabase.auth.getUser();
  const uid = u?.user?.id;
  if (!uid || e0) return null;

  // Query the secure user_roles table
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', uid)
    .maybeSingle();

  if (error || !data?.role) return null;
  return data.role as Role;
}

export function useRole(): { role: Role; loading: boolean } {
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let mounted = true;
    
    // Initial fetch
    fetchRole().then(r => { 
      if (mounted) { 
        setRole(r); 
        setLoading(false); 
      } 
    });
    
    // Listen for auth changes and refetch role
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session) {
          // User logged in, fetch their role
          fetchRole().then(r => { if (mounted) setRole(r); });
        } else {
          // User logged out, clear role
          setRole(null);
        }
      }
    });
    
    return () => { 
      mounted = false; 
      subscription.unsubscribe();
    };
  }, []);
  
  return { role, loading };
}

export function isAdminLike(role: Role) {
  return role === 'owner' || role === 'admin';
}