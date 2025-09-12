import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import { Project } from "../../../types";
import { describe, it, expect } from "vitest";

describe("ProjectCard", () => {
  it("should render all project fields correctly", () => {
    const project: Project = {
      name: "Project Alpha",
      description: "A test project",
      customerId: "12345",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      state: "In Progress",
      createdAt: "2023-01-01",
      updatedAt: "2024-02-01",
      id: "",
      employeeId: "",
    };

    render(
      <ProjectCard
        project={project}
        onButtonClick={function (): Promise<void> {
          throw new Error("Function not implemented.");
        }}
      />
    );

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("A test project")).toBeInTheDocument();
    expect(screen.getByText("Customer ID")).toBeInTheDocument();
    expect(screen.getByText("12345")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Start Date")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getByText("End Date")).toBeInTheDocument();
    expect(screen.getByText("2024-12-31")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
    expect(screen.getByText("Created at")).toBeInTheDocument();
    expect(screen.getByText("2024-01-01")).toBeInTheDocument();
    expect(screen.getByText("Updated at")).toBeInTheDocument();
    expect(screen.getByText("2024-02-01")).toBeInTheDocument();
  });

  it("should not render 'Updated at' if project.updatedAt is undefined", () => {
    const project: Project = {
      name: "Project Beta",
      description: "Another test project",
      customerId: "54321",
      startDate: "2024-02-01",
      endDate: "2024-11-30",
      state: "Completed",
      createdAt: "2024-02-01",
      id: "",
      employeeId: "",
    };

    render(
      <ProjectCard
        project={project}
        onButtonClick={function (): Promise<void> {
          throw new Error("Function not implemented.");
        }}
      />
    );

    expect(screen.queryByText("Updated at")).not.toBeInTheDocument();
  });
});
