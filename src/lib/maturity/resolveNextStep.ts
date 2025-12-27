import type { MaturitySignals } from "@/hooks/useUserMaturity";

export type NextStepKind =
  | "complete_profile"
  | "enable_appointments"
  | "add_first_template"
  | "fix_automation_errors"
  | "run_first_automation"
  | "add_first_lead"
  | "add_first_appointment"
  | "add_first_payment"
  | "nothing";

export interface NextStep {
  kind: NextStepKind;
  title: string;
  description: string;
  ctaLabel: string;
  href?: string;
  priority: number;
}

export function resolveNextStep(s: MaturitySignals): NextStep {
  // 1) Don't nag power users
  const breadth = Number(s.hasLeads) + Number(s.hasAppointments) + Number(s.hasPayments);
  const activeRecently = (s.daysSinceLastActivity ?? 999) <= 7;

  if (s.hasFirstValueEvent && s.hasSuccessfulAutomationRun && breadth >= 2 && activeRecently) {
    return {
      kind: "nothing",
      title: "All set",
      description: "Your system is running smoothly.",
      ctaLabel: "View insights",
      href: "/dashboard",
      priority: 999,
    };
  }

  // 2) Always surface blockers before onboarding
  if (s.automationErrorsCount > 0) {
    return {
      kind: "fix_automation_errors",
      title: "Fix automation errors",
      description: `You have ${s.automationErrorsCount} run issue(s) to review.`,
      ctaLabel: "Review errors",
      href: "/automations/runs",
      priority: 10,
    };
  }

  // 3) Core activation: profile first
  if (!s.profileCompleted) {
    return {
      kind: "complete_profile",
      title: "Complete your profile",
      description: "Answer a few questions so your dashboard can auto-configure.",
      ctaLabel: "Finish setup",
      href: "/create-profile",
      priority: 20,
    };
  }

  // 4) Choose something to run
  if (s.activeTemplatesCount === 0) {
    return {
      kind: "add_first_template",
      title: "Activate your first template",
      description: "Pick one system to turn on so EcoNest can start helping.",
      ctaLabel: "Browse templates",
      href: "/templates",
      priority: 30,
    };
  }

  // 5) First successful run
  if (!s.hasSuccessfulAutomationRun) {
    return {
      kind: "run_first_automation",
      title: "Run your first automation",
      description: "Trigger a test run to confirm everything is connected.",
      ctaLabel: "Run now",
      href: "/automations",
      priority: 40,
    };
  }

  // 6) Feature-specific nudges (only if relevant)
  if (!s.appointmentsEnabled) {
    return {
      kind: "enable_appointments",
      title: "Enable appointments",
      description: "Turn on booking so your system can capture leads automatically.",
      ctaLabel: "Enable booking",
      href: "/appointments/settings",
      priority: 50,
    };
  }

  if (!s.hasLeads) {
    return {
      kind: "add_first_lead",
      title: "Add your first lead",
      description: "Start your pipeline so automations have something to work with.",
      ctaLabel: "Add lead",
      href: "/crm/leads/new",
      priority: 60,
    };
  }

  if (s.appointmentsEnabled && !s.hasAppointments) {
    return {
      kind: "add_first_appointment",
      title: "Create your first appointment",
      description: "Test the booking flow end-to-end.",
      ctaLabel: "Create appointment",
      href: "/appointments/new",
      priority: 70,
    };
  }

  if (!s.hasPayments) {
    return {
      kind: "add_first_payment",
      title: "Connect payments",
      description: "Add a product or payment method so revenue can be tracked.",
      ctaLabel: "Set up payments",
      href: "/payments",
      priority: 80,
    };
  }

  // Fallback (should be rare)
  return {
    kind: "nothing",
    title: "Looking good",
    description: "No setup steps needed right now.",
    ctaLabel: "View dashboard",
    href: "/dashboard",
    priority: 999,
  };
}
