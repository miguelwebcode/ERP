import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { LoginView } from "./LoginView";
import * as authModule from "../../services/auth/service/authService";
import * as appStore from "../../stores/app-store";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("LoginView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(authModule, "watchAuthState");
    vi.spyOn(appStore, "useAppStore");
  });

  it("renders LoginForm", () => {
    render(<LoginView />);

    const title = screen.getByRole("heading", { name: "Login" });
    expect(title).toBeDefined();

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe("");
    expect(inputEmail.type).toBe("text");

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe("");
    expect(inputPassword.type).toBe("password");

    const buttonLogin = screen.getByRole("button", { name: "Login" });
    expect(buttonLogin).toBeInTheDocument();

    const textBelow = screen.getByText(/have an account/i);
    expect(textBelow).toBeInTheDocument();

    const buttonRegister = screen.getByRole("button", { name: "Register" });
    expect(buttonRegister).toBeInTheDocument();
  });

  it("calls watchAuthState and renders LoginForm when user is null", () => {
    const fakeStore = { user: null, setUser: vi.fn() };

    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(fakeStore)
    );

    render(<LoginView />);
    expect(authModule.watchAuthState).toHaveBeenCalledWith(fakeStore.setUser);

    const title = screen.getByRole("heading", { name: "Login" });
    expect(title).toBeDefined();
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("navigates to '/' when user is not null", async () => {
    const fakeStore = { user: { id: "123", name: "Test" }, setUser: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(fakeStore)
    );

    render(<LoginView />);
    await waitFor(() => {
      expect(authModule.watchAuthState).toHaveBeenCalledWith(fakeStore.setUser);
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("calls watchAuthState only once per render", () => {
    const fakeStore = { user: null, setUser: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(fakeStore)
    );
    render(<LoginView />);
    expect(authModule.watchAuthState).toHaveBeenCalledTimes(1);
  });
});
