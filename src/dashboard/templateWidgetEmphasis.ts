import type { TemplateSlug, TemplateCategory } from "@/config/templates/templateIdentity";
import { getTemplateIdentity } from "@/config/templates/templateIdentity";

/**
 * Widget keys used in the dashboard
 */
export type WidgetKey =
  | "focus_today"
  | "kpi_weekly_income"
  | "kpi_monthly_income"
  | "income_trend_chart"
  | "client_list"
  | "follow_up_queue"
  | "appointments_today"
  | "task_list"
  | "project_board"
  | "activity_feed"
  | "assistant_suggestions";

/**
 * Template-to-widget emphasis mapping.
 * - `primary`: These widgets are prominently displayed (top of their zone)
 * - `secondary`: Normal display
 * - `hidden`: Not shown when this template is active
 */
export interface WidgetEmphasis {
  primary: WidgetKey[];
  secondary: WidgetKey[];
  hidden: WidgetKey[];
}

/**
 * Default widget visibility (no template active or unknown template)
 */
const DEFAULT_EMPHASIS: WidgetEmphasis = {
  primary: ["focus_today", "kpi_weekly_income", "kpi_monthly_income"],
  secondary: ["client_list", "task_list", "appointments_today", "follow_up_queue", "activity_feed"],
  hidden: [],
};

/**
 * Template-specific widget emphasis rules
 */
const TEMPLATE_WIDGET_MAP: Partial<Record<TemplateSlug, WidgetEmphasis>> = {
  // Dashboards
  "analytics-dashboard": {
    primary: ["kpi_weekly_income", "kpi_monthly_income", "income_trend_chart"],
    secondary: ["focus_today", "activity_feed", "client_list"],
    hidden: ["assistant_suggestions"],
  },
  "report-generator": {
    primary: ["income_trend_chart", "kpi_monthly_income"],
    secondary: ["kpi_weekly_income", "activity_feed", "task_list"],
    hidden: [],
  },

  // Ops
  "workflow-automation": {
    primary: ["activity_feed", "task_list"],
    secondary: ["focus_today", "kpi_weekly_income", "kpi_monthly_income"],
    hidden: ["appointments_today"],
  },
  "data-sync-tool": {
    primary: ["activity_feed", "task_list"],
    secondary: ["focus_today", "kpi_weekly_income"],
    hidden: [],
  },
  "expense-tracker": {
    primary: ["kpi_weekly_income", "kpi_monthly_income", "income_trend_chart"],
    secondary: ["task_list", "activity_feed"],
    hidden: [],
  },

  // Bots
  "appointment-booker": {
    primary: ["appointments_today", "follow_up_queue"],
    secondary: ["client_list", "task_list", "activity_feed"],
    hidden: [],
  },
  "customer-support-bot": {
    primary: ["activity_feed", "follow_up_queue"],
    secondary: ["client_list", "task_list"],
    hidden: ["income_trend_chart"],
  },
  "customer-support-widget": {
    primary: ["activity_feed", "follow_up_queue"],
    secondary: ["client_list", "task_list"],
    hidden: [],
  },
  "lead-qualification-bot": {
    primary: ["client_list", "follow_up_queue", "activity_feed"],
    secondary: ["task_list", "appointments_today"],
    hidden: [],
  },
  "bio-lead-qualifier": {
    primary: ["client_list", "follow_up_queue"],
    secondary: ["activity_feed", "task_list"],
    hidden: [],
  },
  "agent-support-bot": {
    primary: ["activity_feed", "task_list"],
    secondary: ["follow_up_queue", "client_list"],
    hidden: [],
  },

  // Ecommerce
  "inventory-manager": {
    primary: ["task_list", "activity_feed"],
    secondary: ["kpi_weekly_income", "kpi_monthly_income"],
    hidden: ["appointments_today"],
  },

  // Other
  "social-media-scheduler": {
    primary: ["task_list", "activity_feed"],
    secondary: ["focus_today"],
    hidden: ["appointments_today", "follow_up_queue"],
  },
  "email-campaign-builder": {
    primary: ["activity_feed", "task_list"],
    secondary: ["client_list", "follow_up_queue"],
    hidden: [],
  },
};

/**
 * Category-based fallback emphasis (when template not in map)
 */
const CATEGORY_FALLBACK: Record<TemplateCategory, WidgetEmphasis> = {
  dashboards: {
    primary: ["kpi_weekly_income", "kpi_monthly_income", "income_trend_chart"],
    secondary: ["focus_today", "activity_feed"],
    hidden: [],
  },
  ops: {
    primary: ["activity_feed", "task_list"],
    secondary: ["focus_today", "kpi_weekly_income"],
    hidden: [],
  },
  bots: {
    primary: ["activity_feed", "follow_up_queue", "client_list"],
    secondary: ["task_list"],
    hidden: [],
  },
  ecommerce: {
    primary: ["task_list", "kpi_weekly_income"],
    secondary: ["activity_feed"],
    hidden: [],
  },
  other: DEFAULT_EMPHASIS,
};

/**
 * Get widget emphasis for the active template.
 * Falls back to category-based rules, then defaults.
 */
export function getWidgetEmphasis(activeTemplateSlug: string | null): WidgetEmphasis {
  if (!activeTemplateSlug) return DEFAULT_EMPHASIS;

  // Check direct template mapping
  const templateEmphasis = TEMPLATE_WIDGET_MAP[activeTemplateSlug as TemplateSlug];
  if (templateEmphasis) return templateEmphasis;

  // Fall back to category
  const identity = getTemplateIdentity(activeTemplateSlug);
  if (identity) {
    return CATEGORY_FALLBACK[identity.category] || DEFAULT_EMPHASIS;
  }

  return DEFAULT_EMPHASIS;
}

/**
 * Sort widgets by emphasis (primary first, then secondary)
 * Preserves the full widget type.
 */
export function sortWidgetsByEmphasis<T extends { key: string }>(
  widgets: T[],
  emphasis: WidgetEmphasis
): T[] {
  const primarySet = new Set(emphasis.primary);
  const hiddenSet = new Set(emphasis.hidden);

  return widgets
    .filter(w => !hiddenSet.has(w.key as WidgetKey))
    .sort((a, b) => {
      const aIsPrimary = primarySet.has(a.key as WidgetKey);
      const bIsPrimary = primarySet.has(b.key as WidgetKey);
      if (aIsPrimary && !bIsPrimary) return -1;
      if (!aIsPrimary && bIsPrimary) return 1;
      return 0;
    });
}

/**
 * Check if a widget should be hidden for the active template
 */
export function isWidgetHidden(widgetKey: string, emphasis: WidgetEmphasis): boolean {
  return emphasis.hidden.includes(widgetKey as WidgetKey);
}

/**
 * Check if a widget is primary (emphasized) for the active template
 */
export function isWidgetPrimary(widgetKey: string, emphasis: WidgetEmphasis): boolean {
  return emphasis.primary.includes(widgetKey as WidgetKey);
}
