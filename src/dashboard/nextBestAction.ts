export type NextBestAction = {
  key: string;
  title: string;
  description?: string;
  ctaLabel: string;
  to: string;
  eventKey: string;
};

export type NBAInputs = {
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulRun: boolean;
  hasFirstValueEvent: boolean;

  hasLeads: boolean;
  hasAppointments: boolean;
  hasPayments: boolean;
};

export function getNextBestAction(i: NBAInputs): NextBestAction | null {
  if (!i.profileCompleted) {
    return {
      key: "complete_profile",
      title: "Complete your profile",
      description: "This unlocks personalization and smarter recommendations.",
      ctaLabel: "Finish profile",
      to: "/create-profile",
      eventKey: "nba_complete_profile"
    };
  }

  if ((i.activeTemplatesCount ?? 0) < 1) {
    return {
      key: "install_first_template",
      title: "Install your first template",
      description: "Templates are the fastest way to launch a working system.",
      ctaLabel: "Browse templates",
      to: "/templates",
      eventKey: "nba_install_first_template"
    };
  }

  if (!i.hasSuccessfulRun) {
    return {
      key: "run_first_automation",
      title: "Run your first automation",
      description: "Run a template once to activate EcoNest and unlock insights.",
      ctaLabel: "Open templates",
      to: "/templates",
      eventKey: "nba_run_first_automation"
    };
  }

  if (!i.hasFirstValueEvent) {
    if (!i.hasAppointments) {
      return {
        key: "book_test_appointment",
        title: "Book a test appointment",
        description: "Confirm scheduling works end-to-end.",
        ctaLabel: "Go to appointments",
        to: "/appointments",
        eventKey: "nba_book_test_appointment"
      };
    }
    if (!i.hasLeads) {
      return {
        key: "add_first_lead",
        title: "Add your first lead",
        description: "Start tracking outreach and follow-ups.",
        ctaLabel: "Add lead",
        to: "/dashboard",
        eventKey: "nba_add_first_lead"
      };
    }
    if (!i.hasPayments) {
      return {
        key: "track_first_payment",
        title: "Track your first payment",
        description: "Enable revenue tracking and weekly insights.",
        ctaLabel: "Open dashboard",
        to: "/dashboard",
        eventKey: "nba_track_first_payment"
      };
    }
  }

  return null;
}
