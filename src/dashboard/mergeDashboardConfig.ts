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
  dbRows: DbWidgetRow[] | null | undefined
): ResolvedWidget[] {
  const overrides = new Map<string, DbWidgetRow>();

  (dbRows ?? []).forEach((r) => overrides.set(r.widget_key, r));

  const resolved: ResolvedWidget[] = [];

  for (const key of ruleKeys) {
    const def = WIDGETS[key];
    const ovr = overrides.get(key);

    const enabled = ovr !== undefined ? ovr.enabled : def.defaultEnabled;
    const sortOrder = ovr !== undefined ? ovr.sort_order : def.defaultOrder;

    const config = {
      ...(def.defaultConfig ?? {}),
      ...(ovr?.config ?? {})
    };

    resolved.push({ key, enabled, sortOrder, config });
  }

  // For v2: allow "Add widgets" not in rules
  // for (const [key, ovr] of overrides) {
  //   if (!ruleKeys.includes(key as WidgetKey) && WIDGETS[key as WidgetKey]) {
  //     const def = WIDGETS[key as WidgetKey];
  //     resolved.push({
  //       key: key as WidgetKey,
  //       enabled: ovr.enabled,
  //       sortOrder: ovr.sort_order,
  //       config: { ...(def.defaultConfig ?? {}), ...(ovr.config ?? {}) }
  //     });
  //   }
  // }

  return resolved
    .filter((w) => w.enabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}