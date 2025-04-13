import { Outlet } from "react-router-dom";
import { EmployeesNavigationCard } from "../components/employees/EmployeesNavigationCard/EmployeesNavigationCard";

export default function EmployeesLayout() {
  return (
    <div className="flex items-start h-[80vh] pt-ds-16">
      <EmployeesNavigationCard />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
