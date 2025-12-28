import { WidgetKey } from "./widgetRegistry";

export type UserProfile = {
  business_type?: string | null;
  client_volume?: string | null;
  monthly_revenue_range?: string | null;
  tracking_method?: string | null;
  success_goal?: string | null;
  assistant_level?: string | null;
  primary_challenges?: string[] | null;
  // Legacy fields for backward compatibility
  work_type?: string | null;
  hardest_things?: string[] | null;
};

export function getDashboardConfig(profile: UserProfile): WidgetKey[] {
  // Map legacy fields if new ones aren't set
  const businessType = profile.business_type || mapLegacyWorkType(profile.work_type);
  const challenges = profile.primary_challenges?.length 
    ? profile.primary_challenges 
    : mapLegacyChallenges(profile.hardest_things);

  const eligible = new Set<WidgetKey>();

  // Always-on
  eligible.add("kpi_weekly_income");
  eligible.add("activity_feed");
  eligible.add("templates_quick_access");

  if (profile.monthly_revenue_range && profile.monthly_revenue_range !== "starting_inconsistent") {
    eligible.add("kpi_monthly_income");
  }

  // Work type
  switch (businessType) {
    case "consultant":
    case "coach":
    case "freelancer":
      eligible.add("client_list");
      break;
    case "creative_designer":
    case "creative":
      eligible.add("project_board");
      break;
    case "local_service_provider":
    case "local-service":
      eligible.add("appointments_today");
      break;
    default:
      eligible.add("task_list");
  }

  // Challenges
  const ch = challenges ?? [];
  if (ch.includes("knowing_what_to_focus_on") || ch.includes("focus")) eligible.add("focus_today");
  if (ch.includes("client_follow_ups") || ch.includes("followups")) eligible.add("follow_up_queue");
  if (ch.includes("tracking_income_expenses") || ch.includes("income")) eligible.add("income_trend_chart");
  if (ch.includes("staying_organized") || ch.includes("organized")) eligible.add("task_list");

  // Assistant level
  if (profile.assistant_level === "active") eligible.add("assistant_suggestions");

  return sortByPriority([...eligible], { ...profile, business_type: businessType, primary_challenges: challenges });
}

function sortByPriority(keys: WidgetKey[], profile: UserProfile): WidgetKey[] {
  // Base order (platform default)
  const base: Record<WidgetKey, number> = {
    focus_today: 10,
    kpi_weekly_income: 20,
    kpi_monthly_income: 30,
    templates_quick_access: 35,
    income_trend_chart: 40,
    appointments_today: 45,
    follow_up_queue: 50,
    task_list: 60,
    client_list: 70,
    project_board: 75,
    activity_feed: 90,
    assistant_suggestions: 95
  };

  // Micro-adjustments from onboarding answers
  const bump: Partial<Record<WidgetKey, number>> = {};

  const ch = profile.primary_challenges ?? [];

  if (ch.includes("knowing_what_to_focus_on") || ch.includes("focus")) bump.focus_today = -12;
  if (ch.includes("tracking_income_expenses") || ch.includes("income")) bump.income_trend_chart = -12;
  if (ch.includes("client_follow_ups") || ch.includes("followups")) bump.follow_up_queue = -10;
  if (ch.includes("staying_organized") || ch.includes("organized")) bump.task_list = -10;

  if (profile.business_type === "local_service_provider" || profile.business_type === "local-service") {
    bump.appointments_today = -12;
  }
  if (profile.business_type === "creative_designer" || profile.business_type === "creative") {
    bump.project_board = -8;
  }
  if (["consultant", "coach", "freelancer"].includes(profile.business_type ?? "")) {
    bump.client_list = -8;
  }

  if (profile.client_volume === "25_plus") {
    bump.follow_up_queue = (bump.follow_up_queue ?? 0) - 6;
    bump.client_list = (bump.client_list ?? 0) - 4;
    bump.activity_feed = (bump.activity_feed ?? 0) - 4;
  }

  if (profile.assistant_level === "active") bump.assistant_suggestions = -8;

  return keys.sort((a, b) => {
    const pa = (base[a] ?? 1000) + (bump[a] ?? 0);
    const pb = (base[b] ?? 1000) + (bump[b] ?? 0);
    return pa - pb;
  });
}

/* ---------- helpers ---------- */

// Map legacy work_type to new business_type
function mapLegacyWorkType(workType?: string | null): string | null {
  if (!workType) return null;
  const mapping: Record<string, string> = {
    'consultant': 'consultant',
    'freelancer': 'freelancer',
    'creative': 'creative_designer',
    'local-service': 'local_service_provider',
    'other': 'other',
  };
  return mapping[workType] || workType;
}

// Map legacy hardest_things to new primary_challenges
function mapLegacyChallenges(hardest?: string[] | null): string[] | null {
  if (!hardest?.length) return null;
  const mapping: Record<string, string> = {
    'organized': 'staying_organized',
    'focus': 'knowing_what_to_focus_on',
    'income': 'tracking_income_expenses',
    'followups': 'client_follow_ups',
    'time': 'time_management',
    'overwhelmed': 'feeling_overwhelmed',
  };
  return hardest.map(h => mapping[h] || h);
}
