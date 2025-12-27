import type { MaturitySignals } from "@/hooks/useUserMaturity";

export type MaturityTier = "new" | "activating" | "onboarded" | "power";

export function resolveMaturityTier(s: MaturitySignals): MaturityTier {
  // NEW: no profile + no real activity
  if (!s.profileCompleted && !s.hasFirstValueEvent && s.activeTemplatesCount === 0) {
    return "new";
  }

  // ACTIVATING: profile done OR picked templates, but not yet "value"
  if (!s.hasFirstValueEvent && !s.hasSuccessfulAutomationRun) {
    return "activating";
  }

  // POWER: consistent usage and breadth
  // (Tweak thresholds anytime without touching UI)
  const breadth = Number(s.hasLeads) + Number(s.hasAppointments) + Number(s.hasPayments);
  const activeRecently = (s.daysSinceLastActivity ?? 999) <= 7;

  if (s.hasFirstValueEvent && s.hasSuccessfulAutomationRun && breadth >= 2 && activeRecently) {
    return "power";
  }

  return "onboarded";
}
