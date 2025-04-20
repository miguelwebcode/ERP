import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LiaGripfire } from "react-icons/lia";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { useAppStore } from "../../../stores/app-store";
import "@/styles/Header.css";

export default function Header() {
  const user = useAppStore((state) => state.user);
  const { pathname } = useLocation();
  const needsNavigation = useMemo(() => {
    const paths = [
      "/",
      "/customers",
      "/projects",
      "/employees",
      "/customers/add",
      "/customers/edit",
      "/customers/read",
      "/customers/delete",
      "/projects/add",
      "/projects/edit",
      "/projects/read",
      "/projects/delete",
      "/employees/add",
      "/employees/edit",
      "/employees/read",
      "/employees/delete",
    ];
    return user && paths.includes(pathname);
  }, [pathname, user]);

  const navTextHighlight =
    "text-ds-primary-400 text-2xl uppercase font-bold header-link-selected";
  const navTextNormal = "text-ds-white text-2xl uppercase font-bold";
  return (
    <header className="bg-slate-800">
      <div className="flex mx-auto container px-5 py-8 justify-between items-center">
        <div className="flex gap-3 items-center text-ds-white text-3xl">
          <LiaGripfire />
          <h1>FirERP</h1>
        </div>
        {needsNavigation && (
          <div className="inline-flex justify-center items-center gap-4">
            <nav className="flex gap-8 text-2xl">
              <NavLink
                className={({ isActive }) =>
                  isActive ? navTextHighlight : navTextNormal
                }
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? navTextHighlight : navTextNormal
                }
                to="/customers"
              >
                Customers
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? navTextHighlight : navTextNormal
                }
                to="/projects"
              >
                Projects
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive ? navTextHighlight : navTextNormal
                }
                to="/employees"
              >
                Employees
              </NavLink>
              <LogoutButton />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
