import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSuggestionRow } from "./types";
import { evaluateAndUpsertSuggestionOncePerDay } from "./evaluateAndUpsertSuggestion";

export function useDashboardSuggestion() {
  const [suggestion, setSuggestion] = useState<DashboardSuggestionRow | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    const userId = auth?.user?.id;
    if (!userId) {
      setSuggestion(null);
      setLoading(false);
      return;
    }

    // Fetch active suggestion (one max)
    const { data } = await supabase
      .from("user_dashboard_suggestions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1);

    setSuggestion((data && data[0]) ? (data[0] as unknown as DashboardSuggestionRow) : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      // Try to create a suggestion (throttled)
      await evaluateAndUpsertSuggestionOncePerDay(userId);

      // Then load active suggestion
      await refresh();
    })();
  }, [refresh]);

  return { suggestion, loading, refresh };
}
