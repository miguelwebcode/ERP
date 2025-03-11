import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useAppStore } from "../../stores/app-store";
import { CustomersNavigationCard } from "../../components/customers/CustomersNavigationCard/CustomersNavigationCard";
import { ProjectsNavigationCard } from "../../components/projects/ProjectsNavigationCard/ProjectsNavigationCard";

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
        <CustomersNavigationCard />
        <ProjectsNavigationCard />
      </div>
    </div>
  );
};
