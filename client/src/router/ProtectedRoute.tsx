import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../stores/app-store";

const ProtectedRoute = () => {
  const user = useAppStore((state) => state.user);
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
