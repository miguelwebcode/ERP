import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LiaGripfire } from "react-icons/lia";
import { LogoutButton } from "../LogoutButton/LogoutButton";
import { useAppStore } from "../../../stores/app-store";

export default function Header() {
  const user = useAppStore((state) => state.user);
  const { pathname } = useLocation();
  const needsNavigation = useMemo(() => {
    const paths = [
      "/",
      "/customers",
      "/projects",
      "/customers/add",
      "/customers/edit",
      "/customers/read",
      "/customers/delete",
      "/projects/add",
      "/projects/edit",
      "/projects/read",
      "/projects/delete",
    ];
    return user && paths.includes(pathname);
  }, [pathname]);
  return (
    <header className="bg-slate-800">
      <div className="flex mx-auto container px-5 py-8 justify-between items-center">
        <div className="flex gap-3 items-center text-white text-3xl">
          <LiaGripfire />
          <h1>FirERP</h1>
        </div>
        {needsNavigation && (
          <div className="inline-flex justify-center items-center gap-4">
            <nav className="flex gap-4 text-xl">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 uppercase font-bold"
                    : "text-white uppercase font-bold"
                }
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 uppercase font-bold"
                    : "text-white uppercase font-bold"
                }
                to="/customers"
              >
                Customers
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 uppercase font-bold"
                    : "text-white uppercase font-bold"
                }
                to="/projects"
              >
                Projects
              </NavLink>
            </nav>
            <LogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
