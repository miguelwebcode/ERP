import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth/service/authService";
import { CiLogout } from "react-icons/ci";
import "@styles/LogoutButton.css";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  };
  return (
    <button className="logout-button" onClick={handleClick}>
      <div className="flex items-center text-ds-white">
        <CiLogout className="text-ds-2xl " />
      </div>
    </button>
  );
};
