import { logout } from "../../services/auth";

const handleClick = () => {
  logout();
};

export const LogoutButton = () => {
  return (
    <button
      className="bg-blue-500 text-white py-2 px-4 mt-5 rounded hover:bg-blue-600"
      onClick={handleClick}
    >
      Logout
    </button>
  );
};
