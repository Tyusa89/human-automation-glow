/**
 * Activation inputs - matches exact database schema fields
 */
export type ActivationInputs = {
  profile: {
    full_name: string | null;
    company: string | null;
    onboarding_completed: boolean;
  } | null;
  activeTemplatesCount: number;
  hasSuccessfulRun: boolean;
  hasFirstValueEvent: boolean;
};

/**
 * A user is "activation complete" when ALL of these are true:
 * - Profile is completed (full_name + company + onboarding_completed)
 * - At least one active template installed
 * - Either a successful automation run OR a first value event
 * 
 * After activation complete:
 * - Setup checklist disappears forever
 * - Dashboard shifts to power user mode
 * - NBA shows optimization actions instead of activation actions
 * - Power-user suggestions start appearing
 */
export function getActivationComplete(i: ActivationInputs): boolean {
  const profileCompleted = !!(
    i.profile?.full_name &&
    i.profile?.company &&
    i.profile?.onboarding_completed
  );

  return (
    profileCompleted &&
    (i.activeTemplatesCount ?? 0) >= 1 &&
    (i.hasSuccessfulRun || i.hasFirstValueEvent)
  );
}

/**
 * Legacy aliases for backward compatibility
 * @deprecated Use ActivationInputs and getActivationComplete instead
 */
export type ActivationState = {
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulRun: boolean;
  hasFirstValueEvent: boolean;
};

export function isActivationComplete(state: ActivationState): boolean {
  return (
    state.profileCompleted &&
    state.activeTemplatesCount >= 1 &&
    (state.hasSuccessfulRun || state.hasFirstValueEvent)
  );
}

export function toActivationState(signals: {
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulAutomationRun: boolean;
  hasFirstValueEvent: boolean;
}): ActivationState {
  return {
    profileCompleted: signals.profileCompleted,
    activeTemplatesCount: signals.activeTemplatesCount,
    hasSuccessfulRun: signals.hasSuccessfulAutomationRun,
    hasFirstValueEvent: signals.hasFirstValueEvent,
  };
}
