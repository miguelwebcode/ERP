import { describe, it, expect } from "vitest";
import { formatDate } from "./index";

describe("formatDate", () => {
  it("should format the date correctly", () => {
    const date = new Date(2023, 9, 5, 14, 30); // 5th October 2023, 14:30
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("05/10/2023 14:30");
  });

  it("should pad single digit day and month with zero", () => {
    const date = new Date(2023, 0, 1, 9, 5); // 1st January 2023, 09:05
    const formattedDate = formatDate(date);
    expect(formattedDate).toBe("01/01/2023 09:05");
  });
});
