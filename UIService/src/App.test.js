import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home page title", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /Modernized Accounting UI/i });
  expect(heading).toBeInTheDocument();
});
