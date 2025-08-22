import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, it, expect } from 'vitest';
import AppHeader from "../components/layout/AppHeader";

import { vi } from "vitest";
import { supabaseMock } from "../lib/test-utils/supabaseMock";
vi.mock("@/integrations/supabase/client", () => ({ supabase: supabaseMock }));

describe("Header", () => {
  it("shows EcoNest AI and Sign Out button", () => {
  render(<AppHeader />);

    // brand name visible
    expect(screen.getByText(/EcoNest AI/i)).toBeInTheDocument();

    // sign out visible (or login if logged out)
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });
});
