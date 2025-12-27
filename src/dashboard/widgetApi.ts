import { supabase } from "@/integrations/supabase/client";
import { getDashboardConfig, UserProfile } from "./dashboardRules";
import { WIDGETS, WidgetKey } from "./widgetRegistry";

export async function seedWidgetsOnOnboardingComplete(
  userId: string,
  profile: UserProfile
): Promise<void> {
  const ruleKeys = getDashboardConfig(profile);

  const seedRows = ruleKeys.map((key) => ({
    user_id: userId,
    widget_key: key,
    enabled: true,
    sort_order: WIDGETS[key].defaultOrder,
    config: WIDGETS[key].defaultConfig ?? {}
  }));

  await supabase.from("user_dashboard_widgets").upsert(seedRows, {
    onConflict: "user_id,widget_key"
  });
}

export async function toggleWidget(
  userId: string,
  widgetKey: WidgetKey,
  enabled: boolean
): Promise<void> {
  await supabase
    .from("user_dashboard_widgets")
    .upsert({
      user_id: userId,
      widget_key: widgetKey,
      enabled
    }, { onConflict: "user_id,widget_key" });
}

export async function reorderWidget(
  userId: string,
  widgetKey: WidgetKey,
  sortOrder: number
): Promise<void> {
  await supabase
    .from("user_dashboard_widgets")
    .upsert({
      user_id: userId,
      widget_key: widgetKey,
      sort_order: sortOrder
    }, { onConflict: "user_id,widget_key" });
}

export async function updateWidgetConfig(
  userId: string,
  widgetKey: WidgetKey,
  config: Record<string, any>
): Promise<void> {
  // Get existing config and merge
  const { data: existing } = await supabase
    .from("user_dashboard_widgets")
    .select("config")
    .eq("user_id", userId)
    .eq("widget_key", widgetKey)
    .maybeSingle();

  const existingConfig = (existing?.config && typeof existing.config === 'object') 
    ? existing.config as Record<string, any>
    : {};

  const mergedConfig = {
    ...existingConfig,
    ...config
  };

  await supabase
    .from("user_dashboard_widgets")
    .upsert({
      user_id: userId,
      widget_key: widgetKey,
      config: mergedConfig
    }, { onConflict: "user_id,widget_key" });
}