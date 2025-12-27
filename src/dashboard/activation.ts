/**
 * Activation signals - matches useUserMaturity signals
 */
export type ActivationSignals = {
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulAutomationRun: boolean;
  hasFirstValueEvent: boolean;
};

export function getActivationComplete(s: ActivationSignals): boolean {
  return (
    !!s.profileCompleted &&
    (s.activeTemplatesCount ?? 0) >= 1 &&
    (!!s.hasSuccessfulAutomationRun || !!s.hasFirstValueEvent)
  );
}

/**
 * Legacy type for backward compatibility with components
 * that use the old ActivationInputs pattern
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
 * Legacy aliases for backward compatibility
 * @deprecated Use ActivationSignals and getActivationComplete instead
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
