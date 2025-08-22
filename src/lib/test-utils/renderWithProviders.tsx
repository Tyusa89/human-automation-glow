import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

export function renderWithRouter(ui: ReactNode, route = "/") {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
