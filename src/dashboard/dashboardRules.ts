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
  const widgets: WidgetKey[] = [];

  // Map legacy fields if new ones aren't set
  const businessType = profile.business_type || mapLegacyWorkType(profile.work_type);
  const challenges = profile.primary_challenges?.length 
    ? profile.primary_challenges 
    : mapLegacyChallenges(profile.hardest_things);

  /* -------------------------------------------------
     1. ALWAYS-ON BASELINE
  --------------------------------------------------*/
  widgets.push("activity_feed");
  widgets.push("kpi_weekly_income");

  if (
    profile.monthly_revenue_range &&
    profile.monthly_revenue_range !== "starting_inconsistent"
  ) {
    widgets.push("kpi_monthly_income");
  }

  /* -------------------------------------------------
     2. WORK TYPE → CORE WORK AREA
  --------------------------------------------------*/
  switch (businessType) {
    case "consultant":
    case "coach":
    case "freelancer":
      widgets.push("client_list");
      break;

    case "creative_designer":
    case "creative":
      widgets.push("project_board");
      break;

    case "local_service_provider":
    case "local-service":
      widgets.push("appointments_today");
      break;

    default:
      widgets.push("task_list");
  }

  /* -------------------------------------------------
     3. HARDEST THINGS → TOP PRIORITY WIDGETS
  --------------------------------------------------*/
  if (challenges?.includes("knowing_what_to_focus_on") || challenges?.includes("focus")) {
    widgets.unshift("focus_today"); // force to top
  }

  if (challenges?.includes("client_follow_ups") || challenges?.includes("followups")) {
    widgets.push("follow_up_queue");
  }

  if (challenges?.includes("tracking_income_expenses") || challenges?.includes("income")) {
    widgets.push("income_trend_chart");
  }

  if (challenges?.includes("staying_organized") || challenges?.includes("organized")) {
    if (!widgets.includes("task_list")) {
      widgets.push("task_list");
    }
  }

  /* -------------------------------------------------
     4. CLIENT VOLUME → DENSITY CONTROL
  --------------------------------------------------*/
  if (profile.client_volume === "25_plus") {
    // reduce clutter, focus on queues
    const taskIdx = widgets.indexOf("task_list");
    if (taskIdx > -1) widgets.splice(taskIdx, 1);
  }

  /* -------------------------------------------------
     5. ASSISTANT LEVEL → BEHAVIOR
  --------------------------------------------------*/
  if (profile.assistant_level === "active") {
    widgets.push("assistant_suggestions");
  }

  return dedupe(widgets);
}

/* ---------- helpers ---------- */
function dedupe<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

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