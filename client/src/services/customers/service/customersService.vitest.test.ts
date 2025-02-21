import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { fetchCustomerIds } from "./customersService";
import { getAllCustomerIds } from "../repository/customersRepository";

vi.mock("../repository/customersRepository", () => ({
  getAllCustomerIds: vi.fn(),
}));

describe("fetchCustomerIds", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it("should fetch customer ids and pass them to callback as arg", async () => {
    const mockIds = ["1", "2"];
    (getAllCustomerIds as Mock).mockResolvedValue(mockIds);
    const mockCallback = vi.fn();
    await fetchCustomerIds(mockCallback);
    expect(mockCallback).toHaveBeenCalledWith(mockIds);
  });
  it("should catch thrown error and show it", async () => {
    const error = new Error("Test error");
    (getAllCustomerIds as Mock).mockRejectedValue(error);
    const consoleErrorSpy = vi.spyOn(console, "error");
    const mockCallback = vi.fn();
    await fetchCustomerIds(mockCallback);
    expect(getAllCustomerIds).toHaveBeenCalled();
    expect(mockCallback).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching customer IDs: ",
      error
    );
  });
});
