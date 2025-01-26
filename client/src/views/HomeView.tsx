import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../components/ui/LogoutButton";
import { useEffect } from "react";
import { useAppStore } from "../stores/app-store";
import { SharedButton } from "../components/ui/SharedButton";

export const HomeView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center justify-center bg-white p-6 rounded shadow-md w-fit">
        <h1 className="uppercase font-bold text-xl">Customer's VIEW</h1>
        <h2 className="uppercase font-bold">Welcome, {user && user.email} </h2>
        <div className="flex flex-col gap-3 mt-4">
          <SharedButton
            text="Add Customer"
            handleClick={() => {
              navigate("/customers/add");
            }}
          />
          <SharedButton
            text="Edit Customer"
            handleClick={() => {
              navigate("/customers/edit");
            }}
          />
          <SharedButton
            text="Add Project"
            handleClick={() => {
              navigate("/projects/add");
            }}
          />
          <SharedButton
            text="Edit Project"
            handleClick={() => {
              navigate("/projects/edit");
            }}
          />
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};
