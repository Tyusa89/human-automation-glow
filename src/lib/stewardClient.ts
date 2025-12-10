// src/lib/stewardClient.ts
export type StewardDecision = 'ALLOW' | 'REQUIRE_APPROVAL' | 'DENY';

interface StewardApprovePayload {
  approvalId: string;
  ownerId: string;
  resolutionReason: string;
}

const API_BASE = 'https://rqldulvkwzvrmcvwttep.supabase.co/functions/v1';

export async function stewardApprove(payload: StewardApprovePayload) {
  const res = await fetch(`${API_BASE}/steward-approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Steward approve failed: ${res.status} ${text}`);
  }
  return res.json();
}

export async function stewardReject(payload: StewardApprovePayload) {
  const res = await fetch(`${API_BASE}/steward-reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Steward reject failed: ${res.status} ${text}`);
  }
  return res.json();
}
