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
        <h1 className="uppercase font-bold text-xl">HOME VIEW</h1>
        <h2 className="my-4">Welcome, {user && user.email} </h2>
        <div className="flex flex-col gap-4 md:flex-row md:gap-10 mt-4">
          <div className="flex flex-col gap-3">
            <h3 className="uppercase font-bold text-center">CUSTOMER CRUD</h3>
            <SharedButton
              text="CREATE Customer"
              handleClick={() => {
                navigate("/customers/add");
              }}
            />
            <SharedButton
              text="READ Customers"
              handleClick={() => {
                navigate("/customers/read");
              }}
            />
            <SharedButton
              text="UPDATE Customer"
              handleClick={() => {
                navigate("/customers/edit");
              }}
            />
            <SharedButton
              text="DELETE Customer"
              handleClick={() => {
                navigate("/customers/delete");
              }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="uppercase font-bold text-center">PROJECT CRUD</h3>
            <SharedButton
              text="CREATE Project"
              handleClick={() => {
                navigate("/projects/add");
              }}
            />
            <SharedButton
              text="READ Projects"
              handleClick={() => {
                navigate("/projects/read");
              }}
            />
            <SharedButton
              text="UPDATE Project"
              handleClick={() => {
                navigate("/projects/edit");
              }}
            />
            <SharedButton
              text="DELETE Project"
              handleClick={() => {
                navigate("/projects/delete");
              }}
            />
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
};
