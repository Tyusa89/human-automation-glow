const keyFor = (userId: string, eventKey: string) => 
  `econest:nba:dismiss:${userId}:${eventKey}`;

export function isDismissed(userId: string, eventKey?: string): boolean {
  if (!userId || !eventKey) return false;
  const raw = localStorage.getItem(keyFor(userId, eventKey));
  if (!raw) return false;
  const ts = Number(raw);
  if (!ts) return false;
  const hours24 = 24 * 60 * 60 * 1000;
  return Date.now() - ts < hours24;
}

export function dismiss(userId: string, eventKey?: string): void {
  if (!userId || !eventKey) return;
  localStorage.setItem(keyFor(userId, eventKey), String(Date.now()));
}
