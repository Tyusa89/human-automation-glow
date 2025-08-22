import { vi } from "vitest";

export const supabaseMock = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: "u_123" } } }),
    getSession: vi.fn().mockResolvedValue({ data: { session: {} } }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
    signOut: vi.fn().mockResolvedValue({}),
    signInWithOtp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { user: { id: "u_123" }}, error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
  from: vi.fn(() => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: { role: "owner" }, error: null }),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  })),
  functions: {
    invoke: vi.fn().mockResolvedValue({
      data: { status: "ok", payload: { leads_today: 7 } },
      error: null,
    }),
  },
  channel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(),
  })),
  removeChannel: vi.fn(),
};
// In a test file:
// vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));
