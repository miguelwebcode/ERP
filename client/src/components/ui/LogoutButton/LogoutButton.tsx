import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth/service/authService";
import "@/styles/LogoutButton.css";
import { AppIcon } from "@/config/plugins/icons.plugin";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  };
  return (
    <button className="logout-button" onClick={handleClick}>
      <div className="flex items-center text-ds-white">
        <AppIcon name="logout" className="text-3xl" />
      </div>
    </button>
  );
};
