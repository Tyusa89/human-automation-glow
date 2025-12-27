import type { NextStepKind } from "@/lib/maturity/resolveNextStep";

/**
 * Canonical route for "Finish setup" based on blocker type.
 * - complete_profile → /create-profile (profile doesn't exist)
 * - everything else → /onboarding (profile exists, needs tuning)
 */
export function finishSetupHref(kind: NextStepKind): string {
  return kind === "complete_profile" ? "/create-profile" : "/onboarding";
}

/**
 * Human-readable reason why the primary action is blocked.
 */
export function blockerReason(kind: NextStepKind): string {
  switch (kind) {
    case "complete_profile":
      return "Complete your profile to unlock this action.";
    case "add_first_template":
      return "Activate a template to get started.";
    case "enable_appointments":
      return "Enable appointments to use this template.";
    case "fix_automation_errors":
      return "Fix automation errors before running workflows.";
    case "run_first_automation":
      return "Run your first automation to unlock results.";
    case "add_first_lead":
      return "Add your first lead to unlock this action.";
    case "add_first_appointment":
      return "Create your first appointment to unlock this action.";
    case "add_first_payment":
      return "Add your first payment to unlock this action.";
    default:
      return "Finish setup to unlock this action.";
  }
}

/**
 * Returns blocker info if the NextStepKind implies "not ready".
 * Returns null if no blocker applies (user is ready).
 */
export function getPrimaryActionBlocker(kind: NextStepKind): {
  ctaLabel: string;
  href: string;
  reason: string;
} | null {
  const blockers: NextStepKind[] = [
    "complete_profile",
    "add_first_template",
    "enable_appointments",
    "fix_automation_errors",
    "run_first_automation",
    "add_first_lead",
    "add_first_appointment",
    "add_first_payment",
  ];

  if (!blockers.includes(kind)) return null;

  return {
    ctaLabel: "Finish setup",
    href: finishSetupHref(kind),
    reason: blockerReason(kind),
  };
}
