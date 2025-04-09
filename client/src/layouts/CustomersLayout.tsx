import { Outlet } from "react-router-dom";
import { CustomersNavigationCard } from "../components/customers/CustomersNavigationCard/CustomersNavigationCard";

export default function CustomersLayout() {
  return (
    <div className="flex items-center h-[70vh]">
      <CustomersNavigationCard />
      <div className="flex flex-1 items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}
