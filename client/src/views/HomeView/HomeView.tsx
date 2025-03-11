import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../../components/ui/LogoutButton/LogoutButton";
import { useEffect } from "react";
import { useAppStore } from "../../stores/app-store";
import { SharedButton } from "../../components/ui/SharedButton/SharedButton";

export const HomeView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="uppercase font-bold text-3xl">HOME</h1>
      <h2 className="my-8">Welcome, {user && user.email} </h2>
      <div className="flex flex-col lg:flex-row gap-4 ">
        {/* CARD CUSTOMERS */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded shadow-md min-w-[300px]">
          <h3 className="uppercase font-bold text-center text-xl">
            MANAGE CUSTOMERS
          </h3>
          <div className="flex justify-around">
            <SharedButton
              className="w-24 px-4"
              text="CREATE"
              onClick={() => {
                navigate("/customers/add");
              }}
            />
            <SharedButton
              className="w-24 px-4"
              text="READ"
              onClick={() => {
                navigate("/customers/read");
              }}
            />
          </div>
          <div className="flex justify-around">
            <SharedButton
              className="w-24 px-4"
              text="UPDATE"
              onClick={() => {
                navigate("/customers/edit");
              }}
            />
            <SharedButton
              className="w-24 px-4"
              text="DELETE"
              onClick={() => {
                navigate("/customers/delete");
              }}
            />
          </div>
        </div>
        {/* CARD PROJECTS */}
        <div className="flex flex-col gap-6 bg-white p-6 rounded shadow-md min-w-[300px]">
          <h3 className="uppercase font-bold text-center text-xl">
            MANAGE PROJECTS
          </h3>
          <div className="flex justify-around">
            <SharedButton
              className="w-24 px-4"
              text="CREATE"
              onClick={() => {
                navigate("/projects/add");
              }}
            />
            <SharedButton
              className="w-24"
              text="READ"
              onClick={() => {
                navigate("/projects/read");
              }}
            />
          </div>
          <div className="flex justify-around">
            <SharedButton
              className="w-24 px-4"
              text="UPDATE"
              onClick={() => {
                navigate("/projects/edit");
              }}
            />
            <SharedButton
              className="w-24 px-4"
              text="DELETE"
              onClick={() => {
                navigate("/projects/delete");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
