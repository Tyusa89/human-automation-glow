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
  label: string;
  description: string;
  defaultEnabled: boolean;
  defaultOrder: number;
  defaultConfig?: Record<string, any>;
};

export const WIDGETS: Record<WidgetKey, WidgetDefinition> = {
  focus_today: {
    key: "focus_today",
    label: "Focus Today",
    description: "Your top priority and next best action.",
    defaultEnabled: true,
    defaultOrder: 10
  },
  kpi_weekly_income: {
    key: "kpi_weekly_income",
    label: "Weekly Income",
    description: "Total income for the last 7 days.",
    defaultEnabled: true,
    defaultOrder: 20
  },
  kpi_monthly_income: {
    key: "kpi_monthly_income",
    label: "Monthly Income",
    description: "Total income for the current month.",
    defaultEnabled: true,
    defaultOrder: 30
  },
  income_trend_chart: {
    key: "income_trend_chart",
    label: "Income Trend",
    description: "See your income trend over time.",
    defaultEnabled: true,
    defaultOrder: 40,
    defaultConfig: { rangeDays: 30 }
  },
  client_list: {
    key: "client_list",
    label: "Active Clients",
    description: "Your current clients and recent activity.",
    defaultEnabled: true,
    defaultOrder: 50
  },
  follow_up_queue: {
    key: "follow_up_queue",
    label: "Follow-up Queue",
    description: "Clients waiting for your response.",
    defaultEnabled: true,
    defaultOrder: 60
  },
  appointments_today: {
    key: "appointments_today",
    label: "Today's Appointments",
    description: "Your scheduled appointments for today.",
    defaultEnabled: true,
    defaultOrder: 70
  },
  task_list: {
    key: "task_list",
    label: "Task List",
    description: "Your pending tasks and to-dos.",
    defaultEnabled: true,
    defaultOrder: 80
  },
  project_board: {
    key: "project_board",
    label: "Project Board",
    description: "Track your active projects and deadlines.",
    defaultEnabled: true,
    defaultOrder: 90
  },
  activity_feed: {
    key: "activity_feed",
    label: "Activity Feed",
    description: "Recent events and updates.",
    defaultEnabled: true,
    defaultOrder: 100
  },
  assistant_suggestions: {
    key: "assistant_suggestions",
    label: "AI Suggestions",
    description: "Smart recommendations based on your activity.",
    defaultEnabled: true,
    defaultOrder: 110
  }
};