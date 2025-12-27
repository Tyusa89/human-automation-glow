/**
 * Activation state represents the milestones a user must complete
 * to transition from "new user" (activation mode) to "power user" (operations mode).
 * 
 * This is the single source of truth for dashboard mode switching.
 */
export interface ActivationState {
  profileCompleted: boolean;
  activeTemplatesCount: number;
  hasSuccessfulRun: boolean;
  hasFirstValueEvent: boolean; // appointment booked OR lead created OR payment received
}

/**
 * A user is "activation complete" when ALL of these are true:
 * - Profile is completed (name, company, onboarding_completed)
 * - At least one active template installed
 * - Either a successful automation run OR a first value event
 * 
 * After activation complete:
 * - Setup checklist disappears forever
 * - Dashboard shifts to power user mode
 * - NBA shows optimization actions instead of activation actions
 */
export function isActivationComplete(state: ActivationState): boolean {
  return (
    state.profileCompleted &&
    state.activeTemplatesCount >= 1 &&
    (state.hasSuccessfulRun || state.hasFirstValueEvent)
  );
}

/**
 * Helper to create ActivationState from MaturitySignals
 */
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
