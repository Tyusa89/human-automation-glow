import { z } from 'zod';

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
 */
export function requiresApproval(req: StewardRequest): boolean {
  // Human principal can do anything
  if (req.actorRole === 'human_principal') return false;
  
  // Zone 4 always requires approval for non-humans
  if (req.zone === 4) return true;
  
  // Zone 3 requires approval for writes/config changes
  if (req.zone === 3 && (req.actionType === 'write' || req.actionType === 'config_change')) {
    return true;
  }
  
  // Operators can only do zone 0-1 without approval
  if (req.actorRole === 'operator' && req.zone > 1) return true;
  
  // Orchestrators need approval for zone 3+ writes
  if (req.actorRole === 'orchestrator' && req.zone >= 3 && req.actionType !== 'read') {
    return true;
  }
  
  return false;
}

export function validateStewardRequest(data: unknown): StewardRequest {
  return StewardRequestSchema.parse(data);
}
