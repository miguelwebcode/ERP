// Asegurarse de hacer los mocks antes de importar el componente
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../../services/auth/service/authService", () => ({
  logout: vi.fn(() => Promise.resolve()),
}));

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, Mock } from "vitest";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth/service/authService";
import { LogoutButton } from "./LogoutButton";

describe("LogoutButton", () => {
  it("should call logout and navigate to /login when clicked", () => {
    const mockNavigate = vi.fn();
    // Convertir useNavigate en spy y devolver nuestro mock
    // We mock the return value of useNavigate
    /* 
     // Aquí ya está mockeado, pero no tiene un valor de retorno
      useNavigate(); // ❌ Retorna undefined

    // Aquí sí le damos un valor de retorno
      (useNavigate as Mock).mockReturnValue(mockNavigate);
      useNavigate(); // ✅ Retorna mockNavigate
    */

    (useNavigate as Mock).mockReturnValue(mockNavigate);

    render(<LogoutButton />);
    const button = screen.getByText("Logout");
    fireEvent.click(button);

    // logout ya es un spy (vi.fn), se puede verificar su llamada
    expect(logout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
