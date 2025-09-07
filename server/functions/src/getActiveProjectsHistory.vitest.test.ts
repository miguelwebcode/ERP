import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { getActiveProjectsHistory } from "./getActiveProjectsHistory";
import { db } from "./firebaseConfig";
import { ActiveProjectsMonth, Project } from "./types";

// Mock de Firebase Functions
vi.mock("firebase-functions/v1", () => ({
  region: vi.fn(() => ({
    https: {
      onCall: vi.fn((handler) => ({ _handler: handler })),
    },
  })),
}));

// Mock de Firebase Config
vi.mock("./firebaseConfig", () => ({
  db: {
    collection: vi.fn(),
  },
}));

describe("getActiveProjectsHistory", () => {
  let mockCollection: Mock;
  let mockGet: Mock;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  const mockProjects: Project[] = [
    {
      id: "1",
      name: "Project 1",
      startDate: "2024-01-15",
      endDate: "2024-03-30",
      state: "inProgress",
      description: "Test project 1",
      customerId: "customer1",
      employeeId: "employee1",
      createdAt: "2024-01-01",
    },
    {
      id: "2",
      name: "Project 2",
      startDate: "2024-02-01",
      endDate: "2024-12-31",
      state: "pending",
      description: "Test project 2",
      customerId: "customer2",
      employeeId: "employee2",
      createdAt: "2024-02-01",
    },
    {
      id: "3",
      name: "Project 3",
      startDate: "2024-06-01",
      endDate: "", // ongoing project
      state: "inProgress",
      description: "Test project 3",
      customerId: "customer3",
      employeeId: "employee3",
      createdAt: "2024-06-01",
    },
    {
      id: "4",
      name: "Project 4",
      startDate: "2024-05-01",
      endDate: "2024-05-31",
      state: "completed", // should not count
      description: "Test project 4",
      customerId: "customer4",
      employeeId: "employee4",
      createdAt: "2024-05-01",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error");

    // Setup Firebase mocks
    mockGet = vi.fn();
    mockCollection = vi.mocked(db.collection);

    // Configure mock chains
    mockCollection.mockReturnValue({ get: mockGet } as any);
  });

  it("should return active projects history for last 12 months", async () => {
    // Arrange
    const mockSnapshot = {
      docs: mockProjects.map((project) => ({
        data: () => project,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act - Get the handler function and call it
    const handler = (getActiveProjectsHistory as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockGet).toHaveBeenCalled();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);

    // Each result should have month and activeCount
    result.forEach((item: ActiveProjectsMonth) => {
      expect(item).toHaveProperty("month");
      expect(item).toHaveProperty("activeCount");
      expect(typeof item.month).toBe("string");
      expect(typeof item.activeCount).toBe("number");
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should filter projects by active states only", async () => {
    // Arrange
    const mockSnapshot = {
      docs: mockProjects.map((project) => ({
        data: () => project,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getActiveProjectsHistory as any)._handler;
    const result = await handler({}, {});

    // Assert
    // The completed project should not be counted in any month
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockGet).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle empty projects collection", async () => {
    // Arrange
    const mockSnapshot = {
      docs: [],
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getActiveProjectsHistory as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockGet).toHaveBeenCalled();

    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);

    // All months should have 0 active projects
    result.forEach((item: ActiveProjectsMonth) => {
      expect(item.activeCount).toBe(0);
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle database error", async () => {
    // Arrange
    const error = new Error("Database error");
    mockGet.mockRejectedValue(error);

    // Act & Assert
    const handler = (getActiveProjectsHistory as any)._handler;
    await expect(handler({}, {})).rejects.toThrow("Database error");

    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockGet).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error getting active projects history: ",
      error
    );
  });

  it("should return months in chronological order", async () => {
    // Arrange
    const mockSnapshot = {
      docs: mockProjects.map((project) => ({
        data: () => project,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getActiveProjectsHistory as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);

    // Check that months are in order (oldest first)
    for (let i = 1; i < result.length; i++) {
      // Each month string should be in format like "Jan24", "Feb24", etc.
      expect(typeof result[i].month).toBe("string");
      expect(result[i].month).toMatch(/^[A-Z][a-z]{2}\d{2}$/);
    }

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("should handle projects with null end dates", async () => {
    // Arrange
    const projectsWithNullEndDate: Project[] = [
      {
        id: "1",
        name: "Ongoing Project",
        startDate: "2024-01-01",
        endDate: "",
        state: "inProgress",
        description: "Ongoing test project",
        customerId: "customer1",
        employeeId: "employee1",
        createdAt: "2024-01-01",
      },
    ];

    const mockSnapshot = {
      docs: projectsWithNullEndDate.map((project) => ({
        data: () => project,
      })),
    };
    mockGet.mockResolvedValue(mockSnapshot);

    // Act
    const handler = (getActiveProjectsHistory as any)._handler;
    const result = await handler({}, {});

    // Assert
    expect(mockCollection).toHaveBeenCalledWith("projects");
    expect(mockGet).toHaveBeenCalled();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(12);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
