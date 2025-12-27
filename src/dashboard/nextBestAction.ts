export type NextBestAction = {
  key: string;
  title: string;
  description?: string;
  ctaLabel: string;
  to?: string;
  eventKey?: string;
  priority: number;
};

export type NBAInputs = {
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulRun: boolean;
  hasFirstValueEvent: boolean;

  hasLeads: boolean;
  hasAppointments: boolean;
  hasPayments: boolean;

  // optional operational signals
  failedRunsCount?: number;
};

export function getNextBestAction(i: NBAInputs): NextBestAction | null {
  // 🟢 Activation ladder (new users)
  if (!i.profileCompleted) {
    return {
      key: "complete_profile",
      title: "Complete your profile",
      description: "This unlocks personalization and smarter recommendations.",
      ctaLabel: "Finish profile",
      to: "/create-profile",
      eventKey: "nba_complete_profile",
      priority: 10
    };
  }

  if ((i.activeTemplatesCount ?? 0) < 1) {
    return {
      key: "install_first_template",
      title: "Install your first template",
      description: "Templates are the fastest way to launch a working system.",
      ctaLabel: "Browse templates",
      to: "/templates",
      eventKey: "nba_install_first_template",
      priority: 20
    };
  }

  if (!i.hasSuccessfulRun) {
    return {
      key: "run_first_automation",
      title: "Run your first automation",
      description: "Activate EcoNest by running a template once.",
      ctaLabel: "Open templates",
      to: "/templates",
      eventKey: "nba_run_first_automation",
      priority: 30
    };
  }

  if (!i.hasFirstValueEvent) {
    // pick the most relevant "first value" action
    if (!i.hasAppointments) {
      return {
        key: "book_test_appointment",
        title: "Book a test appointment",
        description: "Make sure scheduling works end-to-end.",
        ctaLabel: "Go to appointments",
        to: "/appointments",
        eventKey: "nba_book_test_appointment",
        priority: 40
      };
    }

    if (!i.hasLeads) {
      return {
        key: "add_first_lead",
        title: "Add your first lead",
        description: "Start tracking outreach and follow-ups.",
        ctaLabel: "Add lead",
        to: "/dashboard",
        eventKey: "nba_add_first_lead",
        priority: 45
      };
    }

    if (!i.hasPayments) {
      return {
        key: "track_first_payment",
        title: "Track your first payment",
        description: "Enable revenue tracking and weekly insights.",
        ctaLabel: "Open dashboard",
        to: "/dashboard",
        eventKey: "nba_track_first_payment",
        priority: 50
      };
    }
  }

  // 🔵 Operations ladder (power users)
  if ((i.failedRunsCount ?? 0) > 0) {
    return {
      key: "fix_failed_runs",
      title: "Fix failed automations",
      description: "Some workflows failed recently. Review and resolve errors.",
      ctaLabel: "View runs",
      to: "/owner/approvals",
      eventKey: "nba_fix_failed_runs",
      priority: 10
    };
  }

  // If nothing urgent, return null (dashboard is calm)
  return null;
}
