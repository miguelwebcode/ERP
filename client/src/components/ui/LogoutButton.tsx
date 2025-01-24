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
      className="bg-blue-500 text-white py-2 px-4 mt-5 rounded hover:bg-blue-600"
      onClick={handleClick}
    >
      Logout
    </button>
  );
};
