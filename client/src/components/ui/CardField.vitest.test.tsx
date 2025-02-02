import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CardField } from "./CardField";

describe("CardField", () => {
  it("should render the label and value correctly", () => {
    const label = "Test Label";
    const value = "Test Value";

    render(<CardField label={label} value={value} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText(value)).toBeInTheDocument();
  });
});
