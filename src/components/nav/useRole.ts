import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useRole() {
  const [loading, setLoading] = useState(true);
  const [isOwnerLike, setIsOwnerLike] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function run() {
      setLoading(true);

      const { data: auth } = await supabase.auth.getUser();
      if (!mounted) return;

      if (!auth.user) {
        setIsOwnerLike(false);
        setLoading(false);
        return;
      }

      // Uses your DB function: public.is_admin_or_owner()
      const { data, error } = await supabase.rpc("is_admin_or_owner");
      if (!mounted) return;

      setIsOwnerLike(!error && data === true);
      setLoading(false);
    }

    run();
    const { data: sub } = supabase.auth.onAuthStateChange(() => run());

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { loading, isOwner: isOwnerLike };
}