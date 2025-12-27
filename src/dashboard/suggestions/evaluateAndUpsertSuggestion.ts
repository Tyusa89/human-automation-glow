import { supabase } from "@/integrations/supabase/client";
import { getDashboardConfig, UserProfile } from "@/dashboard/dashboardRules";
import { resolveDashboardWidgets } from "@/dashboard/mergeDashboardConfig";
import { WidgetKey, WIDGETS } from "@/dashboard/widgetRegistry";
import { SuggestionPayload } from "./types";

type DbWidgetRow = {
  widget_key: string;
  enabled: boolean;
  sort_order: number;
  config: any;
};

type UserEventRow = {
  event_type: string;
  created_at: string;
  event_data: any;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function count(events: UserEventRow[], types: string[]) {
  const set = new Set(types);
  return events.filter((e) => set.has(e.event_type)).length;
}

function getVisibleWidgetKeys(profile: UserProfile, widgetRows: DbWidgetRow[]) {
  const ruleKeys = getDashboardConfig(profile);
  const resolved = resolveDashboardWidgets(ruleKeys, widgetRows);
  return resolved.map((w) => w.key);
}

function widgetHidden(
  widget: WidgetKey,
  profile: UserProfile,
  widgetRows: DbWidgetRow[]
): boolean {
  // If user has a DB row and enabled=false -> hidden
  const row = widgetRows.find((r) => r.widget_key === widget);
  if (row) return row.enabled === false;

  // If no DB row: fallback to registry defaultEnabled
  // BUT only if the widget is eligible for this user (rule engine)
  const eligible = new Set(getDashboardConfig(profile));
  if (!eligible.has(widget)) return true;
  return WIDGETS[widget].defaultEnabled === false;
}

function widgetNotInTopN(
  widget: WidgetKey,
  visibleKeys: WidgetKey[],
  n: number
) {
  const idx = visibleKeys.indexOf(widget);
  return idx === -1 || idx >= n;
}

async function insertSuggestionIfNoneActive(
  userId: string,
  suggestion_key: string,
  payload: SuggestionPayload
) {
  // 30-day cooldown: don't repeat a suggestion acted on within the last 30 days
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: recentlyActed } = await supabase
    .from("user_dashboard_suggestions")
    .select("id")
    .eq("user_id", userId)
    .eq("suggestion_key", suggestion_key)
    .in("status", ["accepted", "dismissed"])
    .gte("acted_at", cutoff)
    .limit(1);

  if (recentlyActed?.length) return; // 30-day cooldown gate

  // Insert new active suggestion; if unique constraint blocks, ignore
  const { error } = await supabase.from("user_dashboard_suggestions").insert({
    user_id: userId,
    suggestion_key,
    payload,
    status: "active"
  });

  // If it fails because already exists (unique partial index), ignore
  if (error) {
    // Postgrest errors vary; don't crash
  }
}

export async function evaluateAndUpsertSuggestionOncePerDay(userId: string) {
  // Client-side "once per day" throttle to prevent spam queries
  const key = `econest:suggestions:last_eval:${userId}`;
  const last = Number(localStorage.getItem(key) || "0");
  if (Date.now() - last < DAY_MS) return;

  localStorage.setItem(key, String(Date.now()));

  // 1) If there is already an active suggestion, do nothing
  const { data: existingActive } = await supabase
    .from("user_dashboard_suggestions")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1);

  if (existingActive && existingActive.length > 0) return;

  // 2) Fetch profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("business_type, client_volume, monthly_revenue_range, tracking_method, success_goal, assistant_level, primary_challenges, work_type, hardest_things")
    .eq("user_id", userId)
    .maybeSingle();

  if (!profileData) return;
  const profile = profileData as unknown as UserProfile;

  // 3) Fetch widget overrides (can be empty)
  const { data: widgetRowsRaw } = await supabase
    .from("user_dashboard_widgets")
    .select("widget_key, enabled, sort_order, config")
    .eq("user_id", userId);

  const widgetRows = (widgetRowsRaw as DbWidgetRow[]) ?? [];
  const hasCustomizedALot = widgetRows.length >= 5;

  // 4) Fetch last 7 days of events
  const since = isoDaysAgo(7);
  const { data: eventsRaw } = await supabase
    .from("user_events")
    .select("event_type, created_at, event_data")
    .eq("user_id", userId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  const events = (eventsRaw as UserEventRow[]) ?? [];

  // 5) Compute signals
  const incomeActions = count(events, ["income_added"]);
  const followupActions = count(events, ["followup_done", "lead_contacted", "lead_followup_done"]);
  const taskCreated = count(events, ["task_created"]);
  const taskCompleted = count(events, ["task_completed"]);
  const taskActions = taskCreated + taskCompleted;
  const appointmentActions = count(events, ["appointment_booked", "appointment_completed"]);

  const completionRate =
    taskCreated > 0 ? taskCompleted / taskCreated : 1;

  const visibleKeys = getVisibleWidgetKeys(profile, widgetRows);
  const TOP_N = 3;

  // 6) Suggestions (ordered by value)
  // A) Follow-ups spiking -> move follow-up queue up (unless heavily customized)
  if (
    followupActions >= 5 &&
    !widgetHidden("follow_up_queue", profile, widgetRows) &&
    widgetNotInTopN("follow_up_queue", visibleKeys, TOP_N) &&
    !hasCustomizedALot
  ) {
    await insertSuggestionIfNoneActive(userId, "move_followups_top", {
      title: "EcoNest suggestion",
      message: "You've been doing lots of follow-ups. Want Follow-ups at the top of your dashboard?",
      actionLabel: "Move to top",
      widget: "follow_up_queue",
      mode: "move_top"
    });
    return;
  }

  // B) Income logging -> enable or surface income trend
  if (
    incomeActions >= 3 &&
    widgetHidden("income_trend_chart", profile, widgetRows)
  ) {
    await insertSuggestionIfNoneActive(userId, "enable_income_trend", {
      title: "EcoNest suggestion",
      message: "Want to see your income trend? I can add the Income Trend widget to your dashboard.",
      actionLabel: "Add widget",
      widget: "income_trend_chart",
      mode: "enable",
      preferredSortOrder: 35
    });
    return;
  }

  // C) Lots of tasks, low completion -> enable Focus Today
  if (
    taskActions >= 6 &&
    completionRate <= 0.4 &&
    widgetHidden("focus_today", profile, widgetRows)
  ) {
    await insertSuggestionIfNoneActive(userId, "enable_focus_today", {
      title: "EcoNest suggestion",
      message: "Want EcoNest to highlight one top priority each day? I can add Focus Today to your dashboard.",
      actionLabel: "Add Focus Today",
      widget: "focus_today",
      mode: "enable",
      preferredSortOrder: 12
    });
    return;
  }

  // D) Local service: appointments heavy -> move appointments up (unless heavily customized)
  if (
    appointmentActions >= 4 &&
    !widgetHidden("appointments_today", profile, widgetRows) &&
    widgetNotInTopN("appointments_today", visibleKeys, TOP_N) &&
    profile.business_type === "local_service_provider" &&
    !hasCustomizedALot
  ) {
    await insertSuggestionIfNoneActive(userId, "move_appointments_top", {
      title: "EcoNest suggestion",
      message: "You've had a busy schedule lately. Want Appointments at the top of your dashboard?",
      actionLabel: "Move to top",
      widget: "appointments_today",
      mode: "move_top"
    });
    return;
  }
}
