import { User } from "firebase/auth";
import CustomersTestComponent from "./CustomersTestComponent";
import { logout } from "../services/auth";

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
        className="text-white p-3 mt-5 bg-slate-500 hover:bg-slate-600 uppercase rounded-lg"
        onClick={handleClick}
      >
        Logout
      </button>
    </div>
  );
};
