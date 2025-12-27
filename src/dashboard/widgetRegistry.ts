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

export type WidgetDefinition = {
  key: WidgetKey;
  defaultEnabled: boolean;
  defaultOrder: number;
  defaultConfig?: Record<string, any>;
};

export const WIDGETS: Record<WidgetKey, WidgetDefinition> = {
  focus_today: { key: "focus_today", defaultEnabled: true, defaultOrder: 10 },
  kpi_weekly_income: { key: "kpi_weekly_income", defaultEnabled: true, defaultOrder: 20 },
  kpi_monthly_income: { key: "kpi_monthly_income", defaultEnabled: true, defaultOrder: 30 },
  income_trend_chart: {
    key: "income_trend_chart",
    defaultEnabled: true,
    defaultOrder: 40,
    defaultConfig: { rangeDays: 30 }
  },
  client_list: { key: "client_list", defaultEnabled: true, defaultOrder: 50 },
  follow_up_queue: { key: "follow_up_queue", defaultEnabled: true, defaultOrder: 60 },
  appointments_today: { key: "appointments_today", defaultEnabled: true, defaultOrder: 70 },
  task_list: { key: "task_list", defaultEnabled: true, defaultOrder: 80 },
  project_board: { key: "project_board", defaultEnabled: true, defaultOrder: 90 },
  activity_feed: { key: "activity_feed", defaultEnabled: true, defaultOrder: 100 },
  assistant_suggestions: { key: "assistant_suggestions", defaultEnabled: true, defaultOrder: 110 }
};