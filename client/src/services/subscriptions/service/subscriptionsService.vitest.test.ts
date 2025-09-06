import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchHistoricalMrr } from "./subscriptionsService";
import { getHistoricalMrr } from "../repository/subscriptionsRepository";
import { MrrMonth } from "../../../types";

vi.mock("../repository/subscriptionsRepository", () => ({
  getHistoricalMrr: vi.fn(),
}));

describe("fetchHistoricalMrr", () => {
  let callback: ReturnType<typeof vi.fn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    vi.clearAllMocks();
    callback = vi.fn((_value: MrrMonth[]) => void 0);
    consoleErrorSpy = vi.spyOn(console, "error");
  });

  it("should fetch historical MRR data and pass to callback", async () => {
    const mrrData: MrrMonth[] = [
      {
        month: "2023-01",
        revenue: 10000,
      },
      {
        month: "2023-02",
        revenue: 12000,
      },
      {
        month: "2023-03",
        revenue: 15000,
      },
      {
        month: "2023-04",
        revenue: 18000,
      },
    ];
    const response = { data: mrrData };

    vi.mocked(getHistoricalMrr).mockResolvedValue(response);

    const result = await fetchHistoricalMrr(callback);

    expect(getHistoricalMrr).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mrrData);
    expect(result).toBeUndefined();
  });

  it("should handle repository errors", async () => {
    const error = new Error("Failed to fetch MRR data");

    vi.mocked(getHistoricalMrr).mockRejectedValue(error);

    const result = await fetchHistoricalMrr(callback);
    expect(getHistoricalMrr).toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching historical MRR data: ",
      error
    );
    expect(result).toBeUndefined();
  });

  it("should work with empty MRR data", async () => {
    const mrrData: MrrMonth[] = [];
    const response = { data: mrrData };

    vi.mocked(getHistoricalMrr).mockResolvedValue(response);

    const result = await fetchHistoricalMrr(callback);

    expect(getHistoricalMrr).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mrrData);
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle single month MRR data", async () => {
    const mrrData: MrrMonth[] = [
      {
        month: "2023-12",
        revenue: 25000,
      },
    ];
    const response = { data: mrrData };

    vi.mocked(getHistoricalMrr).mockResolvedValue(response);

    const result = await fetchHistoricalMrr(callback);

    expect(getHistoricalMrr).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mrrData);
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle MRR data with zero revenue", async () => {
    const mrrData: MrrMonth[] = [
      {
        month: "2023-01",
        revenue: 0,
      },
      {
        month: "2023-02",
        revenue: 5000,
      },
    ];
    const response = { data: mrrData };

    vi.mocked(getHistoricalMrr).mockResolvedValue(response);

    const result = await fetchHistoricalMrr(callback);

    expect(getHistoricalMrr).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mrrData);
    expect(result).toBeUndefined();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle large MRR data sets", async () => {
    const mrrData: MrrMonth[] = Array.from({ length: 24 }, (_, i) => ({
      month: `2022-${String(i + 1).padStart(2, "0")}`,
      revenue: (i + 1) * 1000,
    }));
    const response = { data: mrrData };

    vi.mocked(getHistoricalMrr).mockResolvedValue(response);

    const result = await fetchHistoricalMrr(callback);

    expect(getHistoricalMrr).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(mrrData);
    expect(result).toBeUndefined();
    expect(mrrData).toHaveLength(24);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
