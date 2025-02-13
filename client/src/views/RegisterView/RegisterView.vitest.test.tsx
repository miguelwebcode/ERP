import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import * as authModule from "../../services/auth/auth";
import * as appStore from "../../stores/app-store";
import { RegisterView } from "./RegisterView";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockedNavigate,
}));

describe("RegisterView", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(appStore, "useAppStore");
    vi.spyOn(authModule, "watchAuthState");
  });

  it("renders RegisterForm", () => {
    render(<RegisterView />);

    const title = screen.getByRole("heading", { name: "Register" });
    expect(title).toBeInTheDocument();

    const inputName = screen.getByLabelText("Name") as HTMLInputElement;
    expect(inputName).toBeInTheDocument();
    expect(inputName.value).toBe("");
    expect(inputName.type).toBe("text");

    const selectRole = screen.getByLabelText("Role") as HTMLSelectElement;
    expect(selectRole).toBeInTheDocument();
    expect(selectRole.value).toBe("");
    expect(selectRole.type).toBe("select-one");

    const inputEmail = screen.getByLabelText("Email") as HTMLInputElement;
    expect(inputEmail).toBeInTheDocument();
    expect(inputEmail.value).toBe("");
    expect(inputEmail.type).toBe("text");

    const inputPassword = screen.getByLabelText("Password") as HTMLInputElement;
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe("");
    expect(inputPassword.type).toBe("password");

    const inputConfirmPassword = screen.getByLabelText(
      "Confirm password"
    ) as HTMLInputElement;
    expect(inputConfirmPassword).toBeInTheDocument();
    expect(inputConfirmPassword.value).toBe("");
    expect(inputConfirmPassword.type).toBe("password");

    const buttonRegister = screen.getByRole("button", { name: "Register" });
    expect(buttonRegister).toBeInTheDocument();

    const textBottom = screen.getByText(/have an account/i);
    expect(textBottom).toBeInTheDocument();

    const buttonGoToLogin = screen.getByRole("button", { name: "Login" });
    expect(buttonGoToLogin).toBeInTheDocument();
  });

  it("calls watchAuthState and renders LoginForm when user is null", () => {
    const fakeStore = { user: null, setUser: vi.fn() };

    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(fakeStore)
    );

    render(<RegisterView />);

    expect(authModule.watchAuthState).toHaveBeenCalledWith(fakeStore.setUser);
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("navigates to / when user is not null", async () => {
    const fakeStore = { user: { id: "123", name: "Test" }, setUser: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(fakeStore)
    );

    render(<RegisterView />);

    await waitFor(() => {
      expect(authModule.watchAuthState).toHaveBeenCalledWith(fakeStore.setUser);
      expect(mockedNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("calls watchAuthState only once per render", async () => {
    const fakeStore = { user: null, setUser: vi.fn() };
    (appStore.useAppStore as unknown as Mock).mockImplementation((selector) =>
      selector(fakeStore)
    );

    render(<RegisterView />);
    await waitFor(() => {
      expect(authModule.watchAuthState).toHaveBeenCalledTimes(1);
    });
  });
});
