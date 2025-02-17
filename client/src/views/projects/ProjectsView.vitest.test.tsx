import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectsView } from "./ProjectsView";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("ProjectsView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    render(<ProjectsView />);
  });

  it("renders all texts correctly", () => {
    const title = screen.getByRole("heading", { name: "Project CRUD" });
    expect(title).toBeInTheDocument();
    const buttonCreateProject = screen.getByRole("button", {
      name: /create Project/i,
    });
    expect(buttonCreateProject).toBeInTheDocument();
    const buttonReadProjects = screen.getByRole("button", {
      name: /read Projects/i,
    });
    expect(buttonReadProjects).toBeInTheDocument();
    const buttonUpdateProject = screen.getByRole("button", {
      name: /update Project/i,
    });
    expect(buttonUpdateProject).toBeInTheDocument();
    const buttonDeleteProject = screen.getByRole("button", {
      name: /delete Project/i,
    });
    expect(buttonDeleteProject).toBeInTheDocument();
  });
  it("buttons call their function", async () => {
    const buttonCreateProject = screen.getByRole("button", {
      name: /create Project/i,
    });
    const buttonReadProjects = screen.getByRole("button", {
      name: /read Projects/i,
    });
    const buttonUpdateProject = screen.getByRole("button", {
      name: /update Project/i,
    });
    const buttonDeleteProject = screen.getByRole("button", {
      name: /delete Project/i,
    });
    fireEvent.click(buttonCreateProject);
    fireEvent.click(buttonReadProjects);
    fireEvent.click(buttonUpdateProject);
    fireEvent.click(buttonDeleteProject);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/projects/add");
      expect(mockNavigate).toHaveBeenCalledWith("/projects/read");
      expect(mockNavigate).toHaveBeenCalledWith("/projects/edit");
      expect(mockNavigate).toHaveBeenCalledWith("/projects/delete");
    });
  });
});
