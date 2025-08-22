import { render, screen } from "@testing-library/react";
import React from "react";
import Header from "../Header";
import { supabase } from "../../integrations/supabase/client.ts";
import { vi } from 'vitest';
import { MemoryRouter } from "react-router-dom";

describe("Header", () => {
  it("shows EcoNest AI and Sign In button when logged out", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByAltText(/EcoNest AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  it("shows Sign Out button when logged in", async () => {
    // Mock Supabase auth to simulate logged-in session
    vi.mock('../../integrations/supabase/client.ts', () => {
      const mockSession = { session: { user: { id: '123' } } };
      return {
        supabase: {
          auth: {
            getSession: async () => ({ data: mockSession }),
            onAuthStateChange: (_cb: any) => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
            signOut: vi.fn()
          }
        }
      };
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const signOutButton = await screen.findByText(/Sign Out/i);
    expect(signOutButton).toBeInTheDocument();
  });
    vi.restoreAllMocks();
    vi.restoreAllMocks();
  });
