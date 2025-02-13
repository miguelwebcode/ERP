import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../components/register/RegisterForm/RegisterForm";
import { watchAuthState } from "../services/auth/auth";
import { useAppStore } from "../stores/app-store";

export const RegisterView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    watchAuthState(setUser);
    if (user != null) {
      navigate("/");
    }
  }, [user]);
  return <RegisterForm />;
};
