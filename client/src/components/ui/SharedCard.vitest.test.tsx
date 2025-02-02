import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SharedCard } from "./SharedCard";

describe("SharedCard", () => {
  it("should render children correctly", () => {
    const childText = "This is a child component";

    render(
      <SharedCard>
        <div>{childText}</div>
      </SharedCard>
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it("should have the correct class names", () => {
    const childText = "This is a child component";

    render(
      <SharedCard>
        <div>{childText}</div>
      </SharedCard>
    );

    const cardElement = screen.getByText(childText).parentElement;
    expect(cardElement).toHaveClass("bg-slate-50");
    expect(cardElement).toHaveClass("rounded-xl");
    expect(cardElement).toHaveClass("shadow-lg");
    expect(cardElement).toHaveClass("p-4");
    expect(cardElement).toHaveClass("w-fit");
    expect(cardElement).toHaveClass("h-fit");
  });
});
