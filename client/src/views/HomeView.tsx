import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../components/ui/LogoutButton";
import { useEffect } from "react";
import { useAppStore } from "../stores/app-store";
import { HomeButton } from "../components/home/HomeButton";
import { getAllCustomers } from "../services/customers";

export const HomeView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="uppercase font-bold">Welcome, {user && user.email} </h1>
      <div className="flex flex-col gap-3 mt-10">
        <HomeButton
          text="Add Customer"
          handleClick={() => {
            navigate("/customers/add");
          }}
        />
        <HomeButton
          text="Edit Customer"
          handleClick={() => {
            navigate("/customers/edit");
          }}
        />
        <HomeButton
          text="Add Project"
          handleClick={() => {
            navigate("/projects/add");
          }}
        />
        <HomeButton
          text="Edit Project"
          handleClick={() => {
            navigate("/projects/edit");
          }}
        />
      </div>
      <LogoutButton />
    </div>
  );
};
