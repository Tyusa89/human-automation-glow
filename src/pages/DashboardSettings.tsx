import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardConfig, UserProfile } from "@/dashboard/dashboardRules";
import { WIDGETS, WidgetKey } from "@/dashboard/widgetRegistry";
import { resolveDashboardWidgets, ResolvedWidget } from "@/dashboard/mergeDashboardConfig";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronUp, ChevronDown, GripVertical, Loader2, Eye, EyeOff, Settings2 } from "lucide-react";

type DbRow = {
  widget_key: string;
  enabled: boolean;
  sort_order: number;
  config: any;
};

type WidgetItem = ResolvedWidget & {
  label: string;
  description: string;
};

export default function DashboardSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dbRows, setDbRows] = useState<DbRow[]>([]);
  const [visible, setVisible] = useState<WidgetItem[]>([]);
  const [hidden, setHidden] = useState<WidgetItem[]>([]);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const uid = auth?.user?.id ?? null;
    setUserId(uid);
    if (!uid) {
      setLoading(false);
      return;
    }

    const { data: prof } = await supabase
      .from("profiles")
      .select("business_type, client_volume, monthly_revenue_range, tracking_method, success_goal, assistant_level, primary_challenges, work_type, hardest_things")
      .eq("user_id", uid)
      .maybeSingle();

    setProfile(prof as UserProfile);

    const { data: rows } = await supabase
      .from("user_dashboard_widgets")
      .select("widget_key, enabled, sort_order, config")
      .eq("user_id", uid);

    setDbRows((rows as DbRow[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!profile) return;

    const ruleKeys = getDashboardConfig(profile);
    const resolved = resolveDashboardWidgets(ruleKeys, dbRows);

    const visibleList: WidgetItem[] = resolved.map((w) => ({
      ...w,
      label: WIDGETS[w.key].label,
      description: WIDGETS[w.key].description
    }));

    const visibleKeys = new Set(visibleList.map((x) => x.key));

    // Get hidden widgets from rules that are disabled
    const allRuleWidgets = ruleKeys.map((k) => {
      const dbRow = dbRows.find(r => r.widget_key === k);
      return {
        key: k,
        enabled: dbRow ? dbRow.enabled : WIDGETS[k].defaultEnabled,
        sortOrder: dbRow ? dbRow.sort_order : WIDGETS[k].defaultOrder,
        config: dbRow?.config ?? WIDGETS[k].defaultConfig ?? {},
        label: WIDGETS[k].label,
        description: WIDGETS[k].description
      };
    });

    const hiddenList = allRuleWidgets
      .filter((w) => !w.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    setVisible(visibleList);
    setHidden(hiddenList);
  }, [profile, dbRows]);

  async function upsertWidget(partial: { widget_key: string; enabled?: boolean; sort_order?: number; config?: any }) {
    if (!userId) return;
    setSavingKey(partial.widget_key);

    const widgetDef = WIDGETS[partial.widget_key as WidgetKey];
    const existing = dbRows.find(r => r.widget_key === partial.widget_key);

    const payload = {
      user_id: userId,
      widget_key: partial.widget_key,
      enabled: partial.enabled ?? existing?.enabled ?? true,
      sort_order: partial.sort_order ?? existing?.sort_order ?? widgetDef.defaultOrder,
      config: partial.config ?? existing?.config ?? widgetDef.defaultConfig ?? {}
    };

    await supabase.from("user_dashboard_widgets").upsert(payload, {
      onConflict: "user_id,widget_key"
    });

    // Refresh local db rows
    const { data: rows } = await supabase
      .from("user_dashboard_widgets")
      .select("widget_key, enabled, sort_order, config")
      .eq("user_id", userId);

    setDbRows((rows as DbRow[]) ?? []);
    setSavingKey(null);
  }

  async function toggleVisible(key: WidgetKey, enabled: boolean) {
    await upsertWidget({ widget_key: key, enabled });
  }

  async function move(key: WidgetKey, direction: "up" | "down") {
    const idx = visible.findIndex((w) => w.key === key);
    if (idx < 0) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= visible.length) return;

    const a = visible[idx];
    const b = visible[swapIdx];

    // Swap sortOrder
    setSavingKey(a.key);
    await upsertWidget({ widget_key: a.key, sort_order: b.sortOrder, enabled: true, config: a.config });
    await upsertWidget({ widget_key: b.key, sort_order: a.sortOrder, enabled: true, config: b.config });
  }

  async function setRangeDays(key: WidgetKey, rangeDays: number) {
    const current = visible.find((w) => w.key === key);
    const nextConfig = { ...(current?.config ?? {}), rangeDays };
    await upsertWidget({ widget_key: key, config: nextConfig, enabled: true, sort_order: current?.sortOrder });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Settings2 className="h-8 w-8" />
                Customize Dashboard
              </h1>
              <p className="text-muted-foreground">
                Choose what you want to see and reorder it anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-8 max-w-3xl">
        {/* Visible Widgets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Visible Widgets
            </CardTitle>
            <CardDescription>
              These widgets appear on your dashboard. Drag or use arrows to reorder.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {visible.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No visible widgets. Enable some from the hidden list below.
              </p>
            ) : (
              visible.map((w, i) => (
                <div
                  key={w.key}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground/50 flex-shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{w.label}</p>
                      {savingKey === w.key && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{w.description}</p>
                    
                    {/* Inline config for income trend */}
                    {w.key === "income_trend_chart" && (
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">Range:</span>
                        {[7, 30, 90].map((d) => (
                          <Button
                            key={d}
                            size="sm"
                            variant={w.config?.rangeDays === d ? "default" : "outline"}
                            className="h-6 px-2 text-xs"
                            onClick={() => setRangeDays(w.key, d)}
                            disabled={savingKey === w.key}
                          >
                            {d}d
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => move(w.key, "up")}
                      disabled={i === 0 || savingKey === w.key}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() => move(w.key, "down")}
                      disabled={i === visible.length - 1 || savingKey === w.key}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <Switch
                    checked={true}
                    onCheckedChange={() => toggleVisible(w.key, false)}
                    disabled={savingKey === w.key}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Hidden Widgets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-muted-foreground" />
              Hidden Widgets
            </CardTitle>
            <CardDescription>
              These widgets are available but not shown. Toggle to add them.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {hidden.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                All eligible widgets are visible.
              </p>
            ) : (
              hidden.map((w) => (
                <div
                  key={w.key}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-muted/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm text-muted-foreground">{w.label}</p>
                      {savingKey === w.key && (
                        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/70">{w.description}</p>
                  </div>

                  <Switch
                    checked={false}
                    onCheckedChange={() => toggleVisible(w.key, true)}
                    disabled={savingKey === w.key}
                  />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center">
          <Badge variant="secondary" className="text-xs">
            Widgets are based on your onboarding preferences
          </Badge>
        </div>
      </div>
    </div>
  );
}