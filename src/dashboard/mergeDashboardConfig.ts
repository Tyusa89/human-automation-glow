import { WIDGETS, WidgetKey } from "./widgetRegistry";

type DbWidgetRow = {
  widget_key: string;
  enabled: boolean;
  sort_order: number;
  config: any;
};

export type ResolvedWidget = {
  key: WidgetKey;
  enabled: boolean;
  sortOrder: number;
  config: Record<string, any>;
};

export function resolveDashboardWidgets(
  ruleKeys: WidgetKey[],
  dbRows: DbWidgetRow[] | null | undefined,
  emphasis?: { hero: WidgetKey[]; secondary: WidgetKey[] } | null
): ResolvedWidget[] {
  const overrides = new Map<string, DbWidgetRow>();
  (dbRows ?? []).forEach((r) => overrides.set(r.widget_key, r));

  // Rule-based default ordering (10, 20, 30...)
  const ruleOrder = new Map<WidgetKey, number>();
  ruleKeys.forEach((k, idx) => ruleOrder.set(k, (idx + 1) * 10));

  // Emphasis rank maps (hero first, then secondary)
  const emphasisRank = new Map<WidgetKey, number>();
  if (emphasis) {
    emphasis.hero.forEach((k, i) => emphasisRank.set(k, i + 1)); // 1..n
    emphasis.secondary.forEach((k, i) =>
      emphasisRank.set(k, 100 + i + 1) // 101..n
    );
  }

  const resolved: ResolvedWidget[] = [];

  for (const key of ruleKeys) {
    const def = WIDGETS[key];
    const ovr = overrides.get(key);

    const enabled = ovr ? ovr.enabled : def.defaultEnabled;

    // Use DB sort_order if exists, otherwise use template-aware default
    let sortOrder = ovr?.sort_order ?? (() => {
      const base = ruleOrder.get(key) ?? def.defaultOrder ?? 999;
      const rank = emphasisRank.get(key);

      // If no emphasis, keep existing behavior
      if (!rank) return base;

      // Emphasis order wins among non-overridden widgets
      // We compress into early slots while still stable.
      return rank * 10; // hero: 10,20,30... secondary: 1010,1020...
    })();

    // HARD PIN: focus_today always first (unless user explicitly set a DB sort_order)
    if (key === "focus_today" && ovr?.sort_order == null) {
      sortOrder = -100000;
    }

    const config = {
      ...(def.defaultConfig ?? {}),
      ...(ovr?.config ?? {})
    };

    resolved.push({ key, enabled, sortOrder, config });
  }

  return resolved
    .filter((w) => w.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}
