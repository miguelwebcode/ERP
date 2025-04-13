import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header", () => {
  it("should render the header with title and navigation links and logout button when pathname matches", () => {
    render(
      // There is no browser url in a test, so initialEntries creates a routing context
      // and sets the initial route
      <MemoryRouter initialEntries={["/customers"]}>
        <Header />
      </MemoryRouter>
    );

    const title = screen.getByText("FirERP");
    expect(title).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /customers/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument();
    const buttonLogout = screen.getByRole("button", { name: /logout/i });
    expect(buttonLogout).toBeInTheDocument();
  });

  it("should render title, not render navigation links when pathname does not match", () => {
    render(
      <MemoryRouter initialEntries={["/non-matching-path"]}>
        <Header />
      </MemoryRouter>
    );

    const title = screen.getByText("FirERP");
    expect(title).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /home/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /customers/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /projects/i })
    ).not.toBeInTheDocument();
    const buttonLogout = screen.queryByRole("button", { name: /logout/i });
    expect(buttonLogout).not.toBeInTheDocument();
  });
});
