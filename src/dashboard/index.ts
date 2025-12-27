export { getDashboardConfig, type UserProfile } from './dashboardRules';
export { WIDGETS, type WidgetKey, type WidgetDefinition } from './widgetRegistry';
export { resolveDashboardWidgets, type ResolvedWidget } from './mergeDashboardConfig';
export { seedWidgetsOnOnboardingComplete, toggleWidget, reorderWidget, updateWidgetConfig } from './widgetApi';
export { getActivationComplete, isActivationComplete, toActivationState, type ActivationState, type ActivationInputs } from './activation';