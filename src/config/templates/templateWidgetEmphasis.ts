import type { TemplateSlug, TemplateCategory } from "@/config/templates/templateIdentity";

// Your 11 keys (single source of truth)
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

export type EmphasisLevel = "hero" | "secondary";

export type TemplateEmphasis = {
  hero: WidgetKey[];
  secondary: WidgetKey[];
};

const CATEGORY_DEFAULTS: Record<TemplateCategory, TemplateEmphasis> = {
  dashboards: {
    hero: ["kpi_weekly_income", "kpi_monthly_income", "income_trend_chart"],
    secondary: ["focus_today", "activity_feed", "assistant_suggestions"],
  },
  ops: {
    hero: ["focus_today", "task_list", "project_board"],
    secondary: ["activity_feed", "assistant_suggestions", "client_list"],
  },
  bots: {
    hero: ["focus_today", "follow_up_queue", "activity_feed"],
    secondary: ["assistant_suggestions", "client_list", "appointments_today"],
  },
  ecommerce: {
    hero: ["kpi_weekly_income", "income_trend_chart", "focus_today"],
    secondary: ["task_list", "assistant_suggestions", "activity_feed"],
  },
  other: {
    hero: ["focus_today", "activity_feed", "assistant_suggestions"],
    secondary: ["task_list", "client_list", "kpi_weekly_income"],
  },
};

// Minimal overrides only where it matters.
// Everything else will fall back to category defaults.
export const TEMPLATE_WIDGET_EMPHASIS: Partial<Record<TemplateSlug, TemplateEmphasis>> = {
  // DASHBOARDS
  "analytics-dashboard": {
    hero: ["kpi_weekly_income", "kpi_monthly_income", "income_trend_chart"],
    secondary: ["activity_feed", "assistant_suggestions", "focus_today"],
  },
  "data-sync-warehouse": {
    hero: ["activity_feed", "assistant_suggestions", "focus_today"],
    secondary: ["project_board", "task_list", "income_trend_chart"],
  },
  "report-generator": {
    hero: ["focus_today", "kpi_monthly_income", "activity_feed"],
    secondary: ["income_trend_chart", "assistant_suggestions", "task_list"],
  },

  // OPS
  "data-sync-tool": {
    hero: ["focus_today", "activity_feed", "task_list"],
    secondary: ["project_board", "assistant_suggestions", "client_list"],
  },
  "workflow-automation": {
    hero: ["focus_today", "task_list", "activity_feed"],
    secondary: ["assistant_suggestions", "project_board", "client_list"],
  },
  "expense-tracker": {
    hero: ["kpi_weekly_income", "kpi_monthly_income", "focus_today"],
    secondary: ["income_trend_chart", "task_list", "activity_feed"],
  },
  "data-doc-sync": {
    hero: ["focus_today", "project_board", "task_list"],
    secondary: ["activity_feed", "assistant_suggestions", "client_list"],
  },
  "inventory-manager": {
    hero: ["focus_today", "task_list", "activity_feed"],
    secondary: ["project_board", "client_list", "assistant_suggestions"],
  },

  // BOTS
  "appointment-booker": {
    hero: ["appointments_today", "focus_today", "activity_feed"],
    secondary: ["client_list", "follow_up_queue", "assistant_suggestions"],
  },
  "customer-support-widget": {
    hero: ["follow_up_queue", "activity_feed", "focus_today"],
    secondary: ["assistant_suggestions", "client_list", "task_list"],
  },
  "lead-qualification-bot": {
    hero: ["follow_up_queue", "activity_feed", "focus_today"],
    secondary: ["assistant_suggestions", "client_list", "project_board"],
  },
  "customer-support-bot": {
    hero: ["follow_up_queue", "activity_feed", "focus_today"],
    secondary: ["assistant_suggestions", "client_list", "task_list"],
  },
  "agent-support-bot": {
    hero: ["activity_feed", "assistant_suggestions", "follow_up_queue"],
    secondary: ["focus_today", "client_list", "appointments_today"],
  },
  "bio-lead-qualifier": {
    hero: ["follow_up_queue", "assistant_suggestions", "activity_feed"],
    secondary: ["focus_today", "client_list", "project_board"],
  },

  // ECOMMERCE
  "social-media-scheduler": {
    hero: ["focus_today", "task_list", "project_board"],
    secondary: ["activity_feed", "assistant_suggestions", "kpi_weekly_income"],
  },
  "email-campaign-builder": {
    hero: ["focus_today", "task_list", "kpi_weekly_income"],
    secondary: ["income_trend_chart", "assistant_suggestions", "activity_feed"],
  },

  // OTHER
  "zapier-intercom-integration": {
    hero: ["focus_today", "activity_feed", "assistant_suggestions"],
    secondary: ["follow_up_queue", "task_list", "client_list"],
  },
};

/**
 * Get emphasis config for a template (falls back to category, then "other")
 * ENFORCES: focus_today always first in hero if present anywhere
 */
export function getTemplateWidgetEmphasis(params: {
  templateSlug: TemplateSlug | null;
  templateCategory: TemplateCategory | null;
}): TemplateEmphasis {
  const { templateSlug, templateCategory } = params;

  // IMPORTANT: get base config (don't mutate shared objects)
  const base: TemplateEmphasis =
    (templateSlug && TEMPLATE_WIDGET_EMPHASIS[templateSlug]) ||
    (templateCategory && CATEGORY_DEFAULTS[templateCategory]) ||
    CATEGORY_DEFAULTS.other;

  // Clone arrays so we don't mutate CATEGORY_DEFAULTS / TEMPLATE_WIDGET_EMPHASIS
  const hero = [...base.hero];
  const secondary = [...base.secondary];

  // ENFORCE: focus_today always first in hero (if present anywhere)
  const inHero = hero.includes("focus_today");
  const inSecondary = secondary.includes("focus_today");

  if (inHero || inSecondary) {
    return {
      hero: ["focus_today", ...hero.filter((k) => k !== "focus_today")],
      secondary: secondary.filter((k) => k !== "focus_today"),
    };
  }

  return { hero, secondary };
}

/**
 * Sort widgets by emphasis: hero first, then secondary, then rest
 */
export function sortWidgetsByEmphasis<T extends { key: string }>(
  widgets: T[],
  emphasis: TemplateEmphasis
): T[] {
  const heroSet = new Set(emphasis.hero);
  const secondarySet = new Set(emphasis.secondary);

  return [...widgets].sort((a, b) => {
    const aIsHero = heroSet.has(a.key as WidgetKey);
    const bIsHero = heroSet.has(b.key as WidgetKey);
    const aIsSecondary = secondarySet.has(a.key as WidgetKey);
    const bIsSecondary = secondarySet.has(b.key as WidgetKey);

    // Hero comes first
    if (aIsHero && !bIsHero) return -1;
    if (!aIsHero && bIsHero) return 1;

    // Then secondary
    if (aIsSecondary && !bIsSecondary) return -1;
    if (!aIsSecondary && bIsSecondary) return 1;

    return 0;
  });
}

/**
 * Check if widget is in the hero tier
 */
export function isWidgetHero(widgetKey: string, emphasis: TemplateEmphasis): boolean {
  return emphasis.hero.includes(widgetKey as WidgetKey);
}

/**
 * Check if widget is in the secondary tier
 */
export function isWidgetSecondary(widgetKey: string, emphasis: TemplateEmphasis): boolean {
  return emphasis.secondary.includes(widgetKey as WidgetKey);
}
