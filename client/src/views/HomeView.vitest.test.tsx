import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { HomeView } from "./HomeView";
import * as appStore from "../stores/app-store";
import * as authModule from "../services/auth/auth";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("HomeView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
    vi.spyOn(authModule, "logout");
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
      name: /Customer CRUD/i,
    });
    expect(titleCustomer).toBeInTheDocument();
    const buttonCreateCustomer = screen.getByRole("button", {
      name: /create customer/i,
    });
    expect(buttonCreateCustomer).toBeInTheDocument();
    const buttonReadCustomers = screen.getByRole("button", {
      name: /read customer/i,
    });
    expect(buttonReadCustomers).toBeInTheDocument();
    const buttonUpdateCustomer = screen.getByRole("button", {
      name: /update customer/i,
    });
    expect(buttonUpdateCustomer).toBeInTheDocument();
    const buttonDeleteCustomer = screen.getByRole("button", {
      name: /delete customer/i,
    });
    expect(buttonDeleteCustomer).toBeInTheDocument();

    const titleProject = screen.getByRole("heading", {
      name: /Project CRUD/i,
    });
    expect(titleProject).toBeInTheDocument();
    const buttonCreateProject = screen.getByRole("button", {
      name: /create Project/i,
    });
    expect(buttonCreateProject).toBeInTheDocument();
    const buttonReadProjects = screen.getByRole("button", {
      name: /read Project/i,
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

    const buttonLogout = screen.getByRole("button", { name: /logout/i });
    expect(buttonLogout);
  });

  it("buttons call their function", async () => {
    render(<HomeView />);

    const buttonCreateCustomer = screen.getByRole("button", {
      name: /create customer/i,
    });
    fireEvent.click(buttonCreateCustomer);

    const buttonReadCustomers = screen.getByRole("button", {
      name: /read customer/i,
    });
    fireEvent.click(buttonReadCustomers);

    const buttonUpdateCustomer = screen.getByRole("button", {
      name: /update customer/i,
    });
    fireEvent.click(buttonUpdateCustomer);

    const buttonDeleteCustomer = screen.getByRole("button", {
      name: /delete customer/i,
    });
    fireEvent.click(buttonDeleteCustomer);

    const buttonCreateProject = screen.getByRole("button", {
      name: /create Project/i,
    });
    fireEvent.click(buttonCreateProject);
    const buttonReadProjects = screen.getByRole("button", {
      name: /read Project/i,
    });
    fireEvent.click(buttonReadProjects);

    const buttonUpdateProject = screen.getByRole("button", {
      name: /update Project/i,
    });
    fireEvent.click(buttonUpdateProject);

    const buttonDeleteProject = screen.getByRole("button", {
      name: /delete Project/i,
    });
    fireEvent.click(buttonDeleteProject);

    const buttonLogout = screen.getByRole("button", { name: /logout/i });
    fireEvent.click(buttonLogout);
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/add");
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/read");
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/edit");
      expect(mockedNavigate).toHaveBeenCalledWith("/customers/delete");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/add");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/read");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/edit");
      expect(mockedNavigate).toHaveBeenCalledWith("/projects/delete");
      expect(authModule.logout).toHaveBeenCalled();
    });
  });
});
