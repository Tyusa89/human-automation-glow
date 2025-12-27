import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DashboardSuggestion = {
  id: string;
  suggestion_key: string;
  payload: {
    widget?: string;
    targetOrder?: number;
    message: string;
  };
  status: string;
  created_at: string;
};

type UserEventCounts = {
  income_actions: number;
  followup_actions: number;
  task_actions: number;
  appointment_actions: number;
};

type WidgetStatus = {
  isHidden: boolean;
  isNotTop: boolean;
  sortOrder: number;
};

export function useDashboardSuggestions(userId: string | null) {
  const [suggestion, setSuggestion] = useState<DashboardSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSuggestion = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Check for existing active suggestion first
      const { data: existingSuggestion } = await supabase
        .from("user_dashboard_suggestions")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .limit(1)
        .maybeSingle();

      if (existingSuggestion) {
        setSuggestion(existingSuggestion as unknown as DashboardSuggestion);
        setLoading(false);
        return;
      }

      // No active suggestion - compute one based on behavior
      const newSuggestion = await computeSuggestion(userId);
      setSuggestion(newSuggestion);
    } catch (error) {
      console.error("Error fetching dashboard suggestion:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSuggestion();
  }, [fetchSuggestion]);

  const acceptSuggestion = async () => {
    if (!suggestion || !userId) return;

    const payload = suggestion.payload;

    // Apply the suggestion to user_dashboard_widgets
    if (payload.widget) {
      await supabase.from("user_dashboard_widgets").upsert({
        user_id: userId,
        widget_key: payload.widget,
        enabled: true,
        sort_order: payload.targetOrder ?? 15,
        config: {}
      }, { onConflict: "user_id,widget_key" });
    }

    // Mark suggestion as accepted
    await supabase.from("user_dashboard_suggestions")
      .update({
        status: "accepted",
        acted_at: new Date().toISOString()
      })
      .eq("id", suggestion.id);

    setSuggestion(null);
  };

  const dismissSuggestion = async () => {
    if (!suggestion) return;

    await supabase.from("user_dashboard_suggestions")
      .update({
        status: "dismissed",
        acted_at: new Date().toISOString()
      })
      .eq("id", suggestion.id);

    setSuggestion(null);
  };

  return {
    suggestion,
    loading,
    acceptSuggestion,
    dismissSuggestion,
    refetch: fetchSuggestion
  };
}

async function computeSuggestion(userId: string): Promise<DashboardSuggestion | null> {
  // Get event counts from last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { data: events } = await supabase
    .from("user_events")
    .select("event_type")
    .eq("user_id", userId)
    .gte("created_at", sevenDaysAgo.toISOString());

  if (!events) return null;

  const counts: UserEventCounts = {
    income_actions: events.filter(e => e.event_type === "income_added").length,
    followup_actions: events.filter(e =>
      ["followup_done", "lead_contacted"].includes(e.event_type)
    ).length,
    task_actions: events.filter(e =>
      ["task_created", "task_completed"].includes(e.event_type)
    ).length,
    appointment_actions: events.filter(e =>
      ["appointment_booked", "appointment_completed"].includes(e.event_type)
    ).length
  };

  // Get widget status
  const { data: widgetRows } = await supabase
    .from("user_dashboard_widgets")
    .select("widget_key, enabled, sort_order")
    .eq("user_id", userId);

  const customizationCount = widgetRows?.length ?? 0;
  const hasHeavyCustomization = customizationCount >= 5;

  // Get dismissed suggestions to avoid repeating
  const { data: dismissed } = await supabase
    .from("user_dashboard_suggestions")
    .select("suggestion_key")
    .eq("user_id", userId)
    .eq("status", "dismissed");

  const dismissedKeys = new Set(dismissed?.map(d => d.suggestion_key) ?? []);

  // Helper functions
  const getWidgetStatus = (widgetKey: string): WidgetStatus => {
    const row = widgetRows?.find(r => r.widget_key === widgetKey);
    if (!row) {
      // Not in DB = using defaults
      return { isHidden: false, isNotTop: true, sortOrder: 100 };
    }
    return {
      isHidden: !row.enabled,
      isNotTop: row.sort_order > 30,
      sortOrder: row.sort_order
    };
  };

  // Check heuristics and create suggestion
  // Only suggest enabling widgets if user has heavy customization
  // Otherwise, can also suggest reordering

  // 1. Follow-up queue suggestion
  if (
    !dismissedKeys.has("move_followups_top") &&
    counts.followup_actions >= 5
  ) {
    const status = getWidgetStatus("follow_up_queue");
    if (status.isNotTop && !status.isHidden && !hasHeavyCustomization) {
      return await createSuggestion(userId, "move_followups_top", {
        widget: "follow_up_queue",
        targetOrder: 15,
        message: "You've been doing lots of follow-ups. Want Follow-ups at the top?"
      });
    }
  }

  // 2. Income trend chart suggestion
  if (
    !dismissedKeys.has("enable_income_trend") &&
    counts.income_actions >= 3
  ) {
    const status = getWidgetStatus("income_trend_chart");
    if (status.isHidden) {
      return await createSuggestion(userId, "enable_income_trend", {
        widget: "income_trend_chart",
        targetOrder: 25,
        message: "Want to track income trends? We can add the Income Trend widget."
      });
    }
  }

  // 3. Focus Today suggestion (overwhelmed users)
  if (
    !dismissedKeys.has("enable_focus_today") &&
    counts.task_actions >= 6
  ) {
    // Check if completion rate is low (more created than completed)
    const created = events?.filter(e => e.event_type === "task_created").length ?? 0;
    const completed = events?.filter(e => e.event_type === "task_completed").length ?? 0;
    const completionRateLow = created > 0 && (completed / created) < 0.5;

    const status = getWidgetStatus("focus_today");
    if (status.isHidden && completionRateLow) {
      return await createSuggestion(userId, "enable_focus_today", {
        widget: "focus_today",
        targetOrder: 5,
        message: "Want EcoNest to highlight one top priority each day?"
      });
    }
  }

  // 4. Appointments suggestion for service providers
  if (
    !dismissedKeys.has("move_appointments_top") &&
    counts.appointment_actions >= 4 &&
    !hasHeavyCustomization
  ) {
    const status = getWidgetStatus("appointments_today");
    if (status.isNotTop && !status.isHidden) {
      return await createSuggestion(userId, "move_appointments_top", {
        widget: "appointments_today",
        targetOrder: 10,
        message: "Your schedule is busy! Want Appointments at the top of your dashboard?"
      });
    }
  }

  return null;
}

async function createSuggestion(
  userId: string,
  suggestionKey: string,
  payload: { widget?: string; targetOrder?: number; message: string }
): Promise<DashboardSuggestion | null> {
  const { data, error } = await supabase
    .from("user_dashboard_suggestions")
    .insert({
      user_id: userId,
      suggestion_key: suggestionKey,
      payload,
      status: "active"
    })
    .select()
    .single();

  if (error) {
    // Likely duplicate - ignore
    return null;
  }

  return data as unknown as DashboardSuggestion;
}
