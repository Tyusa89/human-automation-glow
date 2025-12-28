import { type PlanTier } from "@/config/templates/templateIdentity";

/**
 * Template activation limits per plan tier.
 * - free: 1 active template at a time
 * - pro: 5 active templates (future)
 * - business: unlimited (future)
 */
export const ACTIVATION_LIMITS: Record<PlanTier, number> = {
  free: 1,
  pro: 5,
  business: 999, // effectively unlimited
};

export type CanActivateResult =
  | { allowed: true }
  | { allowed: false; reason: "limit_reached"; limit: number; current: number };

/**
 * Determines if a user can activate a new template based on their plan
 * and current active template count.
 * 
 * IMPORTANT: This replaces plan-based template locking for free-tier templates.
 * Pro/Business templates still require plan checks via isTemplateLocked().
 */
export function canActivateTemplate(params: {
  userPlan: PlanTier;
  activeTemplateCount: number;
}): CanActivateResult {
  const { userPlan, activeTemplateCount } = params;
  const limit = ACTIVATION_LIMITS[userPlan];

  if (activeTemplateCount >= limit) {
    return { 
      allowed: false, 
      reason: "limit_reached",
      limit,
      current: activeTemplateCount,
    };
  }

  return { allowed: true };
}

/**
 * Get the activation limit for a plan tier.
 */
export function getActivationLimit(plan: PlanTier): number {
  return ACTIVATION_LIMITS[plan];
}

/**
 * Format the activation limit message for UI display.
 */
export function formatActivationLimitMessage(plan: PlanTier, current: number): string {
  const limit = ACTIVATION_LIMITS[plan];
  
  if (plan === "free") {
    return `You can run ${limit} template on the Free plan. Deactivate your current template to activate this one, or upgrade.`;
  }
  
  return `You're using ${current}/${limit} active templates on ${plan === "pro" ? "Pro" : "Business"}.`;
}

/**
 * Check if a template requires a plan upgrade (for Pro/Business templates only).
 * Free-tier templates should use canActivateTemplate() instead.
 */
export function requiresPlanUpgrade(
  templateRequiredPlan: PlanTier,
  userPlan: PlanTier
): boolean {
  const rank: Record<PlanTier, number> = { free: 0, pro: 1, business: 2 };
  return rank[userPlan] < rank[templateRequiredPlan];
}
