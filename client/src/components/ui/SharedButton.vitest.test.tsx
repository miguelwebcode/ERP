import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SharedButton } from "./SharedButton";

describe("SharedButton", () => {
  it("should render the button with the correct text", () => {
    const text = "Click Me";
    const handleClick = vi.fn();

    render(<SharedButton text={text} handleClick={handleClick} />);

    const button = screen.getByText(text);
    expect(button).toBeInTheDocument();
  });

  it("should call handleClick when the button is clicked", () => {
    const text = "Click Me";
    const handleClick = vi.fn();

    render(<SharedButton text={text} handleClick={handleClick} />);

    const button = screen.getByText(text);
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it("should apply the provided className", () => {
    const text = "Click Me";
    const handleClick = vi.fn();
    const className = "custom-class";

    render(
      <SharedButton
        text={text}
        handleClick={handleClick}
        className={className}
      />
    );

    const button = screen.getByText(text);
    expect(button).toHaveClass("custom-class");
  });
});
