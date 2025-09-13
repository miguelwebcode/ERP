import { Outlet } from "react-router-dom";
import { CustomersNavigationCard } from "../components/customers/CustomersNavigationCard/CustomersNavigationCard";

export default function CustomersLayout() {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start min-h-[80vh] pt-4 gap-6 bg-gray-50">
      <CustomersNavigationCard />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
