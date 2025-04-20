import { useEffect, useState } from "react";
import { useAppStore } from "../stores/app-store";
import { watchAuthState } from "../services/auth/service/authService";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../components/ui/Spinner/Spinner";

type UnauthenticatedRouteProps = {
  redirectRoute?: string;
};

export const UnauthenticatedRoute = ({
  redirectRoute = "/",
}: UnauthenticatedRouteProps) => {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = watchAuthState((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center gap-ds-16 h-[70vh]">
        <Spinner />
        <p className="text-base">Loading...</p>
      </div>
    );
  }

  return user ? <Navigate to={redirectRoute} replace /> : <Outlet />;
};
