import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/login/LoginForm/LoginForm";
import { watchAuthState } from "../../services/auth/authService";
import { useAppStore } from "../../stores/app-store";

export const LoginView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    watchAuthState(setUser);
    if (user != null) {
      navigate("/");
    }
  }, [user]);
  return <LoginForm />;
};
