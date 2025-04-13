import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../stores/app-store";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner/Spinner";
import { watchAuthState } from "../services/auth/service/authService";

const ProtectedRoute = () => {
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
        <p className="text-ds-base">Loading...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
