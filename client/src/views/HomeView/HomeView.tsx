import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useAppStore } from "../../stores/app-store";
import Dashboard from "../../components/dashboard/Dashboard";

export const HomeView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);

  return <Dashboard />;
};
