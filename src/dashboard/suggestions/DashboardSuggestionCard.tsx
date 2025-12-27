import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSuggestionRow, SuggestionPayload } from "./types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, X, Check, Undo2 } from "lucide-react";

type Props = {
  suggestion: DashboardSuggestionRow;
  onChanged?: () => Promise<void> | void;
};

type UndoState = {
  userId: string;
  widget_key: string;
  prev_enabled: boolean | null;      // null = row didn't exist
  prev_sort_order: number | null;
  prev_config: any | null;
};

export default function DashboardSuggestionCard({ suggestion, onChanged }: Props) {
  const payload = (suggestion.payload ?? {}) as SuggestionPayload;
  const [busy, setBusy] = useState(false);

  const [undoState, setUndoState] = useState<UndoState | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
    };
  }, []);

  async function accept() {
    setBusy(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) return;

      const widget = payload.widget;

      // 1) Capture BEFORE state (for Undo)
      let before: any | null = null;
      if (widget) {
        const { data: existingRows } = await supabase
          .from("user_dashboard_widgets")
          .select("enabled, sort_order, config")
          .eq("user_id", userId)
          .eq("widget_key", widget)
          .limit(1);

        before = existingRows?.[0] ?? null;
      }

      // 2) Apply suggestion
      if (widget) {
        const { data: rowsRaw } = await supabase
          .from("user_dashboard_widgets")
          .select("sort_order, enabled")
          .eq("user_id", userId);

        const rows = (rowsRaw as any[]) ?? [];
        const enabledRows = rows.filter((r) => r.enabled !== false);

        const minSort = enabledRows.length
          ? Math.min(...enabledRows.map((r) => Number(r.sort_order ?? 100)))
          : 20;

        let targetSort = payload.preferredSortOrder ?? (minSort - 5);

        if (payload.mode === "enable" && payload.preferredSortOrder == null) {
          targetSort = 35;
        }

        await supabase.from("user_dashboard_widgets").upsert(
          {
            user_id: userId,
            widget_key: widget,
            enabled: true,
            sort_order: targetSort,
            config: before?.config ?? {}
          },
          { onConflict: "user_id,widget_key" }
        );

        // 3) Store Undo state + show snackbar
        setUndoState({
          userId,
          widget_key: widget,
          prev_enabled: before ? Boolean(before.enabled) : null,
          prev_sort_order: before?.sort_order ?? null,
          prev_config: before?.config ?? null
        });

        setShowUndo(true);
        if (hideTimer.current) window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setShowUndo(false), 6000);
      }

      // Mark suggestion accepted
      await supabase
        .from("user_dashboard_suggestions")
        .update({ status: "accepted", acted_at: new Date().toISOString() })
        .eq("id", suggestion.id);

      if (onChanged) await onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function undo() {
    if (!undoState) return;

    setBusy(true);
    try {
      const { userId, widget_key, prev_enabled, prev_sort_order, prev_config } = undoState;

      // If there was no row before, revert by disabling it
      if (prev_enabled === null) {
        await supabase.from("user_dashboard_widgets").upsert(
          {
            user_id: userId,
            widget_key,
            enabled: false,
            sort_order: 999,
            config: {}
          },
          { onConflict: "user_id,widget_key" }
        );
      } else {
        await supabase.from("user_dashboard_widgets").upsert(
          {
            user_id: userId,
            widget_key,
            enabled: prev_enabled,
            sort_order: prev_sort_order ?? 50,
            config: prev_config ?? {}
          },
          { onConflict: "user_id,widget_key" }
        );
      }

      setShowUndo(false);
      setUndoState(null);

      if (onChanged) await onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function dismiss() {
    setBusy(true);
    try {
      await supabase
        .from("user_dashboard_suggestions")
        .update({ status: "dismissed", acted_at: new Date().toISOString() })
        .eq("id", suggestion.id);

      if (onChanged) await onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-full bg-primary/10">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {payload.title ?? "EcoNest suggestion"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {payload.message}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={dismiss}
                disabled={busy}
                className="gap-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                Not now
              </Button>
              <Button
                size="sm"
                onClick={accept}
                disabled={busy}
                className="gap-1"
              >
                <Check className="h-4 w-4" />
                {payload.actionLabel ?? "Apply"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Undo snackbar */}
      {showUndo && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 bg-foreground text-background px-4 py-3 rounded-lg shadow-lg">
            <span className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4" />
              Dashboard updated
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={undo}
              disabled={busy}
              className="text-background hover:bg-background/20 gap-1"
            >
              <Undo2 className="h-4 w-4" />
              Undo
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
