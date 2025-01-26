import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    navigate("/login");
  };
  return (
    <button
      className="bg-slate-600 hover:bg-slate-800 text-white py-2 px-4 mt-5 rounded"
      onClick={handleClick}
    >
      Logout
    </button>
  );
};
