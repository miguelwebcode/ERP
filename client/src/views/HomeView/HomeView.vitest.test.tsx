import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { HomeView } from "./HomeView";
import * as appStore from "../../stores/app-store";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("HomeView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
  });

  it("navigates to /login when user is null", () => {
    const mockStore = { user: null };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );
    render(<HomeView />);

    expect(mockedNavigate).toHaveBeenCalledWith("/login");
  });

  it("doesn't navigate to /login when user is not null", () => {
    const mockStore = {
      user: { id: "1", name: "Test", email: "email@email.com" },
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    render(<HomeView />);

    expect(mockedNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("renders all texts correctly", () => {
    const mockStore = {
      user: { id: "1", name: "Test", email: "email@email.com" },
    };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(mockStore)
    );

    render(<HomeView />);

    const title = screen.getByRole("heading", { name: /home/i });
    expect(title).toBeInTheDocument();

    const regexEmail = new RegExp(mockStore.user.email, "i");
    const userEmail = screen.getByText(regexEmail);
    expect(userEmail).toBeInTheDocument();

    const titleCustomer = screen.getByRole("heading", {
      name: /Manage customers/i,
    });
    expect(titleCustomer).toBeInTheDocument();
    const buttonsCreate = screen.queryAllByRole("button", {
      name: /create/i,
    });
    expect(buttonsCreate[0]).toBeInTheDocument();
    expect(buttonsCreate[1]).toBeInTheDocument();
    expect(buttonsCreate.length).toBe(2);

    const buttonsRead = screen.queryAllByRole("button", {
      name: /read/i,
    });
    expect(buttonsRead[0]).toBeInTheDocument();
    expect(buttonsRead[1]).toBeInTheDocument();
    expect(buttonsRead.length).toBe(2);

    const buttonsUpdate = screen.queryAllByRole("button", {
      name: /update/i,
    });
    expect(buttonsUpdate[0]).toBeInTheDocument();
    expect(buttonsUpdate[1]).toBeInTheDocument();
    expect(buttonsUpdate.length).toBe(2);

    const buttonsDelete = screen.queryAllByRole("button", {
      name: /delete/i,
    });
    expect(buttonsDelete[0]).toBeInTheDocument();
    expect(buttonsDelete[1]).toBeInTheDocument();
    expect(buttonsDelete.length).toBe(2);

    const titleProject = screen.getByRole("heading", {
      name: /Manage projects/i,
    });
    expect(titleProject).toBeInTheDocument();
  });

  it("buttons call their function", async () => {
    render(<HomeView />);

    const queryButtonsCreate = screen.queryAllByRole("button", {
      name: /create/i,
    });
    const queryButtonsRead = screen.queryAllByRole("button", { name: /read/i });
    const queryButtonsUpdate = screen.getAllByRole("button", {
      name: /update/i,
    });
    const queryButtonsDelete = screen.getAllByRole("button", {
      name: /delete/i,
    });

    const buttonCreateCustomer = queryButtonsCreate[0];
    fireEvent.click(buttonCreateCustomer);

    const buttonReadCustomers = queryButtonsRead[0];
    fireEvent.click(buttonReadCustomers);

    const buttonUpdateCustomer = queryButtonsUpdate[0];
    fireEvent.click(buttonUpdateCustomer);

    const buttonDeleteCustomer = queryButtonsDelete[0];
    fireEvent.click(buttonDeleteCustomer);

    const buttonCreateProject = queryButtonsCreate[1];
    fireEvent.click(buttonCreateProject);

    const buttonReadProjects = queryButtonsRead[1];
    fireEvent.click(buttonReadProjects);

    const buttonUpdateProject = queryButtonsUpdate[1];
    fireEvent.click(buttonUpdateProject);

    const buttonDeleteProject = queryButtonsDelete[1];
    fireEvent.click(buttonDeleteProject);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/add");
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/read");
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/edit");
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/delete");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/add");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/read");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/edit");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/delete");
    });
  });
});
