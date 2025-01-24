import { User } from "firebase/auth";
import CustomersTestComponent from "./CustomersTestComponent";

type HomePageProps = {
  user: User;
};

export const HomePage = ({ user }: HomePageProps) => {
  return (
    <div className="flex flex-col h-[100vh] items-center justify-center p-5">
      <h1>Welcome, {user.email}</h1>
      <CustomersTestComponent />
    </div>
  );
};
