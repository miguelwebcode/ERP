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
    const mainTitle = screen.getByRole("heading", { name: "PROJECTS" });
    expect(mainTitle).toBeInTheDocument();
    const cardTitle = screen.getByRole("heading", { name: /Manage projects/i });
    expect(cardTitle).toBeInTheDocument();
    const buttonCreateProject = screen.getByRole("button", {
      name: /create/i,
    });
    expect(buttonCreateProject).toBeInTheDocument();
    const buttonReadProjects = screen.getByRole("button", {
      name: /read/i,
    });
    expect(buttonReadProjects).toBeInTheDocument();
    const buttonUpdateProject = screen.getByRole("button", {
      name: /update/i,
    });
    expect(buttonUpdateProject).toBeInTheDocument();
    const buttonDeleteProject = screen.getByRole("button", {
      name: /delete/i,
    });
    expect(buttonDeleteProject).toBeInTheDocument();
  });
  it("buttons call their function", async () => {
    const buttonCreateProject = screen.getByRole("button", {
      name: /create/i,
    });
    const buttonReadProjects = screen.getByRole("button", {
      name: /read/i,
    });
    const buttonUpdateProject = screen.getByRole("button", {
      name: /update/i,
    });
    const buttonDeleteProject = screen.getByRole("button", {
      name: /delete/i,
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
