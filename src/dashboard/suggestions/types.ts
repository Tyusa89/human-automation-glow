import { WidgetKey } from "@/dashboard/widgetRegistry";

export type SuggestionStatus = "active" | "accepted" | "dismissed";

export type DashboardSuggestionRow = {
  id: string;
  user_id: string;
  suggestion_key: string;
  payload: any;
  status: SuggestionStatus;
  created_at: string;
  acted_at: string | null;
};

export type SuggestionPayload = {
  title: string;
  message: string;
  actionLabel?: string;      // default: "Apply"
  widget?: WidgetKey;        // widget to enable/move
  mode?: "move_top" | "enable"; // how to apply
  preferredSortOrder?: number;  // optional fixed target
};
