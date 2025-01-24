import { User } from "firebase/auth";
import CustomersTestComponent from "./CustomersTestComponent";
import { logout } from "../../services/auth";

type HomePageProps = {
  user: User;
};

const handleClick = () => {
  logout();
};

export const HomePage = ({ user }: HomePageProps) => {
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center p-5">
      <h1>Welcome, {user.email}</h1>
      <CustomersTestComponent />
      <button
        className="bg-blue-500 text-white py-2 px-4 mt-5 rounded hover:bg-blue-600"
        onClick={handleClick}
      >
        Logout
      </button>
    </div>
  );
};
