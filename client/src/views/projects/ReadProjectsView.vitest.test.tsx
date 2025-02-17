import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { ReadProjectsView } from "./ReadProjectsView";
import * as projectsModule from "../../services/projects";
import { useState } from "react";
import { Project } from "../../types";
vi.mock("react", async () => {
  const actualReact = await vi.importActual("react");
  return {
    ...actualReact,
    useState: vi.fn(),
  };
});

describe("ReadProjectsView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(projectsModule, "fetchAllProjects");
  });

  it("calls fetchAllProjects on first render", async () => {
    const mockProjects: Project[] = [
      {
        name: "Dummy Project",
        description: "This is a dummy project for testing purposes.",
        customerId: "cust01",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        state: "active",
        developer: "John Doe",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      },
    ];
    const mockSetProjects = vi.fn();
    (useState as Mock).mockReturnValue([mockProjects, mockSetProjects]);
    render(<ReadProjectsView />);

    await waitFor(() => {
      expect(projectsModule.fetchAllProjects).toHaveBeenCalledWith(
        mockSetProjects
      );
    });
  });
  it("shows correct card texts and project texts", async () => {
    const mockProjects: Project[] = [
      {
        name: "Dummy Project",
        description: "This is a dummy project for testing purposes.",
        customerId: "cust01",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        state: "active",
        developer: "John Doe",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-06-01T00:00:00Z",
      },
    ];
    const mockSetProjects = vi.fn();
    (useState as Mock).mockReturnValue([mockProjects, mockSetProjects]);
    render(<ReadProjectsView />);

    await waitFor(() => {
      const fieldName = screen.getByText("Name");
      expect(fieldName).toBeInTheDocument();
      const valueName = screen.getByText(mockProjects[0].name);
      expect(valueName).toBeInTheDocument();

      const fieldDescription = screen.getByText("Description");
      expect(fieldDescription).toBeInTheDocument();
      const valueDescription = screen.getByText(mockProjects[0].description);
      expect(valueDescription).toBeInTheDocument();

      const fieldCustomerId = screen.getByText("Customer ID");
      expect(fieldCustomerId).toBeInTheDocument();
      const valueCustomerId = screen.getByText(mockProjects[0].customerId);
      expect(valueCustomerId).toBeInTheDocument();

      const fieldDeveloper = screen.getByText("Developer");
      expect(fieldDeveloper).toBeInTheDocument();
      const valueDeveloper = screen.getByText(mockProjects[0].developer);
      expect(valueDeveloper).toBeInTheDocument();

      const fieldState = screen.getByText("State");
      expect(fieldState).toBeInTheDocument();
      const valueState = screen.getByText(mockProjects[0].state);
      expect(valueState).toBeInTheDocument();

      const fieldStartDate = screen.getByText("Start Date");
      expect(fieldStartDate).toBeInTheDocument();
      const valueStartDate = screen.getByText(mockProjects[0].startDate);
      expect(valueStartDate).toBeInTheDocument();

      const fieldEndDate = screen.getByText("End Date");
      expect(fieldEndDate).toBeInTheDocument();
      const valueEndDate = screen.getByText(mockProjects[0].endDate);
      expect(valueEndDate).toBeInTheDocument();

      const fieldUpdatedAt = screen.getByText("Updated at");
      expect(fieldUpdatedAt).toBeInTheDocument();
      const valueUpdatedAt = screen.getByText(
        mockProjects[0].updatedAt as string
      );
      expect(valueUpdatedAt).toBeInTheDocument();
    });
  });
});
