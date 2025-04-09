import { useEffect } from "react";
import { useAppStore } from "../stores/app-store";
import { watchAuthState } from "../services/auth/service/authService";
import { Navigate, Outlet } from "react-router-dom";

type UnauthenticatedRouteProps = {
  redirectRoute?: string;
};

export const UnauthenticatedRoute = ({
  redirectRoute = "/",
}: UnauthenticatedRouteProps) => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    watchAuthState(setUser);
  }, [user]);

  return user ? <Navigate to={redirectRoute} replace /> : <Outlet />;
};
