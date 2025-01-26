import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();
  const needsNavigation = useMemo(() => {
    const paths = ["/", "/customers", "/projects"];
    return paths.includes(pathname);
  }, [pathname]);
  return (
    <header className="bg-slate-800">
      <div className="mx-auto container px-5 py-8">
        {needsNavigation && (
          <div className="flex justify-center items-center">
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
          </div>
        )}
      </div>
    </header>
  );
}
