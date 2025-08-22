// Optional helper for Supabase auth
export function isAuthenticated(session: unknown) {
  return !!(session as { user?: unknown })?.user;
}
