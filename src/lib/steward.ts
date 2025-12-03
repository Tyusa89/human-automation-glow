import { z } from 'zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

/**
 * Steward Authorization Request
 * Used by agents to request permission for actions based on data risk zones
 */
export const StewardRequestSchema = z.object({
  ownerId: z.string().uuid(),
  actorRole: z.enum(['operator', 'orchestrator', 'planner', 'human_principal']),
  actorId: z.string().optional(),
  actionType: z.enum(['read', 'write', 'append', 'config_change']),
  zone: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  resource: z.string().min(1),
  reason: z.string().min(1),
  metadata: z.record(z.any()).optional(),
});

export type StewardRequest = z.infer<typeof StewardRequestSchema>;

/**
 * Steward Decision outcomes
 */
export type StewardDecision =
  | { decision: 'ALLOW' }
  | { decision: 'DENY'; reason: string }
  | { decision: 'REQUIRE_APPROVAL'; approvalId: string };

/**
 * Zone risk levels:
 * 0 - Public/read-only data
 * 1 - User preferences, non-sensitive config
 * 2 - Business data (leads, tasks)
 * 3 - Financial/PII data
 * 4 - External integrations, irreversible actions
 */
export const ZONE_LABELS: Record<number, string> = {
  0: 'public',
  1: 'preferences',
  2: 'business',
  3: 'sensitive',
  4: 'external',
};

/**
 * Check if an action requires human approval based on zone and actor role
 * v1 - conservative and clear
 */
export function requiresApproval(req: StewardRequest): boolean {
  // High-risk zones always require approval
  if (req.zone >= 3) return true;

  // Config changes are always gated unless human-triggered
  if (
    req.actionType === 'config_change' &&
    req.actorRole !== 'human_principal'
  ) {
    return true;
  }

  return false;
}

/**
 * Core Steward function - evaluates request and returns decision
 */
export async function stewardDecision(
  supabase: SupabaseClient<Database>,
  req: StewardRequest
): Promise<StewardDecision> {
  const escalationNeeded = requiresApproval(req);

  // --- Case 1: Escalate to human ---
  if (escalationNeeded) {
    const { data, error } = await supabase
      .from('pending_approvals')
      .insert({
        owner_id: req.ownerId,
        actor_role: req.actorRole,
        actor_id: req.actorId ?? null,
        action_type: req.actionType,
        zone: req.zone,
        resource: req.resource,
        status: 'pending',
        risk_level: req.zone >= 4 ? 'critical' : 'high',
        reason: req.reason,
        metadata: req.metadata ?? {}
      })
      .select('id')
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create pending approval');

    // Audit the escalation
    await supabase.from('audit_logs').insert({
      actor_role: 'steward',
      actor_id: 'steward_core',
      action_type: req.actionType,
      zone: req.zone,
      resource: req.resource,
      decision: 'escalated',
      reason: req.reason,
      metadata: {
        owner_id: req.ownerId,
        approval_id: data.id
      }
    });

    return {
      decision: 'REQUIRE_APPROVAL',
      approvalId: data.id
    };
  }

  // --- Case 2: Allowed ---
  await supabase.from('audit_logs').insert({
    actor_role: 'steward',
    actor_id: 'steward_core',
    action_type: req.actionType,
    zone: req.zone,
    resource: req.resource,
    decision: 'allowed',
    reason: req.reason,
    metadata: {
      owner_id: req.ownerId
    }
  });

  return { decision: 'ALLOW' };
}

export function validateStewardRequest(data: unknown): StewardRequest {
  return StewardRequestSchema.parse(data);
}
