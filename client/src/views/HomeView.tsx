import { useNavigate } from "react-router-dom";
import { LogoutButton } from "../components/ui/LogoutButton";
import { useEffect } from "react";
import { watchAuthState } from "../services/auth";
import { useAppStore } from "../stores/app-store";

export const HomeView = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    watchAuthState(setUser);
    if (user === null) {
      console.log("User is still null");
      console.log("navigate to login");
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="uppercase font-bold">Welcome, {user && user.email} </h1>
      <div className="flex flex-col gap-3 mt-10">
        <button
          className="bg-slate-600 hover:bg-slate-800 text-white font-bold uppercase p-3 rounded-lg "
          onClick={() => {
            navigate("/customers");
          }}
        >
          Create a new Customer
        </button>
        <button
          className="bg-slate-600 hover:bg-slate-800 text-white font-bold uppercase p-3 rounded-lg "
          onClick={() => {
            navigate("/projects");
          }}
        >
          Create a new Project
        </button>
      </div>
      <LogoutButton />
    </div>
  );
};
