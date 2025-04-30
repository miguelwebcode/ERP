import { Outlet } from "react-router-dom";
import { EmployeesNavigationCard } from "../components/employees/EmployeesNavigationCard/EmployeesNavigationCard";

export default function EmployeesLayout() {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start h-[80vh] pt-4 gap-4 ">
      <EmployeesNavigationCard />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
