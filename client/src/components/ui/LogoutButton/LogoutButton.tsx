import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/auth/service/authService";
import { CiLogout } from "react-icons/ci";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  };
  return (
    <button
      className="bg-slate-800 hover:bg-slate-600 text-white  font-bold py-2 px-4 rounded"
      onClick={handleClick}
    >
      <div className="flex gap-3 items-center">
        <CiLogout className="text-xl" />
        <p>Logout</p>
      </div>
    </button>
  );
};
